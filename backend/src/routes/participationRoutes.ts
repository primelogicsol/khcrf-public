import { Router } from 'express';
import { ParticipationController } from '../controllers/participationController';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';

const PARTICIPATION_ADMIN_ROLES = ['ADMIN', 'MODERATOR_EBOOKS'];

const router = Router();

// Public Submission Routes (No Auth Required)
router.post('/nominate', ParticipationController.submitNomination);
router.post('/story', ParticipationController.submitStory);
router.post('/contributor', ParticipationController.submitContributor);
router.post('/documentation', ParticipationController.submitDocumentation);

// CMS Admin & User Profile Routes (Auth + Role Required)
router.get('/my-submissions', authenticateToken, ParticipationController.getMySubmissions);

// Nominations — Admin only
router.get('/nominate', authenticateToken, authorizeRole(PARTICIPATION_ADMIN_ROLES), ParticipationController.getNominations);
router.patch('/nominate/:id', authenticateToken, authorizeRole(PARTICIPATION_ADMIN_ROLES), ParticipationController.reviewNomination);

// Stories — Admin only
router.get('/story', authenticateToken, authorizeRole(PARTICIPATION_ADMIN_ROLES), ParticipationController.getStories);
router.patch('/story/:id', authenticateToken, authorizeRole(PARTICIPATION_ADMIN_ROLES), ParticipationController.reviewStory);

// Contributors — Admin only
router.get('/contributor', authenticateToken, authorizeRole(PARTICIPATION_ADMIN_ROLES), ParticipationController.getContributors);
router.patch('/contributor/:id', authenticateToken, authorizeRole(PARTICIPATION_ADMIN_ROLES), ParticipationController.reviewContributor);

// Documentation — Admin only
router.get('/documentation', authenticateToken, authorizeRole(PARTICIPATION_ADMIN_ROLES), ParticipationController.getDocumentation);
router.patch('/documentation/:id', authenticateToken, authorizeRole(PARTICIPATION_ADMIN_ROLES), ParticipationController.reviewDocumentation);

export default router;
