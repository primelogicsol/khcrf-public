import express from 'express';
import { 
    getHearingsAdmin, 
    createHearing, 
    updateHearing, 
    deleteHearing, 
    getHearingsPublic,
    getHearingBySlugPublic,
    registerForHearing,
    submitTestimony,
    subscribeToHearingNotifications,
    verifySubscription,
    getHearingSubscribersAdmin,
    updateHearingSubscriberStatusAdmin,
    getSubscriberCountForHearing,
    sendHearingNotification,
    getHearingAccess
} from '../controllers/skcHearingController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/public', getHearingsPublic);
router.get('/public/:slug', getHearingBySlugPublic);
router.post('/public/:id/register', registerForHearing);
router.post('/public/:id/testimony', submitTestimony);
router.get('/public/:id/access', authenticateToken, getHearingAccess);

// Subscription routes
router.post('/subscribe', subscribeToHearingNotifications);
router.post('/subscribe/verify/:token', verifySubscription);

// Admin routes - Hearings
router.get('/', authenticateToken, authorizeAdmin, getHearingsAdmin);
router.post('/', authenticateToken, authorizeAdmin, createHearing);
router.put('/:id', authenticateToken, authorizeAdmin, updateHearing);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteHearing);

// Admin routes - Subscriptions
router.get('/subscribers', authenticateToken, authorizeAdmin, getHearingSubscribersAdmin);
router.put('/subscribers/:id/status', authenticateToken, authorizeAdmin, updateHearingSubscriberStatusAdmin);
router.get('/:id/subscribers/count', authenticateToken, authorizeAdmin, getSubscriberCountForHearing);
router.post('/:id/notifications/send', authenticateToken, authorizeAdmin, sendHearingNotification);

export default router;
