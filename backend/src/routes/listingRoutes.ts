import { Router } from 'express';
import { createListing, getMyListings, getListingById, updateListingStatus } from '../controllers/listingController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/create', authenticateToken, createListing);
router.get('/my-listings', authenticateToken, getMyListings);
router.get('/:id', authenticateToken, getListingById);
router.put('/:id/status', authenticateToken, authorizeAdmin, updateListingStatus);

export default router;
