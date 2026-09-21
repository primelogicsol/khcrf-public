import express from 'express';
import {
    submitMembership,
    getMyMembership,
    getAllMemberships,
    updateMembershipStatus,
    getMemberById
} from '../controllers/membershipController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requirePermission } from '../middleware/rbacMiddleware.js';
import { PERMISSIONS } from '../config/permissions.js';

const router = express.Router();

// Public user routes
router.post('/', authenticateToken, submitMembership);
router.get('/my-membership', authenticateToken, getMyMembership);

// Admin / Moderator routes
router.get('/', authenticateToken, requirePermission(PERMISSIONS.MEMBERSHIP_VIEW), getAllMemberships);
router.put('/:id/status', authenticateToken, requirePermission(PERMISSIONS.MEMBERSHIP_APPROVE), updateMembershipStatus);
router.get('/:id', authenticateToken, requirePermission(PERMISSIONS.MEMBERSHIP_VIEW), getMemberById);

export default router;
