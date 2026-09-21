import { Request, Response } from "express";
import { prisma } from "../config/db.js";
import { InitiativeType } from "@prisma/client";
import { requireString } from "../utils/routeHelpers";

// Get all initiatives (optional filter by type)
export const getInitiatives = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const where = type ? { type: type as InitiativeType } : {};

    const initiatives = await prisma.initiative.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    res.json(initiatives);
  } catch (error) {
    console.error("Error fetching initiatives:", error);
    res.status(500).json({ error: "Failed to fetch initiatives" });
  }
};

// Get single initiative by ID
export const getInitiativeById = async (req: Request, res: Response) => {
  try {
    const id = requireString(req.params.id);
    const initiative = await prisma.initiative.findUnique({
      where: { id },
    });

    if (!initiative) {
      return res.status(404).json({ error: "Initiative not found" });
    }

    res.json(initiative);
  } catch (error) {
    console.error("Error fetching initiative:", error);
    res.status(500).json({ error: "Failed to fetch initiative" });
  }
};

// Create new initiative
export const createInitiative = async (req: Request, res: Response) => {
  try {
    const { type, title, tagline, description, hashtags, images, link } = req.body;

    const newInitiative = await prisma.initiative.create({
      data: {
        type: type as InitiativeType,
        title,
        tagline,
        description,
        hashtags,
        images,
        link,
      },
    });
    res.status(201).json(newInitiative);
  } catch (error) {
    console.error("Error creating initiative:", error);
    res.status(500).json({ error: "Failed to create initiative" });
  }
};

// Update initiative
export const updateInitiative = async (req: Request, res: Response) => {
  try {
    const id = requireString(req.params.id);
    const { type, title, tagline, description, hashtags, images, link } = req.body;

    const updatedInitiative = await prisma.initiative.update({
      where: { id },
      data: {
        type: type as InitiativeType,
        title,
        tagline,
        description,
        hashtags,
        images,
        link,
      },
    });
    res.json(updatedInitiative);
  } catch (error) {
    console.error("Error updating initiative:", error);
    res.status(500).json({ error: "Failed to update initiative" });
  }
};

// Delete initiative
export const deleteInitiative = async (req: Request, res: Response) => {
  try {
    const id = requireString(req.params.id);
    await prisma.initiative.delete({
      where: { id },
    });
    res.json({ message: "Initiative deleted successfully" });
  } catch (error) {
    console.error("Error deleting initiative:", error);
    res.status(500).json({ error: "Failed to delete initiative" });
  }
};
