import { Router } from 'express';
import { ArtisanController } from '../controllers/artisanController';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/', ArtisanController.getAll);
router.get('/:id', ArtisanController.getById);
router.post('/', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), ArtisanController.create);
router.patch('/:id', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), ArtisanController.update);
router.delete('/:id', authenticateToken, authorizeRole(['ADMIN']), ArtisanController.remove);

export default router;