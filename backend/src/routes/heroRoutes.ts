import express from 'express';
import {
    getHeroConfig,
    getAdminHeroConfigs,
    createHeroConfig,
    updateHeroConfig,
    publishHeroConfig,
    addSlide,
    updateSlide,
    deleteSlide,
    trackHeroAnalytics
} from '../controllers/heroController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public delivery
router.get('/public/:pageKey', getHeroConfig);

// Public analytics
router.post('/analytics', trackHeroAnalytics);

// Admin Configuration
router.get('/admin/configs', authenticateToken, authorizeAdmin, getAdminHeroConfigs);
router.post('/admin/configs', authenticateToken, authorizeAdmin, createHeroConfig);
router.put('/admin/configs/:id', authenticateToken, authorizeAdmin, updateHeroConfig);
router.post('/admin/configs/:id/publish', authenticateToken, authorizeAdmin, publishHeroConfig);

// Admin Slides
router.post('/admin/slides', authenticateToken, authorizeAdmin, addSlide);
router.put('/admin/slides/:id', authenticateToken, authorizeAdmin, updateSlide);
router.delete('/admin/slides/:id', authenticateToken, authorizeAdmin, deleteSlide);

export default router;
