import { Request, Response } from 'express';
import { CollectionService } from '../services/collectionService';
import { createCollectionSchema, updateCollectionSchema } from '../validators/collectionValidator';
import { requireString } from "../utils/routeHelpers";

export class CollectionController {
  static async getAll(req: Request, res: Response) {
    try {
      const skip = req.query.skip ? parseInt(req.query.skip as string, 10) : 0;
      const take = req.query.take ? parseInt(req.query.take as string, 10) : 20;
      const records = await CollectionService.getAll(skip, take);
      res.json(records);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  }

  static async getById(req: Request, res: Response) {
    try {
      const record = await CollectionService.getById(requireString(req.params.id));
      if (!record) return res.status(404).json({ error: 'Not Found' });
      res.json(record);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  }

  static async create(req: Request, res: Response) {
    try {
      const parsed = createCollectionSchema.parse(req.body);
      const record = await CollectionService.create(parsed);
      res.status(201).json(record);
    } catch (e: any) { res.status(400).json({ error: e.message || 'Validation Error' }); }
  }

  static async update(req: Request, res: Response) {
    try {
      const parsed = updateCollectionSchema.parse(req.body);
      const record = await CollectionService.update(requireString(req.params.id), parsed);
      res.json(record);
    } catch (e: any) { res.status(400).json({ error: e.message || 'Validation Error' }); }
  }

  static async remove(req: Request, res: Response) {
    try {
      await CollectionService.remove(requireString(req.params.id));
      res.status(204).send();
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  }
}