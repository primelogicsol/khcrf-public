import express from 'express';
import { MasterArtisanAdminController } from '../../controllers/admin/masterArtisanAdminController';
import { authenticateToken, authorizeRole } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Phase I: Authentication and Authorization
// All admin routes must be authenticated.
router.use(authenticateToken);

// Phase B: Overview
router.get(
  '/overview-stats',
  authorizeRole(['ADMIN', 'EDITOR_REVIEWER']),
  MasterArtisanAdminController.getOverview
);

// Phase C: Nominations
router.get('/nominations', authorizeRole(['ADMIN', 'EDITOR_REVIEWER']), MasterArtisanAdminController.getNominations);
router.patch('/nominations/:id/status', authorizeRole(['ADMIN', 'EDITOR_REVIEWER']), MasterArtisanAdminController.updateNominationStatus);

// Phase D: Registry
router.get('/registry', authorizeRole(['ADMIN', 'EDITOR_REVIEWER']), MasterArtisanAdminController.getRegistry);
router.post('/registry', authorizeRole(['ADMIN', 'EDITOR_REVIEWER']), MasterArtisanAdminController.createRegistryRecord);
router.put('/registry/:id', authorizeRole(['ADMIN', 'EDITOR_REVIEWER']), MasterArtisanAdminController.updateRegistryRecord);
router.patch('/registry/:id/verify', authorizeRole(['ADMIN', 'EDITOR_REVIEWER']), MasterArtisanAdminController.verifyRegistryRecord);
router.patch('/registry/:id/publish', authorizeRole(['ADMIN', 'EDITOR_REVIEWER']), MasterArtisanAdminController.publishRegistryRecord);
router.post('/registry/:id/evidence-requests', authorizeRole(['ADMIN', 'EDITOR_REVIEWER']), MasterArtisanAdminController.requestEvidence);
router.patch('/registry/:id/reject', authorizeRole(['ADMIN', 'EDITOR_REVIEWER']), MasterArtisanAdminController.rejectRegistryRecord);
router.post('/registry/:id/archive', authorizeRole(['ADMIN', 'EDITOR_REVIEWER']), MasterArtisanAdminController.archiveRegistryRecord);
router.post('/registry/:id/restore', authorizeRole(['ADMIN', 'EDITOR_REVIEWER']), MasterArtisanAdminController.restoreRegistryRecord);

// Phase E: Stories
router.get('/stories', authorizeRole(['ADMIN', 'EDITOR_REVIEWER']), MasterArtisanAdminController.getStories);
router.patch('/stories/:id/status', authorizeRole(['ADMIN', 'EDITOR_REVIEWER']), MasterArtisanAdminController.updateStoryStatus);

// Phase F: Contributors
router.get('/contributors', authorizeRole(['ADMIN', 'EDITOR_REVIEWER']), MasterArtisanAdminController.getContributors);
router.patch('/contributors/:id/status', authorizeRole(['ADMIN', 'EDITOR_REVIEWER']), MasterArtisanAdminController.updateContributorStatus);

// Phase G: Documentation Support
router.get('/documentation', authorizeRole(['ADMIN', 'EDITOR_REVIEWER']), MasterArtisanAdminController.getDocumentation);
router.patch('/documentation/:id/status', authorizeRole(['ADMIN', 'EDITOR_REVIEWER']), MasterArtisanAdminController.updateDocumentationStatus);

export default router;

