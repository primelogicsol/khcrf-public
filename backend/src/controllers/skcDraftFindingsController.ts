import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { requireString } from "../utils/routeHelpers";

export const getPublicDraftFindings = async (req: Request, res: Response) => {
    try {
        const activeCycle = await prisma.assessmentCycle.findFirst({
            where: { isActive: true },
            orderBy: { year: 'desc' }
        });

        if (!activeCycle) {
             return res.json({ success: true, data: { cycleStage: 'Preparation', findings: [] } });
        }

        const findings = await prisma.draftFinding.findMany({
            where: {
                assessmentCycleId: activeCycle.id,
                status: {
                    in: ['APPROVED_FOR_DRAFT_PUBLICATION', 'PUBLISHED_FOR_VALIDATION']
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ 
            success: true, 
            data: { 
                cycleStage: activeCycle.status === 'ACTIVE' ? 'Evidence Collection and Review' : activeCycle.status, 
                findings 
            } 
        });
    } catch (error: any) {
        console.error('Error fetching public draft findings:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch public draft findings' });
    }
};

export const getPublicDraftFindingBySlug = async (req: Request, res: Response) => {
    try {
        const slug = requireString(req.params.slug);
        const finding = await prisma.draftFinding.findFirst({
            where: {
                slug,
                status: {
                    in: ['APPROVED_FOR_DRAFT_PUBLICATION', 'PUBLISHED_FOR_VALIDATION']
                }
            },
            include: {
                evidenceLinks: true,
                hearingLinks: true,
                consultationLinks: true
            }
        });

        if (!finding) {
            return res.status(404).json({ success: false, error: 'Finding not found' });
        }

        res.json({ success: true, data: finding });
    } catch (error: any) {
        console.error('Error fetching finding by slug:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch finding' });
    }
};
