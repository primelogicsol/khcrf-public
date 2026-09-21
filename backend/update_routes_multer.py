import os

# Update consultationController.ts
ctrl_path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\backend\src\controllers\consultationController.ts'
with open(ctrl_path, 'w', encoding='utf-8') as f:
    f.write('''import { Request, Response } from 'express';
import { prisma } from '../config/db.js';

export const submitConsultation = async (req: Request, res: Response) => {
    try {
        let payload;
        try {
            payload = JSON.parse(req.body.payload);
        } catch (e) {
            return res.status(400).json({ error: 'Invalid JSON payload.' });
        }

        // Basic validation
        if (!payload.participantType || !payload.district) {
            return res.status(400).json({ error: 'Missing required fields: participantType and district are required.' });
        }

        const consultationId = `SKC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const files = req.files as Express.Multer.File[] || [];
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

        // Log for audit
        console.log(`[AUDIT] Consultation Submitted: ${consultation.consultationId}`);
        console.log(`[AUDIT] Stakeholder: ${consultation.stakeholderType}`);
        console.log(`[AUDIT] District: ${consultation.district}`);
        console.log(`[AUDIT] Intelligence Score: ${consultation.intelligenceScore}`);
        console.log(`[AUDIT] Confidence: ${consultation.confidenceLevel}`);
        console.log(`[AUDIT] Evidence Uploaded: ${consultation.evidenceCount} files`);
        console.log(`[AUDIT] Timestamp: ${consultation.submittedAt}`);

        res.status(201).json({ success: true, message: 'Consultation securely recorded.', data: consultation });
    } catch (error: any) {
        console.error('Error submitting consultation:', error);
        res.status(500).json({ error: 'Failed to submit consultation. Internal server error.' });
    }
};
''')

# Update consultationRoutes.ts
route_path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\backend\src\routes\consultationRoutes.ts'
with open(route_path, 'w', encoding='utf-8') as f:
    f.write('''import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { submitConsultation } from '../controllers/consultationController.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(process.cwd(), 'uploads', 'consultations');
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

router.post('/submit', upload.array('evidenceFiles'), submitConsultation);

export default router;
''')

print("Backend updated with multer.")
