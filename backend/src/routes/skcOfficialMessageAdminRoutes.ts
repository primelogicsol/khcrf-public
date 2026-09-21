import { Router } from 'express';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware';
import {
  getStats,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getSettings,
  updateSettings,
  getInvitations,
  createInvitation,
  updateInvitation,
  deleteInvitation,
  resendInvitation,
  revokeInvitation,
  extendInvitation,
  copyInvitationLink,
  getMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
  transitionMessageWorkflow,
  toggleMessageFeature,
  getMessageRevisions,
  getMessageAuditLogs,
  getAccessRequests,
  approveAccessRequest,
  rejectAccessRequest,
} from '../controllers/skcOfficialMessageAdminController';

const router = Router();

// Apply auth middleware to all routes in this file
router.use(authenticateToken);
router.use(authorizeAdmin);

// Stats
router.get('/stats', getStats);

// Categories
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// Invitations – CRUD
router.get('/invitations', getInvitations);
router.post('/invitations', createInvitation);
router.put('/invitations/:id', updateInvitation);
router.delete('/invitations/:id', deleteInvitation);

// Invitations – workflow actions
router.patch('/invitations/:id/resend', resendInvitation);
router.patch('/invitations/:id/revoke', revokeInvitation);
router.patch('/invitations/:id/extend', extendInvitation);
router.get('/invitations/:id/link', copyInvitationLink);

// Messages – CRUD
router.get('/messages', getMessages);
router.post('/messages', createMessage);
router.get('/messages/:id', getMessageById);
router.put('/messages/:id', updateMessage);
router.delete('/messages/:id', deleteMessage);

// Messages – workflow transitions  PATCH /messages/:id/workflow  { action, reason? }
router.patch('/messages/:id/workflow', transitionMessageWorkflow);

// Messages – feature toggle  POST /messages/:id/feature
router.post('/messages/:id/feature', toggleMessageFeature);

// Revisions and Logs
router.get('/messages/:messageId/revisions', getMessageRevisions);
router.get('/messages/:messageId/audit-logs', getMessageAuditLogs);

// Access Requests
router.get('/access-requests', getAccessRequests);
router.patch('/access-requests/:id/approve', approveAccessRequest);
router.patch('/access-requests/:id/reject', rejectAccessRequest);

export default router;
