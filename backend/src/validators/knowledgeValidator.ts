import { z } from 'zod';

export const canonicalEntitySchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  slug: z.string().min(1, 'Slug is required').max(255),
  summary: z.string().optional(),
  entityType: z.enum(['KNOWLEDGE_OBJECT', 'HUMAN_OBJECT', 'HERITAGE_OBJECT', 'ADMINISTRATIVE_OBJECT']),
  lifecycle: z.enum(['DRAFT', 'IN_REVIEW', 'VERIFIED', 'PUBLISHED', 'SUPERSEDED', 'DEPRECATED', 'ARCHIVED']).optional(),
  visibility: z.enum(['PUBLIC', 'RESTRICTED', 'INTERNAL', 'CLASSIFIED']).optional(),
  sensitivity: z.enum(['NONE', 'CULTURALLY_SENSITIVE', 'COMMERCIALLY_SENSITIVE', 'PII_SENSITIVE']).optional(),
  verificationStatus: z.enum(['UNVERIFIED', 'PARTIALLY_VERIFIED', 'VERIFIED', 'DISPUTED', 'REJECTED']).optional(),
  aliases: z.array(z.string()).optional(),
  transliterations: z.any().optional(), // Can be strictly typed later
  metadata: z.any().optional(),
  seoMetadata: z.any().optional(),
  aiEmbeddings: z.any().optional(),
  publishedAt: z.string().datetime().optional().nullable(),
  archivedAt: z.string().datetime().optional().nullable(),
  isDemo: z.boolean().optional(),
  isSeedData: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  displayPriority: z.number().int().optional(),
});

export const updateCanonicalEntitySchema = canonicalEntitySchema.partial();

export const entityRelationshipSchema = z.object({
  sourceEntityId: z.string().uuid(),
  targetEntityId: z.string().uuid(),
  relationshipType: z.enum([
    'RELATES_TO', 'USES_MATERIAL', 'USES_TOOL', 'USES_TECHNIQUE', 
    'PRACTICES_CRAFT', 'MENTORS', 'PART_OF', 'CREATED_BY', 
    'APPEARS_IN', 'REFERENCES', 'DERIVED_FROM', 'LOCATED_IN', 
    'CERTIFIED_BY', 'VERIFIED_BY', 'DOCUMENTED_IN'
  ]),
  confidenceScore: z.number().int().min(0).max(100).optional(),
  verificationStatus: z.enum(['UNVERIFIED', 'PARTIALLY_VERIFIED', 'VERIFIED', 'DISPUTED', 'REJECTED']).optional(),
  sourceReferenceId: z.string().uuid().optional(),
  notes: z.string().optional(),
  metadata: z.any().optional(),
});

export const updateEntityRelationshipSchema = entityRelationshipSchema.partial();

export const taxonomyCategorySchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  parentId: z.string().uuid().optional().nullable(),
});

export const updateTaxonomyCategorySchema = taxonomyCategorySchema.partial();

export const sourceReferenceSchema = z.object({
  entityId: z.string().uuid(),
  sourceType: z.enum(['FIELD_SURVEY', 'INTERVIEW', 'ARCHIVAL_DOCUMENT', 'ACADEMIC_PUBLICATION', 'MUSEUM_RECORD', 'GOVERNMENT_RECORD', 'OTHER']),
  title: z.string().optional(),
  author: z.string().optional(),
  publisher: z.string().optional(),
  year: z.number().int().min(1000).max(new Date().getFullYear()).optional(),
  doi: z.string().optional(),
  citationText: z.string().min(1, 'Citation text is required'),
  url: z.string().url().optional().or(z.literal('')),
  confidenceScore: z.number().int().min(0).max(100).optional(),
  metadata: z.any().optional(),
});

export const updateSourceReferenceSchema = sourceReferenceSchema.partial();

export const mediaAssetSchema = z.object({
  mediaType: z.enum(['IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'ARCHIVE']),
  storageProvider: z.string().min(1, 'Storage provider is required'),
  providerId: z.string().optional(),
  storageKey: z.string().optional(),
  publicUrl: z.string().url(),
  fileName: z.string().min(1, 'File name is required'),
  mimeType: z.string().optional(),
  sizeBytes: z.number().int().positive().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  durationSeconds: z.number().int().positive().optional(),
  checksum: z.string().optional(),
  altText: z.string().optional(),
  caption: z.string().optional(),
  copyrightOwner: z.string().optional(),
  license: z.string().optional(),
  attribution: z.string().optional(),
  sensitivityClassification: z.enum(['NONE', 'CULTURALLY_SENSITIVE', 'COMMERCIALLY_SENSITIVE', 'PII_SENSITIVE']).optional(),
  metadata: z.any().optional(),
});

export const updateMediaAssetSchema = mediaAssetSchema.partial();
