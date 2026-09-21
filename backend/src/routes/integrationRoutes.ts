import express from 'express';
import { handleCraftloreWebhook } from '../controllers/integrationController.js';

const router = express.Router();

router.post('/craftlore/verification-request', express.raw({ type: 'application/json' }), handleCraftloreWebhook);



export default router;
