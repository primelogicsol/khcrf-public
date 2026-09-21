import { Request, Response } from 'express';
import {
  QueueQuerySchema,
  PreviewBodySchema,
  SubmitBodySchema,
  HistoryQuerySchema,
} from '../validators/skcClassification.validator';
import { SkcClassificationService, ClassificationServiceError } from '../services/skcClassification.service';
import { SkcClassificationRepository } from '../repositories/skcClassification.repository';
import { classificationLogger } from '../utils/classificationLogger';
import { prisma } from '../config/db';

// Compose the chain once at module load
const repo = new SkcClassificationRepository(prisma);
const service = new SkcClassificationService(repo);

// ────────────────────────────────────────────────────────────────────────────
// Pure HTTP translation — no business logic, no Prisma, no token generation.
// Emits structured log lines for every classification operation via
// classificationLogger (Phase 2 observability).
// ────────────────────────────────────────────────────────────────────────────

export const skcClassificationController = {

  getQueue: async (req: Request, res: Response) => {
    const parsed = QueueQuerySchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    try {
      const result = await service.getQueue(parsed.data);
      return res.json(result);
    } catch (err: unknown) {
      const e = err as Error;
      return res.status(500).json({ error: e.message });
    }
  },

  preview: async (req: Request, res: Response) => {
    const actorId = (req as Request & { user?: { userId: string } }).user?.userId;
    if (!actorId) return res.status(401).json({ error: 'Unauthorized' });

    const parsed = PreviewBodySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });

    const requestId = (req.headers['x-request-id'] as string) ?? undefined;
    const start = Date.now();

    try {
      const result = await service.preview({ ...parsed.data, actorId });

      classificationLogger.logPreview({
        requestId,
        actorId,
        entityType: parsed.data.entityType,
        targetProvenance: parsed.data.targetProvenance,
        requestedCount: parsed.data.recordIds.length,
        affectedCount: result.affectedCount,
        blockedCount: result.blockedCount,
        missingCount: result.missingCount,
        durationMs: Date.now() - start,
      });

      return res.json(result);
    } catch (err: unknown) {
      if (err instanceof ClassificationServiceError) {
        return res.status(err.statusCode).json({ code: err.code, error: err.message });
      }
      const e = err as Error;
      return res.status(500).json({ error: e.message });
    }
  },

  submit: async (req: Request, res: Response) => {
    // Actor MUST come from the verified session — never from the request body.
    const actorId = (req as Request & { user?: { userId: string } }).user?.userId;
    if (!actorId) return res.status(401).json({ error: 'Unauthorized' });

    const parsed = SubmitBodySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });

    const requestId = (req.headers['x-request-id'] as string) ?? undefined;
    const start = Date.now();

    try {
      const result = await service.submit({ ...parsed.data, actorId });

      classificationLogger.logSubmit({
        requestId,
        actorId,
        entityType: parsed.data.entityType,
        targetProvenance: parsed.data.targetProvenance,
        batchId: result.batchId ?? parsed.data.idempotencyKey,
        idempotencyKey: parsed.data.idempotencyKey,
        requestedCount: parsed.data.recordIds.length,
        classifiedCount: result.classifiedCount,
        idempotentReplay: 'idempotent' in result ? result.idempotent : false,
        durationMs: Date.now() - start,
      });

      return res.json(result);
    } catch (err: unknown) {
      const durationMs = Date.now() - start;

      if (err instanceof ClassificationServiceError) {
        if (err.code === 'STALE_PREVIEW') {
          classificationLogger.logStalePreviewRejection({
            requestId,
            actorId,
            entityType: parsed.data.entityType,
            targetProvenance: parsed.data.targetProvenance,
            requestedCount: parsed.data.recordIds.length,
            durationMs,
          });
        } else if (err.code === 'IDEMPOTENCY_KEY_REUSED') {
          classificationLogger.logIdempotencyKeyReuse({
            requestId,
            actorId,
            entityType: parsed.data.entityType,
            targetProvenance: parsed.data.targetProvenance,
            idempotencyKey: parsed.data.idempotencyKey,
            durationMs,
          });
        }
        return res.status(err.statusCode).json({ code: err.code, error: err.message });
      }

      // Unique constraint violation — concurrent duplicate request
      const prismaErr = err as { code?: string };
      if (prismaErr.code === 'P2002') {
        return res.status(409).json({
          code: 'CONCURRENT_DUPLICATE',
          error: 'A concurrent classification request for this batch was already processed.',
        });
      }

      const e = err as Error;
      classificationLogger.logTransactionFailure({
        requestId,
        actorId,
        entityType: parsed.data.entityType,
        targetProvenance: parsed.data.targetProvenance,
        requestedCount: parsed.data.recordIds.length,
        errorCode: prismaErr.code,
        errorMessage: e.message ?? 'Unknown error',
        durationMs,
      });

      return res.status(500).json({ error: e.message });
    }
  },

  getHistory: async (req: Request, res: Response) => {
    const parsed = HistoryQuerySchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    try {
      const result = await service.getHistory(parsed.data);
      return res.json(result);
    } catch (err: unknown) {
      const e = err as Error;
      return res.status(500).json({ error: e.message });
    }
  },
};
