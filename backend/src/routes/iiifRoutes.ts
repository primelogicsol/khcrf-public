import { Router } from 'express';
import { IIIFController } from '../controllers/iiifController';

const router = Router();

// Public IIIF endpoint for interoperability with museum software
router.get('/:id/manifest.json', IIIFController.getManifest);

export default router;
