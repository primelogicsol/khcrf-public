import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { requireString } from "../utils/routeHelpers";

// --- Advisory Members (Admin + Public) ---

export const getAllMembers = async (req: Request, res: Response) => {
    try {
        const members = await prisma.skcAdvisoryMember.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: members });
    } catch (error: any) {
        res.status(500).json({ success: false, error: 'Failed to fetch members' });
    }
};

export const getPublicMembers = async (req: Request, res: Response) => {
    try {
        const members = await prisma.skcAdvisoryMember.findMany({
            where: { status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: members });
    } catch (error: any) {
        res.status(500).json({ success: false, error: 'Failed to fetch members' });
    }
};

export const createMember = async (req: Request, res: Response) => {
    try {
        const member = await prisma.skcAdvisoryMember.create({ data: req.body });
        res.json({ success: true, data: member });
    } catch (error: any) {
        res.status(500).json({ success: false, error: 'Failed to create member' });
    }
};

export const updateMember = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const member = await prisma.skcAdvisoryMember.update({
            where: { id },
            data: req.body
        });
        res.json({ success: true, data: member });
    } catch (error: any) {
        res.status(500).json({ success: false, error: 'Failed to update member' });
    }
};

// --- Advisory Applications (Public Create, Admin Read/Update) ---

export const createApplication = async (req: Request, res: Response) => {
    try {
        const { fullName, advisoryScope, category, email, phone, organization, district, statement, consentAccepted } = req.body;

        if (!fullName || !advisoryScope || !category || !email || !statement) {
            return res.status(400).json({ success: false, error: 'Missing required fields: fullName, advisoryScope, category, email, statement.' });
        }
        if (!['KHCRF', 'SKC', 'BOTH'].includes(advisoryScope)) {
            return res.status(400).json({ success: false, error: 'Invalid advisoryScope. Must be KHCRF, SKC, or BOTH.' });
        }
        if (statement.length < 50) {
            return res.status(400).json({ success: false, error: 'Statement must be at least 50 characters.' });
        }
        if (consentAccepted !== 'true' && consentAccepted !== true) {
            return res.status(400).json({ success: false, error: 'Consent is required.' });
        }

        const count = await prisma.advisoryApplication.count();
        const referenceNumber = `ADV-2026-${String(count + 1).padStart(6, '0')}`;

        const app = await prisma.advisoryApplication.create({
            data: {
                referenceNumber,
                fullName,
                advisoryScope,
                category,
                email,
                phone: phone || null,
                organization: organization || null,
                district: district || null,
                statement,
                consentAccepted: true,
                consentAcceptedAt: new Date(),
                status: 'SUBMITTED',
            }
        });
        res.status(201).json({ success: true, referenceNumber: app.referenceNumber, status: app.status, submittedAt: app.submittedAt });
    } catch (error: any) {
        res.status(500).json({ success: false, error: 'Failed to submit application' });
    }
};

export const getAllApplications = async (req: Request, res: Response) => {
    try {
        const apps = await prisma.advisoryApplication.findMany({
            orderBy: { submittedAt: 'desc' }
        });
        res.json({ success: true, data: apps });
    } catch (error: any) {
        res.status(500).json({ success: false, error: 'Failed to fetch applications' });
    }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const { status, internalNotes, assignedReviewerId } = req.body;
        const dataToUpdate: any = {};
        if (status !== undefined) dataToUpdate.status = status;
        if (internalNotes !== undefined) dataToUpdate.internalNotes = internalNotes;
        if (assignedReviewerId !== undefined) dataToUpdate.assignedReviewerId = assignedReviewerId;
        
        const app = await prisma.advisoryApplication.update({
            where: { id },
            data: dataToUpdate
        });
        res.json({ success: true, data: app });
    } catch (error: any) {
        res.status(500).json({ success: false, error: 'Failed to update application' });
    }
};
