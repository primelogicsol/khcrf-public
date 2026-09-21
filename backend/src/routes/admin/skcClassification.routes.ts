import express from 'express';
import { skcClassificationController } from '../../controllers/skcClassification.controller';

const router = express.Router();

/**
 * All routes require authenticateToken + authorizeAdmin to be applied by the parent router (adminRoutes.ts).
 * This file registers only the endpoints — auth middleware is not repeated here to avoid double-application.
 *
 * Full public paths (relative to app base):
 *   GET   /api/admin/skc/classification/queue
 *   POST  /api/admin/skc/classification/preview
 *   PATCH /api/admin/skc/classification
 *   GET   /api/admin/skc/classification/history
 */

router.get('/queue',   skcClassificationController.getQueue);
router.post('/preview', skcClassificationController.preview);
router.patch('/',       skcClassificationController.submit);
router.get('/history',  skcClassificationController.getHistory);

export default router;
