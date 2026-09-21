import { Request, Response } from 'express';
import { KnowledgeService } from '../services/knowledgeService';
import { canonicalEntitySchema, updateCanonicalEntitySchema } from '../validators/knowledgeValidator';
import { ZodError } from 'zod';
import { requireString } from "../utils/routeHelpers";

export class KnowledgeController {
  
  static async create(req: Request, res: Response) {
    try {
      const validatedData = canonicalEntitySchema.parse(req.body);
      const userId = (req as any).user?.userId; // Assumes authenticate middleware sets this

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const entity = await KnowledgeService.createEntity(validatedData, userId);
      return res.status(201).json(entity);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.issues });
      }
      console.error('Error creating canonical entity:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const { skip, take, search, entityType, lifecycle, visibility, taxonomyId } = req.query;

      const filters = {
        search: search ? String(search) : undefined,
        entityType: entityType ? String(entityType) : undefined,
        lifecycle: lifecycle ? String(lifecycle) : undefined,
        visibility: visibility ? String(visibility) : undefined,
        taxonomyId: taxonomyId ? String(taxonomyId) : undefined,
      };

      const parsedSkip = skip ? parseInt(String(skip), 10) : 0;
      const parsedTake = take ? parseInt(String(take), 10) : 20;

      const results = await KnowledgeService.getEntities(filters, parsedSkip, parsedTake);
      return res.json(results);
    } catch (error) {
      console.error('Error fetching canonical entities:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getByIdOrSlug(req: Request, res: Response) {
    try {
      const idOrSlug = requireString(req.params.idOrSlug);
      const entity = await KnowledgeService.getEntityByIdOrSlug(idOrSlug);

      if (!entity) {
        return res.status(404).json({ error: 'Entity not found' });
      }

      return res.json(entity);
    } catch (error) {
      console.error('Error fetching entity:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = requireString(req.params.id);
      const validatedData = updateCanonicalEntitySchema.parse(req.body);
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const entity = await KnowledgeService.updateEntity(id, validatedData, userId);
      return res.json(entity);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.issues });
      }
      console.error('Error updating entity:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = requireString(req.params.id);
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      await KnowledgeService.softDeleteEntity(id, userId);
      return res.status(204).send();
    } catch (error) {
      console.error('Error deleting entity:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
