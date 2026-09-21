import { Request, Response } from "express";
import { prisma } from "../config/db.js";
import { validatePublicContent } from "../utils/contentValidation.js";
import { requireString } from "../utils/routeHelpers";

// Get page content by slug
export const getPageContent = async (req: Request, res: Response) => {
  try {
    const slug = requireString(req.params.slug);

    let content = null;
    try {
      content = await prisma.pageContent.findUnique({ where: { slug } });
    } catch {
      // Table may not exist yet (pending migration) — treat as not found
      return res.status(404).json({ message: "Content not found" });
    }

    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    res.json(content);
  } catch (error) {
    console.error("Error fetching page content:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update or create page content
export const updatePageContent = async (req: Request, res: Response) => {
  try {
    const slug = requireString(req.params.slug);
    const { title, content } = req.body;

    const validation = validatePublicContent(content);
    if (!validation.isValid) {
      return res.status(400).json({ 
        message: `Content publication blocked. Found restricted developer phrase: "${validation.flaggedPhrase}". Please remove internal notes before publishing.` 
      });
    }

    const updatedContent = await prisma.pageContent.upsert({
      where: { slug },
      update: {
        title,
        content,
      },
      create: {
        slug,
        title: title || slug, // Fallback title
        content,
      },
    });

    res.json(updatedContent);
  } catch (error) {
    console.error("Error updating page content:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
