import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { requireString } from "../utils/routeHelpers";

/**
 * GET /publications/:publicationId/reviews
 * Returns all ChapterReviews for a publication, grouped by chapter.
 */
export const getChapterReviews = async (req: Request, res: Response) => {
    try {
        const publicationId = requireString(req.params.publicationId);

        const chapters = await prisma.chapter.findMany({
            where: { publicationId, status: { not: 'ARCHIVED' } },
            orderBy: { order: 'asc' },
            include: {
                reviews: {
                    include: {
                        reviewer: { select: { id: true, name: true, email: true, role: true } },
                        comments: { orderBy: { createdAt: 'desc' }, take: 1 }
                    }
                }
            }
        });

        const result = chapters.map(ch => ({
            chapterId: ch.id,
            order: ch.order,
            title: ch.title,
            status: ch.status,
            reviews: ch.reviews.map(r => ({
                reviewId: r.id,
                reviewer: r.reviewer,
                role: r.role,
                blindType: r.blindType,
                recommendation: r.recommendation,
                scores: r.scores,
                status: r.status,
                latestComment: r.comments[0]?.content || null,
                createdAt: r.createdAt,
                updatedAt: r.updatedAt
            })),
            avgScore: ch.reviews.length > 0
                ? (() => {
                    const allScores = ch.reviews
                        .filter(r => r.scores)
                        .map(r => {
                            const s = r.scores as Record<string, number>;
                            const vals = Object.values(s).filter(v => typeof v === 'number');
                            return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
                        })
                        .filter((s): s is number => s !== null);
                    return allScores.length > 0
                        ? Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 10) / 10
                        : null;
                })()
                : null
        }));

        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Get Chapter Reviews Error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
    }
};

/**
 * POST /publications/chapters/:chapterId/reviews
 * Assign a reviewer to a chapter.
 * Body: { reviewerId, role, blindType }
 */
export const assignReviewer = async (req: Request, res: Response) => {
    try {
        const chapterId = requireString(req.params.chapterId);
        const { reviewerId, role = 'PRIMARY_REVIEWER', blindType = 'OPEN' } = req.body;

        if (!reviewerId) {
            return res.status(400).json({ success: false, error: 'reviewerId is required' });
        }

        const chapter = await prisma.chapter.findUnique({ where: { id: chapterId } });
        if (!chapter) return res.status(404).json({ success: false, error: 'Chapter not found' });

        // Prevent duplicate assignment of the same reviewer to the same chapter
        const existing = await prisma.chapterReview.findFirst({
            where: { chapterId, reviewerId }
        });
        if (existing) {
            return res.status(409).json({ success: false, error: 'This reviewer is already assigned to this chapter' });
        }

        const review = await prisma.chapterReview.create({
            data: { chapterId, reviewerId, role, blindType },
            include: { reviewer: { select: { id: true, name: true, email: true } } }
        });

        await prisma.editorialAuditLog.create({
            data: {
                publicationId: chapter.publicationId,
                chapterId,
                userId: (req as any).user?.userId || null,
                action: 'REVIEWER_ASSIGNED',
                details: `Reviewer assigned to Chapter ${chapter.order}: ${chapter.title}`
            }
        });

        res.status(201).json({ success: true, data: review });
    } catch (error) {
        console.error('Assign Reviewer Error:', error);
        res.status(500).json({ success: false, error: 'Failed to assign reviewer' });
    }
};

/**
 * PATCH /publications/reviews/:reviewId/decision
 * Submit or update a reviewer's decision.
 * Body: { recommendation, scores, comment, status }
 */
export const submitReviewDecision = async (req: Request, res: Response) => {
    try {
        const reviewId = requireString(req.params.reviewId);
        const { recommendation, scores, comment, status = 'COMPLETED' } = req.body;
        const actorId = (req as any).user?.userId;

        const review = await prisma.chapterReview.findUnique({
            where: { id: reviewId },
            include: { chapter: true }
        });
        if (!review) return res.status(404).json({ success: false, error: 'Review not found' });

        const updated = await prisma.$transaction(async (tx) => {
            const updatedReview = await tx.chapterReview.update({
                where: { id: reviewId },
                data: {
                    recommendation: recommendation || review.recommendation,
                    scores: scores || review.scores,
                    status
                }
            });

            if (comment) {
                await tx.reviewComment.create({
                    data: {
                        reviewId,
                        userId: actorId,
                        commentType: 'INTERNAL_NOTE',
                        content: comment
                    }
                });
            }

            await tx.editorialAuditLog.create({
                data: {
                    publicationId: review.chapter.publicationId,
                    chapterId: review.chapterId,
                    userId: actorId || null,
                    action: 'REVIEW_DECISION_SUBMITTED',
                    details: `Review ${reviewId} updated: ${recommendation || status}`
                }
            });

            return updatedReview;
        });

        res.json({ success: true, data: updated });
    } catch (error) {
        console.error('Submit Review Decision Error:', error);
        res.status(500).json({ success: false, error: 'Failed to submit review decision' });
    }
};

/**
 * GET /publications/:publicationId/audit-log
 * Returns the editorial audit log for a publication.
 */
export const getEditorialAuditLog = async (req: Request, res: Response) => {
    try {
        const publicationId = requireString(req.params.publicationId);
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;

        const [logs, total] = await Promise.all([
            prisma.editorialAuditLog.findMany({
                where: { publicationId },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: (page - 1) * limit,
                include: {
                    user: { select: { id: true, name: true, email: true } },
                    chapter: { select: { id: true, title: true, order: true } }
                }
            }),
            prisma.editorialAuditLog.count({ where: { publicationId } })
        ]);

        res.json({
            success: true,
            data: logs,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        console.error('Get Editorial Audit Log Error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch audit log' });
    }
};
