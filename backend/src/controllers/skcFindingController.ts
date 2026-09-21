import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { requireString } from "../utils/routeHelpers";

export const getAllFindings = async (req: Request, res: Response) => {
    try {
        const findings = await prisma.skcFinding.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: findings });
    } catch (error: any) {
        res.status(500).json({ success: false, error: 'Failed to fetch findings' });
    }
};

export const getPublicFindings = async (req: Request, res: Response) => {
    try {
        const findings = await prisma.skcFinding.findMany({
            where: { status: 'PUBLISHED' },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: findings });
    } catch (error: any) {
        res.status(500).json({ success: false, error: 'Failed to fetch findings' });
    }
};

export const getFinding = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const finding = await prisma.skcFinding.findUnique({ where: { id } });
        if (!finding) return res.status(404).json({ success: false, error: 'Not found' });
        res.json({ success: true, data: finding });
    } catch (error: any) {
        res.status(500).json({ success: false, error: 'Failed to fetch finding' });
    }
};

export const createFinding = async (req: Request, res: Response) => {
    try {
        const { title, content, status, phase, author, attachmentUrl } = req.body;
        const finding = await prisma.skcFinding.create({
            data: { title, content, status, phase, author, attachmentUrl }
        });
        res.json({ success: true, data: finding });
    } catch (error: any) {
        res.status(500).json({ success: false, error: 'Failed to create finding' });
    }
};

export const updateFinding = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const { title, content, status, phase, author, attachmentUrl } = req.body;
        const finding = await prisma.skcFinding.update({
            where: { id },
            data: { title, content, status, phase, author, attachmentUrl }
        });
        res.json({ success: true, data: finding });
    } catch (error: any) {
        res.status(500).json({ success: false, error: 'Failed to update finding' });
    }
};

export const deleteFinding = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        await prisma.skcFinding.delete({ where: { id } });
        res.json({ success: true, message: 'Deleted' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: 'Failed to delete finding' });
    }
};
