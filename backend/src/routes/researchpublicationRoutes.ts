import { Router } from 'express';
import { ResearchPublicationController } from '../controllers/researchpublicationController';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/', ResearchPublicationController.getAll);
router.get('/:id', ResearchPublicationController.getById);
router.post('/', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), ResearchPublicationController.create);
router.patch('/:id', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), ResearchPublicationController.update);
router.delete('/:id', authenticateToken, authorizeRole(['ADMIN']), ResearchPublicationController.remove);

export default router;