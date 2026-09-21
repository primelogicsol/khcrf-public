import express from 'express';
import { 
   getOverview, getCycles,
   getProgress,
   getStatistics,
   getThemes,
   getGeography,
   getTimeline,
   getReports,
   getActivities,
   getThematicClusters,
   getPublicMetadata
} from '../controllers/publicSkcController.js';

const router = express.Router();

router.get('/cycles', getCycles);
router.get('/overview', getOverview);
router.get('/progress', getProgress);
router.get('/statistics', getStatistics);
router.get('/themes', getThemes);
router.get('/geography', getGeography);
router.get('/timeline', getTimeline);
router.get('/reports', getReports);
router.get('/activities', getActivities);
router.get('/thematic-clusters', getThematicClusters);
router.get('/metadata', getPublicMetadata);

export default router;
