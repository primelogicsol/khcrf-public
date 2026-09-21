import { Router } from 'express';
import { StudioController } from '../controllers/studioController';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/', StudioController.getAll);
router.get('/:id', StudioController.getById);
router.post('/', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), StudioController.create);
router.patch('/:id', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), StudioController.update);
router.delete('/:id', authenticateToken, authorizeRole(['ADMIN']), StudioController.remove);

export default router;