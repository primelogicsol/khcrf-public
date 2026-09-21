import express from 'express';
import { getAllUsers, getUserSidebarStats, updateUserRole, impersonateUser, stopImpersonation, updateUser, deleteUser, trashUser, restoreUser, updateUserStatus } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requirePermission } from '../middleware/rbacMiddleware.js';
import { PERMISSIONS } from '../config/permissions.js';

const router = express.Router();

router.get('/', authenticateToken, requirePermission(PERMISSIONS.USERS_VIEW), getAllUsers);
router.put('/:id', authenticateToken, requirePermission(PERMISSIONS.USERS_MANAGE), updateUser);
router.put('/:id/status', authenticateToken, requirePermission(PERMISSIONS.USERS_MANAGE), updateUserStatus);
router.put('/:id/trash', authenticateToken, requirePermission(PERMISSIONS.USERS_MANAGE), trashUser);
router.put('/:id/restore', authenticateToken, requirePermission(PERMISSIONS.USERS_MANAGE), restoreUser);
router.delete('/:id', authenticateToken, requirePermission(PERMISSIONS.USERS_MANAGE), deleteUser);
router.put('/:id/role', authenticateToken, requirePermission(PERMISSIONS.ROLES_ASSIGN), updateUserRole);
router.get('/sidebar-stats', authenticateToken, getUserSidebarStats);
router.post('/impersonate/:id', authenticateToken, requirePermission(PERMISSIONS.USERS_MANAGE), impersonateUser);
router.post('/stop-impersonation', authenticateToken, stopImpersonation);

export default router;
