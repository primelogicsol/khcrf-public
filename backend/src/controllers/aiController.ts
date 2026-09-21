import { Request, Response } from 'express';
import { AIService } from '../services/aiService';

export class AIController {
  static async analyzeText(req: Request, res: Response) {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'Text is required for analysis' });
      }

      const metadata = await AIService.generateMetadata(text);
      const classification = await AIService.classifyEntityType(text);
      
      return res.json({
        metadata,
        classification
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to run AI analysis' });
    }
  }
}
