
import express from 'express';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware'; // Adjust path
import { 
    createProfile, 
    getDashboardStats, 
    getProfiles,
    downloadTemplate,
    previewBulk,
    submitBulk,
    getProfile,
    deleteProfile,
    updateProfile,
    updateProfileStatus,
    approveJurisdiction,
    verifyProfile,
    getMyCcsiProfile,
    resumeCcsiRegistration,
    requestReferralCode,
    approveReferralCode
} from '../controllers/ccsiController';

const router = express.Router();

// Middleware to check for role/legislative office access could be added here
router.use(authenticateToken);

router.get('/my-profile', getMyCcsiProfile);
router.put('/resume', resumeCcsiRegistration);
router.post('/request-referral', requestReferralCode);
router.put('/profile/:id/approve-referral', authorizeAdmin, approveReferralCode);

router.get('/dashboard', authorizeAdmin, getDashboardStats);
router.post('/profile', createProfile);
router.get('/profiles', authorizeAdmin, getProfiles);
router.get('/profile/:id', getProfile);
router.get('/verify/:id', verifyProfile);
router.put('/profile/:id/approve-jurisdiction', authorizeAdmin, approveJurisdiction);
router.delete('/profile/:id', authorizeAdmin, deleteProfile);
router.put('/profile/:id', updateProfile);
router.put('/profile/:id/status', authorizeAdmin, updateProfileStatus);
router.get('/template', authorizeAdmin, downloadTemplate);
router.post('/bulk-preview', authorizeAdmin, previewBulk);
router.post('/bulk-submit', authorizeAdmin, submitBulk);

export default router;
