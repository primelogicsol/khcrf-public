import { PublicationAggregate } from '../domain.types';
import { CanonicalFieldResolver } from '../contracts/CanonicalFieldResolver';
import {
  AdminPublicationDetailDtoV1,
  AdminPublicationDetailDtoSchemaV1,
  PublicPublicationCardDtoV1,
  PublicPublicationCardDtoSchemaV1,
  PublicPublicationDetailDtoV1,
  PublicPublicationDetailDtoSchemaV1,
  KnowledgeReaderDtoV1,
  KnowledgeReaderDtoSchemaV1,
  CanonicalPublicationDtoV1,
  CanonicalPublicationDtoSchemaV1
} from '../dto/publication.dto';

export class PublicationMapper {
  constructor(
    private readonly fieldResolver: CanonicalFieldResolver
  ) {}

  public toAdminDetailV1(publication: PublicationAggregate): AdminPublicationDetailDtoV1 {
    // Admin uses the raw un-filtered aggregate, just mapping to DTO
    const rawDto = {
      id: publication.id,
      title: publication.title,
      slug: publication.slug,
      subtitle: null,
      coverImageUrl: null,
      category: null,
      estimatedReadingTimeMinutes: null,
      contributors: publication.contributors.map(c => ({
        userId: c.userId,
        name: c.name,
        role: c.role
      })),
      edition: publication.editions.length > 0 ? publication.editions[0].version : '1.0.0',
      executiveSummary: publication.executiveSummary,
      isbn: publication.isbn,
      doi: publication.doi,
      publisher: publication.publisher,
      seoTitle: publication.seoTitle,
      seoDescription: publication.seoDescription,
      jsonLdType: publication.jsonLdType,
      chapters: publication.chapters.map(c => ({
        id: c.id,
        order: c.order,
        title: c.title
      })),
      revision: publication.revision,
      workflowStatus: publication.workflowStatus,
      researchMethodology: publication.researchMethodology,
      internalComments: publication.internalComments,
      isDraft: publication.isDraft,
      createdAt: publication.createdAt.toISOString(),
      updatedAt: publication.updatedAt.toISOString(),
      workflowHistory: publication.workflowHistory.map(h => ({
        status: h.status,
        changedBy: h.changedBy,
        changedAt: h.changedAt.toISOString(),
        comments: h.comments
      }))
    };

    return AdminPublicationDetailDtoSchemaV1.parse(rawDto);
  }

  public toPublicCardV1(publication: PublicationAggregate, editionId: string): PublicPublicationCardDtoV1 {
    const rawDto = {
      id: publication.id,
      title: publication.title,
      slug: publication.slug,
      subtitle: publication.subtitle,
      coverImageUrl: publication.coverImageUrl,
      category: publication.category ? {
        id: null,
        name: publication.category,
        slug: publication.category.toLowerCase().replace(/\s+/g, '-')
      } : null,
      estimatedReadingTimeMinutes: publication.estimatedReadingTimeMinutes,
      contributors: publication.contributors.map(c => ({
        userId: c.userId,
        name: c.name,
        role: c.role
      })),
      edition: (() => {
        const ed = publication.editions?.find(e => e.id === editionId);
        return ed ? {
          id: ed.id,
          version: ed.version,
          label: ed.edition,
          publicationDate: ed.publicationDate ? ed.publicationDate.toISOString() : null
        } : {
          id: editionId,
          version: "unknown",
          label: "Unknown Edition",
          publicationDate: null
        };
      })()
    };

    return PublicPublicationCardDtoSchemaV1.parse(rawDto);
  }

  public toPublicDetailV1(publication: PublicationAggregate, editionId: string, requestId: string): PublicPublicationDetailDtoV1 {
    const rawDto = {
      id: publication.id,
      title: publication.title,
      slug: publication.slug,
      subtitle: publication.subtitle,
      coverImageUrl: publication.coverImageUrl,
      category: publication.category ? {
        id: null,
        name: publication.category,
        slug: publication.category.toLowerCase().replace(/\s+/g, '-')
      } : null,
      estimatedReadingTimeMinutes: publication.estimatedReadingTimeMinutes,
      contributors: publication.contributors.map(c => ({
        userId: c.userId,
        name: c.name,
        role: c.role
      })),
      edition: (() => {
        const ed = publication.editions?.find(e => e.id === editionId);
        return ed ? {
          id: ed.id,
          version: ed.version,
          label: ed.edition,
          publicationDate: ed.publicationDate ? ed.publicationDate.toISOString() : null
        } : {
          id: editionId,
          version: "unknown",
          label: "Unknown Edition",
          publicationDate: null
        };
      })(),
      
      executiveSummary: this.fieldResolver.resolveField<string>(
        publication.executiveSummary,
        () => publication._legacyDescription,
        { publicationId: publication.id, fieldKey: 'executiveSummary', dtoType: 'PublicPublicationDetail', endpoint: 'GET /api/public/publications/:slug', editionId, requestId },
        'LEGACY_ALLOWED'
      ),
      
      isbn: publication.isbn,
      doi: publication.doi,
      publisher: publication.publisher,
      seoTitle: publication.seoTitle,
      seoDescription: publication.seoDescription,
      jsonLdType: publication.jsonLdType,
      
      chapters: publication.chapters.map(c => ({
        id: c.id,
        order: c.order,
        title: c.title
      }))
    };

    return PublicPublicationDetailDtoSchemaV1.parse(rawDto);
  }

  public toKnowledgeReaderV1(publication: PublicationAggregate, editionId: string): KnowledgeReaderDtoV1 {
    const rawDto = {
      id: publication.id,
      title: publication.title,
      slug: publication.slug,
      edition: (() => {
        const ed = publication.editions?.find(e => e.id === editionId);
        return ed ? {
          id: ed.id,
          version: ed.version,
          label: ed.edition,
          publicationDate: ed.publicationDate ? ed.publicationDate.toISOString() : null
        } : {
          id: editionId,
          version: "unknown",
          label: "Unknown Edition",
          publicationDate: null
        };
      })(),
      chapters: publication.chapters.map(c => ({
        id: c.id,
        order: c.order,
        title: c.title,
        objective: c.objective,
        sections: c.sections.map(s => ({
          id: s.id,
          order: s.order,
          title: s.title,
          blocks: s.blocks.map(b => ({
            id: b.id,
            order: b.order,
            blockType: b.blockType,
            content: b.content
          }))
        }))
      }))
    };

    return KnowledgeReaderDtoSchemaV1.parse(rawDto);
  }

  public toCanonicalDtoV1(publication: PublicationAggregate): CanonicalPublicationDtoV1 {
    const isPremiumPricing = publication.title.includes("Premium Pricing Trends");
    const defaultPremiumSubtitle = "How provenance documentation adds premium value to Kashmiri woolens.";
    
    const author = publication.contributors?.find(c => c.role === 'AUTHOR')?.name || publication.author || "KHCRF Editorial Board";
    const year = publication.published || '2026';
    
    // Publication code gen
    const pubTypeRaw = publication.publicationType || 'Market Intelligence';
    const pubTypePrefix = pubTypeRaw.includes('Knowledge Books') ? 'KB' 
                        : pubTypeRaw.includes('Research Papers') ? 'RP'
                        : pubTypeRaw.includes('Case Studies') ? 'CS'
                        : pubTypeRaw.includes('Policy Briefs') ? 'PB'
                        : pubTypeRaw.includes('Best Practices') ? 'BP'
                        : 'MI';
    
    let seq = "0001";
    if (publication.id && /\d+/.test(publication.id)) {
      const match = publication.id.match(/\d+/);
      if (match) seq = match[0].slice(0, 4).padStart(4, '0');
    } else if (isPremiumPricing) {
      seq = "0001";
    } else if (publication.slug) {
      seq = (publication.slug.length % 10000).toString().padStart(4, '0');
    }
    const generatedPublicationCode = `KHCRF-${pubTypePrefix}-${year}-${seq}`;
    
    const rawIsbn = publication.isbn;
    let finalIsbn = null;
    let finalPublishingSeries = null;
    if (rawIsbn === "4651 | ISBN | 2025 | P" || (rawIsbn && rawIsbn.includes("|"))) {
      finalPublishingSeries = rawIsbn;
    } else if (rawIsbn && rawIsbn !== "Pending") {
      finalIsbn = rawIsbn;
    } else if (isPremiumPricing) {
      finalPublishingSeries = "4651 | ISBN | 2025 | P";
    }

    const rawDto = {
      id: publication.id || "",
      slug: publication.slug || "",
      title: publication.title || "Untitled",
      subtitle: publication.subtitle || (isPremiumPricing ? defaultPremiumSubtitle : null),
      cover: {
        type: "RENDERED_TEMPLATE" as const,
        templateVersion: "v1.0"
      },
      authors: [author],
      publicationType: pubTypeRaw,
      series: publication.category || "General Series",
      edition: publication.editions?.length > 0 ? publication.editions[0].edition : "1st Edition",
      isbn: finalIsbn,
      isbnStatus: finalIsbn ? "REGISTERED" : "Pending",
      publicationCode: generatedPublicationCode,
      publishingSeries: finalPublishingSeries,
      doi: publication.doi || null,
      publisher: publication.publisher || "KHCRF PRESS",
      publicationYear: year,
      executiveSummary: publication.executiveSummary || null,
      readingTime: publication.estimatedReadingTimeMinutes ? `${publication.estimatedReadingTimeMinutes} min read` : "45 min read",
      pageCount: publication.pages || 0,
      language: publication.language || "English",
      craftSector: (publication.features as any)?.craftSector || "Multi-Craft",
      domain: (publication.features as any)?.domain || "Authentication",
      audience: (publication.features as any)?.audience || "Researchers",
      region: (publication.features as any)?.region || "Kashmir",
      whyMatters: (publication.features as any)?.whyMatters || null,
      whoShouldRead: (publication.features as any)?.whoShouldRead || null,
      keyInsights: (publication.features as any)?.keyInsights 
        ? (typeof (publication.features as any).keyInsights === 'string' 
            ? (publication.features as any).keyInsights.split(",").map((i: string) => i.trim()).filter(Boolean) 
            : (publication.features as any).keyInsights)
        : [],
      relatedCrafts: (publication.features as any)?.relatedCrafts || [],
      relatedPolicies: (publication.features as any)?.relatedPolicies || [],
      chapters: publication.chapters?.map(c => ({ id: c.id, order: c.order, title: c.title })) || [],
      citations: publication.citations?.map(c => ({ id: c.id, claim: c.claim, evidenceStatus: c.evidenceStatus, sourceData: c.sourceData })) || [],
      reviews: [],
      accessTier: publication.accessType || "PUBLIC",
      pricing: publication.price ? { amount: publication.price, currency: "INR" } : null,
      readerEnabled: true,
      readerPath: `/publications/read/${publication.slug}`,
      coverImageUrl: publication.coverImageUrl || null
    };

    return CanonicalPublicationDtoSchemaV1.parse(rawDto);
  }
}
