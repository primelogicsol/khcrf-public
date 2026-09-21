import crypto from 'crypto';
import { validateFactors } from '../domain/performanceFactors.js';

// Generate Tracking ID
async function generateTrackingId() {
    let trackingId;
    let isUnique = false;
    const year = new Date().getFullYear();
    let attempts = 0;
    while (!isUnique && attempts < 10) {
        const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
        trackingId = `VR-${year}-${randomHex}`;
        const existing = await prisma.evaluationSubmission.findUnique({
            where: { trackingId }
        });
        if (!existing) {
            isUnique = true;
        }
        attempts++;
    }
    if (!isUnique) throw new Error('Failed to generate tracking ID');
    return trackingId;
}

// ----------------------------------------------------
// NEW LIFECYCLE ENDPOINTS
// ----------------------------------------------------

export const createEvaluation = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { entityType, entityName, craftType } = req.body;

        if (!['ARTISAN', 'BUSINESS', 'INSTITUTION'].includes(entityType)) {
            return res.status(400).json({ message: 'Invalid entityType' });
        }

        const trackingId = await generateTrackingId();

        const submission = await prisma.evaluationSubmission.create({
            data: {
                userId,
                entityType,
                businessName: entityName,
                craftType,
                origin: 'KHCRF',
                caseStatus: 'DRAFT',
                trackingId,
                score: null,
                tier: null,
                selfReportedPts: null,
                answers: {}
            }
        });

        res.status(201).json({
            success: true,
            id: submission.id,
            trackingId: submission.trackingId,
            origin: submission.origin,
            status: submission.caseStatus
        });
    } catch (error) {
        console.error('Create Evaluation Error:', error);
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

export const getEvaluation = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { id } = req.params;
        const submission = await prisma.evaluationSubmission.findUnique({
            where: { id }
        });

        if (!submission) return res.status(404).json({ message: 'Not found' });
        if (submission.userId !== userId) return res.status(403).json({ message: 'Forbidden' });

        res.status(200).json(submission);
    } catch (error) {
        console.error('Get Evaluation Error:', error);
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

export const updateEvaluation = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { id } = req.params;
        const { answers, entityName, craftType, location } = req.body; // Add any fields that can be updated

        const submission = await prisma.evaluationSubmission.findUnique({
            where: { id }
        });

        if (!submission) return res.status(404).json({ message: 'Not found' });
        if (submission.userId !== userId) return res.status(403).json({ message: 'Forbidden' });
        if (submission.caseStatus !== 'DRAFT') return res.status(400).json({ message: 'Cannot edit submitted evaluation' });

        if (answers && !validateFactors(submission.entityType as string, answers)) {
            return res.status(400).json({ message: 'INVALID_FACTOR_FOR_ENTITY_TYPE' });
        }

        const mergedAnswers = { ...(submission.answers as any), ...(answers || {}) };

        const updated = await prisma.evaluationSubmission.update({
            where: { id },
            data: {
                answers: mergedAnswers,
                businessName: entityName !== undefined ? entityName : undefined,
                craftType: craftType !== undefined ? craftType : undefined,
            }
        });

        res.status(200).json({ success: true, submission: updated });
    } catch (error) {
        console.error('Update Evaluation Error:', error);
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

export const submitEvaluationDraft = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { id } = req.params;

        const submission = await prisma.evaluationSubmission.findUnique({
            where: { id }
        });

        if (!submission) return res.status(404).json({ message: 'Not found' });
        if (submission.userId !== userId) return res.status(403).json({ message: 'Forbidden' });
        if (submission.caseStatus !== 'DRAFT') return res.status(400).json({ message: 'Already submitted' });

        const nextRevision = submission.currentRevision + 1;
        const updated = await prisma.evaluationSubmission.update({
            where: { id },
            data: {
                caseStatus: 'SUBMITTED',
                submittedAt: new Date(),
                currentRevision: nextRevision
            }
        });

        if (updated.answers && typeof updated.answers === 'object') {
            const findingsData = Object.entries(updated.answers).map(([factorKey, selfReportedValue]) => ({
                submissionId: id,
                revision: nextRevision,
                factorKey,
                selfReportedValue: selfReportedValue as any,
                verifiedValue: null,
                status: 'SELF_REPORTED' as const
            }));

            if (findingsData.length > 0) {
                await prisma.verificationFinding.createMany({
                    data: findingsData
                });
            }
        }

        res.status(200).json({ success: true, trackingId: updated.trackingId, status: updated.caseStatus });
    } catch (error) {
        console.error('Submit Draft Error:', error);
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};
