import { PublicationAggregate, EditionAggregate } from '../domain.types';

export interface PublicationCardQuery {
  categoryId?: string;
  publicationType?: string;
  series?: string;
  searchTerm?: string;
  limit?: number;
  offset?: number;
  visibility?: 'PUBLIC' | 'ALL';
  locale?: string;
}

/**
 * The strict interface for the Publication Repository.
 * Responsibilities:
 * - Fetch required canonical and legacy relations.
 * - Enforce tenant/authorization scopes where applicable.
 * - Do NOT assemble DTOs.
 * - Return pure domain aggregates for the mapper.
 * - Zero knowledge of Prisma, HTTP, or DTO serialization.
 */
export interface PublicationRepository {
  /**
   * Fetch a publication and all its internal history/relations for Admin use.
   */
  findAdminPublicationBySlug(slug: string): Promise<PublicationAggregate | null>;

  /**
   * Fetch a publication specifically for the Public Detail Page.
   */
  findPublicPublicationBySlug(slug: string): Promise<PublicationAggregate | null>;

  /**
   * Fetch a list of publication cards based on a structured query.
   */
  findPublicationCards(query: PublicationCardQuery): Promise<PublicationAggregate[]>;

  /**
   * Fetch the deeply nested hierarchical content for the Knowledge Reader.
   */
  findKnowledgeReaderPublication(slug: string, editionId?: string): Promise<PublicationAggregate | null>;

  /**
   * Fetch a specific edition of a publication (historical or active).
   */
  findEditionByVersion(publicationId: string, version: string): Promise<EditionAggregate | null>;
}
