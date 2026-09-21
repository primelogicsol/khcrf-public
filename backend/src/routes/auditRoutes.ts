import express from 'express';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';
import { getDashboardAuditLogs } from '../controllers/auditController.js';

const router = express.Router();

router.get('/', authenticateToken, authorizeAdmin, getDashboardAuditLogs);

export default router;
