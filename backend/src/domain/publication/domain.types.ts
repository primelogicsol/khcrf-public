// ============================================================================
// PURE DOMAIN AGGREGATES
// These interfaces describe the domain model purely, with zero Prisma leakage.
// ============================================================================

export type FallbackPolicy = 
  | 'REQUIRED_WITH_LEGACY_FALLBACK' 
  | 'LEGACY_ALLOWED' 
  | 'CANONICAL_ONLY' 
  | 'LEGACY_PROHIBITED';

export interface ContributorAggregate {
  userId: string;
  name: string;
  role: string;
}

export interface ContentBlockAggregate {
  id: string;
  order: number;
  blockType: string;
  content: string;
  evidenceStatus: string | null;
}

export interface SectionAggregate {
  id: string;
  order: number;
  title: string;
  status: string;
  blocks: ContentBlockAggregate[];
}

export interface ChapterAggregate {
  id: string;
  order: number;
  title: string;
  status: string;
  objective: string | null;
  sections: SectionAggregate[];
}

export interface CitationAggregate {
  id: string;
  claim: string;
  evidenceStatus: string;
  sourceData: string | null;
}

export interface PublicationAssetAggregate {
  id: string;
  assetType: string;
  title: string;
  url: string;
  altText: string | null;
  isReusable: boolean;
}

export interface EditionAggregate {
  id: string;
  publicationId: string;
  version: string;
  edition: string;
  publicationDate: Date | null;
  status: string;
}

export interface WorkflowHistoryAggregate {
  status: string;
  changedBy: string;
  changedAt: Date;
  comments: string | null;
}

export interface PublicationAggregate {
  id: string;
  slug: string;
  revision: number;
  title: string;
  subtitle: string | null;
  category: string | null;
  estimatedReadingTimeMinutes: number | null;
  
  executiveSummary: string | null;
  _legacyDescription?: string | null;
  isbn: string | null;
  doi: string | null;
  publisher: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  jsonLdType: string;
  coverImageUrl: string | null;
  
  editions: EditionAggregate[];
  chapters: ChapterAggregate[];
  citations: CitationAggregate[];
  assets: PublicationAssetAggregate[];
  contributors: ContributorAggregate[];
  
  workflowStatus: string;
  researchMethodology: string | null;
  internalComments: string | null;
  isDraft: boolean;
  createdAt: Date;
  updatedAt: Date;
  workflowHistory: WorkflowHistoryAggregate[];

  author?: string | null;
  published?: string | null;
  publicationType?: string | null;
  pages?: number | null;
  language?: string | null;
  features?: any;
  accessType?: string | null;
  price?: number | null;
}
