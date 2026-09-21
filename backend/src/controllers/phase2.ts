import { prisma } from '../config/db.js';
import { requireString } from "../utils/routeHelpers";

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
                } as any
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

        // Hardcode the REQUIRED 16-step factors for completion logic
        const requiredFactors = [
            'AUTHENTICITY_PROVENANCE',
            'CHILD_LABOUR_SAFEGUARDS',
            'FAIR_WAGE_PRACTICE',
            'ENVIRONMENTAL_SUSTAINABILITY'
        ];

        // Ensure all required factors have a finding
        const currentFindings = evaluation.VerificationFinding || [];
        const foundFactorCodes = currentFindings.map(f => f.factorKey);
        
        for (const reqF of requiredFactors) {
            if (!foundFactorCodes.includes(reqF)) {
                return res.status(400).json({ error: 'Incomplete review: missing finding for ' + reqF });
            }
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

