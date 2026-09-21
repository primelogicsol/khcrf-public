import { Request, Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../config/db.js';
import { validateFactors } from '../domain/performanceFactors.js';
import { Prisma } from '@prisma/client';

const CRAFTLORE_TO_KHCRF_SECRET = process.env.CRAFTLORE_TO_KHCRF_SECRET || 'test_secret_for_craftlore';

function computeCraftloreSignature(
    timestamp: string,
    eventId: string,
    method: string,
    path: string,
    payloadSha256: string
): string {
    const message = `${timestamp}.${eventId}.${method}.${path}.${payloadSha256}`;
    return crypto.createHmac('sha256', CRAFTLORE_TO_KHCRF_SECRET).update(message).digest('hex');
}

export const handleCraftloreWebhook = async (req: Request, res: Response) => {
    const rawBody = (req as any).rawBody as Buffer;
    if (!rawBody) {
        return res.status(500).json({ message: 'Raw body missing' });
    }

    const payloadSha256 = crypto.createHash('sha256').update(rawBody).digest('hex');

    let body: any;
    try {
        body = JSON.parse(rawBody.toString('utf8'));
    } catch (err) {
        return res.status(400).json({ message: 'Invalid JSON' });
    }

    const {
        event_id,
        event_type,
        verification_request_id,
        entity_id,
        entity_type,
        revision,
        snapshot_id,
        snapshot_sha256,
        self_reported_pts,
        methodology_version,
        factor_findings,
        contract_version
    } = body;

    const signature = req.headers['x-craftlore-signature'] as string;
    const timestamp = req.headers['x-craftlore-timestamp'] as string;

    if (!signature || !timestamp || !event_id) {
        return res.status(401).json({ message: 'Missing cryptographic headers or event_id' });
    }

    if (contract_version !== 'CKTRE-KHCRF-1.0') {
        return res.status(400).json({ message: 'UNSUPPORTED_CONTRACT_VERSION' });
    }

    const eventId = event_id;
    const eventType = event_type;
    const verificationRequestId = verification_request_id;
    const entityType = entity_type;
    const craftloreEntityId = entity_id; // Mapping entity_id to our internal craftloreEntityId
    const snapshotId = snapshot_id;
    const snapshotSha256 = snapshot_sha256;
    const selfReportedPts = self_reported_pts;
    const methodologyVersion = methodology_version;
    const factorFindings = factor_findings || [];

    if (!eventId || !eventType || !verificationRequestId || !entityType || !snapshotId || !snapshotSha256) {
        return res.status(400).json({ message: 'Missing canonical fields' });
    }

    const expectedSignature = computeCraftloreSignature(timestamp, eventId, req.method, req.originalUrl, payloadSha256);
    const isValid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));

    if (!isValid) {
        // Do not record in the main event ledger as the eventId is unverified
        return res.status(401).json({ message: 'Invalid signature' });
    }

    const requestTime = parseInt(timestamp, 10);
    if (Math.abs(Date.now() - parseInt(timestamp, 10)) > 5 * 60 * 1000) {
        return res.status(401).json({ message: 'Request expired' });
    }

    // Now eventId is verified, we can use it for idempotency
    const existingEvent = await prisma.craftloreIntegrationEvent.findUnique({ where: { eventId } });
    if (existingEvent) {
        if (existingEvent.processingStatus === 'SUCCESS') {
            return res.status(200).json({
                success: true,
                idempotentReplay: true,
                verificationRequestId,
                revision,
                status: 'RECEIVED'
            });
        }
        // FAILED events can potentially be retried depending on business logic. We'll proceed.
    }

    if (eventType !== 'VERIFICATION_REQUESTED') {
        await logFailedEvent(eventId, verificationRequestId, 'VERIFICATION_REQUESTED', payloadSha256, 400, 'UNSUPPORTED_EVENT_TYPE');
        return res.status(400).json({ message: 'Event type ignored' });
    }

    if (!verificationRequestId || !/^VR-\d{4}-[A-Z0-9]+$/.test(verificationRequestId)) {
        await logFailedEvent(eventId, verificationRequestId, eventType, payloadSha256, 400, 'INVALID_TRACKING_ID_FORMAT');
        return res.status(400).json({ message: 'Invalid tracking ID format. Expected VR-YYYY-XXXXXX' });
    }

    if (!Array.isArray(factorFindings) || factorFindings.length === 0) {
        await logFailedEvent(eventId, verificationRequestId, eventType, payloadSha256, 400, 'MISSING_FACTOR_FINDINGS');
        return res.status(400).json({ message: 'Missing factor findings' });
    }

    if (!validateFactors(entityType, factorFindings)) {
        await logFailedEvent(eventId, verificationRequestId, eventType, payloadSha256, 400, 'UNKNOWN_FACTOR_CODE');
        return res.status(400).json({ message: 'Invalid factor vocabulary' });
    }

    try {
        const isIdempotent = await prisma.$transaction(async (tx) => {
            const existingEvent = await tx.craftloreIntegrationEvent.findUnique({
                where: { eventId }
            });

            if (existingEvent) {
                if (existingEvent.payloadSha256 !== payloadSha256) {
                    throw new Error('EVENT_PAYLOAD_HASH_CONFLICT');
                }
                if (existingEvent.processingStatus === 'SUCCESS') {
                    // Idempotent success replay
                    return true;
                }
            }

            // Log RECEIVED / UPDATE to PROCESSING
            await tx.craftloreIntegrationEvent.upsert({
                where: { eventId },
                update: { processingStatus: 'PROCESSING' },
                create: {
                    eventId,
                    verificationRequestId,
                    eventType: 'VERIFICATION_REQUESTED',
                    payloadSha256,
                    signatureValid: true,
                    processingStatus: 'PROCESSING'
                }
            });

            // 1. Identity Consistency & Case Upsert
            let submission = await tx.evaluationSubmission.findUnique({
                where: { trackingId: verificationRequestId }
            });

            if (submission) {
                if (submission.entityType !== entityType || (submission.craftloreEntityId && submission.craftloreEntityId !== craftloreEntityId)) {
                    throw new Error('IDENTITY_CONFLICT');
                }

                // Revision progression checks
                if (revision !== submission.currentRevision && revision !== submission.currentRevision + 1) {
                    throw new Error('REVISION_PROGRESSION_VIOLATION');
                }
            } else {
                if (revision !== 1) {
                    throw new Error('INITIAL_REVISION_MUST_BE_1');
                }
            }

            // 2. Check Immutable Revisions
            const existingRevision = await tx.verificationSubmissionRevision.findUnique({
                where: { submissionId_revision: { submissionId: submission?.id || '', revision } }
            });

            if (existingRevision) {
                if (existingRevision.snapshotSha256 !== snapshotSha256) {
                    throw new Error('REVISION_HASH_CONFLICT');
                }
                // Exactly identical hash and revision means this is an idempotent duplicate delivery 
                // of an already-stored state, but we already handled idempotency via eventId. 
                // If eventId differs but payload is semantically the same, we just return.
                // We shouldn't mutate.
                return; // skip further DB ops for this tx
            }

            // Upsert the main case
            if (!submission) {
                submission = await tx.evaluationSubmission.create({
                    data: {
                        trackingId: verificationRequestId,
                        entityType,
                        craftloreEntityId,
                        caseStatus: 'RECEIVED',
                        origin: 'CRAFTLORE',
                        currentRevision: revision,
                        snapshotId,
                        snapshotSha256,
                        methodologyVersion,
                        selfReportedPts,
                        receivedAt: new Date(),
                        answers: {}
                    }
                });
            } else {
                submission = await tx.evaluationSubmission.update({
                    where: { id: submission.id },
                    data: {
                        currentRevision: revision,
                        snapshotId,
                        snapshotSha256,
                        methodologyVersion,
                        selfReportedPts,
                        receivedAt: new Date()
                    }
                });
            }

            // 3. Create Immutable Revision
            await tx.verificationSubmissionRevision.create({
                data: {
                    submissionId: submission.id,
                    revision: revision,
                    origin: 'CRAFTLORE',
                    snapshotId,
                    snapshotSha256,
                    methodologyVersion,
                    selfReportedPts,
                    answersSnapshot: {},
                    factorSnapshot: factorFindings,
                    evidenceManifest: req.body.evidence_manifest || [],
                    receivedAt: new Date()
                } as any
            });

            // 4. Create Evidence Manifest Tracking Records
            const evidenceManifest = req.body.evidence_manifest || [];
            if (Array.isArray(evidenceManifest)) {
                for (const ev of evidenceManifest) {
                    await tx.verificationEvidence.create({
                        data: {
                            submissionId: submission.id,
                            revision: revision,
                            evidenceId: ev.evidence_id,
                            factorCode: ev.factor_code,
                            originalFilename: ev.filename,
                            mimeType: ev.mime_type,
                            sizeBytes: ev.size_bytes,
                            expectedSha256: ev.sha256 || ev.sha256_hash,
                            storageKey: crypto.randomUUID()
                        } as any
                    });
                }
            }

            // 4. Create VerificationFinding Records
            const findingsData = factorFindings.map((finding: any) => ({
                submissionId: submission.id,
                revision,
                factorKey: finding.factor_code,
                selfReportedValue: finding.self_reported_value,
                verifiedValue: null,
                status: 'SELF_REPORTED' as const, id: crypto.randomUUID(), updatedAt: new Date()
            } as any));

            if (findingsData.length > 0) {
                await tx.verificationFinding.createMany({
                    data: findingsData
                });
            }

            // 5. Success Event
            await tx.craftloreIntegrationEvent.update({
                where: { eventId },
                data: {
                    processingStatus: 'SUCCESS',
                    responseStatus: 200,
                    assessmentRevision: revision,
                    snapshotId,
                    snapshotSha256,
                    processedAt: new Date()
                }
            });

            return false; // not idempotent
        }, {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable
        });

        if (isIdempotent) {
            res.status(200).json({ message: 'Verification request processed successfully', idempotentReplay: true });
        } else {
            res.status(200).json({ message: 'Verification request processed successfully' });
        }

    } catch (error: any) {
        if (error.message === 'IDENTITY_CONFLICT' || error.message === 'REVISION_PROGRESSION_VIOLATION' || error.message === 'INITIAL_REVISION_MUST_BE_1') {
            await logFailedEvent(eventId, verificationRequestId, 'VERIFICATION_REQUESTED', payloadSha256, 400, error.message);
            return res.status(400).json({ message: error.message });
        }
        if (error.message === 'REVISION_HASH_CONFLICT' || error.message === 'EVENT_PAYLOAD_HASH_CONFLICT') {
            await logFailedEvent(eventId, verificationRequestId, 'VERIFICATION_REQUESTED', payloadSha256, 409, error.message);
            return res.status(409).json({ message: error.message });
        }

        console.error('Webhook Error:', error);
        await logFailedEvent(eventId, verificationRequestId, 'VERIFICATION_REQUESTED', payloadSha256, 500, 'INTERNAL_ERROR');
        res.status(500).json({ message: 'Server error' });
    }
};

async function logFailedEvent(eventId: string, verificationRequestId: string, eventType: any, payloadSha256: string, responseStatus: number, errorCode: string) {
    try {
        await prisma.craftloreIntegrationEvent.upsert({
            where: { eventId },
            update: { processingStatus: 'FAILED', responseStatus, errorCode, processedAt: new Date() },
            create: {
                eventId,
                verificationRequestId: verificationRequestId || 'UNKNOWN',
                eventType: 'VERIFICATION_REQUESTED', // Always force VERIFICATION_REQUESTED for now as the schema requires
                payloadSha256,
                signatureValid: true,
                processingStatus: 'FAILED',
                responseStatus,
                errorCode,
                processedAt: new Date()
            }
        });
    } catch (e) {
        console.error('Failed to log event', e);
    }
}





