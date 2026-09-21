import { Router } from 'express';
import { MotifController } from '../controllers/motifController';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/', MotifController.getAll);
router.get('/:id', MotifController.getById);

router.post('/', authenticateToken, authorizeRole(['ADMIN', 'SUPER_ADMIN', 'EDITOR', 'ARCHIVIST']), MotifController.create);
router.patch('/:id', authenticateToken, authorizeRole(['ADMIN', 'SUPER_ADMIN', 'EDITOR', 'ARCHIVIST']), MotifController.update);
router.delete('/:id', authenticateToken, authorizeRole(['ADMIN', 'SUPER_ADMIN']), MotifController.delete);

export default router;
