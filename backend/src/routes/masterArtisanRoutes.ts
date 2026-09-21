import express from 'express';
import { MasterArtisanController } from '../controllers/masterArtisanController';
import { MasterArtisanStoryController } from '../controllers/masterArtisanStoryController';
import { MasterArtisanSeriesController } from '../controllers/masterArtisanSeriesController';
import { MasterArtisanFeatureController } from '../controllers/masterArtisanFeatureController';
import { MasterArtisanIssueController } from '../controllers/masterArtisanIssueController';
import { authenticateToken, authorizeRole, authorizeAdmin } from '../middleware/authMiddleware';
const router = express.Router();

// Issues (Publications) - Public
router.get('/issues', MasterArtisanController.getIssues);
router.get('/issues/:slug', MasterArtisanController.getIssueBySlug);

// MasterArtisanController routes are moved to the bottom of public routes// Discover - TODO: implement MasterArtisanDiscoverController
// router.get('/discover', MasterArtisanDiscoverController.getDiscoverPayload);


// Stories - Public
router.get('/editorial-stories', MasterArtisanStoryController.getPublicStories);
router.get('/editorial-stories/:slug', MasterArtisanStoryController.getPublicStoryBySlug);

// Series - Public
router.get('/editorial-series', MasterArtisanSeriesController.getPublicSeries);
router.get('/editorial-series/:slug', MasterArtisanSeriesController.getPublicSeriesBySlug);

// Features - Public
router.get('/featured', MasterArtisanFeatureController.getActiveFeature);

// Artisans - Public
router.get('/stats', MasterArtisanController.getStats);
router.get('/', MasterArtisanController.getAll);
router.get('/:slug', MasterArtisanController.getBySlug);

// Admin - Stories
router.get('/admin/stories', authenticateToken, authorizeAdmin, MasterArtisanStoryController.getAllAdmin);
router.get('/admin/stories/:id', authenticateToken, authorizeAdmin, MasterArtisanStoryController.getAdminById);
router.post('/admin/stories', authenticateToken, authorizeAdmin, MasterArtisanStoryController.create);
router.patch('/admin/stories/:id', authenticateToken, authorizeAdmin, MasterArtisanStoryController.update);
router.post('/admin/stories/:id/archive', authenticateToken, authorizeAdmin, MasterArtisanStoryController.archive);

// Admin - Series
router.get('/admin/editorial-series', authenticateToken, authorizeAdmin, MasterArtisanSeriesController.getAllAdmin);
router.get('/admin/editorial-series/:id', authenticateToken, authorizeAdmin, MasterArtisanSeriesController.getAdminById);
router.post('/admin/editorial-series', authenticateToken, authorizeAdmin, MasterArtisanSeriesController.create);
router.patch('/admin/editorial-series/:id', authenticateToken, authorizeAdmin, MasterArtisanSeriesController.update);
router.post('/admin/editorial-series/:id/archive', authenticateToken, authorizeAdmin, MasterArtisanSeriesController.archive);
router.post('/admin/editorial-series/:id/stories', authenticateToken, authorizeAdmin, MasterArtisanSeriesController.addStory);
router.delete('/admin/editorial-series/:id/stories/:storyId', authenticateToken, authorizeAdmin, MasterArtisanSeriesController.removeStory);
router.patch('/admin/editorial-series/:id/stories/reorder', authenticateToken, authorizeAdmin, MasterArtisanSeriesController.reorderStories);

// Admin - Features
router.get('/admin/features', authenticateToken, authorizeAdmin, MasterArtisanFeatureController.getAllAdmin);
router.get('/admin/features/:id', authenticateToken, authorizeAdmin, MasterArtisanFeatureController.getAdminById);
router.post('/admin/features', authenticateToken, authorizeAdmin, MasterArtisanFeatureController.create);
router.patch('/admin/features/:id', authenticateToken, authorizeAdmin, MasterArtisanFeatureController.update);
router.post('/admin/features/:id/expire', authenticateToken, authorizeAdmin, MasterArtisanFeatureController.expire);

// Admin - Issues
router.get('/admin/issues/:issueId/stories', authenticateToken, authorizeAdmin, MasterArtisanIssueController.getStories);
router.post('/admin/issues/:issueId/stories', authenticateToken, authorizeAdmin, MasterArtisanIssueController.addStory);
router.delete('/admin/issues/:issueId/stories/:storyId', authenticateToken, authorizeAdmin, MasterArtisanIssueController.removeStory);
router.patch('/admin/issues/:issueId/stories/reorder', authenticateToken, authorizeAdmin, MasterArtisanIssueController.reorderStories);
router.patch('/admin/issues/:issueId/cover-story', authenticateToken, authorizeAdmin, MasterArtisanIssueController.setCoverStory);

// Public Submissions
router.post('/nominations', MasterArtisanController.submitNomination);
router.post('/stories', MasterArtisanController.submitStory);
router.post('/contributors', MasterArtisanController.submitContributor);
router.post('/documentation', MasterArtisanController.submitDocumentation);

export default router;
