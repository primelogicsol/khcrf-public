import { Router } from 'express';
import { CollectionController } from '../controllers/collectionController';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/', CollectionController.getAll);
router.get('/:id', CollectionController.getById);
router.post('/', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), CollectionController.create);
router.patch('/:id', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), CollectionController.update);
router.delete('/:id', authenticateToken, authorizeRole(['ADMIN']), CollectionController.remove);

export default router;