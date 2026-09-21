import { Request, Response } from 'express';
import { prisma } from '../config/db.js';

export const getDashboardAuditLogs = async (req: Request, res: Response) => {
    try {
        const { module, action, startDate, endDate, limit, skip } = req.query;
        
        const whereClause: any = {};
        
        if (module) {
            whereClause.module = String(module);
        }
        
        if (action) {
            whereClause.action = String(action);
        }
        
        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate) whereClause.createdAt.gte = new Date(String(startDate));
            if (endDate) whereClause.createdAt.lte = new Date(String(endDate));
        }

        const take = limit ? parseInt(String(limit)) : 100;
        const skipRecords = skip ? parseInt(String(skip)) : 0;

        const [logs, total] = await Promise.all([
            prisma.dashboardAuditLog.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' },
                take,
                skip: skipRecords
            }),
            prisma.dashboardAuditLog.count({ where: whereClause })
        ]);

        res.json({
            success: true,
            data: logs,
            meta: {
                total,
                limit: take,
                skip: skipRecords
            }
        });
    } catch (error: any) {
        console.error("Error fetching audit logs:", error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
