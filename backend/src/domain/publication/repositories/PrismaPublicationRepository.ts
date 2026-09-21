import { PrismaClient, Prisma } from '@prisma/client';
import { prisma } from '../../../config/db.js';
import { PublicationRepository, PublicationCardQuery } from '../contracts/PublicationRepository.js';
import { PublicationAggregate, EditionAggregate, ChapterAggregate, SectionAggregate, ContentBlockAggregate, PublicationAssetAggregate, ContributorAggregate, CitationAggregate } from '../domain.types.js';

export class PrismaPublicationRepository implements PublicationRepository {
  public async findPublicPublicationBySlug(slug: string): Promise<PublicationAggregate | null> {
    const prismaPub = await (prisma as any).publication.findUnique({
      where: { slug },
      include: {
        chapters: {
          include: {
            sections: {
              include: {
                blocks: true
              }
            }
          }
        },
        assets: true,
        editions: true,
        contributors: true,
        citations: true,
        publicationMetadata: true,
        readerExp: true
      }
    });

    if (!prismaPub) return null;
    return this.mapToAggregate(prismaPub as any);
  }

  public async findPublicationCards(query: PublicationCardQuery): Promise<PublicationAggregate[]> {
    const where: any = {};
    if (query.categoryId) where.categoryId = query.categoryId;
    
    const prismaPubs = await (prisma as any).publication.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        chapters: {
          include: {
            sections: {
              include: {
                blocks: true
              }
            }
          }
        },
        assets: true,
        editions: true,
        contributors: true,
        citations: true,
        publicationMetadata: true,
        readerExp: true
      }
    });

    return prismaPubs.map((p: any) => this.mapToAggregate(p));
  }

  async findAdminPublicationBySlug(slug: string): Promise<PublicationAggregate | null> {
    return this.findPublicPublicationBySlug(slug);
  }

  async findKnowledgeReaderPublication(slug: string, editionId?: string): Promise<PublicationAggregate | null> {
    return this.findPublicPublicationBySlug(slug);
  }

  async findEditionByVersion(publicationId: string, version: string): Promise<EditionAggregate | null> {
    return null; 
  }

  private mapToAggregate(prismaPub: any): PublicationAggregate {
    const coverAsset = (prismaPub.assets || []).find((a: any) => a.assetType === 'COVER' || a.assetType === 'FRONT_COVER');
    const legacyCover = prismaPub.coverImage || prismaPub.imagePath || null;

    return {
      id: prismaPub.id,
      slug: prismaPub.slug,
      revision: prismaPub.revision || 1,
      title: prismaPub.title,
      subtitle: prismaPub.subtitle || prismaPub.metadata?.subtitle || null,
      category: prismaPub.category || null,
      estimatedReadingTimeMinutes: prismaPub.readerExp?.estimatedReadingTime || prismaPub.metadata?.estimatedReadingTimeMinutes || null,
      
      executiveSummary: prismaPub.executiveSummary || prismaPub.description || null,
      _legacyDescription: prismaPub.description || null,
      
      isbn: prismaPub.publicationMetadata?.isbn || prismaPub.metadata?.isbn || null,
      doi: prismaPub.publicationMetadata?.doi || prismaPub.metadata?.doi || null,
      publisher: prismaPub.publicationMetadata?.publisher || prismaPub.metadata?.publisher || null,
      seoTitle: prismaPub.seo?.seoTitle || prismaPub.seoTitle || null,
      seoDescription: prismaPub.seo?.seoDescription || prismaPub.seoDescription || null,
      jsonLdType: prismaPub.seo?.jsonLdType || 'Book',
      coverImageUrl: coverAsset ? coverAsset.url : legacyCover,
      
      editions: (prismaPub.editions || []).map((e: any) => ({
        id: e.id,
        publicationId: e.publicationId,
        version: e.version,
        edition: e.edition,
        publicationDate: e.publicationDate,
        status: e.status
      })),
      
      chapters: (prismaPub.chapters || []).map((c: any) => ({
        id: c.id,
        order: c.order,
        title: c.title,
        status: c.status,
        objective: null,
        sections: (c.sections || []).map((s: any) => ({
          id: s.id,
          order: s.order,
          title: s.title,
          status: s.status,
          blocks: (s.blocks || []).map((b: any) => ({
            id: b.id,
            order: b.order,
            blockType: b.blockType,
            content: b.content,
            evidenceStatus: b.evidenceStatus
          }))
        }))
      })),
      
      citations: (prismaPub.citations || []).map((c: any) => ({
        id: c.id,
        claim: c.claim,
        evidenceStatus: c.evidenceStatus,
        sourceData: c.sourceData
      })),
      
      assets: (prismaPub.assets || []).map((a: any) => ({
        id: a.id,
        assetType: a.assetType,
        title: a.title,
        url: a.url || '',
        altText: a.altText || null,
        isReusable: a.isReusable || true
      })),
      
      contributors: (prismaPub.contributors || []).map((c: any) => ({
        userId: c.userId,
        name: c.user?.name || 'Unknown',
        role: c.role
      })),
      
      workflowStatus: 'PUBLISHED',
      researchMethodology: null,
      internalComments: null,
      isDraft: false,
      createdAt: prismaPub.createdAt,
      updatedAt: prismaPub.updatedAt,
      workflowHistory: [],
      
      author: prismaPub.author || null,
      published: prismaPub.published || null,
      publicationType: prismaPub.publicationType || null,
      pages: prismaPub.pages || 0,
      language: prismaPub.language || null,
      features: prismaPub.features || null,
      accessType: prismaPub.accessType || null,
      price: prismaPub.price || null
    };
  }
}
