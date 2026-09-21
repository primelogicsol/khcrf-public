import { Router } from 'express';
import { registerFellow, getFellowsAdmin, updateFellowStatus } from '../controllers/fellowshipController.js';
import { upload } from '../middleware/cvUploadMiddleware.js';

const router = Router();

// Public route to submit an application
router.post('/register', upload.fields([
    { name: 'cvFile', maxCount: 1 },
    { name: 'portfolioFile', maxCount: 1 }
]), registerFellow);

// Admin routes
router.get('/admin', getFellowsAdmin);
router.put('/admin/:id/status', updateFellowStatus);

export default router;
