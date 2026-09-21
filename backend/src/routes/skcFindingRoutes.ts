import express from 'express';
import { 
    getAllFindings,
    getPublicFindings,
    getFinding,
    createFinding,
    updateFinding,
    deleteFinding
} from '../controllers/skcFindingController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/public', getPublicFindings);
router.get('/', authenticateToken, authorizeAdmin, getAllFindings);
router.get('/:id', authenticateToken, authorizeAdmin, getFinding);
router.post('/', authenticateToken, authorizeAdmin, createFinding);
router.put('/:id', authenticateToken, authorizeAdmin, updateFinding);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteFinding);

export default router;
