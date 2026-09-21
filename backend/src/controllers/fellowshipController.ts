// @ts-nocheck
import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { requireString } from "../utils/routeHelpers";

export const registerFellow = async (req: Request, res: Response) => {
    try {
        const {
            fullName,
            email,
            phone,
            district,
            education,
            institution,
            position,
            skills,
            statement
        } = req.body || {};

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const cvUrl = files?.['cvFile']?.[0]?.filename ? `/secure_uploads/${files['cvFile'][0].filename}` : undefined;
        const portfolioUrl = files?.['portfolioFile']?.[0]?.filename ? `/secure_uploads/${files['portfolioFile'][0].filename}` : undefined;

        if (!fullName?.trim() || !email?.trim()) {
            return res.status(400).json({ success: false, error: 'Full name and email are required.' });
        }

        const count = await prisma.fellowshipApplication.count();
        const referenceNumber = `SKC-FEL-${String(count + 1).padStart(6, '0')}`;

        const application = await prisma.fellowshipApplication.create({
            data: {
                referenceNumber,
                fullName: fullName.trim(),
                email: email.trim().toLowerCase(),
                phone: phone?.trim(),
                district: district?.trim(),
                education: education?.trim(),
                institution: institution?.trim(),
                position: position?.trim(),
                skills: skills?.trim(),
                statement: statement?.trim(),
                cvUrl: cvUrl?.trim(),
                portfolioUrl: portfolioUrl?.trim(),
                status: 'SUBMITTED'
            }
        });

        return res.status(201).json({
            success: true,
            data: {
                referenceNumber: application.referenceNumber,
                status: application.status
            }
        });
    } catch (error: any) {
        console.error("FELLOWSHIP ERROR:", error);
        res.status(500).json({
          success: false,
          error: String(error),
          stack: error.stack
        });
    }
};

export const getFellowsAdmin = async (req: Request, res: Response) => {
    try {
        const applications = await prisma.fellowshipApplication.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return res.json({ success: true, data: applications });
    } catch (error: any) {
        console.error('getFellowsAdmin error:', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch fellowship applications.' });
    }
};

export const updateFellowStatus = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const { status } = req.body;
        
        const updated = await prisma.fellowshipApplication.update({
            where: { id },
            data: { status }
        });
        return res.json({ success: true, data: updated });
    } catch (error: any) {
        console.error('updateFellowStatus error:', error);
        return res.status(500).json({ success: false, error: 'Failed to update fellowship status.' });
    }
};
