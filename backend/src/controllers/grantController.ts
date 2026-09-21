
import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { EmailService } from '../services/emailService.js';
import { EmailTemplates } from '../constants/emailTemplates.js';
import { requireString } from "../utils/routeHelpers";

// Submit Grant Application
export const submitGrantApplication = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const data = req.body;

        // Create new grant application
        // Note: Ensure frontend sends arrays for Json fields (grantTypes, grantPurpose)
        const newGrant = await prisma.grantApplication.create({
            data: {
                userId,

                // Applicant Info
                applicantName: data.applicantName,
                organizationName: data.organizationName,
                applicantType: data.applicantType,
                otherApplicantType: data.otherApplicantType,
                contactNumber: data.contactNumber,
                email: data.email,

                // Address
                village: data.village,
                district: data.district,
                state: data.state,
                country: data.country,
                postalCode: data.postalCode,

                // Craft & Business
                primaryCraft: data.primaryCraft,
                experienceYears: data.experienceYears,
                artisansInvolved: data.artisansInvolved,
                businessStage: data.businessStage,
                certificationStatus: data.certificationStatus,

                // Grant Info
                grantTypes: data.grantTypes,
                grantAmount: data.grantAmount,
                grantPurpose: data.grantPurpose,

                // Project Description
                briefDescription: data.briefDescription,
                projectDescription: data.projectDescription,
                livelihoodImpact: data.livelihoodImpact,
                heritageContribution: data.heritageContribution,

                // Budget
                budgetTools: data.budgetTools,
                budgetMaterials: data.budgetMaterials,
                budgetLabor: data.budgetLabor,
                budgetMarketing: data.budgetMarketing,
                budgetOther: data.budgetOther,
                timeline: data.timeline,

                // Support
                previousGrants: data.previousGrants,
                previousGrantDetails: data.previousGrantDetails,
                progressUpdates: data.progressUpdates,

                // Documents (Optional/Placeholders)
                identityDoc: data.uploadIdentity ? "true" : "false", // Just string flag for now or URL if implemented
                businessDoc: data.uploadBusiness ? "true" : "false",
                craftPhotosDoc: data.uploadPhotos ? "true" : "false",
                // supportingDoc: data.supportingDoc
            }
        });

        // Send Email
        if (data.email) {
            const { email, applicantName, organizationName, grantAmount } = data;
            EmailService.sendEmail(email, EmailTemplates.BUSINESS_GRANT_SUPPORT, {
                name: applicantName,
                organization_name: organizationName || applicantName,
                grant_amount: grantAmount,
                id: newGrant.id
            }).catch(err => console.error("Failed to send grant application email:", err));
        }

        res.status(201).json({ message: 'Grant application submitted successfully', grant: newGrant });
    } catch (error) {
        console.error('Submit Grant Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get My Grant Applications
export const getMyGrantApplications = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const grants = await prisma.grantApplication.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        res.json(grants);
    } catch (error) {
        console.error('Get My Grants Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get Grant Application By ID
export const getGrantApplicationById = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const grant = await prisma.grantApplication.findUnique({
            where: { id },
            include: {
                user: {
                    select: { name: true, email: true }
                }
            }
        });

        if (!grant) {
            return res.status(404).json({ message: 'Grant application not found' });
        }

        res.json(grant);
    } catch (error) {
        console.error('Get Grant By ID Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get All Grant Applications (Admin)
export const getAllGrantApplications = async (req: Request, res: Response) => {
    try {
        // In a real app, verify admin role here
        const grants = await prisma.grantApplication.findMany({
            include: {
                user: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(grants);
    } catch (error) {
        console.error('Get All Grants Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update Grant Status (Admin)
export const updateGrantStatus = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const { status } = req.body;

        const updatedGrant = await prisma.grantApplication.update({
            where: { id },
            data: { status }
        });

        // Send Status Update Email
        if (updatedGrant.email) {
            EmailService.sendEmail(updatedGrant.email, EmailTemplates.STATUS_UPDATE, {
                name: updatedGrant.applicantName,
                type: 'Grant Application',
                status: status
            }).catch(err => console.error("Failed to send grant status update email:", err));
        }

        res.json(updatedGrant);
    } catch (error) {
        console.error('Update Grant Status Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete Grant Application (Admin)
export const deleteGrant = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        await prisma.grantApplication.delete({
            where: { id }
        });
        res.json({ message: 'Grant application deleted successfully' });
    } catch (error) {
        console.error('Delete Grant Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
