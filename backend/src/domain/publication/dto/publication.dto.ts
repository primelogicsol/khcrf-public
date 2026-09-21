import { z } from 'zod';

// ============================================================================
// SHARED / NESTED SCHEMAS
// ============================================================================

export const PublicCategoryDtoSchema = z.object({
  id: z.string().cuid().nullable(),
  name: z.string().min(1),
  slug: z.string().min(1),
}).strict();

export const PublicAssetUrlSchema = z.string().refine(
  value =>
    value.startsWith('/') ||
    /^https?:\/\/.+/i.test(value),
  {
    message:
      'Asset URL must be an absolute HTTP(S) URL or a root-relative path',
  }
);

export const PublicContributorDtoSchema = z.object({
  userId: z.string().cuid(),
  name: z.string(),
  role: z.enum([
    'EDITORIAL_OWNER',
    'SCIENTIFIC_REVIEWER',
    'TECHNICAL_REVIEWER',
    'LANGUAGE_EDITOR',
    'CITATION_REVIEWER',
    'SEO_REVIEWER',
    'FINAL_APPROVER',
    'AUTHOR'
  ]),
}).strict();

export const ContentBlockDtoSchema = z.object({
  id: z.string().cuid(),
  order: z.number().int().nonnegative(),
  blockType: z.enum([
    'PARAGRAPH', 'HEADING', 'QUOTE', 'TABLE', 'FIGURE', 'IMAGE', 
    'CALLOUT', 'CODE', 'MERMAID', 'CHECKLIST', 'FORMULA', 'VIDEO', 
    'AUDIO', 'EMBED', 'REFERENCE'
  ]),
  content: z.string(),
  // Note: evidenceStatus is intentionally omitted from Public DTO to prevent leakage
}).strict();

export const SectionDtoSchema = z.object({
  id: z.string().cuid(),
  order: z.number().int().nonnegative(),
  title: z.string(),
  blocks: z.array(ContentBlockDtoSchema),
}).strict();

export const ChapterDtoSchema = z.object({
  id: z.string().cuid(),
  order: z.number().int().nonnegative(),
  title: z.string(),
  objective: z.string().nullable(),
  sections: z.array(SectionDtoSchema),
}).strict();

// ============================================================================
// MAIN DTOS (V1)
// ============================================================================

export const PublicPublicationCardDtoSchemaV1 = z.object({
  id: z.string(),
  title: z.string().min(1),
  slug: z.string().min(1),
  subtitle: z.string().nullable(),
  coverImageUrl: PublicAssetUrlSchema.nullable(),
  category: PublicCategoryDtoSchema.nullable(),
  estimatedReadingTimeMinutes: z.number().int().nonnegative().nullable(),
  contributors: z.array(PublicContributorDtoSchema),
  edition: z.object({
    id: z.string(),
    version: z.string(),
    label: z.string(),
    publicationDate: z.string().datetime().nullable(),
  }).strict(),
}).strict();
export type PublicPublicationCardDtoV1 = z.infer<typeof PublicPublicationCardDtoSchemaV1>;

export const PublicPublicationDetailDtoSchemaV1 = PublicPublicationCardDtoSchemaV1.extend({
  executiveSummary: z.string().nullable(),
  isbn: z.string().nullable(),
  doi: z.string().nullable(),
  publisher: z.string().nullable(),
  seoTitle: z.string().nullable(),
  seoDescription: z.string().nullable(),
  jsonLdType: z.string(),
  chapters: z.array(z.object({
    id: z.string().cuid(),
    order: z.number().int().nonnegative(),
    title: z.string(),
  }).strict()),
}).strict();
export type PublicPublicationDetailDtoV1 = z.infer<typeof PublicPublicationDetailDtoSchemaV1>;

export const CanonicalPublicationDtoSchemaV1 = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  subtitle: z.string().nullable(),
  cover: z.object({
    type: z.enum(["RENDERED_TEMPLATE"]),
    templateVersion: z.string(),
  }).strict(),
  authors: z.array(z.string()),
  publicationType: z.string(),
  series: z.string(),
  edition: z.string(),
  isbn: z.string().nullable(),
  isbnStatus: z.string(),
  publicationCode: z.string(),
  publishingSeries: z.string().nullable(),
  doi: z.string().nullable(),
  publisher: z.string(),
  publicationYear: z.string(),
  executiveSummary: z.string().nullable(),
  readingTime: z.string(),
  pageCount: z.number().int().nonnegative(),
  language: z.string(),
  craftSector: z.string().nullable(),
  domain: z.string().nullable(),
  audience: z.string().nullable(),
  region: z.string().nullable(),
  whyMatters: z.string().nullable(),
  whoShouldRead: z.string().nullable(),
  keyInsights: z.array(z.string()),
  relatedCrafts: z.array(z.string()),
  relatedPolicies: z.array(z.string()),
  chapters: z.array(z.any()).optional(),
  citations: z.array(z.any()).optional(),
  reviews: z.array(z.any()).optional(),
  accessTier: z.string(),
  pricing: z.object({
    amount: z.number(),
    currency: z.string(),
  }).strict().nullable(),
  readerEnabled: z.boolean(),
  readerPath: z.string().nullable(),
  coverImageUrl: z.string().nullable(),
}).strict();
export type CanonicalPublicationDtoV1 = z.infer<typeof CanonicalPublicationDtoSchemaV1>;

export const KnowledgeReaderDtoSchemaV1 = z.object({
  id: z.string().cuid(),
  title: z.string().min(1),
  slug: z.string().min(1),
  edition: z.object({
    id: z.string().cuid(),
    version: z.string(),
    label: z.string(),
    publicationDate: z.string().datetime().nullable(),
  }).strict(),
  chapters: z.array(ChapterDtoSchema),
}).strict();
export type KnowledgeReaderDtoV1 = z.infer<typeof KnowledgeReaderDtoSchemaV1>;

export const PublicationSearchDtoSchemaV1 = z.object({
  id: z.string().cuid(),
  title: z.string(),
  slug: z.string(),
  abstract: z.string().nullable(),
  keywords: z.array(z.string()),
  publicationType: z.string(),
  series: z.string().nullable(),
}).strict();
export type PublicationSearchDtoV1 = z.infer<typeof PublicationSearchDtoSchemaV1>;

export const PublicationEditionDtoSchemaV1 = z.object({
  id: z.string().cuid(),
  publicationId: z.string().cuid(),
  version: z.string(),
  edition: z.string(),
  publicationDate: z.string().datetime().nullable(),
  status: z.enum([
    'CONCEPT', 'BLUEPRINT_DRAFT', 'BLUEPRINT_REVIEW', 'BLUEPRINT_APPROVED', 
    'RESEARCH', 'WRITING', 'INTERNAL_REVIEW', 'TECHNICAL_REVIEW', 
    'EDITORIAL_REVIEW', 'PUBLISHED', 'REVISION', 'SUPERSEDED', 'ARCHIVED'
  ]),
}).strict();
export type PublicationEditionDtoV1 = z.infer<typeof PublicationEditionDtoSchemaV1>;

export const AdminPublicationDetailDtoSchemaV1 = PublicPublicationDetailDtoSchemaV1.extend({
  revision: z.number().int().nonnegative(),
  workflowStatus: z.enum([
    'CONCEPT', 'BLUEPRINT_DRAFT', 'BLUEPRINT_REVIEW', 'BLUEPRINT_APPROVED', 
    'RESEARCH', 'WRITING', 'INTERNAL_REVIEW', 'TECHNICAL_REVIEW', 
    'EDITORIAL_REVIEW', 'PUBLISHED', 'REVISION', 'SUPERSEDED', 'ARCHIVED'
  ]),
  researchMethodology: z.string().nullable(),
  internalComments: z.string().nullable(),
  isDraft: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  workflowHistory: z.array(z.object({
    status: z.string(),
    changedBy: z.string(),
    changedAt: z.string().datetime(),
    comments: z.string().nullable()
  }).strict()),
}).strict();
export type AdminPublicationDetailDtoV1 = z.infer<typeof AdminPublicationDetailDtoSchemaV1>;
