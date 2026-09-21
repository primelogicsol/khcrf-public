import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { EmailService } from '../services/emailService.js';
import { EmailTemplates } from '../constants/emailTemplates.js';
import { requireString } from "../utils/routeHelpers";

// Submit a new application
export const submitApplication = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const {
            businessName, contactPerson, emailAddress, phoneNumber, businessAddress,
            badges, businessDescription, productionMethods, documentation, otherDocumentation, certification
        } = req.body;

        const application = await prisma.accreditationApplication.create({
            data: {
                userId,
                businessName,
                contactPerson,
                emailAddress,
                phoneNumber,
                businessAddress,
                badges: badges || [],
                businessDescription,
                productionMethods,
                documentation: documentation || [],
                otherDocumentation,
                status: 'PENDING'
            }
        });

        // Send Email
        EmailService.sendEmail(emailAddress, EmailTemplates.ACCREDITATION_BADGE_REVIEW, {
            first_name: contactPerson.split(' ')[0],
            last_name: contactPerson.split(' ').slice(1).join(' ') || '',
            email: emailAddress,
            business_name: businessName,
            badge_type: badges.join(', '),
            message: businessDescription
        }).catch(err => console.error("Failed to send accreditation application email:", err));

        res.status(201).json({ message: "Accreditation application submitted successfully", applicationId: application.id });
    } catch (error) {
        console.error("Error submitting accreditation application:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get my applications
export const getMyApplications = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("getMyApplications Request User:", (req as any).user);
        const userId = (req as any).user?.userId;

        if (!userId) {
            console.log("getMyApplications Unauthorized: No userId found");
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const applications = await prisma.accreditationApplication.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        console.log("Applications found:", applications.length);
        res.json(applications);
    } catch (error) {
        console.error("Error fetching my accreditation applications:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get application by ID (User or Admin)
export const getApplicationById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = requireString(req.params.id);
        const userId = (req as any).user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        // TODO: In a real app, check if user is admin or owner. 
        // For now assuming middleware or basic check is enough for demo.
        const application = await prisma.accreditationApplication.findUnique({
            where: { id }
        });

        if (!application) {
            res.status(404).json({ message: "Application not found" });
            return;
        }

        res.json(application);
    } catch (error) {
        console.error("Error fetching application details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all applications (Admin)
export const getAllApplications = async (req: Request, res: Response): Promise<void> => {
    try {
        const applications = await prisma.accreditationApplication.findMany({
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true, email: true } } } // Include user info for admin dashboard
        });
        res.json(applications);
    } catch (error) {
        console.error("Error fetching all applications:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update status (Admin)
export const updateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = requireString(req.params.id);
        const { status, adminCertificateUrl } = req.body;

        const updatedApplication = await prisma.accreditationApplication.update({
            where: { id },
            data: { 
                status,
                adminCertificateUrl // Save the certificate URL if provided
            }
        });

        // Send Status Update Email
        if (updatedApplication.emailAddress) {
            EmailService.sendEmail(updatedApplication.emailAddress, EmailTemplates.STATUS_UPDATE, {
                name: updatedApplication.contactPerson,
                type: 'Accreditation Application',
                status: status
            }).catch(err => console.error("Failed to send accreditation status update email:", err));
        }

        res.json({ message: "Status updated successfully", application: updatedApplication });
    } catch (error) {
        console.error("Error updating application status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
