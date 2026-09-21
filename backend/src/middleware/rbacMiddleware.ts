import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import { ROLE_PERMISSIONS } from '../config/rolePermissions.js';

export const requirePermission = (permission: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user?.userId;
            if (!userId) return res.status(401).json({ message: "Unauthorized" });

            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { role: true, isAdmin: true }
            });

            if (!user) return res.status(401).json({ message: "User not found" });

            // Ensure SYSTEM_ADMIN has implicit bypass for safety
            if (user.role === 'SYSTEM_ADMIN') {
                return next();
            }

            const userPermissions = ROLE_PERMISSIONS[user.role] || [];
            
            // Check for explicit wildcard or exact permission
            if (userPermissions.includes("*") || userPermissions.includes(permission)) {
                return next();
            }

            return res.status(403).json({ message: `Forbidden: Requires permission '${permission}'` });
        } catch (error) {
            console.error("Permission authorization error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };
};
