import express from 'express';
import {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    submitApplication,
    getApplications,
    getApplicationById,
    updateApplicationStatus
} from '../controllers/careerController';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// Public Routes
router.get('/jobs', getJobs);
router.get('/jobs/:id', getJobById);
router.post('/apply', submitApplication);

// Admin Routes
router.post('/jobs', authenticateToken, authorizeAdmin, createJob);
router.put('/jobs/:id', authenticateToken, authorizeAdmin, updateJob);
router.delete('/jobs/:id', authenticateToken, authorizeAdmin, deleteJob);

router.get('/applications', authenticateToken, authorizeAdmin, getApplications);
router.get('/applications/:id', authenticateToken, authorizeAdmin, getApplicationById);
router.put('/applications/:id/status', authenticateToken, authorizeAdmin, updateApplicationStatus);

export default router;
