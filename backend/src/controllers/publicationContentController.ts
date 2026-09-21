import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { validatePublicContent } from '../utils/contentValidation.js';

// --- Chapters ---

export const createChapter = async (req: Request, res: Response) => {
    try {
        const { title, order, status, summary, sectionType, publicationId } = req.body;
        const parsedOrder = parseInt(order);

        // Idempotency check: publicationId + sectionType + order
        const existing = await prisma.chapter.findFirst({
            where: {
                publicationId,
                sectionType: sectionType || "chapter",
                order: parsedOrder
            }
        });

        if (existing) {
            console.log(`Idempotent write: Chapter already exists at order ${parsedOrder}. Updating instead of creating.`);
            const updated = await prisma.chapter.update({
                where: { id: existing.id },
                data: {
                    title,
                    status,
                    summary
                }
            });
            return res.status(200).json(updated);
        }

        const chapter = await prisma.chapter.create({
            data: {
                title,
                order: parsedOrder,
                status,
                summary,
                sectionType: sectionType || "chapter",
                publicationId
            }
        });

        res.status(201).json(chapter);
    } catch (error) {
        console.error("Create Chapter Error:", error);
        res.status(500).json({ error: "Failed to create chapter" });
    }
};

export const updateChapter = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const { title, order, status, summary, sectionType } = req.body;

        const chapter = await prisma.chapter.update({
            where: { id },
            data: {
                title,
                order: order ? parseInt(order) : undefined,
                status,
                summary,
                sectionType
            }
        });

        res.json(chapter);
    } catch (error) {
        console.error("Update Chapter Error:", error);
        res.status(500).json({ error: "Failed to update chapter" });
    }
};

export const deleteChapter = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        await prisma.chapter.delete({ where: { id } });
        res.json({ message: "Chapter deleted successfully" });
    } catch (error) {
        console.error("Delete Chapter Error:", error);
        res.status(500).json({ error: "Failed to delete chapter" });
    }
};

export const getChapters = async (req: Request, res: Response) => {
    try {
        const publicationId = requireString(req.params.publicationId);
        const chapters = await prisma.chapter.findMany({
            where: { publicationId },
            orderBy: { order: 'asc' },
            include: { pages: { orderBy: { pageNumber: 'asc' } } }
        });
        res.json(chapters);
    } catch (error) {
        console.error("Get Chapters Error:", error);
        res.status(500).json({ error: "Failed to fetch chapters" });
    }
};

// --- Pages ---

export const createPage = async (req: Request, res: Response) => {
    try {
        const { content, pageNumber, chapterId } = req.body;

        const safeContent = typeof content === "string" ? content : JSON.stringify(content);

        const validation = validatePublicContent(safeContent);
        if (!validation.isValid) {
            return res.status(400).json({ 
                error: `Content publication blocked. Found restricted developer phrase: "${validation.flaggedPhrase}". Please remove internal notes before publishing.` 
            });
        }

        const page = await prisma.bookPage.create({
            data: {
                content: safeContent,
                pageNumber: parseInt(pageNumber),
                chapterId
            }
        });

        res.status(201).json(page);
    } catch (error) {
        console.error("Create Page Error:", error);
        res.status(500).json({ error: "Failed to create page" });
    }
};

export const updatePage = async (req: Request, res: Response) => {
    try {
        console.log("UPDATE PAGE PARAMS", req.params);
        console.log("UPDATE PAGE BODY", req.body);

        const id = requireString(req.params.id);
        if (!id) {
            return res.status(400).json({ error: "Page ID required" });
        }

        const existing = await prisma.bookPage.findUnique({ where: { id } });
        if (!existing) {
            console.log(`Page not found: ${id}`);
            return res.status(404).json({ error: "Page not found", pageId: id });
        }

        const rawContent = req.body.content;
        const serializedContent =
          typeof rawContent === "string"
            ? rawContent
            : JSON.stringify(rawContent ?? []);

        const pageNumber =
          Number(req.body.pageNumber || req.body.page_number || req.body.order || existing.pageNumber || 1);

        const validation = validatePublicContent(serializedContent);
        if (!validation.isValid) {
            return res.status(400).json({ 
                error: `Content publication blocked. Found restricted developer phrase: "${validation.flaggedPhrase}". Please remove internal notes before publishing.` 
            });
        }

        const page = await prisma.bookPage.update({
            where: { id },
            data: {
                content: serializedContent,
                pageNumber
            }
        });

        return res.json(page);
    } catch (error: any) {
        require('fs').appendFileSync('C:/Users/Fayaz/Sufipulseupdate2026/KHCRF 2026/hcr_foundation_full_govind/backend/error_log.txt', new Date().toISOString() + ' ' + error.message + '\n' + error.stack + '\n');
        console.error("UPDATE PAGE ERROR:", error);
        return res.status(500).json({ 
            error: "Page update failed",
            pageId: req.params.id,
            message: error.message,
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined
        });
    }
};

export const deletePage = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        await prisma.bookPage.delete({ where: { id } });
        res.json({ message: "Page deleted successfully" });
    } catch (error) {
        console.error("Delete Page Error:", error);
        res.status(500).json({ error: "Failed to delete page" });
    }
};

// --- Bulk Upload ---
// This is a placeholder for the bulk upload logic. 
// In a real scenario, this would parse a CSV/Excel file and create multiple records.
export const bulkUploadPublications = async (req: Request, res: Response) => {
    try {
        // Validation and parsing logic would go here
        res.status(501).json({ message: "Bulk upload not implemented yet" });
    } catch (error) {
        console.error("Bulk Upload Error:", error);
        res.status(500).json({ error: "Failed to process bulk upload" });
    }
};
import { PUBLICATION_BLUEPRINTS } from '../utils/publicationBlueprints.js';
import { requireString } from "../utils/routeHelpers";

export const initializeManuscript = async (req: Request, res: Response) => {
    try {
        const publicationId = requireString(req.params.publicationId);
        const { blueprintKey } = req.body;
        
        if (!publicationId) return res.status(400).json({ error: 'publicationId is required' });

        const publication = await prisma.publication.findUnique({
            where: { id: publicationId },
            include: { chapters: true }
        });

        if (!publication) return res.status(404).json({ error: 'Publication not found' });
        if (publication.chapters && publication.chapters.length > 0) return res.status(400).json({ error: 'Publication already has chapters initialized.' });
        
        const blueprint = PUBLICATION_BLUEPRINTS[blueprintKey || publication.category || ''];
        let newChaptersToCreate: any[] = [];
        let order = 1;

        if (blueprint) {
            blueprint.defaultStructure.forEach((section: any) => {
                section.items.forEach((item: string) => {
                    newChaptersToCreate.push({
                        title: item, order: order++, status: 'DRAFT', summary: '', sectionType: section.type, publicationId
                    });
                });
            });
        } else {
            const generic = [
                { title: 'Cover Page', sectionType: 'front-matter' }, { title: 'Foreword', sectionType: 'front-matter' },
                { title: 'Preface', sectionType: 'front-matter' }, { title: 'Executive Summary', sectionType: 'front-matter' },
                { title: 'Chapter 1', sectionType: 'chapter' }, { title: 'Chapter 2', sectionType: 'chapter' },
                { title: 'Chapter 3', sectionType: 'chapter' }, { title: 'Chapter 4', sectionType: 'chapter' },
                { title: 'Chapter 5', sectionType: 'chapter' }, { title: 'Appendices', sectionType: 'back-matter' },
                { title: 'Glossary', sectionType: 'back-matter' }, { title: 'References', sectionType: 'back-matter' }
            ];
            generic.forEach(item => {
                newChaptersToCreate.push({ title: item.title, order: order++, status: 'DRAFT', summary: '', sectionType: item.sectionType, publicationId });
            });
        }

        const createdChapters = await prisma.$transaction(
            newChaptersToCreate.map(data => prisma.chapter.create({ data }))
        );

        const emptyPagesToCreate = createdChapters.map(chapter => ({
            content: JSON.stringify([{ type: 'Paragraph', text: '' }]),
            pageNumber: 1,
            chapterId: chapter.id
        }));

        await prisma.$transaction(
            emptyPagesToCreate.map(data => prisma.bookPage.create({ data }))
        );

        await prisma.editorialAuditLog.create({
            data: {
                publicationId,
                userId: (req as any).user?.id || null,
                action: 'MANUSCRIPT_INITIALIZED',
                details: 'Initialized ' + createdChapters.length + ' chapters using blueprint: ' + (blueprintKey || 'Generic')
            }
        });

        const initializedPublication = await prisma.publication.findUnique({
            where: { id: publicationId },
            include: { chapters: { include: { pages: true } } }
        });

        res.status(200).json({ status: 'success', data: initializedPublication });
    } catch (error) {
        console.error('Error initializing manuscript', error);
        res.status(500).json({ error: 'Failed to initialize manuscript' });
    }
};

export const reorderChapters = async (req: Request, res: Response) => {
    try {
        const publicationId = requireString(req.params.publicationId);
        const { chapters } = req.body;
        
        if (!chapters || !Array.isArray(chapters)) {
            return res.status(400).json({ success: false, message: "Invalid chapters array" });
        }
        
        for (const chapter of chapters) {
            await prisma.chapter.update({
                where: { id: chapter.id },
                data: { order: chapter.order }
            });
        }
        
        res.json({ success: true, message: "Chapters reordered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const approveTOC = async (req: Request, res: Response) => {
    try {
        const publicationId = requireString(req.params.publicationId);
        res.json({ success: true, message: "TOC approved" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
