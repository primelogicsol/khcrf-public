import { Router } from 'express';
import { GraphController } from '../controllers/graphController';

const router = Router();

// Retrieve ego-graph around a central node up to ?depth=X
router.get('/:id', GraphController.getEgoGraph);

export default router;
