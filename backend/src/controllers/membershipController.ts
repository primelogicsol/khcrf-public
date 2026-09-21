import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { EmailService } from '../services/emailService.js';
import { EmailTemplates } from '../constants/emailTemplates.js';
import { requireString } from "../utils/routeHelpers";

// Submit Membership Application
export const submitMembership = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const {
            fullName,
            email,
            phone,
            contactCountry,
            personalCountry,
            state,
            city,
            postalCode,
            streetAddress,
            membershipType,
            gender,
            ...restData
        } = req.body;

        // Check if member profile already exists for this user
        const existingMember = await prisma.member.findUnique({
            where: { userId }
        });

        if (existingMember) {
            return res.status(400).json({ message: 'Membership application already exists for this user.' });
        }

        const newMember = await prisma.member.create({
            data: {
                userId,
                fullName,
                gender: gender ? gender.toUpperCase() : null,
                country: contactCountry || personalCountry,
                phone,
                state,
                city,
                postalCode,
                streetAddress,
                profileData: restData,
                membershipType: membershipType.toUpperCase(),
                paymentMethod: 'RAZORPAY', // Defaulting for now
                status: 'PENDING',
                razorpayOrderId: req.body.razorpayOrderId,
                razorpayPaymentId: req.body.razorpayPaymentId
            }
        });

        // Send Email
        EmailService.sendEmail(email, EmailTemplates.MEMBERSHIP_APPLICATION_RECEIVED, {
            first_name: fullName.split(' ')[0],
            last_name: fullName.split(' ').slice(1).join(' ') || '',
            email: email,
            phone: phone,
            membership_type: membershipType,
            message: "Membership Application" 
        }).catch(err => console.error("Failed to send membership application email:", err));

        // Also update the Transaction status if needed, though RazorpayCheckout's verify already marks it SUCCESS
        // Ideally we link Transaction to this Member entityId here, but we'd need to look up Transaction by orderId first
        if (req.body.razorpayOrderId) {
            await prisma.transaction.update({
                where: { orderId: req.body.razorpayOrderId },
                data: {
                    entityId: newMember.id,
                    entityType: 'MEMBERSHIP'
                }
            }).catch(err => console.error("Failed to link transaction", err));
        }

        res.status(201).json({ message: 'Membership application submitted successfully', member: newMember });
    } catch (error) {
        console.error('Submit Membership Error:', error);
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

// Get My Membership
export const getMyMembership = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const member = await prisma.member.findUnique({
            where: { userId }
        });

        res.status(200).json(member);
    } catch (error) {
        console.error('Get My Membership Error:', error);
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

// Get All Memberships (Admin)
export const getAllMemberships = async (req: Request, res: Response) => {
    try {
        const members = await prisma.member.findMany({
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { email: true, name: true } } }
        });
        res.status(200).json(members);
    } catch (error) {
        console.error('Get All Memberships Error:', error);
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

// Update Membership Status (Admin)
export const updateMembershipStatus = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const { status, applicationStatus, membershipStatus, permissions, workflowState } = req.body;
        console.log(`[updateMembershipStatus] Called with id: ${id}, payload:`, req.body);

        // Authorization is handled by RBAC middleware
        const adminUser = (req as any).user;

        const result = await prisma.$transaction(async (tx) => {
            const member = await tx.member.findUnique({ where: { id } });
            if (!member) {
                throw new Error("MEMBER_NOT_FOUND");
            }

            // Reject invalid transitions (e.g. APPROVED -> APPROVED, depending on requirements, or keep idempotent)
            
            let data: any = {};
            if (status) data.status = status;
            if (applicationStatus) data.applicationStatus = applicationStatus;
            if (membershipStatus) data.membershipStatus = membershipStatus;
            if (permissions) data.permissions = permissions;

            if (applicationStatus === 'APPROVED') {
                data.approvedAt = new Date();
                data.approvedBy = adminUser.userId || adminUser.id;
            } else if (applicationStatus === 'REJECTED') {
                data.rejectedAt = new Date();
                data.rejectionReason = req.body.rejectionReason || "Admin Rejection";
            }

            if (workflowState) {
                const currentProfile = member.profileData && typeof member.profileData === 'object' ? (member.profileData as any) : {};
                data.profileData = { ...currentProfile, workflowState };
            }

            const updatedMember = await tx.member.update({
                where: { id },
                data
            });

            if (status === 'APPROVED' || applicationStatus === 'APPROVED') {
                await tx.user.update({
                    where: { id: updatedMember.userId },
                    data: { isMember: true }
                });
            } else if (status === 'REJECTED' || status === 'EXPIRED' || applicationStatus === 'REJECTED') {
                await tx.user.update({
                    where: { id: updatedMember.userId },
                    data: { isMember: false }
                });
            }
            
            // Add audit record
            await tx.auditLog.create({
                data: {
                    action: 'MEMBERSHIP_STATUS_UPDATE',
                    entityType: 'MEMBER',
                    entityId: member.id,
                    userId: adminUser.userId || adminUser.id,
                    details: JSON.stringify({ previousStatus: member.applicationStatus, newStatus: applicationStatus })
                }
            }).catch(e => console.error("Audit log failed, ignoring:", e));

            return updatedMember;
        });

        res.status(200).json({ status: 'success', data: result });
    } catch (error: any) {
        console.error('Update Membership Status Error:', error);
        if (error.message === 'MEMBER_NOT_FOUND') {
            return res.status(404).json({ message: 'Member not found', error: 'Member not found' });
        }
        res.status(500).json({ message: 'Failed to update status', error: error.message });
    }
};

// Get Member By ID (Admin)
export const getMemberById = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        
        const member = await prisma.member.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        res.status(200).json({ data: member });
    } catch (error) {
        console.error('Get Member By ID Error:', error);
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};
