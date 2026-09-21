import { isTransactionConflict } from '../utils/errorMapper.js';
import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { createStorySchema, updateStorySchema, publicFilterSchema } from '../validators/masterArtisanEditorialValidator.js';
import { requireString } from "../utils/routeHelpers";

export class MasterArtisanStoryController {
  
  // Public Endpoint
  static async getPublicStories(req: Request, res: Response) {
    try {
      const { skip, take } = publicFilterSchema.parse(req.query);
      
      const stories = await prisma.masterArtisanStory.findMany({
        where: {
          publicationStatus: 'PUBLISHED',
          archivedAt: null, // Soft delete exclusion
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take,
        include: {
          contributor: {
            select: { id: true, name: true },
          },
        },
      });

      res.json(stories);
    } catch (e: any) {
      if (e && (e.name === 'ZodError' || e.errors)) {
        return res.status(400).json({ error: e.errors || e.message });
      }
      if (isTransactionConflict(e)) {
        return res.status(409).json({ error: e instanceof Error ? e.message : 'Conflict' });
      }
      console.log('CATCH ERROR:', e); return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Public Endpoint
  static async getPublicStoryBySlug(req: Request, res: Response) {
    try {
      const slug = requireString(req.params.slug);
      const story = await prisma.masterArtisanStory.findFirst({
        where: {
          slug,
          publicationStatus: 'PUBLISHED',
          archivedAt: null, // Soft delete exclusion
        },
        include: {
          contributor: {
            select: { id: true, name: true },
          },
          seriesLinks: {
            include: { series: true },
          },
          issueLinks: {
            include: { issue: true },
          }
        },
      });

      if (!story) return res.status(404).json({ error: 'Story not found' });
      res.json(story);
    } catch (e: any) {
      if (e && (e.name === 'ZodError' || e.errors)) {
        return res.status(400).json({ error: e.errors || e.message });
      }
      if (isTransactionConflict(e)) {
        return res.status(409).json({ error: e instanceof Error ? e.message : 'Conflict' });
      }
      console.log('CATCH ERROR:', e); return res.status(500).json({ error: 'Internal Server Error' });
    }
  }



  static async create(req: Request, res: Response) {
    try {
      const data = createStorySchema.parse(req.body);
      const story = await prisma.masterArtisanStory.create({
        data,
      });
      res.status(201).json(story);
    } catch (e: any) {
      if (e && (e.name === 'ZodError' || e.errors)) {
        return res.status(400).json({ error: e.errors || e.message });
      }
      if (isTransactionConflict(e)) {
        return res.status(409).json({ error: e instanceof Error ? e.message : 'Conflict' });
      }
      console.log('CATCH ERROR:', e); return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = requireString(req.params.id);
      const { version, ...data } = updateStorySchema.parse(req.body);

      const updated = await prisma.masterArtisanStory.updateMany({
        where: { id, version },
        data: {
          ...data,
          version: { increment: 1 },
        },
      });

      if (updated.count === 0) {
        return res.status(409).json({ error: 'Conflict: Document has been modified by another user or does not exist.' });
      }

      // Fetch the updated document to return
      const finalDoc = await prisma.masterArtisanStory.findUnique({ where: { id } });
      res.json(finalDoc);
    } catch (e: any) {
      if (e && (e.name === 'ZodError' || e.errors)) {
        return res.status(400).json({ error: e.errors || e.message });
      }
      if (isTransactionConflict(e)) {
        return res.status(409).json({ error: e instanceof Error ? e.message : 'Conflict' });
      }
      console.log('CATCH ERROR:', e); return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async archive(req: Request, res: Response) {
    try {
      const id = requireString(req.params.id);
      const updated = await prisma.masterArtisanStory.update({
        where: { id },
        data: {
          archivedAt: new Date(),
          publicationStatus: 'ARCHIVED',
          version: { increment: 1 },
        },
      });
      res.json(updated);
    } catch (e: any) {
      if (e && (e.name === 'ZodError' || e.errors)) {
        return res.status(400).json({ error: e.errors || e.message });
      }
      if (isTransactionConflict(e)) {
        return res.status(409).json({ error: e instanceof Error ? e.message : 'Conflict' });
      }
      console.log('CATCH ERROR:', e); return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // --- Admin Endpoints ---

  static async getAllAdmin(req: Request, res: Response) {
    try {
      const { skip = 0, take = 20 } = publicFilterSchema.parse(req.query);
      const stories = await prisma.masterArtisanStory.findMany({
        skip,
        take,
        orderBy: { updatedAt: 'desc' },
        include: {
          contributor: { select: { id: true, name: true } },
        }
      });
      const total = await prisma.masterArtisanStory.count();
      res.json({ data: stories, total });
    } catch (e: any) {
      if (e && (e.name === 'ZodError' || e.errors)) {
        return res.status(400).json({ error: e.errors || e.message });
      }
      if (isTransactionConflict(e)) {
        return res.status(409).json({ error: e instanceof Error ? e.message : 'Conflict' });
      }
      console.log('CATCH ERROR:', e); return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getAdminById(req: Request, res: Response) {
    try {
      const id = requireString(req.params.id);
      const story = await prisma.masterArtisanStory.findUnique({
        where: { id },
        include: {
          contributor: { select: { id: true, name: true } },
          seriesLinks: { include: { series: true } }
        }
      });
      if (!story) return res.status(404).json({ error: 'Not found' });
      res.json(story);
    } catch (e: any) {
      if (e && (e.name === 'ZodError' || e.errors)) {
        return res.status(400).json({ error: e.errors || e.message });
      }
      if (isTransactionConflict(e)) {
        return res.status(409).json({ error: e instanceof Error ? e.message : 'Conflict' });
      }
      console.log('CATCH ERROR:', e); return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
