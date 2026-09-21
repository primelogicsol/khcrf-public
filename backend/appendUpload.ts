import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

// Setup multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dest = path.join(process.cwd(), 'storage/evidence');
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        cb(null, crypto.randomUUID() + path.extname(file.originalname));
    }
});

export const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

export const uploadEvidence = async (req: any, res: any) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { id } = req.params;
        const { factorCode } = req.body;
        
        const file = req.file;
        if (!file) return res.status(400).json({ message: 'No file provided' });
        if (!factorCode) return res.status(400).json({ message: 'Missing factorCode' });

        const submission = await prisma.evaluationSubmission.findUnique({
            where: { id }
        });

        if (!submission) return res.status(404).json({ message: 'Not found' });
        if (submission.userId !== userId) return res.status(403).json({ message: 'Forbidden' });
        if (submission.caseStatus !== 'DRAFT') return res.status(400).json({ message: 'Cannot upload evidence after submission' });

        // Calculate hash of the uploaded file
        const fileBuffer = fs.readFileSync(file.path);
        const sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');

        // Create VerificationEvidence record
        const evidenceId = crypto.randomUUID();
        const evidence = await prisma.verificationEvidence.create({
            data: {
                submissionId: id,
                revision: submission.currentRevision || 1,
                evidenceId,
                factorCode,
                originalFilename: file.originalname,
                mimeType: file.mimetype,
                sizeBytes: file.size,
                expectedSha256: sha256,
                receivedSha256: sha256,
                storageKey: file.filename,
                transferStatus: 'HASH_VERIFIED',
                integrityVerified: true,
                receivedAt: new Date(),
            }
        });

        res.status(201).json({
            success: true,
            evidence: {
                id: evidence.id,
                evidenceId: evidence.evidenceId,
                factorCode: evidence.factorCode,
                filename: evidence.originalFilename,
                sha256: evidence.expectedSha256
            }
        });
    } catch (error) {
        console.error('Upload Evidence Error:', error);
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

export const getDraftEvidence = async (req: any, res: any) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { id } = req.params;
        const submission = await prisma.evaluationSubmission.findUnique({
            where: { id },
            include: { verificationEvidences: true }
        });

        if (!submission) return res.status(404).json({ message: 'Not found' });
        if (submission.userId !== userId) return res.status(403).json({ message: 'Forbidden' });

        res.status(200).json({ success: true, evidence: submission.verificationEvidences });
    } catch (error) {
        console.error('Get Evidence Error:', error);
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

export const deleteDraftEvidence = async (req: any, res: any) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { id, evidenceId } = req.params;
        
        const submission = await prisma.evaluationSubmission.findUnique({
            where: { id }
        });

        if (!submission) return res.status(404).json({ message: 'Not found' });
        if (submission.userId !== userId) return res.status(403).json({ message: 'Forbidden' });
        if (submission.caseStatus !== 'DRAFT') return res.status(400).json({ message: 'Cannot modify evidence after submission' });

        const evidence = await prisma.verificationEvidence.findUnique({
            where: { id: evidenceId }
        });

        if (!evidence || evidence.submissionId !== id) {
            return res.status(404).json({ message: 'Evidence not found' });
        }

        const filePath = path.join(process.cwd(), 'storage/evidence', evidence.storageKey);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await prisma.verificationEvidence.delete({
            where: { id: evidenceId }
        });

        res.status(200).json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        console.error('Delete Evidence Error:', error);
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};
