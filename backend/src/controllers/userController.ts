import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { Role, UserStatus } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import bcrypt from 'bcrypt';
import { requireString } from "../utils/routeHelpers";

// Helper to log audit events
async function logAudit(req: Request, targetUserId: string, action: string, oldState?: string, newState?: string, reason?: string) {
    const actingUserId = (req as any).user?.userId || 'SYSTEM';
    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
    
    let details = '';
    if (oldState && newState) {
        details = `Changed from ${oldState} to ${newState}`;
    }
    if (reason) {
        details += details ? `. Reason: ${reason}` : `Reason: ${reason}`;
    }

    try {
        await prisma.auditLog.create({
            data: {
                userId: actingUserId,
                action: `${action} (Target: ${targetUserId})`,
                details: details || null,
                ipAddress
            }
        });
    } catch (error) {
        console.error("Failed to log audit event:", error);
    }
}

// Get all users (Admin only)
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                isAdmin: true,
                isVerified: true,
                isTrashed: true,
                avatarUrl: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(users);
    } catch (error) {
        console.error("Get All Users Error:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

function canAssignRole(actingRole: string, targetRole: string): boolean {
    if (actingRole === 'SYSTEM_ADMIN') return true;
    if (actingRole === 'ADMIN' || actingRole === 'SUPER_ADMIN') {
        if (targetRole === 'SYSTEM_ADMIN') return false;
        return true;
    }
    if (actingRole === 'OPERATIONS_MANAGER') {
        const restricted = ['ADMIN', 'SUPER_ADMIN', 'SYSTEM_ADMIN', 'API_MANAGER', 'DEVELOPER', 'DASHBOARD_AUDITOR'];
        if (restricted.includes(targetRole)) return false;
        return true;
    }
    return false;
}

// Update user status
export const updateUserStatus = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const { status, reason } = req.body;
        const actingUserId = (req as any).user?.userId;

        if (!status || !Object.values(UserStatus).includes(status)) {
            return res.status(400).json({ error: "Invalid status provided" });
        }

        const actingUser = await prisma.user.findUnique({ where: { id: actingUserId } });
        const targetUser = await prisma.user.findUnique({ where: { id } });
        
        if (!actingUser) return res.status(401).json({ error: "Unauthorized" });
        if (!targetUser) return res.status(404).json({ error: "Target user not found" });

        // Prevent self-suspension
        if (id === actingUserId && (status === 'SUSPENDED' || status === 'DEACTIVATED' || status === 'REJECTED')) {
            return res.status(403).json({ error: "You cannot suspend, deactivate, or reject your own account." });
        }

        // Only SYSTEM_ADMIN can suspend a SYSTEM_ADMIN
        if (targetUser.role === 'SYSTEM_ADMIN' && actingUser.role !== 'SYSTEM_ADMIN' && (status === 'SUSPENDED' || status === 'DEACTIVATED' || status === 'REJECTED')) {
            return res.status(403).json({ error: "Only a System Administrator can suspend or deactivate another System Administrator." });
        }

        // Don't allow suspending/deactivating the last active admin/system admin
        if ((targetUser.role === 'ADMIN' || targetUser.role === 'SYSTEM_ADMIN') && (status === 'SUSPENDED' || status === 'DEACTIVATED' || status === 'REJECTED')) {
            const adminCount = await prisma.user.count({ where: { role: targetUser.role, status: 'APPROVED', isTrashed: false } });
            if (adminCount <= 1 && targetUser.status === 'APPROVED') {
                if (targetUser.role === 'SYSTEM_ADMIN') {
                    return res.status(409).json({ error: "LAST_ACTIVE_SYSTEM_ADMIN", message: "Cannot suspend/deactivate the last active SYSTEM_ADMIN." });
                }
                return res.status(403).json({ error: `Cannot suspend/deactivate the last active ${targetUser.role}.` });
            }
        }

        // Validate approval against intended role
        if (status === 'APPROVED' && targetUser.status !== 'APPROVED') {
            if (!canAssignRole(actingUser.role, targetUser.role)) {
                return res.status(403).json({ error: `You are not authorized to approve an account that requests the ${targetUser.role} role.` });
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { 
                status,
                // Automatically verify user if approved
                isVerified: status === 'APPROVED' ? true : targetUser.isVerified 
            },
            select: { id: true, name: true, email: true, status: true, role: true }
        });

        await logAudit(req, id, 'UPDATE_STATUS', targetUser.status, status, reason);

        res.json(updatedUser);
    } catch (error) {
        console.error("Update User Status Error:", error);
        res.status(500).json({ error: "Failed to update user status" });
    }
};

// Update user role (Admin only)
export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const { role, reason } = req.body;
        const actingUserId = (req as any).user?.userId;

        if (!role || !Object.values(Role).includes(role)) {
            return res.status(400).json({ error: "Invalid role provided" });
        }

        const actingUser = await prisma.user.findUnique({ where: { id: actingUserId } });
        const targetUser = await prisma.user.findUnique({ where: { id } });

        if (!actingUser || !targetUser) return res.status(404).json({ error: "User not found" });

        // Prevent self-role change unless authorized by another logic (we strictly block it here to be safe)
        if (id === actingUserId && role !== targetUser.role) {
            return res.status(403).json({ error: "You cannot change your own role." });
        }

        // Server-enforced role assignment logic
        if (!canAssignRole(actingUser.role, role)) {
            return res.status(403).json({ error: `You are not authorized to assign the ${role} role.` });
        }

        // Only SYSTEM_ADMIN can change a SYSTEM_ADMIN's role
        if (targetUser.role === 'SYSTEM_ADMIN' && actingUser.role !== 'SYSTEM_ADMIN') {
            return res.status(403).json({ error: "Only a System Administrator can modify another System Administrator's role." });
        }
        
        // Prevent changing the last admin/system admin's role
        if ((targetUser.role === 'ADMIN' || targetUser.role === 'SYSTEM_ADMIN') && role !== targetUser.role) {
            const adminCount = await prisma.user.count({ where: { role: targetUser.role, isTrashed: false, status: 'APPROVED' } });
            if (adminCount <= 1) {
                if (targetUser.role === 'SYSTEM_ADMIN') {
                    return res.status(409).json({ error: "LAST_ACTIVE_SYSTEM_ADMIN", message: "Cannot remove the final SYSTEM_ADMIN role." });
                }
                return res.status(403).json({ error: `Cannot remove the final ${targetUser.role}.` });
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { role, isAdmin: role === 'ADMIN' || role === 'SYSTEM_ADMIN' || role === 'SUPER_ADMIN' },
            select: { id: true, name: true, email: true, role: true, status: true }
        });

        await logAudit(req, id, 'ASSIGN_ROLE', targetUser.role, role, reason);

        res.json(updatedUser);
    } catch (error) {
        console.error("Update User Role Error:", error);
        res.status(500).json({ error: "Failed to update user role" });
    }
};

export const getUserSidebarStats = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                _count: {
                    select: {
                        userPurchases: true, donations: true, certifications: true,
                        accreditationApplications: true, grantApplications: true,
                        evaluationSubmissions: true, 
                        legislativeOffices: { where: { status: 'APPROVED' } },
                        partnerApplications: true, apprenticeshipApplications: true,
                    }
                },
                isMember: true, name: true,
            }
        });

        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({
            hasPurchases: user._count.userPurchases > 0,
            hasDonations: user._count.donations > 0,
            hasCertifications: user._count.certifications > 0,
            hasAccreditations: user._count.accreditationApplications > 0,
            hasGrants: user._count.grantApplications > 0,
            hasEvaluations: user._count.evaluationSubmissions > 0,
            hasLegislativeOffice: user._count.legislativeOffices > 0,
            hasPartnership: user._count.partnerApplications > 0,
            hasApprenticeship: user._count.apprenticeshipApplications > 0,
            isMember: user.isMember,
            hasPublications: await prisma.publication.count({ where: { author: user.name } }) > 0
        });
    } catch (error) {
        console.error("Get User Sidebar Stats Error:", error);
        res.status(500).json({ error: "Failed to fetch user stats" });
    }
};

export const impersonateUser = async (req: Request, res: Response) => {
    try {
        const adminId = (req as any).user.userId;
        const targetUserId = requireString(req.params.id);
        const targetUser = await prisma.user.findUnique({
            where: { id: targetUserId },
            select: { id: true, name: true, email: true, isMember: true, isAdmin: true, role: true }
        });

        if (!targetUser) return res.status(404).json({ error: "Target user not found" });

        const token = jwt.sign({ userId: targetUser.id, adminId: adminId }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV?.trim() === 'production', sameSite: 'lax', path: '/', maxAge: 3600000 });

        await logAudit(req, targetUserId, 'IMPERSONATE_USER', undefined, undefined, 'Admin impersonation');
        res.json({ message: `Now impersonating ${targetUser.email}`, user: { ...targetUser, isImpersonating: true } });
    } catch (error) {
        console.error("Impersonation Error:", error);
        res.status(500).json({ error: "Failed to impersonate user" });
    }
};

export const stopImpersonation = async (req: Request, res: Response) => {
    try {
        const adminId = (req as any).user.adminId;
        if (!adminId) return res.status(400).json({ error: "Not currently impersonating" });
        const adminUser = await prisma.user.findUnique({
            where: { id: adminId },
            select: { id: true, name: true, email: true, isMember: true, isAdmin: true, role: true }
        });
        if (!adminUser) return res.status(404).json({ error: "Original admin user not found" });

        const token = jwt.sign({ userId: adminUser.id }, JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV?.trim() === 'production', sameSite: 'lax', path: '/', maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.json({ message: "Impersonation stopped", user: adminUser });
    } catch (error) {
        console.error("Stop Impersonation Error:", error);
        res.status(500).json({ error: "Failed to stop impersonation" });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const { name, email, password, avatarUrl } = req.body;
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }
        const updatedUser = await prisma.user.update({
            where: { id }, data: updateData,
            select: { id: true, name: true, email: true, role: true, avatarUrl: true, isAdmin: true, isVerified: true, createdAt: true }
        });
        await logAudit(req, id, 'UPDATE_USER_DETAILS');
        res.json(updatedUser);
    } catch (error) {
        console.error("Update User Error:", error);
        res.status(500).json({ error: "Failed to update user" });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const { reason } = req.query;
        const actingUserId = (req as any).user?.userId;

        const targetUser = await prisma.user.findUnique({
            where: { id },
            include: {
                accreditationApplications: true, apprenticeshipApplications: true,
                certifications: true, donations: true, evaluationSubmissions: true,
                grantApplications: true, legislativeOffices: true, listings: true
            }
        });

        if (!targetUser) return res.status(404).json({ error: "User not found" });

        if (id === actingUserId) {
            return res.status(403).json({ message: "You cannot delete your own account." });
        }

        if (targetUser.role === 'ADMIN' || targetUser.role === 'SYSTEM_ADMIN') {
            const adminCount = await prisma.user.count({ where: { role: targetUser.role, isTrashed: false } });
            if (adminCount <= 1) {
                if (targetUser.role === 'SYSTEM_ADMIN') {
                    return res.status(409).json({ error: "LAST_ACTIVE_SYSTEM_ADMIN", message: "Cannot delete the last active SYSTEM_ADMIN." });
                }
                return res.status(403).json({ message: `Cannot delete the last active ${targetUser.role}.` });
            }
        }

        const hasDependencies = (
            targetUser.accreditationApplications.length > 0 ||
            targetUser.apprenticeshipApplications.length > 0 ||
            targetUser.certifications.length > 0 ||
            targetUser.donations.length > 0 ||
            targetUser.evaluationSubmissions.length > 0 ||
            targetUser.grantApplications.length > 0 ||
            targetUser.legislativeOffices.length > 0 ||
            targetUser.listings.length > 0
        );

        if (hasDependencies) {
            return res.status(400).json({ error: "Cannot hard-delete user because they have existing registrations or records. Use soft-delete (deactivate/trash) instead." });
        }

        await prisma.user.delete({ where: { id } });
        await logAudit(req, id, 'HARD_DELETE_USER', targetUser.status, 'DELETED', reason as string);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete User Error:", error);
        res.status(500).json({ error: "Failed to delete user" });
    }
};

export const trashUser = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const actingUserId = (req as any).user?.userId;

        if (id === actingUserId) {
            return res.status(403).json({ message: "You cannot trash your own account." });
        }
        
        const targetUser = await prisma.user.findUnique({ where: { id } });
        if (!targetUser) return res.status(404).json({ error: "User not found" });

        if (targetUser.role === 'ADMIN' || targetUser.role === 'SYSTEM_ADMIN') {
            const adminCount = await prisma.user.count({ where: { role: targetUser.role, isTrashed: false } });
            if (adminCount <= 1) {
                if (targetUser.role === 'SYSTEM_ADMIN') {
                    return res.status(409).json({ error: "LAST_ACTIVE_SYSTEM_ADMIN", message: "Cannot trash the last active SYSTEM_ADMIN." });
                }
                return res.status(403).json({ message: `Cannot trash the last active ${targetUser.role}.` });
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { isTrashed: true, status: 'DEACTIVATED' },
            select: { id: true, isTrashed: true, status: true }
        });
        await logAudit(req, id, 'SOFT_DELETE_USER', targetUser.status, 'DEACTIVATED');
        res.json({ message: "User moved to trash", user: updatedUser });
    } catch (error) {
        console.error("Trash User Error:", error);
        res.status(500).json({ error: "Failed to trash user" });
    }
};

export const restoreUser = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const targetUser = await prisma.user.findUnique({ where: { id } });
        if (!targetUser) return res.status(404).json({ error: "User not found" });

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { isTrashed: false, status: 'APPROVED' },
            select: { id: true, isTrashed: true, status: true }
        });
        await logAudit(req, id, 'RESTORE_USER', targetUser.status, 'APPROVED');
        res.json({ message: "User restored from trash", user: updatedUser });
    } catch (error) {
        console.error("Restore User Error:", error);
        res.status(500).json({ error: "Failed to restore user" });
    }
};
