import { z } from 'zod';

// --- Shared Enums ---
const publicationStatuses = ['DRAFT', 'REVIEW', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED'] as const;
const accessLevels = ['PUBLIC', 'REGISTERED_USERS', 'MEMBERS_ONLY'] as const;
const seriesStatuses = ['PLANNED', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED'] as const;
const featureStatuses = ['DRAFT', 'SCHEDULED', 'ACTIVE', 'EXPIRED'] as const;

// --- Stories ---
export const createStorySchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/).min(1),
  title: z.string().min(1),
  subtitle: z.string().optional().nullable(),
  excerpt: z.string().optional().nullable(),
  bodyMarkdown: z.string().optional().nullable(),
  bodyJson: z.any().optional().nullable(),
  heroImage: z.string().optional().nullable(),
  contributorId: z.string().uuid().optional().nullable(),
  authorDisplayName: z.string().optional().nullable(),
  storyType: z.string().min(1),
  primaryCraft: z.string().min(1),
  publicationStatus: z.enum(publicationStatuses).optional(),
  accessLevel: z.enum(accessLevels).optional(),
  publishedAt: z.string().datetime().optional().nullable(),
  readingMinutes: z.number().int().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

export const updateStorySchema = createStorySchema.partial().extend({
  version: z.number().int(),
});

// --- Series ---
export const createSeriesSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/).min(1),
  title: z.string().min(1),
  subtitle: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  status: z.enum(seriesStatuses).optional(),
  accessLevel: z.enum(accessLevels).optional(),
  publishedAt: z.string().datetime().optional().nullable(),
});

export const updateSeriesSchema = createSeriesSchema.partial().extend({
  version: z.number().int(),
});

// --- Feature ---
const baseFeatureSchema = z.object({
  artisanId: z.string().uuid(),
  linkedStoryId: z.string().cuid().optional().nullable(),
  headline: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  featureImage: z.string().optional().nullable(),
  status: z.enum(featureStatuses).optional(),
  accessLevel: z.enum(accessLevels).optional(),
  startsAt: z.string().datetime().optional().nullable(),
  endsAt: z.string().datetime().optional().nullable(),
});

export const createFeatureSchema = baseFeatureSchema.refine(data => {
  if (data.startsAt && data.endsAt) {
    return new Date(data.startsAt) < new Date(data.endsAt);
  }
  return true;
}, { message: 'endsAt must be after startsAt', path: ['endsAt'] });

export const updateFeatureSchema = baseFeatureSchema.partial().extend({
  version: z.number().int(),
}).refine(data => {
  if (data.startsAt && data.endsAt) {
    return new Date(data.startsAt) < new Date(data.endsAt);
  }
  return true;
}, { message: 'endsAt must be after startsAt', path: ['endsAt'] });

// --- Filters ---
const optionalPositiveInteger = z.preprocess(
  (value) =>
    value === undefined || value === null || value === ''
      ? undefined
      : value,
  z.coerce.number().int().nonnegative().optional()
);

export const publicFilterSchema = z.object({
  skip: optionalPositiveInteger,
  take: optionalPositiveInteger,
});
