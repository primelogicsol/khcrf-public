import { Router } from 'express';
import { HealthController } from '../controllers/healthController';

const router = Router();

router.get('/knowledge', HealthController.getKnowledgeHealth);

export default router;
