import express from 'express';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';
import * as adminController from '../controllers/adminController.js';
import skcClassificationRoutes from './admin/skcClassification.routes';

const router = express.Router();

// Office Management
router.get('/offices', authenticateToken, authorizeAdmin, adminController.getAllOffices);
router.put('/offices/blacklist', authenticateToken, authorizeAdmin, adminController.blacklistOffice);

// Report Management
router.get('/reports', authenticateToken, authorizeAdmin, adminController.getReportedPosts);
router.post('/reports/:reportId/resolve', authenticateToken, authorizeAdmin, adminController.resolveReport);

// Hidden Posts Management
router.get('/posts/hidden', authenticateToken, authorizeAdmin, adminController.getHiddenPosts);
router.post('/posts/restore', authenticateToken, authorizeAdmin, adminController.restorePost);

// Stats
router.get('/overview', authenticateToken, adminController.getDashboardStats);
router.get('/activity', authenticateToken, adminController.getRecentActivity);

// User Management
router.get('/users/:userId/history', authenticateToken, authorizeAdmin, adminController.getUserLoginHistory);

// Publication Management
router.get('/publications/template', authenticateToken, authorizeAdmin, adminController.getPublicationCSVTemplate);

// CCSI Profiles Management
router.get('/ccsi-profiles', authenticateToken, authorizeAdmin, adminController.getAllCcsiProfiles);
router.get('/ccsi-profiles/:id', authenticateToken, authorizeAdmin, adminController.getCcsiProfileById);
router.put('/ccsi-profiles/:id', authenticateToken, authorizeAdmin, adminController.updateCcsiProfile);
router.put('/ccsi-profiles/:id/status', authenticateToken, authorizeAdmin, adminController.updateCcsiProfileStatus);
router.delete('/ccsi-profiles/:id', authenticateToken, authorizeAdmin, adminController.deleteCcsiProfile);

// SKC Classification
router.use('/skc/classification', authenticateToken, authorizeAdmin, skcClassificationRoutes);

export default router;
