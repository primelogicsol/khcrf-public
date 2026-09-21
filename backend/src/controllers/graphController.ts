import { Request, Response } from 'express';
import { GraphService } from '../services/graphService';
import { requireString } from "../utils/routeHelpers";

export class GraphController {
  static async getEgoGraph(req: Request, res: Response) {
    try {
      const centerId = requireString(req.params.id);
      const depth = req.query.depth ? parseInt(String(req.query.depth), 10) : 1;
      
      const graph = await GraphService.getEgoGraph(centerId, depth);
      return res.json(graph);
    } catch (error: any) {
      console.error(error);
      if (error.message === 'Central entity not found') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
