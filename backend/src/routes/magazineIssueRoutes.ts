import { Router } from 'express';
import {
  getMagazineIssues,
  getAdminMagazineIssues,
  getMagazineIssueBySlug,
  checkIssueAccess,
  getIssueReaderContent,
  createMagazineIssue,
  updateMagazineIssue,
  publishMagazineIssue,
  archiveMagazineIssue,
  submitMagazineIssueForReview,
  duplicateMagazineIssue,
  deleteMagazineIssue,
} from '../controllers/magazineIssueController.js';
import {
  authenticateToken,
  authorizeAdmin,
} from '../middleware/authMiddleware.js';
import { requirePermission } from '../middleware/rbacMiddleware.js';
import { PERMISSIONS } from '../config/permissions.js';
import { optionalAuthenticateToken as optionalAuth } from '../middleware/optionalAuthMiddleware.js';


const router = Router();

// ── Public read ───────────────────────────────────────────────────────────────
// GET /api/magazine-issues                   — Published + non-hidden
// GET /api/magazine-issues/admin             — All (admin)
// GET /api/magazine-issues/:slug             — Issue detail (visibility enforced)
// GET /api/magazine-issues/:slug/access      — Membership access check
// GET /api/magazine-issues/:slug/read        — Deliver reader asset (auth enforced)

router.get('/',                getMagazineIssues);
router.get('/admin',           authenticateToken, requirePermission(PERMISSIONS.MAGAZINE_VIEW), getAdminMagazineIssues);
router.get('/:slug/access',    optionalAuth,  checkIssueAccess);
router.get('/:slug/read',      optionalAuth,  getIssueReaderContent);
router.get('/:slug',           optionalAuth,  getMagazineIssueBySlug);

// ── Admin lifecycle (POST for state transitions per REST resource semantics) ──
// POST /api/magazine-issues                  — Create (starts as DRAFT)
// PATCH /api/magazine-issues/:id             — Partial update any field
// POST  /api/magazine-issues/:id/review      — DRAFT → REVIEW
// POST  /api/magazine-issues/:id/publish     — REVIEW/DRAFT/SCHEDULED → PUBLISHED
// POST  /api/magazine-issues/:id/archive     — PUBLISHED → ARCHIVED
// POST  /api/magazine-issues/:id/duplicate   — Clone → new DRAFT
// DELETE /api/magazine-issues/:id            — Hard delete

router.post('/',                      authenticateToken, requirePermission(PERMISSIONS.MAGAZINE_CREATE), createMagazineIssue);
router.patch('/:id',                  authenticateToken, requirePermission(PERMISSIONS.MAGAZINE_EDIT), updateMagazineIssue);
router.post('/:id/review',            authenticateToken, requirePermission(PERMISSIONS.MAGAZINE_REVIEW), submitMagazineIssueForReview);
router.post('/:id/publish',           authenticateToken, requirePermission(PERMISSIONS.MAGAZINE_PUBLISH), publishMagazineIssue);
router.post('/:id/archive',           authenticateToken, requirePermission(PERMISSIONS.MAGAZINE_ARCHIVE), archiveMagazineIssue);
router.post('/:id/duplicate',         authenticateToken, requirePermission(PERMISSIONS.MAGAZINE_CREATE), duplicateMagazineIssue);
router.delete('/:id',                 authenticateToken, requirePermission(PERMISSIONS.MAGAZINE_DELETE), deleteMagazineIssue);

export default router;
