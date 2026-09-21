import { isTransactionConflict } from '../utils/errorMapper.js';
import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { createFeatureSchema, updateFeatureSchema } from '../validators/masterArtisanEditorialValidator.js';
import { z } from 'zod';
import { requireString } from "../utils/routeHelpers";

const publicFilterSchema = z.object({
  skip: z.coerce.number().optional().default(0),
  take: z.coerce.number().optional().default(20)
});

export class MasterArtisanFeatureController {
  
  // Public Endpoint
  static async getActiveFeature(req: Request, res: Response) {
    try {
      const now = new Date();
      // Enforce deterministic priority: order by startsAt desc, take 1
      const feature = await prisma.masterArtisanFeature.findFirst({
        where: {
          status: 'ACTIVE',
          startsAt: { lte: now },
          OR: [
            { endsAt: { gt: now } },
            { endsAt: null },
          ]
        },
        orderBy: { startsAt: 'desc' },
        include: {
          artisan: {
            include: { canonicalEntity: true }
          },
          linkedStory: {
            where: { archivedAt: null, publicationStatus: 'PUBLISHED' }
          }
        }
      });

      if (!feature) {
        return res.status(200).json({ data: null, message: 'No active feature' });
      }

      res.json({ data: feature });
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
      const data = createFeatureSchema.parse(req.body);
      
      const feature = await prisma.$transaction(async (tx) => {
        // Ensure no overlapping active features using transaction validation
        if (data.status === 'ACTIVE' && data.startsAt) {
          const overlapping = await tx.masterArtisanFeature.findFirst({
            where: {
              status: 'ACTIVE',
              startsAt: { lte: data.endsAt || new Date('2099-12-31') },
              OR: [
                { endsAt: { gt: data.startsAt } },
                { endsAt: null },
              ]
            }
          });
          if (overlapping) {
            throw new Error('Conflict: An active feature already exists in this date range.');
          }
        }

        return tx.masterArtisanFeature.create({
          data,
        });
      }, {
        isolationLevel: 'Serializable'
      });
      
      res.status(201).json(feature);
    } catch (e: any) {
      if (e.message?.includes('Conflict')) {
        return res.status(409).json({ error: e.message });
      }
      if (e.code === 'P2034') {
        return res.status(409).json({ error: 'Conflict: Serialization failure.' });
      }
      if (isTransactionConflict(e)) return res.status(409).json({ error: 'Conflict' });
      res.status(400).json({ error: e.errors || e.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = requireString(req.params.id);
      const { version, ...data } = updateFeatureSchema.parse(req.body);

      const current = await prisma.masterArtisanFeature.findUnique({ where: { id } });
      if (!current) return res.status(404).json({ error: 'Not found' });
      if (current.version !== version) {
        return res.status(409).json({ error: 'Conflict: Document has been modified by another user.' });
      }

      const finalDoc = await prisma.$transaction(async (tx) => {
        if (data.status === 'ACTIVE' && (data.startsAt || current.startsAt)) {
          const startsAt = data.startsAt || current.startsAt;
          const endsAt = data.endsAt !== undefined ? data.endsAt : current.endsAt;
          
          const overlapping = await tx.masterArtisanFeature.findFirst({
            where: {
              id: { not: id },
              status: 'ACTIVE',
              startsAt: { lte: endsAt || new Date('2099-12-31') },
              OR: [
                { endsAt: { gt: startsAt } },
                { endsAt: null },
              ]
            }
          });
          if (overlapping) {
            throw new Error('Conflict: An active feature already exists in this date range.');
          }
        }

        const updated = await tx.masterArtisanFeature.updateMany({
          where: { id, version },
          data: {
            ...data,
            version: { increment: 1 },
          },
        });

        if (updated.count === 0) {
          throw new Error('Conflict: Document has been modified by another user or does not exist.');
        }

        return tx.masterArtisanFeature.findUnique({ where: { id } });
      }, {
        isolationLevel: 'Serializable'
      });

      res.json(finalDoc);
    } catch (e: any) {
      if (e.message?.includes('Conflict')) {
        return res.status(409).json({ error: e.message });
      }
      if (e.code === 'P2034') {
        return res.status(409).json({ error: 'Conflict: Serialization failure.' });
      }
      if (isTransactionConflict(e)) return res.status(409).json({ error: 'Conflict' });
      res.status(400).json({ error: e.errors || e.message });
    }
  }

  static async expire(req: Request, res: Response) {
    try {
      const id = requireString(req.params.id);
      const updated = await prisma.masterArtisanFeature.update({
        where: { id },
        data: {
          status: 'EXPIRED',
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
      const features = await prisma.masterArtisanFeature.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { artisan: { include: { canonicalEntity: true } }, linkedStory: true }
      });
      const total = await prisma.masterArtisanFeature.count();
      res.json({ data: features, total });
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
      const feature = await prisma.masterArtisanFeature.findUnique({
        where: { id },
        include: { artisan: { include: { canonicalEntity: true } }, linkedStory: true }
      });
      if (!feature) return res.status(404).json({ error: 'Not found' });
      res.json(feature);
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
