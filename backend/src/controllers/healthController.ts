import { Request, Response } from 'express';
import { HealthService } from '../services/healthService';

export class HealthController {
  static async getKnowledgeHealth(req: Request, res: Response) {
    try {
      const data = await HealthService.getKnowledgeHealth();
      return res.json(data);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error evaluating knowledge health' });
    }
  }
}
