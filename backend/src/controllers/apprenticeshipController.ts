import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { EmailService } from '../services/emailService.js';
import { EmailTemplates } from '../constants/emailTemplates.js';
import { requireString } from "../utils/routeHelpers";

export const createApprenticeshipApplication = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const data = req.body;

        const application = await prisma.apprenticeshipApplication.create({
            data: {
                userId: userId || null,
                fullName: data.fullName,
                dob: data.dob,
                gender: data.gender,
                contactNumber: data.contactNumber,
                email: data.email,
                city: data.city,
                state: data.state,
                country: data.country,
                postalCode: data.postalCode,
                qualification: data.qualification,
                otherQualification: data.otherQualification,
                fieldOfStudy: data.fieldOfStudy,
                institution: data.institution,
                completionYear: data.completionYear,
                apprenticeTrack: data.apprenticeTrack,
                preferredLocation: data.preferredLocation,
                availability: data.availability,
                skills: data.skills,
                otherSkill: data.otherSkill,
                experience: data.experience,
                motivation: data.motivation,
                heritageMeaning: data.heritageMeaning,
                contribution: data.contribution,
                cvUrl: data.cvUrl,
                portfolioLink: data.portfolioLink,
                portfolioFileUrl: data.portfolioFileUrl,
                status: 'PENDING'
            }
        });

        // Send Email
        EmailService.sendEmail(data.email, EmailTemplates.APPLICATION_RECEIVED, {
            name: data.fullName,
            type: 'Apprenticeship',
            id: application.id
        }).catch(err => console.error("Failed to send apprenticeship application email:", err));

        res.status(201).json(application);
    } catch (error) {
        console.error("Create Apprenticeship Application Error:", error);
        res.status(500).json({ error: "Failed to submit application" });
    }
};

export const getMyApprenticeshipApplications = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const applications = await prisma.apprenticeshipApplication.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(applications);
    } catch (error) {
        console.error("Get My Apprenticeship Applications Error:", error);
        res.status(500).json({ error: "Failed to fetch applications" });
    }
};

export const getAllApprenticeshipApplications = async (req: Request, res: Response) => {
    try {
        const applications = await prisma.apprenticeshipApplication.findMany({
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true, email: true } } }
        });
        res.json(applications);
    } catch (error) {
        console.error("Get All Apprenticeship Applications Error:", error);
        res.status(500).json({ error: "Failed to fetch applications" });
    }
};

export const updateApprenticeshipStatus = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const { status } = req.body;

        const application = await prisma.apprenticeshipApplication.update({
            where: { id },
            data: { status }
        });

        // Send Status Update Email
        if (application.email) {
            EmailService.sendEmail(application.email, EmailTemplates.STATUS_UPDATE, {
                name: application.fullName,
                type: 'Apprenticeship Application',
                status: status
            }).catch(err => console.error("Failed to send apprenticeship status update email:", err));
        }

        res.json(application);
    } catch (error) {
        console.error("Update Apprenticeship Status Error:", error);
        res.status(500).json({ error: "Failed to update status" });
    }
};
