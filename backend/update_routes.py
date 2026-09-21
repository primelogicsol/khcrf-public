import os

# Create consultationController.ts
ctrl_path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\backend\src\controllers\consultationController.ts'
with open(ctrl_path, 'w', encoding='utf-8') as f:
    f.write('''import { Request, Response } from 'express';
import { prisma } from '../config/db.js';

export const submitConsultation = async (req: Request, res: Response) => {
    try {
        const payload = req.body;

        // Basic validation
        if (!payload.participantType || !payload.district) {
            return res.status(400).json({ error: 'Missing required fields: participantType and district are required.' });
        }

        const consultationId = `SKC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

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
                evidenceCount: payload.evidenceCount || 0,
                
                graphNodes: payload.knowledgeGraphOutput?.nodes || [],
                graphEdges: payload.knowledgeGraphOutput?.relationships || [],
                
                rawConsultationData: payload.rawConsultationData || {},
                evidenceMetadata: payload.evidenceMetadata || [],
            }
        });

        // Log for audit
        console.log(`[AUDIT] Consultation Submitted: ${consultation.consultationId} - ${consultation.participantType} from ${consultation.district}. Score: ${consultation.intelligenceScore}, Confidence: ${consultation.confidenceLevel}, Evidence: ${consultation.evidenceCount}`);

        res.status(201).json({ success: true, message: 'Consultation securely recorded.', data: consultation });
    } catch (error: any) {
        console.error('Error submitting consultation:', error);
        res.status(500).json({ error: 'Failed to submit consultation. Internal server error.' });
    }
};
''')

# Create consultationRoutes.ts
route_path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\backend\src\routes\consultationRoutes.ts'
with open(route_path, 'w', encoding='utf-8') as f:
    f.write('''import express from 'express';
import { submitConsultation } from '../controllers/consultationController.js';

const router = express.Router();

router.post('/submit', submitConsultation);

export default router;
''')

# Update index.ts
index_path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\backend\src\index.ts'
with open(index_path, 'r', encoding='utf-8') as f:
    index_content = f.read()

if "import consultationRoutes" not in index_content:
    index_content = index_content.replace(
        "import advisoryRoutes from './routes/advisoryRoutes.js';",
        "import advisoryRoutes from './routes/advisoryRoutes.js';\nimport consultationRoutes from './routes/consultationRoutes.js';"
    )
    
if "app.use('/api/consultation'" not in index_content:
    index_content = index_content.replace(
        "app.use('/api/advisory', advisoryRoutes);",
        "app.use('/api/advisory', advisoryRoutes);\napp.use('/api/consultation', consultationRoutes);"
    )

with open(index_path, 'w', encoding='utf-8') as f:
    f.write(index_content)

print("Backend routes and controllers updated.")
