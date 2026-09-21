import { Router } from 'express';
import { SearchController } from '../controllers/searchController';

const router = Router();

// Global unified search (e.g. ?q=papier&limit=10)
router.get('/', SearchController.globalSearch);

// Advanced Discovery Search Endpoint
router.get('/discovery', SearchController.discoverySearch);

export default router;
