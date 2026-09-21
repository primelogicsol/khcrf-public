import os
import re

# 1. Update consultationRoutes.ts (Multer Hardening)
route_path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\backend\src\routes\consultationRoutes.ts'
with open(route_path, 'w', encoding='utf-8') as f:
    f.write('''import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { submitConsultation, getConsultations } from '../controllers/consultationController.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Prevent path traversal by using path.resolve and ensuring it stays in intended dir
        const dir = path.resolve(process.cwd(), 'uploads', 'consultations');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Sanitize filename
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeName}`);
    }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Allowed file types: Images, PDFs, Word, Excel, CSV
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images, PDFs, Word, and Excel documents are allowed.'));
    }
};

const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    fileFilter
});

router.post('/submit', upload.array('evidenceFiles', 10), submitConsultation);
router.get('/', getConsultations);

export default router;
''')

# 2. Update consultationController.ts (File Cleanup on DB Failure)
ctrl_path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\backend\src\controllers\consultationController.ts'
with open(ctrl_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_ctrl = '''import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import fs from 'fs';

export const submitConsultation = async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[] || [];
    try {
        let payload;
        try {
            payload = JSON.parse(req.body.payload);
        } catch (e) {
            return res.status(400).json({ error: 'Invalid JSON payload.' });
        }

        if (!payload.participantType || !payload.district) {
            return res.status(400).json({ error: 'Missing required fields: participantType and district are required.' });
        }

        const consultationId = payload.consultationId || `SKC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const evidenceMetadata = files.map(f => ({
            filename: f.filename,
            originalName: f.originalname,
            fileType: f.mimetype,
            size: f.size,
            evidenceCategory: 'Supporting Document',
            uploadTimestamp: new Date().toISOString(),
            consultationId: consultationId
        }));

        const consultation = await prisma.consultationSubmission.create({
            data: {
                consultationId: consultationId,
                participantType: payload.participantType,
                district: payload.district,
                craft: payload.craft || null,
                stakeholderType: payload.participantType,
                
                aiNarrative: payload.generatedSummary,
                inferredTags: payload.challengeTags || [],
                inferredThemes: payload.semanticThemes || [],
                challenges: payload.challenges || {},
                opportunityRanking: payload.opportunityRanking || {},
                
                governmentRecommendation: payload.governmentRecommendation || null,
                industryRecommendation: payload.industryRecommendation || null,
                immediateAction: payload.immediateAction || null,
                
                intelligenceScore: payload.generatedIndicators?.overallIntelligenceScore || 0,
                confidenceLevel: payload.generatedIndicators?.submissionConfidence || 'Low',
                qualityIndicators: payload.generatedIndicators || {},
                evidenceCount: files.length,
                
                graphNodes: payload.knowledgeGraphOutput?.nodes || [],
                graphEdges: payload.knowledgeGraphOutput?.relationships || [],
                
                rawConsultationData: payload.rawConsultationData || {},
                evidenceMetadata: evidenceMetadata,
            }
        });

        console.log(`[AUDIT] Consultation Submitted: ${consultation.consultationId}`);
        res.status(201).json({ success: true, message: 'Consultation securely recorded.', data: consultation });
    } catch (error: any) {
        console.error('Error submitting consultation:', error);
        
        // Cleanup uploaded files on DB failure
        if (files && files.length > 0) {
            files.forEach(f => {
                if (fs.existsSync(f.path)) {
                    try { fs.unlinkSync(f.path); } catch (e) {}
                }
            });
        }
        
        // Handle duplicate consultationId
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'A submission with this ID already exists.' });
        }

        res.status(500).json({ error: 'Failed to submit consultation. Internal server error.' });
    }
};

export const getConsultations = async (req: Request, res: Response) => {
    try {
        const consultations = await prisma.consultationSubmission.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ success: true, data: consultations });
    } catch (error: any) {
        console.error('Error fetching consultations:', error);
        res.status(500).json({ error: 'Failed to fetch consultations.' });
    }
};
'''
with open(ctrl_path, 'w', encoding='utf-8') as f:
    f.write(new_ctrl)


# 3. Update Frontend API URLs (ParticipateClient.tsx & Admin Dashboard)
part_path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts\participate\ParticipateClient.tsx'
with open(part_path, 'r', encoding='utf-8') as f:
    part_content = f.read()

part_content = part_content.replace("'http://localhost:4000/api/consultation/submit'", "process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/consultation/submit` : 'http://localhost:4000/api/consultation/submit'")
with open(part_path, 'w', encoding='utf-8') as f:
    f.write(part_content)

admin_path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\admin\state-of-kashmir-crafts\intelligence\page.tsx'
with open(admin_path, 'r', encoding='utf-8') as f:
    admin_content = f.read()

admin_content = admin_content.replace("'http://localhost:4000/api/consultation'", "process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/consultation` : 'http://localhost:4000/api/consultation'")
with open(admin_path, 'w', encoding='utf-8') as f:
    f.write(admin_content)

print("Harden script complete.")
