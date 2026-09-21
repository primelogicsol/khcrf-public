import { ZodError } from 'zod';
import { glossaryTermSchema, updateGlossaryTermSchema } from '../validators/sprint1BValidator';
import { Request, Response } from 'express';
import { GlossaryTermService } from '../services/glossarytermService';
import { requireString } from "../utils/routeHelpers";

export class GlossaryTermController {
  static async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
      const validatedData = glossaryTermSchema.parse(req.body);
      const record = await GlossaryTermService.create(validatedData, userId);
      return res.status(201).json(record);
    } catch (error: any) {
      if (error instanceof ZodError) return res.status(400).json({ error: 'Validation failed', details: error.issues });
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const skip = req.query.skip ? parseInt(String(req.query.skip), 10) : 0;
      const take = req.query.take ? parseInt(String(req.query.take), 10) : 20;
      const results = await GlossaryTermService.getAll(skip, take);
      return res.json(results);
    } catch (error: any) {
      if (error instanceof ZodError) return res.status(400).json({ error: 'Validation failed', details: error.issues });
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const record = await GlossaryTermService.getById(requireString(req.params.id));
      if (!record) return res.status(404).json({ error: 'Not found' });
      return res.json(record);
    } catch (error: any) {
      if (error instanceof ZodError) return res.status(400).json({ error: 'Validation failed', details: error.issues });
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const validatedData = updateGlossaryTermSchema.parse(req.body);
      const record = await GlossaryTermService.update(requireString(req.params.id), validatedData, userId || 'system');
      return res.json(record);
    } catch (error: any) {
      if (error instanceof ZodError) return res.status(400).json({ error: 'Validation failed', details: error.issues });
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      await GlossaryTermService.hardDelete(requireString(req.params.id), userId || 'system');
      return res.status(204).send();
    } catch (error: any) {
      if (error instanceof ZodError) return res.status(400).json({ error: 'Validation failed', details: error.issues });
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
