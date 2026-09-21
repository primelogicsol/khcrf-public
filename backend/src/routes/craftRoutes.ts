import { Router } from 'express';
import { CraftController } from '../controllers/craftController';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/', CraftController.getAll);
router.get('/:id', CraftController.getById);

router.post('/', authenticateToken, authorizeRole(['ADMIN', 'SUPER_ADMIN', 'EDITOR', 'ARCHIVIST']), CraftController.create);
router.patch('/:id', authenticateToken, authorizeRole(['ADMIN', 'SUPER_ADMIN', 'EDITOR', 'ARCHIVIST']), CraftController.update);
router.delete('/:id', authenticateToken, authorizeRole(['ADMIN', 'SUPER_ADMIN']), CraftController.delete);

export default router;
