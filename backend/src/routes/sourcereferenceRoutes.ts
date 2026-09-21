import { Router } from 'express';
import { SourceReferenceController } from '../controllers/sourcereferenceController';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/', SourceReferenceController.getAll);
router.get('/:id', SourceReferenceController.getById);

router.post('/', authenticateToken, authorizeRole(['ADMIN', 'SUPER_ADMIN', 'EDITOR', 'ARCHIVIST']), SourceReferenceController.create);
router.patch('/:id', authenticateToken, authorizeRole(['ADMIN', 'SUPER_ADMIN', 'EDITOR', 'ARCHIVIST']), SourceReferenceController.update);
router.delete('/:id', authenticateToken, authorizeRole(['ADMIN', 'SUPER_ADMIN']), SourceReferenceController.delete);

export default router;
