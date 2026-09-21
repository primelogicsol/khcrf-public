
import express from 'express';
import {
    submitGrantApplication,
    getMyGrantApplications,
    getAllGrantApplications,
    getGrantApplicationById,
    updateGrantStatus,
    deleteGrant
} from '../controllers/grantController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public/Protected Routes (User Side)
router.post('/submit', authenticateToken, submitGrantApplication);
router.get('/my-grants', authenticateToken, getMyGrantApplications);

// Admin Routes
router.get('/all', authenticateToken, authorizeAdmin, getAllGrantApplications);
router.put('/:id/status', authenticateToken, authorizeAdmin, updateGrantStatus);

// Common Route (Admin only - applicants use /my-grants)
router.get('/:id', authenticateToken, authorizeAdmin, getGrantApplicationById);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteGrant);

export default router;
