import express from 'express';
import { submitApplication, getMyApplications, getApplicationById, getAllApplications, updateStatus } from '../controllers/accreditationController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User Routes
router.post('/submit', authenticateToken, submitApplication);
router.get('/my-applications', authenticateToken, getMyApplications);

// Shared/Admin Routes
router.get('/all', authenticateToken, authorizeAdmin, getAllApplications);
router.get('/:id', authenticateToken, authorizeAdmin, getApplicationById);
router.put('/:id/status', authenticateToken, authorizeAdmin, updateStatus);

export default router;
