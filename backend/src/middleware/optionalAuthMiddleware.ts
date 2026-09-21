import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import { prisma } from '../config/db.js';

export const optionalAuthenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        (req as any).user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        if (decoded && decoded.userId) {
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                select: { id: true, role: true, isAdmin: true, isVerified: true, currentSessionId: true, status: true }
            });
            if (user && (!decoded.sessionId || user.currentSessionId === decoded.sessionId)) {
                if (user.status !== 'APPROVED') {
                    user.role = 'USER';
                    user.isAdmin = false;
                }
                (req as any).user = { ...decoded, ...user, userId: decoded.userId };
            } else {
                (req as any).user = null;
            }
        } else {
            (req as any).user = null;
        }
    } catch (err) {
        (req as any).user = null;
    }
    next();
};
