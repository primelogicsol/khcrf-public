import { Request, Response } from 'express';
import { IIIFService } from '../services/iiifService';
import { requireString } from "../utils/routeHelpers";

export class IIIFController {
  static async getManifest(req: Request, res: Response) {
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const manifest = await IIIFService.generateManifest(requireString(req.params.id), baseUrl);
      
      // IIIF standards recommend specific content type
      res.setHeader('Content-Type', 'application/ld+json;profile="http://iiif.io/api/presentation/3/context.json"');
      res.json(manifest);
    } catch (error: any) {
      console.error('IIIF Manifest Error:', error);
      res.status(404).json({ error: error.message || 'Manifest generation failed' });
    }
  }
}
