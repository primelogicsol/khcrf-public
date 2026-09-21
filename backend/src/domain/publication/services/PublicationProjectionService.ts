import { PublicationAggregate } from '../domain.types';
import { PublicationVisibilityPolicy } from '../contracts/PublicationVisibilityPolicy';
import { EditionResolver } from '../contracts/EditionResolver';
import { PublicationMapper } from '../mappers/PublicationMapper';
import { PublicationNotVisibleError, EditionNotFoundError } from '../domain.errors';

export class PublicationProjectionService {
  constructor(
    private readonly visibilityPolicy: PublicationVisibilityPolicy,
    private readonly editionResolver: EditionResolver,
    private readonly mapper: PublicationMapper
  ) {}

  public projectPublicDetail(aggregate: PublicationAggregate, requestId: string) {
    if (!this.visibilityPolicy.isPublicationVisible(aggregate)) {
      throw new PublicationNotVisibleError(aggregate.id);
    }

    const editionId = this.editionResolver.resolveCurrentEdition(aggregate);
    if (!editionId) {
      throw new EditionNotFoundError(aggregate.id, 'current');
    }

    const filterHierarchy = (chapters: any[]) => 
      this.visibilityPolicy.filterVisibleChapters(chapters).map(c => ({
        ...c,
        sections: this.visibilityPolicy.filterVisibleSections(c.sections).map(s => ({
          ...s,
          blocks: this.visibilityPolicy.filterVisibleBlocks(s.blocks)
        }))
      }));

    // Scrub immutable projection
    const filteredAggregate: PublicationAggregate = {
      ...aggregate,
      chapters: filterHierarchy(aggregate.chapters),
      contributors: aggregate.contributors.filter(c => this.visibilityPolicy.canExposeContributor(c)),
      assets: aggregate.assets.filter(a => this.visibilityPolicy.canExposeAsset(a))
    };

    return this.mapper.toPublicDetailV1(filteredAggregate, editionId, requestId);
  }
  
  public projectKnowledgeReader(aggregate: PublicationAggregate) {
    if (!this.visibilityPolicy.isPublicationVisible(aggregate)) {
      throw new PublicationNotVisibleError(aggregate.id);
    }

    const editionId = this.editionResolver.resolveCurrentEdition(aggregate);
    if (!editionId) {
      throw new EditionNotFoundError(aggregate.id, 'current');
    }

    const filterHierarchy = (chapters: any[]) => 
      this.visibilityPolicy.filterVisibleChapters(chapters).map(c => ({
        ...c,
        sections: this.visibilityPolicy.filterVisibleSections(c.sections).map(s => ({
          ...s,
          blocks: this.visibilityPolicy.filterVisibleBlocks(s.blocks)
        }))
      }));

    const filteredAggregate: PublicationAggregate = {
      ...aggregate,
      chapters: filterHierarchy(aggregate.chapters)
    };

    return this.mapper.toKnowledgeReaderV1(filteredAggregate, editionId);
  }

  public projectPublicCards(aggregates: PublicationAggregate[]) {
    return aggregates
      .filter(agg => this.visibilityPolicy.isPublicationVisible(agg))
      .map(agg => {
        const editionId = this.editionResolver.resolveCurrentEdition(agg) || 'latest';
        const filteredAggregate: PublicationAggregate = {
          ...agg,
          contributors: agg.contributors.filter(c => this.visibilityPolicy.canExposeContributor(c))
        };
        return this.mapper.toPublicCardV1(filteredAggregate, editionId);
      });
  }

  public projectAdminDetail(aggregate: PublicationAggregate) {
    // Admin bypasses visibility rules
    return this.mapper.toAdminDetailV1(aggregate);
  }

  public projectCanonicalPublication(aggregate: PublicationAggregate) {
    // We can enforce visibility policy here if we are serving this to the public
    return this.mapper.toCanonicalDtoV1(aggregate);
  }
}
