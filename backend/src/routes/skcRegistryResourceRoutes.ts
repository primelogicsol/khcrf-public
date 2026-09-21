import express from 'express';
import {
  getStakeholderRegistryResources,
  getStakeholderRegistryResourceBySlug,
  downloadStakeholderRegistryResource,
  adminGetRegistryResources,
  adminCreateRegistryResource,
  adminUpdateRegistryResource,
  adminDeleteRegistryResource,
  adminUploadResourceFile
} from '../controllers/skcRegistryResourceController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/cvUploadMiddleware.js';

const router = express.Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================
router.get('/', getStakeholderRegistryResources);
router.get('/:slug', getStakeholderRegistryResourceBySlug);
router.get('/:slug/download', downloadStakeholderRegistryResource);

// ==========================================
// ADMIN ROUTES (Protected)
// ==========================================
router.get('/admin/all', authenticateToken, authorizeAdmin, adminGetRegistryResources);
router.post('/admin/create', authenticateToken, authorizeAdmin, adminCreateRegistryResource);
router.put('/admin/update/:id', authenticateToken, authorizeAdmin, adminUpdateRegistryResource);
router.delete('/admin/delete/:id', authenticateToken, authorizeAdmin, adminDeleteRegistryResource);
router.post('/admin/upload', authenticateToken, authorizeAdmin, upload.single('file'), adminUploadResourceFile);

export default router;
