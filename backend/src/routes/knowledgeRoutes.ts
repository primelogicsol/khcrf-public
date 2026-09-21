import { Router } from 'express';
import { KnowledgeController } from '../controllers/knowledgeController';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateRequest';
import { cacheMiddleware } from '../middleware/cacheMiddleware';
import { z } from 'zod';

const knowledgeQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().transform(Number),
    limit: z.string().regex(/^\d+$/).optional().transform(Number),
    skip: z.string().regex(/^\d+$/).optional().transform(Number),
    take: z.string().regex(/^\d+$/).optional().transform(Number),
    search: z.string().trim().optional(),
    entityType: z.string().trim().optional(),
    lifecycle: z.string().trim().optional(),
    visibility: z.string().trim().optional(),
    taxonomyId: z.string().trim().optional(),
  }).passthrough(),
});

const router = Router();

// Public/Read Routes
router.get('/', validateRequest(knowledgeQuerySchema), cacheMiddleware(300), KnowledgeController.getAll);
router.get('/:idOrSlug', cacheMiddleware(300), KnowledgeController.getByIdOrSlug);

// Protected/Mutative Routes
router.post('/', authenticateToken, authorizeRole(['ADMIN', 'SUPER_ADMIN', 'EDITOR', 'ARCHIVIST', 'RESEARCHER']), KnowledgeController.create);
router.patch('/:id', authenticateToken, authorizeRole(['ADMIN', 'SUPER_ADMIN', 'EDITOR', 'ARCHIVIST', 'RESEARCHER']), KnowledgeController.update);
router.delete('/:id', authenticateToken, authorizeRole(['ADMIN', 'SUPER_ADMIN']), KnowledgeController.delete);

export default router;
