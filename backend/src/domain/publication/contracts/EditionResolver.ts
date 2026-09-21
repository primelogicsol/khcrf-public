import { PublicationAggregate } from '../domain.types';

export interface RouteRequestParams {
  versionId?: string;
  preview?: boolean;
}

/**
 * Determines the specific edition of a publication to serve based on the request context.
 */
export interface EditionResolver {
  /**
   * Resolves the current published edition.
   * Rule: Latest active edition where status = PUBLISHED, ordered by publicationDate descending.
   * Must handle cases where multiple active editions exist (e.g., throwing a deterministic error or resolving safely).
   */
  resolveCurrentEdition(publication: PublicationAggregate): string | null;

  /**
   * Resolves a requested historical edition.
   */
  resolveHistoricalEdition(publication: PublicationAggregate, versionId: string): string | null;

  /**
   * Resolves a preview edition for authorized internal users.
   */
  resolvePreviewEdition(publication: PublicationAggregate): string | null;

  /**
   * Dedicated helper for the router to immediately resolve the target edition string 
   * so routing logic is centralized and testable.
   */
  resolveEditionForRoute(publication: PublicationAggregate, requestParams: RouteRequestParams): string | null;
}
