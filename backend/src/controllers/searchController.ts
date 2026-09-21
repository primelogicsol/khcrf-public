import { Request, Response } from 'express';
import { SearchService } from '../services/searchService';

export class SearchController {
  static async globalSearch(req: Request, res: Response) {
    try {
      const query = req.query.q as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      
      const results = await SearchService.globalSearch(query, limit);
      return res.json(results);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error during search' });
    }
  }
  static async discoverySearch(req: Request, res: Response) {
    try {
      const filters = {
        q: req.query.q as string,
        entityTypes: req.query.entityTypes ? (req.query.entityTypes as string).split(',') : undefined,
        verificationStatus: req.query.verificationStatus ? (req.query.verificationStatus as string).split(',') : undefined,
        visibility: req.query.visibility ? (req.query.visibility as string).split(',') : undefined,
        lifecycle: req.query.lifecycle ? (req.query.lifecycle as string).split(',') : undefined,
        tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
      };

      const skip = req.query.skip ? parseInt(req.query.skip as string, 10) : 0;
      const take = req.query.take ? parseInt(req.query.take as string, 10) : 20;
      
      const results = await SearchService.discoverySearch(filters, skip, take);
      return res.json(results);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error during discovery search' });
    }
  }
}
