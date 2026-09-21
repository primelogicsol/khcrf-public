import { Router } from 'express';
import { 
  getAllPublications, 
  getPublication, 
  getPublicationById, 
  getMyLibrary, 
  toggleBookmark, 
  checkAccess, 
  seedPublications, 
  createPublication, 
  updatePublication, 
  deletePublication, 
  getPublicationStats, 
  submitPublicationReview, 
  getPublicationReviews, 
  voteHelpfulReview,
  voteRecommendReview,
  reportReviewConcern,
  getAdminReviewsQueue,
  updateReviewStatus,
  getMyContributorPublications,
  getContributorBooks,
  updateContributorBookStatus,
  approvePublication,
  publishPublication,
  schedulePublication,
  cancelSchedulePublication,
  getPublicationContent,
  getCitationsForPublication,
  createOrUpsertCitation,
  deleteCitation
} from '../controllers/publicationController.js';
import { createChapter, updateChapter, deleteChapter, getChapters, createPage, updatePage, deletePage, bulkUploadPublications, reorderChapters, approveTOC, initializeManuscript } from '../controllers/publicationContentController.js';
import { createCategory, getAllCategories, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';
import { optionalAuthenticateToken } from '../middleware/optionalAuthMiddleware.js';
import { publicContentLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Public Routes
router.get('/stats', publicContentLimiter, getPublicationStats);
router.get('/', publicContentLimiter, getAllPublications);
router.get('/details/:slug', publicContentLimiter, getPublication);
router.get('/:publicationId/citations', publicContentLimiter, getCitationsForPublication);

// Protected Routes
router.get('/my-library', authenticateToken, getMyLibrary);
router.post('/my-library/toggle', authenticateToken, toggleBookmark);
router.get('/access/:slug', optionalAuthenticateToken, checkAccess);
router.get('/content/:slug', authenticateToken, getPublicationContent);
router.post('/:publicationId/citations', authenticateToken, authorizeRole(['MODERATOR_EBOOKS']), createOrUpsertCitation);
router.delete('/citations/:id', authenticateToken, authorizeRole(['MODERATOR_EBOOKS']), deleteCitation);

// Contributor Routes
router.get('/my', authenticateToken, getMyContributorPublications);

// Admin Contributor Book Routes
router.get('/contributor-books', authenticateToken, authorizeRole(['MODERATOR_EBOOKS']), getContributorBooks);
router.put('/:id/contributor-status', authenticateToken, authorizeRole(['MODERATOR_EBOOKS']), updateContributorBookStatus);

// Category Routes
router.get('/categories', publicContentLimiter, getAllCategories);
router.post('/categories', authenticateToken, authorizeRole(['MODERATOR_EBOOKS']), createCategory);
router.put('/categories/:id', authenticateToken, authorizeRole(['MODERATOR_EBOOKS']), updateCategory);
router.delete('/categories/:id', authenticateToken, authorizeRole(['MODERATOR_EBOOKS']), deleteCategory);

// CRUD Routes
router.post('/', authenticateToken, authorizeRole(['MODERATOR_EBOOKS']), createPublication);
router.get('/:id', publicContentLimiter, getPublicationById);
router.put('/:id', authenticateToken, authorizeRole(['MODERATOR_EBOOKS']), updatePublication);
router.patch('/:id/approve', authenticateToken, authorizeRole(['MODERATOR_EBOOKS']), approvePublication);
router.patch('/:id/publish', authenticateToken, authorizeRole(['MODERATOR_EBOOKS']), publishPublication);
router.patch('/:id/schedule', authenticateToken, authorizeRole(['MODERATOR_EBOOKS']), schedulePublication);
router.patch('/:id/cancel-schedule', authenticateToken, authorizeRole(['MODERATOR_EBOOKS']), cancelSchedulePublication);
router.delete('/:id', authenticateToken, authorizeRole(['MODERATOR_EBOOKS']), deletePublication);

// Review Routes
router.post('/:id/reviews', optionalAuthenticateToken, submitPublicationReview);
router.get('/:id/reviews', publicContentLimiter, getPublicationReviews);
router.post('/reviews/:reviewId/helpful', voteHelpfulReview);
router.post('/reviews/:reviewId/recommend', voteRecommendReview);
router.post('/reviews/:reviewId/report', reportReviewConcern);
router.get('/reviews/admin/queue', authenticateToken, authorizeRole(['MODERATOR_EBOOKS']), getAdminReviewsQueue);
router.put('/reviews/admin/:reviewId/status', authenticateToken, authorizeRole(['MODERATOR_EBOOKS']), updateReviewStatus);

// Chapter Routes
router.get('/:publicationId/chapters', getChapters);
router.post('/:publicationId/manuscript/initialize', authenticateToken, authorizeRole(['MODERATOR_EBOOKS']), initializeManuscript);
router.post('/chapters', authenticateToken, authorizeRole(['MODERATOR_EBOOKS']), createChapter);
router.put('/chapters/:id', authenticateToken, authorizeRole(['MODERATOR_EBOOKS']), updateChapter);
router.delete('/chapters/:id', authenticateToken, authorizeRole(['MODERATOR_EBOOKS']), deleteChapter);
router.patch('/:publicationId/chapters/reorder', authenticateToken, authorizeRole(['MODERATOR_EBOOKS']), reorderChapters);
router.post('/:publicationId/toc/approve', authenticateToken, authorizeRole(['MODERATOR_EBOOKS']), approveTOC);

// Peer Review Routes
import { assignReviewer, getChapterReviews, submitReviewDecision, getEditorialAuditLog } from '../controllers/peerReviewController.js';
router.get('/:publicationId/reviews', authenticateToken, authorizeRole(['MODERATOR_EBOOKS']), getChapterReviews);
router.post('/chapters/:chapterId/reviews', authenticateToken, authorizeRole(['MODERATOR_EBOOKS']), assignReviewer);
router.patch('/reviews/:reviewId/decision', authenticateToken, authorizeRole(['MODERATOR_EBOOKS']), submitReviewDecision);
router.get('/:publicationId/audit-log', authenticateToken, authorizeRole(['MODERATOR_EBOOKS']), getEditorialAuditLog);

// Page Routes
router.post('/pages', authenticateToken, authorizeRole(['MODERATOR_EBOOKS']), createPage);
router.put('/pages/:id', authenticateToken, authorizeRole(['MODERATOR_EBOOKS']), updatePage);
router.delete('/pages/:id', authenticateToken, authorizeRole(['MODERATOR_EBOOKS']), deletePage);

// Bulk Upload
router.post('/bulk-upload', authenticateToken, authorizeRole(['MODERATOR_EBOOKS']), bulkUploadPublications);

export default router;

