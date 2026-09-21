import { isTransactionConflict } from '../utils/errorMapper.js';
import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { createSeriesSchema, updateSeriesSchema, publicFilterSchema } from '../validators/masterArtisanEditorialValidator.js';
import { requireString } from "../utils/routeHelpers";

export class MasterArtisanSeriesController {
  
  // Public Endpoint
  static async getPublicSeries(req: Request, res: Response) {
    try {
      const { skip, take } = publicFilterSchema.parse(req.query);
      
      const series = await prisma.masterArtisanSeries.findMany({
        where: {
          status: 'ACTIVE',
          archivedAt: null,
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take,
        include: {
          stories: {
            where: {
              story: {
                publicationStatus: 'PUBLISHED',
                archivedAt: null,
              }
            },
            orderBy: { position: 'asc' },
            include: { story: true },
          }
        },
      });

      res.json(series);
    } catch (e: any) {
      if (e && (e.name === 'ZodError' || e.errors)) {
        return res.status(400).json({ error: e.errors || e.message });
      }
      if (isTransactionConflict(e)) {
        return res.status(409).json({ error: e instanceof Error ? e.message : 'Conflict' });
      }
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Public Endpoint
  static async getPublicSeriesBySlug(req: Request, res: Response) {
    try {
      const slug = requireString(req.params.slug);
      const series = await prisma.masterArtisanSeries.findFirst({
        where: {
          slug,
          status: 'ACTIVE',
          archivedAt: null,
        },
        include: {
          stories: {
            where: {
              story: {
                publicationStatus: 'PUBLISHED',
                archivedAt: null,
              }
            },
            orderBy: { position: 'asc' },
            include: { story: true },
          }
        },
      });

      if (!series) return res.status(404).json({ error: 'Series not found' });
      res.json(series);
    } catch (e: any) {
      if (e && (e.name === 'ZodError' || e.errors)) {
        return res.status(400).json({ error: e.errors || e.message });
      }
      if (isTransactionConflict(e)) {
        return res.status(409).json({ error: e instanceof Error ? e.message : 'Conflict' });
      }
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }



  static async create(req: Request, res: Response) {
    try {
      const data = createSeriesSchema.parse(req.body);
      const series = await prisma.masterArtisanSeries.create({
        data,
      });
      res.status(201).json(series);
    } catch (e: any) {
      if (e && (e.name === 'ZodError' || e.errors)) {
        return res.status(400).json({ error: e.errors || e.message });
      }
      if (isTransactionConflict(e)) {
        return res.status(409).json({ error: e instanceof Error ? e.message : 'Conflict' });
      }
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = requireString(req.params.id);
      const { version, ...data } = updateSeriesSchema.parse(req.body);

      const updated = await prisma.masterArtisanSeries.updateMany({
        where: { id, version },
        data: {
          ...data,
          version: { increment: 1 },
        },
      });

      if (updated.count === 0) {
        return res.status(409).json({ error: 'Conflict: Document has been modified by another user or does not exist.' });
      }

      // Fetch updated doc
      const finalDoc = await prisma.masterArtisanSeries.findUnique({ where: { id } });
      res.json(finalDoc);
    } catch (e: any) {
      if (e && (e.name === 'ZodError' || e.errors)) {
        return res.status(400).json({ error: e.errors || e.message });
      }
      if (isTransactionConflict(e)) {
        return res.status(409).json({ error: e instanceof Error ? e.message : 'Conflict' });
      }
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async archive(req: Request, res: Response) {
    try {
      const id = requireString(req.params.id);
      const updated = await prisma.masterArtisanSeries.update({
        where: { id },
        data: {
          archivedAt: new Date(),
          status: 'ARCHIVED',
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
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // --- Admin Endpoints ---

  static async getAllAdmin(req: Request, res: Response) {
    try {
      const { skip = 0, take = 20 } = publicFilterSchema.parse(req.query);
      const series = await prisma.masterArtisanSeries.findMany({
        skip,
        take,
        orderBy: { updatedAt: 'desc' },
      });
      const total = await prisma.masterArtisanSeries.count();
      res.json({ data: series, total });
    } catch (e: any) {
      if (e && (e.name === 'ZodError' || e.errors)) {
        return res.status(400).json({ error: e.errors || e.message });
      }
      if (isTransactionConflict(e)) {
        return res.status(409).json({ error: e instanceof Error ? e.message : 'Conflict' });
      }
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getAdminById(req: Request, res: Response) {
    try {
      const id = requireString(req.params.id);
      const series = await prisma.masterArtisanSeries.findUnique({
        where: { id },
        include: {
          stories: {
            include: { story: true },
            orderBy: { position: 'asc' }
          }
        }
      });
      if (!series) return res.status(404).json({ error: 'Not found' });
      res.json(series);
    } catch (e: any) {
      if (e && (e.name === 'ZodError' || e.errors)) {
        return res.status(400).json({ error: e.errors || e.message });
      }
      if (isTransactionConflict(e)) {
        return res.status(409).json({ error: e instanceof Error ? e.message : 'Conflict' });
      }
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async addStory(req: Request, res: Response) {
    try {
      const id = requireString(req.params.id);
      const { storyId } = req.body;
      if (!storyId) return res.status(400).json({ error: 'storyId is required' });

      // Check if already exists
      const existing = await prisma.masterArtisanSeriesStory.findUnique({
        where: { seriesId_storyId: { seriesId: id, storyId } }
      });
      if (existing) return res.status(409).json({ error: 'Story already assigned' });

      // Get max position
      const maxPos = await prisma.masterArtisanSeriesStory.aggregate({
        where: { seriesId: id },
        _max: { position: true }
      });
      const position = (maxPos._max.position || 0) + 1;

      const link = await prisma.masterArtisanSeriesStory.create({
        data: { seriesId: id, storyId, position }
      });
      res.status(201).json(link);
    } catch (e: any) {
      if (e && (e.name === 'ZodError' || e.errors)) {
        return res.status(400).json({ error: e.errors || e.message });
      }
      if (isTransactionConflict(e)) {
        return res.status(409).json({ error: e instanceof Error ? e.message : 'Conflict' });
      }
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async removeStory(req: Request, res: Response) {
    try {
      const id = requireString(req.params.id);
        const storyId = requireString(req.params.storyId);
      await prisma.masterArtisanSeriesStory.delete({
        where: { seriesId_storyId: { seriesId: id, storyId } }
      });
      res.status(204).end();
    } catch (e: any) {
      if (e && (e.name === 'ZodError' || e.errors)) {
        return res.status(400).json({ error: e.errors || e.message });
      }
      if (isTransactionConflict(e)) {
        return res.status(409).json({ error: e instanceof Error ? e.message : 'Conflict' });
      }
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async reorderStories(req: Request, res: Response) {
    try {
      const id = requireString(req.params.id);
      const { order } = req.body; // array of storyIds
      if (!Array.isArray(order) || order.length === 0) return res.status(400).json({ error: 'Invalid order payload' });

      await prisma.$transaction(
        order.map((storyId, index) =>
          prisma.masterArtisanSeriesStory.update({
            where: { seriesId_storyId: { seriesId: id, storyId } },
            data: { position: index + 1 }
          })
        )
      );
      res.json({ success: true });
    } catch (e: any) {
      if (e && (e.name === 'ZodError' || e.errors)) {
        return res.status(400).json({ error: e.errors || e.message });
      }
      if (isTransactionConflict(e)) {
        return res.status(409).json({ error: e instanceof Error ? e.message : 'Conflict' });
      }
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
