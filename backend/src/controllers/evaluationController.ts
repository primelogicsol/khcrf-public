import axios from "axios";
import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { EmailService } from '../services/emailService.js';
import { EmailTemplates } from '../constants/emailTemplates.js';
import { requireString } from "../utils/routeHelpers";

// Submit Evaluation
export const submitEvaluation = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId; // Assumes auth middleware populates this
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const {
            businessName,
            yearsInOperation,
            craftType,
            annualRevenue,
            website,
            answers,
            score,
            evaluationType,
        } = req.body;

        // Determine Tier based on score (Simple logic for now, can be complex)
        let tier = 'Bronze';
        if (score >= 20) tier = 'Gold';
        else if (score >= 15) tier = 'Silver';

        // Create Submission
        const submission = await prisma.evaluationSubmission.create({
            data: {
                userId,
                businessName,
                yearsInOperation: Number(yearsInOperation) || 0,
                craftType,
                annualRevenue,
                website,
                answers,
                score,
                tier,
                status: 'PENDING',
                evaluationType: evaluationType || 'SELF_ASSESSMENT',
            },
        });

        // Send Email (Fire and forget)
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user && user.email) {
            EmailService.sendEmail(user.email, EmailTemplates.BUSINESS_EVALUATION_CONFIRMATION, {
                first_name: user.name, // Template uses first_name
                type: 'Business Evaluation',
                id: submission.id
            }).catch(err => console.error("Failed to send evaluation application email:", err));
        }

        res.status(201).json({ message: 'Evaluation submitted successfully', submission });
    } catch (error) {
        console.error('Submit Evaluation Error:', error);
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

// Get My Submissions
export const getMySubmissions = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const submissions = await prisma.evaluationSubmission.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        res.status(200).json(submissions);
    } catch (error) {
        console.error('Get My Submissions Error:', error);
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};
// Get All Submissions (Admin)
export const getAllEvaluations = async (req: Request, res: Response) => {
    try {
        // In a real app, you'd check for admin role here
        // const userRole = (req as any).user?.role;
        // if (userRole !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });

        const submissions = await prisma.evaluationSubmission.findMany({
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true, email: true } } }
        });

        res.status(200).json(submissions);
    } catch (error) {
        console.error('Get All Submissions Error:', error);
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

// Get Single Submission (Admin/Owner)
export const getEvaluationById = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const submission = await prisma.evaluationSubmission.findUnique({
            where: { id },
            include: { user: { select: { name: true, email: true } } }
        });

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        // Fetch related Listing (Documents) for this user
        // Assuming the most recent listing is relevant
        const listing = await prisma.listing.findFirst({
            where: { userId: submission.userId },
            include: {
                artisanProfile: true,
                businessProfile: true,
                instituteProfile: true,
                compliance: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({ ...submission, listing });
    } catch (error) {
        console.error('Get Submission By ID Error:', error);
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

// Update Submission Status (Admin)
export const updateEvaluationStatus = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const { status, adminCertificateUrl } = req.body;

        if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const updatedSubmission = await prisma.evaluationSubmission.update({
            where: { id },
            data: { 
                status,
                adminCertificateUrl // Save the certificate URL if provided
            },
            include: { user: true } // Include user to get email
        });

        // Send Status Update Email
        if (updatedSubmission.user && updatedSubmission.user.email) {
            EmailService.sendEmail(updatedSubmission.user.email, EmailTemplates.STATUS_UPDATE, {
                name: updatedSubmission.user.name,
                type: 'Evaluation',
                status: status
            }).catch(err => console.error("Failed to send evaluation status update email:", err));
        }

        res.status(200).json({ message: 'Status updated successfully', submission: updatedSubmission });
    } catch (error) {
        console.error('Update Status Error:', error);
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};


export const startVerificationReview = async (req: any, res: any) => {
    try {
        const evaluationId = requireString(req.params.id);
        const evaluation = await prisma.evaluationSubmission.findUnique({ where: { id: evaluationId } });

        if (!evaluation) return res.status(404).json({ error: 'Not found' });
        if (evaluation.evaluationType !== 'KHCRF_16_STEP') return res.status(400).json({ error: 'Invalid type' });
        if (evaluation.caseStatus !== 'SUBMITTED') return res.status(409).json({ error: 'Must be in SUBMITTED state to start review' });

        await prisma.evaluationSubmission.update({
            where: { id: evaluationId },
            data: { caseStatus: 'UNDER_REVIEW' }
        });

        res.json({ success: true, message: 'Review started' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const upsertVerificationFinding = async (req: any, res: any) => {
    try {
        const evaluationId = requireString(req.params.id);
        const factorCode = requireString(req.params.factorCode);
        const { findingStatus, reviewerNote, evidenceIds } = req.body;
        const reviewerId = req.user.userId;

        const evaluation = await prisma.evaluationSubmission.findUnique({ where: { id: evaluationId } });
        if (!evaluation) return res.status(404).json({ error: 'Not found' });
        if (evaluation.evaluationType !== 'KHCRF_16_STEP') return res.status(400).json({ error: 'Invalid type' });
        
        // Allowed reviewable states
        if (evaluation.caseStatus !== 'UNDER_REVIEW' && evaluation.caseStatus !== 'GROUND_VERIFICATION_REQUIRED') {
            return res.status(409).json({ error: 'Review is not currently active' });
        }

        // Validate evidence IDs belong to this evaluation
        if (evidenceIds && evidenceIds.length > 0) {
            const evs = await prisma.evaluationEvidence.findMany({
                where: {
                    id: { in: evidenceIds }
                }
            });
            if (evs.some(e => e.evaluationId !== evaluationId)) {
                return res.status(400).json({ error: 'Cross-evaluation evidence rejected' });
            }
        }

        // Generate ID manually since there is no @default(cuid()) in the pulled schema for VerificationFinding
        const { randomUUID } = require('crypto');
        
        // Upsert
        // We use evaluation.currentRevision
        const revision = evaluation.currentRevision || 0;

        // Upsert isn't directly possible with composite unique in prisma unless all fields match exactly,
        // so we try finding first
        let finding = await prisma.verificationFinding.findUnique({
            where: {
                submissionId_revision_factorKey: {
                    submissionId: evaluationId,
                    revision: revision,
                    factorKey: factorCode
                }
            }
        });

        if (finding) {
            finding = await prisma.verificationFinding.update({
                where: { id: finding.id },
                data: {
                    status: findingStatus,
                    reviewerNotes: reviewerNote,
                    reviewerId: reviewerId,
                    reviewedAt: new Date()
                }
            });
        } else {
            finding = await prisma.verificationFinding.create({
                data: {
                    id: randomUUID(),
                    submissionId: evaluationId,
                    revision: revision,
                    factorKey: factorCode,
                    status: findingStatus,
                    reviewerNotes: reviewerNote,
                    reviewerId: reviewerId,
                    reviewedAt: new Date()
                } as any
            });
        }

        // Update evidence mapping
        // First delete existing
        await prisma.verificationFindingEvidence.deleteMany({
            where: { findingId: finding.id }
        });
        
        if (evidenceIds && evidenceIds.length > 0) {
            await prisma.verificationFindingEvidence.createMany({
                data: evidenceIds.map((eid: string) => ({
                    findingId: finding.id,
                    evidenceId: eid
                }))
            });
        }

        res.json({ success: true, finding });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const completeVerificationReview = async (req: any, res: any) => {
    try {
        const evaluationId = requireString(req.params.id);
        const evaluation = await prisma.evaluationSubmission.findUnique({
            where: { id: evaluationId },
            include: {
                VerificationFinding: {
                    where: { revision: 0 } // Assuming revision 0
                }
            }
        });

        if (!evaluation) return res.status(404).json({ error: 'Not found' });
        if (evaluation.evaluationType !== 'KHCRF_16_STEP') return res.status(400).json({ error: 'Invalid type' });
        if (evaluation.caseStatus !== 'UNDER_REVIEW') return res.status(409).json({ error: 'Must be UNDER_REVIEW' });

        const factorsData = require('../../../shared/factors.json');
        const FACTOR_LISTS: Record<string, string[]> = factorsData.FACTOR_LISTS;
        const requiredFactors = FACTOR_LISTS[evaluation.entityType || 'BUSINESS'] || FACTOR_LISTS.BUSINESS;

        // Ensure all required factors have a finding
        const currentFindings = evaluation.VerificationFinding || [];
        const foundFactorCodes = currentFindings.map(f => f.factorKey);
        
        const missingFactors = requiredFactors.filter(reqF => !foundFactorCodes.includes(reqF));
        if (missingFactors.length > 0) {
            return res.status(400).json({ error: 'Incomplete review', missingFactors });
        }

        // Transition logic: if any finding requires ground verification, set to GROUND_VERIFICATION_REQUIRED
        const needsGround = currentFindings.some(f => f.status === 'MORE_EVIDENCE_REQUIRED' || f.status === 'UNDER_REVIEW');
        
        // Wait, the prompt says: "if any factor requires physical or field verification..."
        // Or if explicitly marked GROUND_VERIFICATION_REQUIRED in request body.
        let targetStatus = req.body.requireGroundVerification ? 'GROUND_VERIFICATION_REQUIRED' : 'VERIFICATION_COMPLETED';

        await prisma.evaluationSubmission.update({
            where: { id: evaluationId },
            data: { caseStatus: targetStatus as any }
        });

        res.json({ success: true, status: targetStatus });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const transmitToCraftlore = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const evaluation = await prisma.evaluationSubmission.findUnique({
            where: { id },
            include: { VerificationFinding: true }
        });

        if (!evaluation) return res.status(404).json({ error: 'Not found' });
        if (evaluation.evaluationType !== 'KHCRF_16_STEP') return res.status(400).json({ error: 'Invalid type' });
        if (evaluation.caseStatus !== 'VERIFICATION_COMPLETED') return res.status(409).json({ error: 'Must be VERIFICATION_COMPLETED' });

        let verifiedResult = await prisma.kHCRFVerifiedResult.findFirst({
            where: { evaluationId: id },
            orderBy: { verificationVersion: 'desc' },
            include: { factors: true }
        });

        if (!verifiedResult) {
            verifiedResult = await prisma.kHCRFVerifiedResult.create({
                data: {
                    evaluationId: id,
                    trackingId: evaluation.trackingId || id,
                    entityId: evaluation.userId,
                    entityType: evaluation.entityType || 'BUSINESS',
                    craftType: evaluation.craftType || 'Pashmina',
                    verificationVersion: 1,
                    factors: {
                        create: evaluation.VerificationFinding.map(f => ({
                            factorCode: f.factorKey,
                            findingStatus: f.status,
                            evidenceReferenceCount: 1,
                            findingId: f.id
                        }))
                    }
                },
                include: { factors: true }
            });
        }

        const transmission = await prisma.verificationTransmission.create({
            data: {
                verifiedResultId: verifiedResult.id,
                destination: 'CRAFTLORE_CKTRE',
                status: 'PENDING'
            }
        });

        const eventId = transmission.id;
        
        const payload = {
            contract_version: "1.0",
            event_type: "VERIFICATION_COMPLETED",
            event_id: eventId,
            verification_request_id: verifiedResult.trackingId,
            revision: verifiedResult.verificationVersion,
            methodology_version: "PTS-v1.0",
            verified_factors: verifiedResult.factors.map(f => ({
                factor_code: f.factorCode,
                verification_status: f.findingStatus
            })),
            verification_status: "VERIFICATION_COMPLETED",
            confidence: 1.0,
            khcrf_entity: {
                sourceEntityId: verifiedResult.entityId,
                entityType: verifiedResult.entityType,
                name: evaluation.businessName,
                craft: verifiedResult.craftType
            }
        };

        const payloadStr = JSON.stringify(payload);
        const payloadSha256 = require('crypto').createHash('sha256').update(payloadStr).digest('hex');
        const timestamp = Date.now().toString();
        
        const CRAFTLORE_URL = process.env.CRAFTLORE_API_BASE_URL || 'http://127.0.0.1:5000';
        const path = '/api/cktre/integrations/khcrf/events';
        const method = 'POST';
        
        const SECRET = process.env.KHCRF_TO_CRAFTLORE_SECRET || 'test_secret_for_khcrf';
        const signatureBase = `${timestamp}.${eventId}.${method}.${path}.${payloadSha256}`;
        const signature = require('crypto').createHmac('sha256', SECRET).update(signatureBase).digest('hex');

        try {
            const craftloreRes = await axios.post(`${CRAFTLORE_URL}${path}`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-khcrf-signature': signature,
                    'x-khcrf-timestamp': timestamp,
                    'x-khcrf-payload-sha256': payloadSha256
                }
            });
            
            await prisma.verificationTransmission.update({
                where: { id: transmission.id },
                data: {
                    status: 'ACKNOWLEDGED',
                    transmittedAt: new Date(),
                    externalReference: craftloreRes.data.importId
                }
            });

            return res.json({
                importId: craftloreRes.data.importId,
                status: craftloreRes.data.status,
                craftloreEntityId: craftloreRes.data.craftloreEntityId
            });
        } catch (apiErr: any) {
            console.error('Transmission failed:', apiErr.response?.data || apiErr.message);
            await prisma.verificationTransmission.update({
                where: { id: transmission.id },
                data: {
                    status: 'FAILED',
                    lastError: apiErr.message,
                    attemptCount: { increment: 1 }
                }
            });
            return res.status(502).json({ error: 'Transmission failed', detail: apiErr.message });
        }
    } catch (error) {
        console.error('Error transmitting:', error);
        res.status(500).json({ error: 'Failed to transmit' });
    }
};

export const getEvaluationEvidenceFile = async (req: any, res: any) => {
    try {
        const evaluationId = requireString(req.params.evaluationId);
        const evidenceId = requireString(req.params.evidenceId);
        const evidence = await prisma.evaluationEvidence.findUnique({
            where: { id: evidenceId },
            include: { evaluation: true }
        });
        if (!evidence || evidence.evaluationId !== evaluationId) return res.status(404).json({ error: 'Not found' });
        const filePath = require('path').join(process.cwd(), 'secure_uploads', evidence.storageKey);
        if (!require('fs').existsSync(filePath)) return res.status(404).json({ error: 'File not found on disk' });
        res.sendFile(filePath);
    } catch(e) {
        res.status(500).json({ error: 'Failed to download file' });
    }
};
