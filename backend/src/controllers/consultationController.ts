import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import fs from 'fs';
import { createAuditLog } from '../utils/auditLogger.js';
import { requireString } from "../utils/routeHelpers";

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

        const host = req.get('host');
        const protocol = req.protocol;
        const baseUrl = `${protocol}://${host}`;
        const evidenceMetadata = files.map(f => {
            const s3Url = (f as any).location;
            const localUrl = s3Url ? undefined : `${baseUrl}/uploads/consultations/${f.filename}`;
            return {
                filename: (f as any).key || f.filename,
                originalName: f.originalname,
                fileType: f.mimetype,
                size: f.size,
                url: s3Url || localUrl,
                evidenceCategory: 'Supporting Document',
                uploadTimestamp: new Date().toISOString(),
                consultationId: consultationId
            };
        });

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

        res.status(500).json({ error: 'Failed to submit consultation. Internal server error.', details: error.message || String(error) });
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

export const getConsultationById = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        if (!id) {
            return res.status(400).json({ success: false, error: 'Consultation ID is required.' });
        }

        const consultation = await prisma.consultationSubmission.findFirst({
            where: {
                OR: [
                    { id: id },
                    { consultationId: id }
                ]
            }
        });

        if (!consultation) {
            return res.status(404).json({ success: false, error: 'Consultation submission not found' });
        }

        res.status(200).json({ success: true, data: consultation });
    } catch (error: any) {
        console.error('Error fetching consultation by ID:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch consultation details.' });
    }
};

export const updateConsultationStatus = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const { status, internalNote, reason } = req.body;

        if (!id) return res.status(400).json({ success: false, error: 'Consultation ID is required.' });

        const consultation = await prisma.consultationSubmission.findUnique({ where: { id } });
        if (!consultation) return res.status(404).json({ success: false, error: 'Consultation not found' });

        const currentStatus = consultation.status || 'RECEIVED';
        const notes = reason || internalNote;

        if (status && status !== currentStatus) {
            // State Machine Rules
            const validTransitions: Record<string, string[]> = {
                'RECEIVED': ['UNDER_REVIEW', 'ARCHIVED', 'NEEDS_CLARIFICATION'],
                'UNDER_REVIEW': ['NEEDS_CLARIFICATION', 'VERIFIED', 'ARCHIVED'],
                'NEEDS_CLARIFICATION': ['UNDER_REVIEW', 'ARCHIVED'],
                'VERIFIED': ['USED_IN_DRAFT', 'ARCHIVED'],
                'USED_IN_DRAFT': ['VALIDATED', 'ARCHIVED'],
                'VALIDATED': ['USED_IN_FINAL_REPORT', 'ARCHIVED'],
                'USED_IN_FINAL_REPORT': ['ARCHIVED'],
                'ARCHIVED': [] // Terminal state
            };

            const allowed = validTransitions[currentStatus] || [];
            if (!allowed.includes(status)) {
                return res.status(400).json({ 
                    success: false, 
                    error: `Invalid transition from ${currentStatus} to ${status}. Allowed: ${allowed.join(', ')}` 
                });
            }
        }

        const updated = await prisma.consultationSubmission.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(notes !== undefined && { internalNotes: notes })
            }
        });

        if (status && status !== currentStatus) {
            await createAuditLog({
                module: 'Consultation',
                recordType: 'ConsultationSubmission',
                recordId: id,
                action: 'status_update',
                previousValue: currentStatus,
                newValue: status,
                notes: notes,
                req
            });
        } else if (notes !== undefined && notes !== consultation.internalNotes) {
            await createAuditLog({
                module: 'Consultation',
                recordType: 'ConsultationSubmission',
                recordId: id,
                action: 'note_update',
                previousValue: consultation.internalNotes,
                newValue: notes,
                req
            });
        }

        res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
        console.error('Error updating consultation status:', error);
        res.status(500).json({ success: false, error: 'Failed to update consultation.' });
    }
};

export const deleteConsultation = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        if (!id) {
            return res.status(400).json({ success: false, error: 'Consultation ID is required.' });
        }

        const consultation = await prisma.consultationSubmission.findUnique({ where: { id } });
        if (!consultation) {
            return res.status(404).json({ success: false, error: 'Consultation not found' });
        }

        // Clean up evidence files if stored locally
        const metadata = consultation.evidenceMetadata as any[] || [];
        for (const file of metadata) {
            if (file.url && !file.url.startsWith('http')) {
                try {
                    if (fs.existsSync(file.url)) {
                        fs.unlinkSync(file.url);
                    }
                } catch (e) { /* ignore */ }
            }
        }

        await prisma.consultationSubmission.delete({ where: { id } });
        console.log(`[AUDIT] Consultation Deleted: ${consultation.consultationId}`);
        res.status(200).json({ success: true, message: 'Consultation deleted successfully.' });
    } catch (error: any) {
        console.error('Error deleting consultation:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ success: false, error: 'Consultation not found.' });
        }
        res.status(500).json({ success: false, error: 'Failed to delete consultation.' });
    }
};

export const getConsultationAuditLog = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        if (!id) return res.status(400).json({ success: false, error: 'Consultation ID is required.' });

        const logs = await prisma.dashboardAuditLog.findMany({
            where: {
                recordType: 'ConsultationSubmission',
                recordId: id
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({ success: true, data: logs });
    } catch (error: any) {
        console.error('Error fetching audit logs:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch audit logs.' });
    }
};
