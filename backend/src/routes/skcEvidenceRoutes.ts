import express from 'express';
import { 
    getEvidenceMetrics, 
    searchPublicEvidence,
    getPublicEvidenceBySlug,
    submitEvidence,
    getAdminEvidence,
    getAdminEvidenceById,
    updateAdminEvidence,
    deleteAdminEvidence
} from '../controllers/skcEvidenceController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/public/metrics', getEvidenceMetrics);
router.get('/public/search', searchPublicEvidence);
router.get('/public/slug/:slug', getPublicEvidenceBySlug);
router.post('/public/submit', submitEvidence);

// Admin routes
router.get('/', authenticateToken, authorizeAdmin, getAdminEvidence);
router.get('/:id', authenticateToken, authorizeAdmin, getAdminEvidenceById);
router.put('/:id', authenticateToken, authorizeAdmin, updateAdminEvidence);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteAdminEvidence);

export default router;
