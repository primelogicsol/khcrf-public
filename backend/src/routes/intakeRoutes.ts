import { Router } from 'express';
import { submitIntake, getMySubmissions, getAdminIntakeQueue, updateIntakeStatus, deleteIntakeSubmission, checkDuplicateSubmission, trackSubmission } from '../controllers/intakeController.js';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';
import { optionalAuthenticateToken } from '../middleware/optionalAuthMiddleware.js';

const INTAKE_ADMIN_ROLES = ['ADMIN', 'MODERATOR_EBOOKS'];

const router = Router();

// Public routes
router.post('/submit', optionalAuthenticateToken, submitIntake);
router.get('/check-duplicate', checkDuplicateSubmission);
router.get('/track/:trackingId', trackSubmission);

// Authenticated user routes
router.get('/my-submissions', authenticateToken, getMySubmissions);

// Admin-only routes (require ADMIN or MODERATOR role)
router.get('/admin/queue', authenticateToken, authorizeRole(INTAKE_ADMIN_ROLES), getAdminIntakeQueue);
router.put('/admin/:id/status', authenticateToken, authorizeRole(INTAKE_ADMIN_ROLES), updateIntakeStatus);
router.delete('/admin/:id', authenticateToken, authorizeRole(INTAKE_ADMIN_ROLES), deleteIntakeSubmission);

export default router;
