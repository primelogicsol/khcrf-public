import { Request, Response } from "express";
import { prisma } from "../config/db.js";
import { requireString } from "../utils/routeHelpers";

// Get all openings
export const getOpenings = async (req: Request, res: Response) => {
  try {
    const openings = await prisma.apprenticeshipOpening.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(openings);
  } catch (error) {
    console.error("Error fetching openings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create a new opening
export const createOpening = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      location,
      type,
      duration,
      stipend,
      requirements,
      status,
    } = req.body;

    const opening = await prisma.apprenticeshipOpening.create({
      data: {
        title,
        description,
        location,
        type: type || "FULL_TIME",
        duration,
        stipend,
        requirements: requirements || [],
        status: status || "OPEN",
      },
    });

    res.status(201).json(opening);
  } catch (error) {
    console.error("Error creating opening:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update an opening
export const updateOpening = async (req: Request, res: Response) => {
  try {
    const id = requireString(req.params.id);
    const {
      title,
      description,
      location,
      type,
      duration,
      stipend,
      requirements,
      status,
    } = req.body;

    const opening = await prisma.apprenticeshipOpening.update({
      where: { id },
      data: {
        title,
        description,
        location,
        type,
        duration,
        stipend,
        requirements,
        status,
      },
    });

    res.status(200).json(opening);
  } catch (error) {
    console.error("Error updating opening:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete an opening
export const deleteOpening = async (req: Request, res: Response) => {
  try {
    const id = requireString(req.params.id);
    await prisma.apprenticeshipOpening.delete({
      where: { id },
    });
    res.status(200).json({ message: "Opening deleted successfully" });
  } catch (error) {
    console.error("Error deleting opening:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
