import express from 'express';
import { createOrder, verifyPayment, getAllCertifications, getMyCertifications, updateCertificationStatus } from '../controllers/paymentController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';
import { optionalAuthenticateToken } from '../middleware/optionalAuthMiddleware.js';

const router = express.Router();

// Route to create a new order
router.post('/create-order', optionalAuthenticateToken, createOrder);

// Route to verify payment
router.post('/verify-payment', verifyPayment);

// Admin route to get all certifications
router.get('/certifications', authenticateToken, authorizeAdmin, getAllCertifications);

// Admin route to update certification status
router.put('/certifications/:id/status', authenticateToken, authorizeAdmin, updateCertificationStatus);

// User route to get their own certifications
router.get('/my-certifications', authenticateToken, getMyCertifications);

export default router;
