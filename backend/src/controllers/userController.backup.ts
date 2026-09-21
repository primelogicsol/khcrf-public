import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { Role } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import bcrypt from 'bcrypt';
import { requireString } from "../utils/routeHelpers";

// Get all users (Admin only)
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
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

// Update user role (Admin only)
export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const { role } = req.body;

        if (!role || !Object.values(Role).includes(role)) {
            return res.status(400).json({ error: "Invalid role provided" });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { role },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error("Update User Role Error:", error);
        res.status(500).json({ error: "Failed to update user role" });
    }
};

// Get stats for sidebar filtering
export const getUserSidebarStats = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                _count: {
                    select: {
                        userPurchases: true,
                        donations: true,
                        certifications: true,
                        accreditationApplications: true,
                        grantApplications: true,
                        evaluationSubmissions: true,
                        legislativeOffices: {
                            where: {
                                status: 'APPROVED'
                            }
                        },
                        partnerApplications: true,
                        apprenticeshipApplications: true,
                    }
                },
                // Also check if they are a member (boolean flag on user model)
                isMember: true,
                name: true,
            }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

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

// Admin Impersonation
export const impersonateUser = async (req: Request, res: Response) => {
    try {
        const adminId = (req as any).user.userId;
        const targetUserId = requireString(req.params.id);

        const targetUser = await prisma.user.findUnique({
            where: { id: targetUserId },
            select: { id: true, name: true, email: true, isMember: true, isAdmin: true, role: true }
        });

        if (!targetUser) {
            return res.status(404).json({ error: "Target user not found" });
        }

        // Create token for target user, preserving the original admin ID
        const token = jwt.sign(
            { userId: targetUser.id, adminId: adminId }, 
            JWT_SECRET, 
            { expiresIn: '1h' } // Shorter lived for safety
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV?.trim() === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 3600000, // 1 hour
        });

        res.json({ 
            message: `Now impersonating ${targetUser.name}`, 
            user: { 
                id: targetUser.id, 
                name: targetUser.name, 
                email: targetUser.email, 
                isMember: targetUser.isMember, 
                isAdmin: targetUser.isAdmin, 
                role: targetUser.role,
                isImpersonating: true
            } 
        });
    } catch (error) {
        console.error("Impersonation Error:", error);
        res.status(500).json({ error: "Failed to impersonate user" });
    }
};

export const stopImpersonation = async (req: Request, res: Response) => {
    try {
        const adminId = (req as any).user.adminId;

        if (!adminId) {
            return res.status(400).json({ error: "Not currently impersonating" });
        }

        const adminUser = await prisma.user.findUnique({
            where: { id: adminId },
            select: { id: true, name: true, email: true, isMember: true, isAdmin: true, role: true }
        });

        if (!adminUser) {
            return res.status(404).json({ error: "Original admin user not found" });
        }

        const token = jwt.sign(
            { userId: adminUser.id }, 
            JWT_SECRET, 
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV?.trim() === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({ 
            message: "Impersonation stopped", 
            user: { 
                id: adminUser.id, 
                name: adminUser.name, 
                email: adminUser.email, 
                isMember: adminUser.isMember, 
                isAdmin: adminUser.isAdmin, 
                role: adminUser.role 
            } 
        });
    } catch (error) {
        console.error("Stop Impersonation Error:", error);
        res.status(500).json({ error: "Failed to stop impersonation" });
    }
};

// Update user details (Admin only: name, email, password, avatarUrl)
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
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatarUrl: true,
                isAdmin: true,
                isVerified: true,
                createdAt: true,
            }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error("Update User Error:", error);
        res.status(500).json({ error: "Failed to update user" });
    }
};

// Delete user (Admin only)
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);

        await prisma.user.delete({
            where: { id }
        });

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete User Error:", error);
        res.status(500).json({ error: "Failed to delete user" });
    }
};

// Soft-delete (Trash) user (Admin only)
export const trashUser = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { isTrashed: true },
            select: {
                id: true,
                isTrashed: true,
            }
        });

        res.json({ message: "User moved to trash", user: updatedUser });
    } catch (error) {
        console.error("Trash User Error:", error);
        res.status(500).json({ error: "Failed to trash user" });
    }
};

// Restore user from trash (Admin only)
export const restoreUser = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { isTrashed: false },
            select: {
                id: true,
                isTrashed: true,
            }
        });

        res.json({ message: "User restored from trash", user: updatedUser });
    } catch (error) {
        console.error("Restore User Error:", error);
        res.status(500).json({ error: "Failed to restore user" });
    }
};
