import { Router } from 'express';
import { 
    createApplication, 
    getMyApplications, 
    getApplicationById, 
    getAllApplications, 
    updateApplicationStatus 
} from '../controllers/cceController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Public / User Routes
router.post('/apply', authenticateToken, createApplication);
router.get('/my-applications', authenticateToken, getMyApplications);
router.get('/:id', authenticateToken, getApplicationById);

// Admin Routes
router.get('/', authenticateToken, authorizeAdmin, getAllApplications);
router.patch('/:id/status', authenticateToken, authorizeAdmin, updateApplicationStatus);

export default router;
