import { 
  PublicationAggregate, 
  ChapterAggregate, 
  SectionAggregate, 
  ContentBlockAggregate, 
  CitationAggregate,
  PublicationAssetAggregate,
  ContributorAggregate,
  EditionAggregate
} from '../domain.types';

/**
 * Enforces visibility rules before a publication or its parts are passed to a Mapper.
 * This ensures that a published publication does not accidentally leak draft chapters.
 */
export interface PublicationVisibilityPolicy {
  /**
   * Determines if the entire publication is visible to the public.
   */
  isPublicationVisible(publication: PublicationAggregate): boolean;

  /**
   * Determines if a specific edition can be exposed.
   */
  canExposeEdition(edition: EditionAggregate): boolean;

  /**
   * Determines if a specific contributor can be exposed publicly.
   */
  canExposeContributor(contributor: ContributorAggregate): boolean;

  /**
   * Determines if an asset (image, dataset, video) is cleared for public exposure.
   */
  canExposeAsset(asset: PublicationAssetAggregate): boolean;

  /**
   * Filters the chapters array, removing drafts or internal-only chapters.
   */
  filterVisibleChapters(chapters: ChapterAggregate[]): ChapterAggregate[];

  /**
   * Filters sections, ensuring only published sections are exposed.
   */
  filterVisibleSections(sections: SectionAggregate[]): SectionAggregate[];

  /**
   * Filters blocks within a section, allowing block-level visibility rules.
   */
  filterVisibleBlocks(blocks: ContentBlockAggregate[]): ContentBlockAggregate[];

  /**
   * Filters citations, strictly removing anything marked PROHIBITED_UNTIL_SOURCED.
   */
  filterVerifiedCitations(citations: CitationAggregate[]): CitationAggregate[];
}
