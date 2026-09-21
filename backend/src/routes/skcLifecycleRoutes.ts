import express from 'express';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';
import {
  getLifecycle,
  getAuditHistory,
  createLifecycleStage,
  updateLifecycleStage,
  deleteLifecycleStage,
  reorderStages
} from '../controllers/skcLifecycleController.js';

const router = express.Router();

// Public / general endpoints
router.get('/state-of-kashmir-crafts/assessment-cycles/2026/lifecycle', getLifecycle);
router.get('/state-of-kashmir-crafts/assessment-cycles/2026/lifecycle/audit-history', getAuditHistory);

// Admin-protected lifecycle management endpoints
router.post('/admin/skc/assessment-cycles/2026/lifecycle', authenticateToken, authorizeAdmin, createLifecycleStage);
router.patch('/admin/skc/lifecycle/:stageId', authenticateToken, authorizeAdmin, updateLifecycleStage);
router.delete('/admin/skc/lifecycle/:stageId', authenticateToken, authorizeAdmin, deleteLifecycleStage);
router.post('/admin/skc/lifecycle/reorder', authenticateToken, authorizeAdmin, reorderStages);

export default router;
