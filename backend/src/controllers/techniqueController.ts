import { ZodError } from 'zod';
import { techniqueSchema, updateTechniqueSchema } from '../validators/sprint1BValidator';
import { Request, Response } from 'express';
import { TechniqueService } from '../services/techniqueService';
import { requireString } from "../utils/routeHelpers";

export class TechniqueController {
  static async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
      const validatedData = techniqueSchema.parse(req.body);
      const record = await TechniqueService.create(validatedData, userId);
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
      const results = await TechniqueService.getAll(skip, take);
      return res.json(results);
    } catch (error: any) {
      if (error instanceof ZodError) return res.status(400).json({ error: 'Validation failed', details: error.issues });
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const record = await TechniqueService.getById(requireString(req.params.id));
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
      const validatedData = updateTechniqueSchema.parse(req.body);
      const record = await TechniqueService.update(requireString(req.params.id), validatedData, userId || 'system');
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
      await TechniqueService.hardDelete(requireString(req.params.id), userId || 'system');
      return res.status(204).send();
    } catch (error: any) {
      if (error instanceof ZodError) return res.status(400).json({ error: 'Validation failed', details: error.issues });
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
