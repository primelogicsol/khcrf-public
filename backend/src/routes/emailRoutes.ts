import express from 'express';
import { sendEmail, getTemplates } from '../controllers/emailController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected route - only Authenticated users/admins should trigger emails via API ideally
// But specific use cases might differ. For now, protecting it.
router.post('/send', authenticateToken, authorizeAdmin, sendEmail);
router.get('/templates', authenticateToken, authorizeAdmin, getTemplates);

export default router;
