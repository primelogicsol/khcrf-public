import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { requireString } from "../utils/routeHelpers";

// Get a specific config by key (Public)
export const getConfig = async (req: Request, res: Response) => {
    try {
        const key = requireString(req.params.key);
        const config = await prisma.skcConfig.findUnique({
            where: { key }
        });
        
        if (!config) {
            return res.status(404).json({ success: false, error: 'Config not found' });
        }
        
        res.json({ success: true, data: config.value });
    } catch (error: any) {
        console.error(`Error fetching config ${requireString(req.params.key)}:`, error);
        res.status(500).json({ success: false, error: 'Failed to fetch config' });
    }
};

// Get all configs (Admin)
export const getAllConfigs = async (req: Request, res: Response) => {
    try {
        const configs = await prisma.skcConfig.findMany();
        res.json({ success: true, data: configs });
    } catch (error: any) {
        console.error('Error fetching all configs:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch configs' });
    }
};

// Set a config (Admin)
export const setConfig = async (req: Request, res: Response) => {
    try {
        const key = requireString(req.params.key);
        const { value, description } = req.body;
        
        if (value === undefined) {
            return res.status(400).json({ success: false, error: 'Value is required' });
        }

        const config = await prisma.skcConfig.upsert({
            where: { key },
            update: { value, description },
            create: { key, value, description }
        });
        
        res.json({ success: true, data: config });
    } catch (error: any) {
        console.error(`Error setting config ${requireString(req.params.key)}:`, error);
        res.status(500).json({ success: false, error: 'Failed to set config' });
    }
};
