import express from 'express';
import { login, signup, logout, updateProfile, forgotPassword, resetPassword, verifyEmail, resendVerificationOtp, getMe } from '../controllers/authController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { loginSchema, signupSchema, forgotPasswordSchema, resetPasswordSchema, verifyEmailSchema } from '../schemas/authSchemas.js';
import { googleLogin } from '../controllers/googleAuth.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/signup', authLimiter, validateRequest(signupSchema), signup);
router.post('/login', authLimiter, validateRequest(loginSchema), login);
router.post('/google', googleLogin);
router.post('/logout', logout);
router.post('/forgot-password', authLimiter, validateRequest(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', authLimiter, validateRequest(resetPasswordSchema), resetPassword);
router.post('/verify-email', authLimiter, validateRequest(verifyEmailSchema), verifyEmail);
router.post('/resend-verification', authLimiter, validateRequest(forgotPasswordSchema), resendVerificationOtp);
router.get('/me', authenticateToken, getMe);
router.put('/profile', authenticateToken, updateProfile);

export default router;
