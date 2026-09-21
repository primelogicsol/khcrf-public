import { z } from 'zod';

export const BasePublicationCommandSchema = z.object({
  publicationId: z.string().cuid(),
  expectedRevision: z.number().int().positive(),
  userId: z.string().cuid(),
  idempotencyKey: z.string().min(1)
}).strict();
export type BasePublicationCommand = z.infer<typeof BasePublicationCommandSchema>;

export const UpdatePublicationTitleCommandSchema = BasePublicationCommandSchema.extend({
  title: z.string().min(1),
  subtitle: z.string().nullable().optional()
}).strict();
export type UpdatePublicationTitleCommand = z.infer<typeof UpdatePublicationTitleCommandSchema>;

export const TransitionPublicationWorkflowCommandSchema = BasePublicationCommandSchema.extend({
  targetStatus: z.enum([
    'CONCEPT', 'BLUEPRINT_DRAFT', 'BLUEPRINT_REVIEW', 'BLUEPRINT_APPROVED', 
    'RESEARCH', 'WRITING', 'INTERNAL_REVIEW', 'TECHNICAL_REVIEW', 
    'EDITORIAL_REVIEW', 'PUBLISHED', 'REVISION', 'SUPERSEDED', 'ARCHIVED'
  ]),
  comments: z.string().nullable().optional()
}).strict();
export type TransitionPublicationWorkflowCommand = z.infer<typeof TransitionPublicationWorkflowCommandSchema>;
