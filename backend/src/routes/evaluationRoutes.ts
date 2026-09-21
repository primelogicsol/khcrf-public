import express from 'express';
import { transmitToCraftlore,  
    submitEvaluation, 
    getMySubmissions, 
    getAllEvaluations, 
    getEvaluationById, 
    updateEvaluationStatus, 
    
    startVerificationReview,
    upsertVerificationFinding,
    completeVerificationReview,
    getEvaluationEvidenceFile
} from '../controllers/evaluationController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { prisma } from '../config/db.js';

const router = express.Router();

const UPLOAD_DIR = path.join(process.cwd(), 'secure_uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => cb(null, crypto.randomBytes(16).toString('hex') + path.extname(file.originalname))
});

const uploadEvidence = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type'));
  }
});

// Create new 16-step Draft
router.post('/', authenticateToken, async (req: any, res: any) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { businessName, craftType, answers } = req.body;
        
        // Use VR-YYYY-XXXXXX format
        const trackingId = 'VR-' + new Date().getFullYear() + '-' + crypto.randomBytes(3).toString('hex').toUpperCase();

        const draft = await prisma.evaluationSubmission.create({
            data: {
                userId,
                businessName: businessName || '',
                craftType: craftType || '',
                answers: answers || {},
                evaluationType: 'KHCRF_16_STEP',
                caseStatus: 'DRAFT',
                status: 'PENDING',
                trackingId,
                score: 0
            }
        });

        res.json({ success: true, id: draft.id, trackingId: draft.trackingId });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to create draft' });
    }
});

// Update 16-step Draft
router.patch('/:id', authenticateToken, async (req: any, res: any) => {
    try {
        const userId = req.user?.userId;
        const evaluationId = req.params.id;

        const draft = await prisma.evaluationSubmission.findUnique({ where: { id: evaluationId } });
        
        if (!draft) return res.status(404).json({ error: 'Not found' });
        if (draft.userId !== userId) return res.status(403).json({ error: 'Forbidden' });
        if (draft.evaluationType !== 'KHCRF_16_STEP') return res.status(400).json({ error: 'Invalid evaluation type' });
        if (draft.caseStatus !== 'DRAFT') return res.status(409).json({ error: 'Assessment is no longer a draft' });

        let newAnswers = draft.answers as Record<string, any>;
        if (req.body.answers) {
            newAnswers = { ...newAnswers, ...req.body.answers };
        }
        
        let businessName = draft.businessName;
        let craftType = draft.craftType;
        if (req.body.businessName) businessName = req.body.businessName;
        if (req.body.craftType) craftType = req.body.craftType;

        await prisma.evaluationSubmission.update({
            where: { id: evaluationId },
            data: { answers: newAnswers, businessName, craftType }
        });

        res.json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to update draft' });
    }
});

// Upload Evidence
router.post('/:id/evidence', authenticateToken, uploadEvidence.single('file'), async (req: any, res: any) => {
    try {
        const evaluationId = req.params.id;
        const userId = req.user?.userId;

        const draft = await prisma.evaluationSubmission.findUnique({ where: { id: evaluationId } });
        if (!draft) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(404).json({ error: 'Evaluation not found' });
        }
        if (draft.userId !== userId) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(403).json({ error: 'Forbidden' });
        }
        if (draft.evaluationType !== 'KHCRF_16_STEP') {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ error: 'Invalid evaluation type' });
        }
        if (draft.caseStatus !== 'DRAFT') {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(409).json({ error: 'Assessment is no longer a draft' });
        }

        const file = req.file;
        let factorCodes = req.body.factorCodes || req.body.factorCode;

        if (!file) return res.status(400).json({ error: 'No file uploaded' });
        
        let factors: string[] = [];
        if (typeof factorCodes === 'string') {
            try {
                const parsed = JSON.parse(factorCodes);
                if (Array.isArray(parsed)) factors = parsed;
                else factors = factorCodes.split(',').map((s: string) => s.trim()).filter(Boolean);
            } catch (e) {
                factors = factorCodes.split(',').map((s: string) => s.trim()).filter(Boolean);
            }
        } else if (Array.isArray(factorCodes)) {
            factors = factorCodes;
        }

        if (factors.length === 0) {
            fs.unlinkSync(file.path);
            return res.status(400).json({ error: 'At least one factor is required' });
        }

        const evidence = await prisma.evaluationEvidence.create({
            data: {
                evaluationId,
                originalFilename: file.originalname,
                storageKey: file.filename,
                mimeType: file.mimetype,
                fileSize: file.size,
                uploadedBy: userId,
                factors: {
                    create: factors.map(code => ({ factorCode: code }))
                }
            },
            include: { factors: true }
        });

        res.json({
            success: true,
            evidence: {
                id: evidence.id,
                originalFilename: evidence.originalFilename,
                mimeType: evidence.mimeType,
                fileSize: evidence.fileSize,
                uploadedAt: evidence.uploadedAt,
                factors: evidence.factors.map(f => f.factorCode)
            }
        });
    } catch (e: any) {
        if (req.file) fs.unlinkSync(req.file.path);
        console.error(e);
        res.status(500).json({ error: 'Upload failed' });
    }
});

// Get Evidence
router.get('/:id/evidence', authenticateToken, async (req: any, res: any) => {
    try {
        const userId = req.user?.userId;
        const evaluationId = req.params.id;

        const draft = await prisma.evaluationSubmission.findUnique({ where: { id: evaluationId } });
        if (!draft || draft.userId !== userId) {
            return res.status(404).json({ error: 'Not found' });
        }

        const evidenceList = await prisma.evaluationEvidence.findMany({
            where: { evaluationId },
            include: { factors: true }
        });

        res.json({
            success: true,
            evidence: evidenceList.map(e => ({
                id: e.id,
                originalFilename: e.originalFilename,
                mimeType: e.mimeType,
                fileSize: e.fileSize,
                uploadedAt: e.uploadedAt,
                factors: e.factors.map(f => f.factorCode)
            }))
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to fetch evidence' });
    }
});

// Delete Evidence
router.delete('/:id/evidence/:eid', authenticateToken, async (req: any, res: any) => {
    try {
        const userId = req.user?.userId;
        const evaluationId = req.params.id;

        const draft = await prisma.evaluationSubmission.findUnique({ where: { id: evaluationId } });
        if (!draft || draft.userId !== userId) return res.status(404).json({ error: 'Not found' });
        if (draft.caseStatus !== 'DRAFT') return res.status(409).json({ error: 'Assessment is no longer a draft' });

        const evidence = await prisma.evaluationEvidence.findUnique({ where: { id: req.params.eid } });
        if (!evidence || evidence.evaluationId !== evaluationId) return res.status(404).json({ error: 'Not found' });

        await prisma.evaluationEvidence.delete({ where: { id: req.params.eid } });
        
        try {
            fs.unlinkSync(path.join(UPLOAD_DIR, evidence.storageKey));
        } catch (e) {}

        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Failed to delete' });
    }
});

// Final Submission
router.post('/:id/submit', authenticateToken, async (req: any, res: any) => {
    try {
        const userId = req.user?.userId;
        const evaluationId = req.params.id;

        const draft = await prisma.evaluationSubmission.findUnique({ where: { id: evaluationId } });
        
        if (!draft) return res.status(404).json({ error: 'Not found' });
        if (draft.userId !== userId) return res.status(403).json({ error: 'Forbidden' });
        if (draft.evaluationType !== 'KHCRF_16_STEP') return res.status(400).json({ error: 'Invalid evaluation type' });
        if (draft.caseStatus !== 'DRAFT') return res.status(409).json({ error: 'Assessment is no longer a draft' });

        await prisma.evaluationSubmission.update({
            where: { id: evaluationId },
            data: { caseStatus: 'SUBMITTED' }
        });

        res.json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to submit' });
    }
});

// Original User Routes
router.post('/submit-evaluation', authenticateToken, submitEvaluation);
router.get('/my-evaluation', authenticateToken, getMySubmissions);

// Admin Routes
router.get('/', authenticateToken, authorizeAdmin, getAllEvaluations);
router.get('/:id', authenticateToken, authorizeAdmin, getEvaluationById);
router.put('/:id/status', authenticateToken, authorizeAdmin, updateEvaluationStatus);

// Reviewer Phase 2 Routes
router.post('/:id/start-review', authenticateToken, authorizeAdmin, startVerificationReview);
router.put('/:id/findings/:factorCode', authenticateToken, authorizeAdmin, upsertVerificationFinding);
router.post('/:id/complete-review', authenticateToken, authorizeAdmin, completeVerificationReview);
router.post('/:id/transmit-craftlore', authenticateToken, authorizeAdmin, transmitToCraftlore);

// Evidence File Route (Authorized for owner + admins)
router.get('/:evaluationId/evidence/:evidenceId/file', authenticateToken, getEvaluationEvidenceFile);

export default router;
