import { z } from 'zod';
import {
  DataProvenance,
  RecordSourceSystem,
  SkcClassifiedEntityType,
} from '@prisma/client';

export const MAX_BATCH_SIZE = 100;

export const ALLOWED_ENTITY_TYPES = new Set<SkcClassifiedEntityType>([
  SkcClassifiedEntityType.SKC_STAKEHOLDER_REGISTRATION,
  SkcClassifiedEntityType.SKC_INSTITUTION_REGISTRATION,
  SkcClassifiedEntityType.SKC_HEARING,
  SkcClassifiedEntityType.HEARING_REGISTRATION,
  SkcClassifiedEntityType.HEARING_TESTIMONY,
  SkcClassifiedEntityType.SKC_EVIDENCE,
]);

// Valid provenance transitions (forward-only)
export const ALLOWED_TRANSITIONS: Partial<Record<DataProvenance, DataProvenance[]>> = {
  [DataProvenance.UNKNOWN]: [DataProvenance.PRODUCTION, DataProvenance.TEST],
  [DataProvenance.TEST]: [DataProvenance.PRODUCTION],
};

// ────────────────────────────────────────────────────────────────────────────
// Request Validators
// ────────────────────────────────────────────────────────────────────────────

export const QueueQuerySchema = z.object({
  provenance: z.nativeEnum(DataProvenance).optional().default(DataProvenance.UNKNOWN),
  entityType: z.string().optional(),
  sourceSystem: z.nativeEnum(RecordSourceSystem).optional(),
  search: z.string().max(200).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
});

export const PreviewBodySchema = z.object({
  entityType: z.nativeEnum(SkcClassifiedEntityType, {
    message: 'Invalid entityType. Must be one of the authorized entity types.',
  }),
  recordIds: z
    .array(z.string())
    .min(1, 'At least one recordId is required.')
    .max(MAX_BATCH_SIZE, `Maximum batch size is ${MAX_BATCH_SIZE} records.`),
  targetProvenance: z.nativeEnum(DataProvenance, {
    message: 'Invalid targetProvenance.',
  }),
});

export const SubmitBodySchema = z.object({
  entityType: z.nativeEnum(SkcClassifiedEntityType),
  recordIds: z
    .array(z.string())
    .min(1)
    .max(MAX_BATCH_SIZE),
  targetProvenance: z.nativeEnum(DataProvenance),
  reason: z
    .string()
    .min(10, 'Reason must be at least 10 characters.')
    .max(2000, 'Reason must not exceed 2000 characters.')
    .transform((s) => s.trim()),
  idempotencyKey: z
    .string()
    .uuid('idempotencyKey must be a valid UUID v4.'),
  previewToken: z
    .string()
    .min(32, 'previewToken is required and must be the value returned by the preview endpoint.'),
});

export const HistoryQuerySchema = z.object({
  entityType: z.nativeEnum(SkcClassifiedEntityType).optional(),
  recordId: z.string().optional(),
  actorId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
});

export type QueueQuery = z.infer<typeof QueueQuerySchema>;
export type PreviewBody = z.infer<typeof PreviewBodySchema>;
export type SubmitBody = z.infer<typeof SubmitBodySchema>;
export type HistoryQuery = z.infer<typeof HistoryQuerySchema>;
