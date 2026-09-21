import { isTransactionConflict } from '../utils/errorMapper.js';
import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { requireString } from "../utils/routeHelpers";

export class MasterArtisanIssueController {
  
  static async getStories(req: Request, res: Response) {
    try {
      const issueId = requireString(req.params.issueId);
      const links = await prisma.masterArtisanIssueStory.findMany({
        where: { issueId },
        include: { story: true },
        orderBy: { position: 'asc' }
      });
      res.json(links);
    } catch (e: any) {
      if (e && (e.name === 'ZodError' || e.errors)) {
        return res.status(400).json({ error: e.errors || e.message });
      }
      if (isTransactionConflict(e)) {
        return res.status(409).json({ error: e instanceof Error ? e.message : 'Conflict' });
      }
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async addStory(req: Request, res: Response) {
    try {
      const issueId = requireString(req.params.issueId);
      const { storyId } = req.body;
      if (!storyId) return res.status(400).json({ error: 'storyId is required' });

      // Ensure issue exists
      const issue = await prisma.magazineIssue.findUnique({ where: { id: issueId } });
      if (!issue) return res.status(404).json({ error: 'Issue not found' });

      // Check if already assigned
      const existing = await prisma.masterArtisanIssueStory.findUnique({
        where: { issueId_storyId: { issueId, storyId } }
      });
      if (existing) return res.status(409).json({ error: 'Story already assigned to this issue' });

      // Get max position
      const maxPos = await prisma.masterArtisanIssueStory.aggregate({
        where: { issueId },
        _max: { position: true }
      });
      const position = (maxPos._max.position || 0) + 1;

      const link = await prisma.masterArtisanIssueStory.create({
        data: { issueId, storyId, position, isCoverStory: false }
      });
      res.status(201).json(link);
    } catch (e: any) {
      if (e && (e.name === 'ZodError' || e.errors)) {
        return res.status(400).json({ error: e.errors || e.message });
      }
      if (isTransactionConflict(e)) {
        return res.status(409).json({ error: e instanceof Error ? e.message : 'Conflict' });
      }
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async removeStory(req: Request, res: Response) {
    try {
      const issueId = requireString(req.params.issueId);
        const storyId = requireString(req.params.storyId);
      await prisma.masterArtisanIssueStory.delete({
        where: { issueId_storyId: { issueId, storyId } }
      });
      res.status(204).end();
    } catch (e: any) {
      if (e && (e.name === 'ZodError' || e.errors)) {
        return res.status(400).json({ error: e.errors || e.message });
      }
      if (isTransactionConflict(e)) {
        return res.status(409).json({ error: e instanceof Error ? e.message : 'Conflict' });
      }
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async reorderStories(req: Request, res: Response) {
    try {
      const issueId = requireString(req.params.issueId);
      const { order } = req.body; // array of storyIds
      if (!Array.isArray(order) || order.length === 0) {
        return res.status(400).json({ error: 'Invalid order payload' });
      }

      await prisma.$transaction(
        order.map((storyId, index) =>
          prisma.masterArtisanIssueStory.update({
            where: { issueId_storyId: { issueId, storyId } },
            data: { position: index + 1 }
          })
        )
      );
      res.json({ success: true });
    } catch (e: any) {
      if (e && (e.name === 'ZodError' || e.errors)) {
        return res.status(400).json({ error: e.errors || e.message });
      }
      if (isTransactionConflict(e)) {
        return res.status(409).json({ error: e instanceof Error ? e.message : 'Conflict' });
      }
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async setCoverStory(req: Request, res: Response) {
    try {
      const issueId = requireString(req.params.issueId);
      const { storyId } = req.body;
      if (!storyId) return res.status(400).json({ error: 'storyId is required' });

      // Ensure the story is actually linked to this issue
      const link = await prisma.masterArtisanIssueStory.findUnique({
        where: { issueId_storyId: { issueId, storyId } }
      });
      if (!link) {
        return res.status(404).json({ error: 'Story is not linked to this issue' });
      }

      await prisma.$transaction([
        // unset old cover story
        prisma.masterArtisanIssueStory.updateMany({
          where: { issueId },
          data: { isCoverStory: false }
        }),
        // set new cover story
        prisma.masterArtisanIssueStory.update({
          where: { issueId_storyId: { issueId, storyId } },
          data: { isCoverStory: true }
        })
      ]);

      res.json({ success: true });
    } catch (e: any) {
      if (e && (e.name === 'ZodError' || e.errors)) {
        return res.status(400).json({ error: e.errors || e.message });
      }
      if (isTransactionConflict(e)) {
        return res.status(409).json({ error: e instanceof Error ? e.message : 'Conflict' });
      }
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
