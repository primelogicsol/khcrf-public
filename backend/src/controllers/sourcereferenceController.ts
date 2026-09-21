import { Request, Response } from 'express';
import { SourceReferenceService } from '../services/sourcereferenceService';
import { requireString } from "../utils/routeHelpers";

export class SourceReferenceController {
  static async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
      const record = await SourceReferenceService.create(req.body, userId || 'system');
      return res.status(201).json(record);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const skip = req.query.skip ? parseInt(String(req.query.skip), 10) : 0;
      const take = req.query.take ? parseInt(String(req.query.take), 10) : 20;
      const results = await SourceReferenceService.getAll(skip, take);
      return res.json(results);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const record = await SourceReferenceService.getById(requireString(req.params.id));
      if (!record) return res.status(404).json({ error: 'Not found' });
      return res.json(record);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const record = await SourceReferenceService.update(requireString(req.params.id), req.body, userId || 'system');
      return res.json(record);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      await SourceReferenceService.softDelete(requireString(req.params.id), userId || 'system');
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
