import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { requireString } from "../utils/routeHelpers";

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, slug, description } = req.body;

        if (!name || !slug) {
            return res.status(400).json({ error: "Name and slug are required" });
        }

        const existing = await prisma.publicationCategory.findUnique({
            where: { slug }
        });

        if (existing) {
            return res.status(400).json({ error: "Category with this slug already exists" });
        }

        const category = await prisma.publicationCategory.create({
            data: {
                name,
                slug,
                description
            }
        });

        res.status(201).json(category);
    } catch (error) {
        console.error("Create Category Error:", error);
        res.status(500).json({ error: "Failed to create category" });
    }
};

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.publicationCategory.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(categories);
    } catch (error) {
        console.error("Get Categories Error:", error);
        res.status(500).json({ error: "Failed to fetch categories" });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const { name, slug, description } = req.body;

        const category = await prisma.publicationCategory.update({
            where: { id },
            data: { name, slug, description }
        });

        res.json(category);
    } catch (error) {
        console.error("Update Category Error:", error);
        res.status(500).json({ error: "Failed to update category" });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        await prisma.publicationCategory.delete({ where: { id } });
        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Delete Category Error:", error);
        res.status(500).json({ error: "Failed to delete category" });
    }
};
