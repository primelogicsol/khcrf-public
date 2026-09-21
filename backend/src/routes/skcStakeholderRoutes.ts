import express from 'express';
import { 
    registerStakeholder, 
    getStakeholdersAdmin, 
    updateStakeholderStatus,
    getStakeholdersStatsPublic,
    getStakeholdersPublic,
    getStakeholderByReference,
    getRegistrationStatusForUser,
    recoverReferenceByEmail
} from '../controllers/skcStakeholderController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route for registry submission
router.get('/stats', getStakeholdersStatsPublic);
router.get('/public', getStakeholdersPublic);
router.get('/registration-status', authenticateToken, getRegistrationStatusForUser);
router.get('/reference/:referenceNumber', getStakeholderByReference);
router.post('/register', registerStakeholder);
router.post('/recover-reference', recoverReferenceByEmail);

// Admin routes for managing registry
router.get('/', authenticateToken, authorizeAdmin, getStakeholdersAdmin);
router.put('/:id', authenticateToken, authorizeAdmin, updateStakeholderStatus);

export default router;
