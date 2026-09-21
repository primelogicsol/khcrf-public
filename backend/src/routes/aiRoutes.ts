import { Router } from 'express';
import { AIController } from '../controllers/aiController';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';

const router = Router();

// Only Admins or Editors can utilize AI analysis endpoints
router.post('/analyze', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), AIController.analyzeText);

export default router;
