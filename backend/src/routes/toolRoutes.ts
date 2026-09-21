import { Router } from 'express';
import { ToolController } from '../controllers/toolController';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/', ToolController.getAll);
router.get('/:id', ToolController.getById);

router.post('/', authenticateToken, authorizeRole(['ADMIN', 'SUPER_ADMIN', 'EDITOR', 'ARCHIVIST']), ToolController.create);
router.patch('/:id', authenticateToken, authorizeRole(['ADMIN', 'SUPER_ADMIN', 'EDITOR', 'ARCHIVIST']), ToolController.update);
router.delete('/:id', authenticateToken, authorizeRole(['ADMIN', 'SUPER_ADMIN']), ToolController.delete);

export default router;
