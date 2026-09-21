import express from 'express';
import {
    createApprenticeshipApplication,
    getAllApprenticeshipApplications,
    getMyApprenticeshipApplications,
    updateApprenticeshipStatus
} from '../controllers/apprenticeshipController.js';
import {
    getOpenings,
    createOpening,
    updateOpening,
    deleteOpening
} from '../controllers/apprenticeshipOpeningController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { optionalAuthenticateToken } from '../middleware/optionalAuthMiddleware.js';

const router = express.Router();

// --- Applications Routes ---

// Public Route (with optional auth)
router.post('/', optionalAuthenticateToken, createApprenticeshipApplication);

// User Route
router.get('/my-applications', authenticateToken, getMyApprenticeshipApplications);

// Admin Route (Applications)
router.get('/', authenticateToken, getAllApprenticeshipApplications);
router.patch('/:id/status', authenticateToken, updateApprenticeshipStatus);

// --- Openings Routes (Admin) ---
// TODO: Add proper role checks later, assuming /dashboard/hr access implies admin for now
router.get('/openings', getOpenings);
router.post('/openings', authenticateToken, createOpening);
router.put('/openings/:id', authenticateToken, updateOpening);
router.delete('/openings/:id', authenticateToken, deleteOpening);

export default router;
