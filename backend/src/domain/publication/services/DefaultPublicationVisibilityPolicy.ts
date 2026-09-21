import { PublicationVisibilityPolicy } from '../contracts/PublicationVisibilityPolicy';
import { 
  PublicationAggregate, ChapterAggregate, SectionAggregate, ContentBlockAggregate, 
  CitationAggregate, PublicationAssetAggregate, ContributorAggregate, EditionAggregate
} from '../domain.types';
import { PublicationNotVisibleError } from '../domain.errors';

export class DefaultPublicationVisibilityPolicy implements PublicationVisibilityPolicy {
  
  isPublicationVisible(publication: PublicationAggregate): boolean {
    const publishedEditions = publication.editions?.filter(e => e.status === 'PUBLISHED') || [];
    return publishedEditions.length > 0;
  }

  canExposeEdition(edition: EditionAggregate): boolean {
    return edition.status === 'PUBLISHED' || edition.status === 'ARCHIVED';
  }

  canExposeContributor(contributor: ContributorAggregate): boolean {
    const publicRoles = ['EDITORIAL_OWNER', 'AUTHOR', 'FINAL_APPROVER'];
    return publicRoles.includes(contributor.role);
  }

  canExposeAsset(asset: PublicationAssetAggregate): boolean {
    // Assets are only exposed if they are marked as reusable (public)
    // Internal assets linked to draft content should be excluded.
    return asset.isReusable;
  }

  filterVisibleChapters(chapters: ChapterAggregate[]): ChapterAggregate[] {
    return chapters.filter(c => c.status === 'PUBLISHED' || c.status === 'READY');
  }

  filterVisibleSections(sections: SectionAggregate[]): SectionAggregate[] {
    return sections.filter(s => s.status === 'PUBLISHED' || s.status === 'READY');
  }

  filterVisibleBlocks(blocks: ContentBlockAggregate[]): ContentBlockAggregate[] {
    return blocks.filter(b => b.evidenceStatus !== 'PROHIBITED_UNTIL_SOURCED');
  }

  filterVerifiedCitations(citations: CitationAggregate[]): CitationAggregate[] {
    return citations.filter(c => c.evidenceStatus === 'VERIFIED');
  }

  /**
   * Orchestrates the complete filtering of the hierarchical content tree.
   * This guarantees that a caller cannot forget a nested filtering stage.
   */
  filterPublicationHierarchy(chapters: ChapterAggregate[]): ChapterAggregate[] {
    const visibleChapters = this.filterVisibleChapters(chapters);

    return visibleChapters.map(chapter => {
      // Create a shallow copy of the chapter to avoid mutating the aggregate
      const chapterCopy = { ...chapter };
      
      const visibleSections = this.filterVisibleSections(chapterCopy.sections);
      
      chapterCopy.sections = visibleSections.map(section => {
        const sectionCopy = { ...section };
        sectionCopy.blocks = this.filterVisibleBlocks(sectionCopy.blocks);
        return sectionCopy;
      });
      
      return chapterCopy;
    });
  }
}
