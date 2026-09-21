import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config/env.js';
import { prisma } from '../config/db.js';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token; // Read from HTTP-only cookie

    if (!token) {
        console.warn(`[AUTH] 401 Unauthorized: No token provided for ${req.method} ${req.originalUrl}`);
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        
        // Single Session Enforcement: If token has sessionId, verify it matches DB
        if (decoded.sessionId) {
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                select: { currentSessionId: true }
            });

            if (!user || user.currentSessionId !== decoded.sessionId) {
                res.clearCookie('token', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                });
                return res.status(401).json({ message: 'Session expired. You have logged in from another device.' });
            }
        }

        // Check if user is verified (Defense in Depth)
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { isVerified: true }
        });

        if (!user || !user.isVerified) {
            return res.status(403).json({ message: 'Forbidden: Account verification required' });
        }

        (req as any).user = decoded; // Attach user payload to request
        next();
    } catch (err) {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;

    if (!token) {
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
                (req as any).user = undefined;
            }
        } else {
            (req as any).user = undefined;
        }
    } catch (error) {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });
        (req as any).user = undefined;
    }

    return next();
};
// Middleware to check if user is admin
export const authorizeAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { isAdmin: true, role: true, status: true }
        });

        if (!user || user.status !== 'APPROVED') {
            return res.status(403).json({ message: 'Forbidden: Account must be approved to exercise admin privileges' });
        }

        // SECURITY: role === 'ADMIN' is the sole source of truth for admin access.
        // The isAdmin boolean is stored for display purposes but does NOT independently grant admin API access.
        // This prevents privilege escalation where isAdmin:true + non-ADMIN role could bypass this check.
        if (user.role !== 'ADMIN' && user.role !== 'SYSTEM_ADMIN') {
            return res.status(403).json({ message: 'Forbidden: Admin access required' });
        }

        next();
    } catch (error) {
        console.error("Admin authorization error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
// Middleware to check specific roles
export const authorizeRole = (allowedRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user?.userId;
            if (!userId) return res.status(401).json({ message: "Unauthorized" });

            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { role: true, isAdmin: true, status: true }
            });

            if (!user) return res.status(401).json({ message: "User not found" });

            if (user.status !== 'APPROVED') {
                return res.status(403).json({ message: "Forbidden: Account must be approved to exercise role privileges" });
            }

            // Allow if admin or has specific role
            if (user.role === 'ADMIN' || user.role === 'SYSTEM_ADMIN' || allowedRoles.includes(user.role)) {
                next();
            } else {
                res.status(403).json({ message: "Forbidden: Insufficient permissions" });
            }
        } catch (error) {
            console.error("Role authorization error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };
};
