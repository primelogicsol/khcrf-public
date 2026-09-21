import express from "express";
import { applyAdvisor, getAdvisors, updateAdvisorStatus } from "../controllers/advisoryController.js";
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';
// upload is defined in cvUploadMiddleware to avoid circular dependency with advisoryController
export { upload } from '../middleware/cvUploadMiddleware.js';

const router = express.Router();

router.post("/apply", applyAdvisor);
router.get("/", authenticateToken, authorizeAdmin, getAdvisors);
router.patch("/:id/status", authenticateToken, authorizeAdmin, updateAdvisorStatus);

export default router;
