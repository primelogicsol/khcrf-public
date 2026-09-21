import express from 'express';
import { 
    getAllMembers,
    getPublicMembers,
    createMember,
    updateMember,
    createApplication,
    getAllApplications,
    updateApplicationStatus
} from '../controllers/skcAdvisoryController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/members/public', getPublicMembers);
router.post('/apply', createApplication);

// Admin routes for Members
router.get('/members', authenticateToken, authorizeAdmin, getAllMembers);
router.post('/members', authenticateToken, authorizeAdmin, createMember);
router.put('/members/:id', authenticateToken, authorizeAdmin, updateMember);

// Admin routes for Applications
router.get('/applications', authenticateToken, authorizeAdmin, getAllApplications);
router.put('/applications/:id', authenticateToken, authorizeAdmin, updateApplicationStatus);

export default router;
