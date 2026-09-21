import express from 'express';
import {
    createPartnerApplication,
    getAllPartnerApplications,
    getMyPartnerApplications,
    updatePartner,
    getPublicPartners,
    getPartnerById,
    seedCanonicalPartners
} from '../controllers/partnerController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';
import { optionalAuthenticateToken } from '../middleware/optionalAuthMiddleware.js';

const router = express.Router();

// Public/Authenticated Routes (requires login — status defaults to PENDING for non-admins)
router.post('/', authenticateToken, createPartnerApplication);
router.get('/registry', getPublicPartners);
router.get('/seed-registry', seedCanonicalPartners); // Public registry list

// User Route
router.get('/my-applications', authenticateToken, getMyPartnerApplications);

// Admin Routes
router.get('/', authenticateToken, authorizeAdmin, getAllPartnerApplications);
router.get('/:id', authenticateToken, authorizeAdmin, getPartnerById); // Admin Detail View
router.put('/:id', authenticateToken, authorizeAdmin, updatePartner); // Admin Update (Status, Logo, etc.)

export default router;


