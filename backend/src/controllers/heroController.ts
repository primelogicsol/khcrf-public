import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { requireString } from "../utils/routeHelpers";

// ==========================================
// PUBLIC HERO DELIVERY
// ==========================================
export const getHeroConfig = async (req: Request, res: Response) => {
    try {
        const pageKey = requireString(req.params.pageKey);

        const config = await prisma.heroConfiguration.findUnique({
            where: { pageKey },
            include: {
                slides: {
                    where: {
                        enabled: true,
                        OR: [
                            { startDate: null, endDate: null },
                            { startDate: { lte: new Date() }, endDate: { gte: new Date() } },
                            { startDate: { lte: new Date() }, endDate: null },
                            { startDate: null, endDate: { gte: new Date() } }
                        ]
                    },
                    orderBy: { displayOrder: 'asc' }
                }
            }
        });

        if (!config || !config.active || config.status !== 'PUBLISHED') {
            return res.json({ success: true, empty: true });
        }

        // Apply publishing rule: minimum 3 valid slides
        if (config.slides.length < 3) {
            console.warn(`[HERO SERVICE] Hero ${pageKey} suppressed: has fewer than 3 valid slides.`);
            return res.json({ success: true, empty: true });
        }

        res.json({ success: true, data: config });
    } catch (error) {
        console.error('Error fetching hero config:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// ==========================================
// ADMIN DASHBOARD
// ==========================================
export const getAdminHeroConfigs = async (req: Request, res: Response) => {
    try {
        const configs = await prisma.heroConfiguration.findMany({
            include: { slides: { orderBy: { displayOrder: 'asc' } } },
            orderBy: { updatedAt: 'desc' }
        });
        res.json({ success: true, data: configs });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

export const createHeroConfig = async (req: Request, res: Response) => {
    try {
        const { pageKey, route, pageFamily, variant } = req.body;
        const config = await prisma.heroConfiguration.create({
            data: { pageKey, route, pageFamily, variant }
        });
        res.status(201).json({ success: true, data: config });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Creation failed' });
    }
};

export const updateHeroConfig = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const config = await prisma.heroConfiguration.update({
            where: { id },
            data: req.body
        });
        res.json({ success: true, data: config });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Update failed' });
    }
};

export const publishHeroConfig = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const config = await prisma.heroConfiguration.findUnique({
            where: { id },
            include: { slides: { where: { enabled: true } } }
        });

        if (!config) return res.status(404).json({ success: false, error: 'Not found' });

        if (config.slides.length < 3) {
            return res.status(400).json({ success: false, error: 'Minimum 3 active slides required for publication.' });
        }

        // Save revision
        await prisma.heroRevision.create({
            data: {
                heroConfigurationId: id,
                version: config.version,
                snapshot: config as any,
                status: 'PUBLISHED',
                changeSummary: 'Published via Admin'
            }
        });

        const updated = await prisma.heroConfiguration.update({
            where: { id },
            data: {
                status: 'PUBLISHED',
                active: true,
                publishedAt: new Date(),
                version: config.version + 1
            }
        });

        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Publishing failed' });
    }
};

// ==========================================
// SLIDE MANAGEMENT
// ==========================================
export const addSlide = async (req: Request, res: Response) => {
    try {
        const slide = await prisma.heroSlide.create({
            data: req.body
        });
        res.status(201).json({ success: true, data: slide });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Add slide failed' });
    }
};

export const updateSlide = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const slide = await prisma.heroSlide.update({
            where: { id },
            data: req.body
        });
        res.json({ success: true, data: slide });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Update slide failed' });
    }
};

export const deleteSlide = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        await prisma.heroSlide.delete({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Delete slide failed' });
    }
};

// ==========================================
// ANALYTICS
// ==========================================
export const trackHeroAnalytics = async (req: Request, res: Response) => {
    try {
        const { slideId, event } = req.body;
        
        // Use an upsert strategy for today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let analytics = await prisma.heroAnalytics.findFirst({
            where: { heroSlideId: slideId, date: today }
        });

        if (!analytics) {
            analytics = await prisma.heroAnalytics.create({
                data: { heroSlideId: slideId, date: today }
            });
        }

        const updateData: any = {};
        if (event === 'IMPRESSION') updateData.impressions = { increment: 1 };
        if (event === 'MANUAL_VIEW') updateData.manualViews = { increment: 1 };
        if (event === 'COMPLETED_VIEW') updateData.completedViews = { increment: 1 };
        if (event === 'CTA_CLICK') updateData.ctaClicks = { increment: 1 };
        if (event === 'SECONDARY_CTA_CLICK') updateData.secondaryCtaClicks = { increment: 1 };
        if (event === 'PAUSE') updateData.pauseEvents = { increment: 1 };

        await prisma.heroAnalytics.update({
            where: { id: analytics.id },
            data: updateData
        });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Tracking failed' });
    }
};
