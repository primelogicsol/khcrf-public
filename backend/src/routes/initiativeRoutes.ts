import express from "express";
import {
  getInitiatives,
  getInitiativeById,
  createInitiative,
  updateInitiative,
  deleteInitiative,
} from "../controllers/initiativeController.js";
import { authenticateToken, authorizeRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route to get initiatives
router.get("/", getInitiatives);
router.get("/:id", getInitiativeById);

// Admin routes
router.post(
  "/",
  authenticateToken,
  // Add role checks if needed, e.g., authorizeRole(["ADMIN", "COLLABORATOR_CAMPAIGNING"])
  createInitiative
);
router.put(
  "/:id",
  authenticateToken,
  updateInitiative
);
router.delete(
  "/:id",
  authenticateToken,
  deleteInitiative
);

export default router;
