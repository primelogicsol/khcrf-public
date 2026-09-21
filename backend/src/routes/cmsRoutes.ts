import express from "express";
import { getPageContent, updatePageContent } from "../controllers/cmsController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

// Public route to get content
router.get("/:slug", getPageContent);

// Protected route to update content (only admin/moderator should ideally access this, keeping it authenticated for now)
router.post("/:slug", authenticateToken, updatePageContent);

export default router;
