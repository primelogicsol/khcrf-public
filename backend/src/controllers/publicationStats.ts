
import { Request, Response } from 'express';
import { prisma } from '../config/db';

export const getPublicationStats = async (req: Request, res: Response) => {
    try {
        const totalPublications = await prisma.publication.count();
        const totalCategories = await prisma.publicationCategory.count();
        
        // Calculate total revenue from UserPurchase
        const purchases = await prisma.userPurchase.findMany({
            select: { amount: true }
        });
        const totalRevenue = purchases.reduce((sum: number, p: { amount: number }) => sum + p.amount, 0);

        // Get 5 recent publications
        // Fetch only selected fields that exist in the Prisma schema
        // Assuming 'publication' model has these fields.
        const recentPublications = await prisma.publication.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            // select: { ... } // Let's select all fields or specific ones if needed, but basic findMany is safer if schema changes
        });

        res.json({
            totalPublications,
            totalCategories,
            totalRevenue,
            recentPublications
        });
    } catch (error) {
        console.error("Get Publication Stats Error:", error);
        res.status(500).json({ error: "Failed to fetch publication stats" });
    }
};
