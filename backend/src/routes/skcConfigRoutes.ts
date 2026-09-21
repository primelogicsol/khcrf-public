import express from 'express';
import { 
    getConfig,
    getAllConfigs,
    setConfig
} from '../controllers/skcConfigController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/:key', getConfig);

// Admin routes
router.get('/', authenticateToken, authorizeAdmin, getAllConfigs);
router.post('/:key', authenticateToken, authorizeAdmin, setConfig);
router.put('/:key', authenticateToken, authorizeAdmin, setConfig);

export default router;
