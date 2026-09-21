import express from 'express';
import {
    registerOffice,
    getAllOffices,
    getMyOffice,
    updateMyOffice,
    updateOfficeStatus,
    getOfficeBySlug,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    getPublicOffices,
    getPublicPost,
    reportPost,
    toggleSubscription,
    checkSubscriptionStatus,
    generateReferralCode
} from '../controllers/legislativeController.js';
import { submitPublicCcsiProfile, validatePublicCcsiContact } from '../controllers/ccsiController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';
import { optionalAuthenticateToken } from '../middleware/optionalAuthMiddleware.js';

const router = express.Router();

// Registration (User)
router.post('/register', authenticateToken, registerOffice);

// User Management
router.get('/my-office', authenticateToken, getMyOffice);
router.post('/my-office/referral-code', authenticateToken, generateReferralCode);
router.put('/my-office', authenticateToken, updateMyOffice);
router.post('/posts', authenticateToken, createBlogPost);
router.put('/posts/:id', authenticateToken, updateBlogPost);
router.delete('/posts/:id', authenticateToken, deleteBlogPost);

// Admin Management
router.get('/admin/all', authenticateToken, authorizeAdmin, getAllOffices);
router.patch('/admin/:id/status', authenticateToken, authorizeAdmin, updateOfficeStatus);

// Public View
router.get('/public/list', getPublicOffices);
router.get('/public/post/:id', getPublicPost);
router.post('/public/posts/report', authenticateToken, reportPost); // Report Post
router.get('/public/:slug', getOfficeBySlug);

// Public Subscriptions
router.get('/public/:slug/subscribe', authenticateToken, checkSubscriptionStatus);
router.post('/public/:slug/subscribe', authenticateToken, toggleSubscription);

// Public CCSI Registration
router.post('/public/ccsi', optionalAuthenticateToken, submitPublicCcsiProfile); // General Intake
router.post('/public/:slug/ccsi', optionalAuthenticateToken, submitPublicCcsiProfile); // Constituency Linked
router.post('/public/ccsi/validate', validatePublicCcsiContact); // General Intake Validate
router.post('/public/:slug/ccsi/validate', validatePublicCcsiContact); // Constituency Linked Validate

export default router;
