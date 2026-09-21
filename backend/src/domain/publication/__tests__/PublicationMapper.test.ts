import { PublicationMapper } from '../../mappers/PublicationMapper';
import { DefaultCanonicalFieldResolver } from '../../services/DefaultCanonicalFieldResolver';
import { DefaultPublicationVisibilityPolicy } from '../../services/DefaultPublicationVisibilityPolicy';
import { DefaultEditionResolver } from '../../services/DefaultEditionResolver';
import { PublicationAggregate } from '../../domain.types';

describe('PublicationMapper Contract Tests', () => {
  let mapper: PublicationMapper;
  let fieldResolver: DefaultCanonicalFieldResolver;
  let visibilityPolicy: DefaultPublicationVisibilityPolicy;
  let editionResolver: DefaultEditionResolver;

  beforeEach(() => {
    fieldResolver = new DefaultCanonicalFieldResolver();
    visibilityPolicy = new DefaultPublicationVisibilityPolicy();
    editionResolver = new DefaultEditionResolver();
    mapper = new PublicationMapper(fieldResolver, visibilityPolicy, editionResolver);
  });

  const validAggregate: PublicationAggregate = {
    id: 'cuid-pub-123',
    slug: 'test-publication',
    revision: 1,
    title: 'Test Publication',
    currentEdition: {
      id: 'cuid-ed-1',
      publicationId: 'cuid-pub-123',
      version: '1.0.0',
      edition: 'First Edition',
      publicationDate: new Date(),
      status: 'PUBLISHED'
    },
    chapters: [{
      id: 'cuid-ch-1',
      order: 1,
      title: 'Chapter 1',
      status: 'PUBLISHED',
      objective: null,
      sections: [{
        id: 'cuid-sec-1',
        order: 1,
        title: 'Section 1',
        status: 'PUBLISHED',
        blocks: [{
          id: 'cuid-bl-1',
          order: 1,
          blockType: 'PARAGRAPH',
          content: 'Hello world',
          evidenceStatus: 'VERIFIED'
        }]
      }]
    }],
    citations: [],
    assets: [],
    contributors: [{
      userId: 'cuid-user-1',
      name: 'Dr. Smith',
      role: 'AUTHOR'
    }]
  };

  it('toPublicCardV1 strips evidenceStatus and internal fields', () => {
    const dto = mapper.toPublicCardV1(validAggregate);
    
    // Zod .parse() already ran inside the mapper, we just verify the output shape
    expect(dto).toHaveProperty('id');
    expect(dto).toHaveProperty('title');
    expect((dto as any).revision).toBeUndefined(); // Internal field
    expect((dto as any).chapters).toBeUndefined();
  });

  it('toKnowledgeReaderV1 successfully filters out PROHIBITED blocks', () => {
    const aggregateWithProhibited = JSON.parse(JSON.stringify(validAggregate)); // Deep copy
    aggregateWithProhibited.chapters[0].sections[0].blocks[0].evidenceStatus = 'PROHIBITED_UNTIL_SOURCED';

    const dto = mapper.toKnowledgeReaderV1(aggregateWithProhibited);
    
    // Block should have been stripped out by visibility policy
    expect(dto.chapters[0].sections[0].blocks.length).toBe(0);
  });

  it('throws an error if an unpublished publication is mapped to public detail', () => {
    const draftAggregate = JSON.parse(JSON.stringify(validAggregate));
    draftAggregate.currentEdition.status = 'DRAFT';

    expect(() => mapper.toPublicDetailV1(draftAggregate, 'req-id')).toThrowError(/Mapper Invariant Violation/);
  });
});
