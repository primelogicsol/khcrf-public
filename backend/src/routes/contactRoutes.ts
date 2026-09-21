import express from "express";
import {
  submitContactForm,
  getContactSubmissions,
  deleteContactSubmission,
  markContactRead,
} from "../controllers/contactController";
import { authenticateToken, authorizeAdmin } from "../middleware/authMiddleware";

const router = express.Router();

// Public route to submit
router.post("/submit", submitContactForm);

// Protected routes (admin only)
router.get("/", authenticateToken, authorizeAdmin, getContactSubmissions);
router.delete("/:id", authenticateToken, authorizeAdmin, deleteContactSubmission);
router.put("/:id", authenticateToken, authorizeAdmin, markContactRead);

export default router;
