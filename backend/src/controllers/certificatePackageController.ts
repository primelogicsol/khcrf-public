import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { requireString } from "../utils/routeHelpers";

// Create Package
export const createPackage = async (req: Request, res: Response) => {
    try {
        const { name, price, description, features, validity,annualFee } = req.body;
        
        const pkg = await prisma.certificatePackage.create({
            data: {
                name,
                price: parseFloat(price),
                description,
                features,
                validity,
                annualFee
            }
        });
        res.status(201).json(pkg);
    } catch (error) {
        console.error("Error creating package:", error);
        res.status(500).json({ error: 'Failed to create package' });
    }
};

// Get All Packages
export const getPackages = async (req: Request, res: Response) => {
    try {
        const packages = await prisma.certificatePackage.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(packages);
    } catch (error) {
        console.error("Error fetching packages:", error);
        res.status(500).json({ error: 'Failed to fetch packages' });
    }
};

// Get Single Package
export const getPackageById = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const pkg = await prisma.certificatePackage.findUnique({
            where: { id }
        });
        if (!pkg) {
            return res.status(404).json({ error: 'Package not found' });
        }
        res.json(pkg);
    } catch (error) {
        console.error("Error fetching package:", error);
        res.status(500).json({ error: 'Failed to fetch package' });
    }
};

// Update Package

export const updatePackage = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const { name, price, description, features, validity,annualFee } = req.body;

        const pkg = await prisma.certificatePackage.update({
            where: { id },
            data: {
                name,
                price: parseFloat(price),
                description,
                features,
                validity,
                annualFee
            }
        });
        res.json(pkg);
    } catch (error) {
        console.error("Error updating package:", error);
        res.status(500).json({ error: 'Failed to update package' });
    }
};

// Delete Package
export const deletePackage = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        await prisma.certificatePackage.delete({
            where: { id }
        });
        res.json({ message: 'Package deleted successfully' });
    } catch (error) {
        console.error("Error deleting package:", error);
        res.status(500).json({ error: 'Failed to delete package' });
    }
};
