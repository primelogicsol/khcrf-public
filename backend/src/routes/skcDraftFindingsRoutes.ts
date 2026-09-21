import express from 'express';
import { 
    getPublicDraftFindings,
    getPublicDraftFindingBySlug
} from '../controllers/skcDraftFindingsController.js';

const router = express.Router();

router.get('/public', getPublicDraftFindings);
router.get('/public/:slug', getPublicDraftFindingBySlug);

export default router;
