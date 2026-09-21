import express from 'express';
import { 
    getInstitutionsAdmin, 
    createInstitution, 
    updateInstitution, 
    deleteInstitution, 
    getInstitutionsPublic,
    registerInstitution,
    getRegistrationsAdmin,
    updateRegistrationStatus,
    getInstitutionRegistrationByReference
} from '../controllers/skcInstitutionController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ── Public routes ────────────────────────────────────────────────────────────
router.get('/public', getInstitutionsPublic);
router.get('/reference/:referenceNumber', getInstitutionRegistrationByReference);
router.post('/register', registerInstitution);          // Public registration form

// ── Admin: Registrations (applications queue) ────────────────────────────────
router.get('/registrations', authenticateToken, authorizeAdmin, getRegistrationsAdmin);
router.put('/registrations/:id', authenticateToken, authorizeAdmin, updateRegistrationStatus);

// ── Admin: Verified institution directory ────────────────────────────────────
router.get('/', authenticateToken, authorizeAdmin, getInstitutionsAdmin);
router.post('/', authenticateToken, authorizeAdmin, createInstitution);
router.put('/:id', authenticateToken, authorizeAdmin, updateInstitution);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteInstitution);

export default router;
