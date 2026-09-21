import { Router } from 'express';
import {
  getPublicMessages,
  getPublicStats,
  getPublicCategories,
  getMessageBySlug,
  validateToken,
  submitMessage,
  requestInvitation,
  checkSession
} from '../controllers/skcOfficialMessageController';

const router = Router();

// Public read endpoints
router.get('/stats', getPublicStats);
router.get('/categories', getPublicCategories);

// Invitation flow
router.get('/session', checkSession);              // check active session cookie
router.post('/invitations/verify', validateToken); // verify code → set cookie
router.post('/invitation-requests', requestInvitation);
router.post('/submit', submitMessage);             // submit message (requires cookie)

// Public listing
router.get('/', getPublicMessages);

// Must be last (slug catch-all)
router.get('/:slug', getMessageBySlug);

export default router;
