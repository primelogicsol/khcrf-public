import { Router } from 'express';
import { TechniqueController } from '../controllers/techniqueController';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/', TechniqueController.getAll);
router.get('/:id', TechniqueController.getById);

router.post('/', authenticateToken, authorizeRole(['ADMIN', 'SUPER_ADMIN', 'EDITOR', 'ARCHIVIST']), TechniqueController.create);
router.patch('/:id', authenticateToken, authorizeRole(['ADMIN', 'SUPER_ADMIN', 'EDITOR', 'ARCHIVIST']), TechniqueController.update);
router.delete('/:id', authenticateToken, authorizeRole(['ADMIN', 'SUPER_ADMIN']), TechniqueController.delete);

export default router;
