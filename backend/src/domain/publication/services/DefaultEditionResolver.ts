import { EditionResolver, RouteRequestParams } from '../contracts/EditionResolver';
import { PublicationAggregate } from '../domain.types';
import { EditionConflictError, EditionNotFoundError } from '../domain.errors';

export class DefaultEditionResolver implements EditionResolver {
  resolveCurrentEdition(publication: PublicationAggregate): string | null {
    if (!publication.editions || publication.editions.length === 0) return null;

    const publishedEditions = publication.editions
      .filter(e => e.status === 'PUBLISHED' && e.publicationDate !== null)
      .sort((a, b) => b.publicationDate!.getTime() - a.publicationDate!.getTime());

    if (publishedEditions.length === 0) {
      return null;
    }

    if (publishedEditions.length > 1) {
      // Check if multiple editions have the exact same publication date (conflict)
      if (publishedEditions[0].publicationDate!.getTime() === publishedEditions[1].publicationDate!.getTime()) {
        throw new EditionConflictError(publication.id);
      }
    }

    return publishedEditions[0].id;
  }

  resolveHistoricalEdition(publication: PublicationAggregate, versionId: string): string | null {
    if (!publication.editions) return null;
    
    const edition = publication.editions.find(e => e.version === versionId);
    if (!edition) {
      throw new EditionNotFoundError(publication.id, `version:${versionId}`);
    }
    
    return edition.id;
  }

  resolvePreviewEdition(publication: PublicationAggregate): string | null {
    if (!publication.editions || publication.editions.length === 0) return null;
    
    // For preview, we want the most recently modified draft or review edition
    // If none exist, fallback to the latest edition of any status
    const drafts = publication.editions.filter(e => e.status !== 'PUBLISHED' && e.status !== 'ARCHIVED');
    if (drafts.length > 0) {
      return drafts[drafts.length - 1].id; 
    }
    
    return publication.editions[publication.editions.length - 1].id;
  }

  resolveEditionForRoute(publication: PublicationAggregate, requestParams: RouteRequestParams): string | null {
    if (requestParams.versionId) {
      return this.resolveHistoricalEdition(publication, requestParams.versionId);
    }
    if (requestParams.preview) {
      return this.resolvePreviewEdition(publication);
    }
    return this.resolveCurrentEdition(publication);
  }
}
