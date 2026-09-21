import { PublicationProjectionService } from '../../services/PublicationProjectionService';
import { PublicationMapper } from '../../mappers/PublicationMapper';
import { DefaultCanonicalFieldResolver } from '../../services/DefaultCanonicalFieldResolver';
import { DefaultPublicationVisibilityPolicy } from '../../services/DefaultPublicationVisibilityPolicy';
import { DefaultEditionResolver } from '../../services/DefaultEditionResolver';
import { NoOpTelemetrySink } from '../../telemetry/TelemetrySink';
import { PublicationAggregate } from '../../domain.types';
import { PublicationNotVisibleError, CanonicalResolutionError, EditionConflictError } from '../../domain.errors';
import { z } from 'zod';

describe('Publication Projection & Resolvers Exhaustive Tests', () => {
  let telemetry: NoOpTelemetrySink;
  let fieldResolver: DefaultCanonicalFieldResolver;
  let visibilityPolicy: DefaultPublicationVisibilityPolicy;
  let editionResolver: DefaultEditionResolver;
  let mapper: PublicationMapper;
  let projectionService: PublicationProjectionService;

  beforeEach(() => {
    telemetry = new NoOpTelemetrySink();
    fieldResolver = new DefaultCanonicalFieldResolver(telemetry);
    visibilityPolicy = new DefaultPublicationVisibilityPolicy();
    editionResolver = new DefaultEditionResolver();
    mapper = new PublicationMapper(fieldResolver);
    projectionService = new PublicationProjectionService(visibilityPolicy, editionResolver, mapper);
  });

  const createBaseAggregate = (): PublicationAggregate => ({
    id: 'cuid-pub-123',
    slug: 'test-publication',
    revision: 1,
    title: 'Test Publication',
    executiveSummary: null,
    isbn: null,
    doi: null,
    publisher: null,
    seoTitle: null,
    seoDescription: null,
    jsonLdType: 'Book',
    editions: [{
      id: 'cuid-ed-1',
      publicationId: 'cuid-pub-123',
      version: '1.0.0',
      edition: 'First Edition',
      publicationDate: new Date('2023-01-01'),
      status: 'PUBLISHED'
    }],
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
    }],
    workflowStatus: 'PUBLISHED',
    researchMethodology: null,
    internalComments: null,
    isDraft: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    workflowHistory: []
  });

  describe('CanonicalFieldResolver', () => {
    it('canonical value wins over legacy (including 0, false, "")', () => {
      const context = { publicationId: '1', fieldKey: 'test', dtoType: 'Test', endpoint: 'test', editionId: '1', requestId: '1' };
      
      expect(fieldResolver.resolveField('canonical', () => 'legacy', context, 'LEGACY_ALLOWED')).toBe('canonical');
      expect(fieldResolver.resolveField('', () => 'legacy', context, 'LEGACY_ALLOWED')).toBe('');
      expect(fieldResolver.resolveField(0, () => 99, context, 'LEGACY_ALLOWED')).toBe(0);
      expect(fieldResolver.resolveField(false, () => true, context, 'LEGACY_ALLOWED')).toBe(false);
      expect(fieldResolver.resolveField([], () => ['legacy'], context, 'LEGACY_ALLOWED')).toEqual([]);
    });

    it('legacy fallback occurs when permitted', () => {
      const context = { publicationId: '1', fieldKey: 'test', dtoType: 'Test', endpoint: 'test', editionId: '1', requestId: '1' };
      expect(fieldResolver.resolveField(null, () => 'legacy', context, 'LEGACY_ALLOWED')).toBe('legacy');
    });

    it('canonical-only ignores legacy', () => {
      const context = { publicationId: '1', fieldKey: 'test', dtoType: 'Test', endpoint: 'test', editionId: '1', requestId: '1' };
      expect(fieldResolver.resolveField(null, () => 'legacy', context, 'CANONICAL_ONLY')).toBe(null);
    });

    it('prohibited fallback fails closed', () => {
      const context = { publicationId: '1', fieldKey: 'test', dtoType: 'Test', endpoint: 'test', editionId: '1', requestId: '1' };
      expect(() => fieldResolver.resolveField(null, () => 'legacy', context, 'LEGACY_PROHIBITED'))
        .toThrow(CanonicalResolutionError);
    });

    it('required fallback fails when both sources absent', () => {
      const context = { publicationId: '1', fieldKey: 'test', dtoType: 'Test', endpoint: 'test', editionId: '1', requestId: '1' };
      expect(() => fieldResolver.resolveField(null, () => null, context, 'REQUIRED_WITH_LEGACY_FALLBACK'))
        .toThrow(CanonicalResolutionError);
    });
  });

  describe('EditionResolver', () => {
    it('duplicate published editions raise EditionConflictError', () => {
      const aggregate = createBaseAggregate();
      const duplicateDate = new Date();
      aggregate.editions = [
        { id: '1', publicationId: 'pub', version: '1', edition: 'E1', publicationDate: duplicateDate, status: 'PUBLISHED' },
        { id: '2', publicationId: 'pub', version: '2', edition: 'E2', publicationDate: duplicateDate, status: 'PUBLISHED' }
      ];
      
      expect(() => editionResolver.resolveCurrentEdition(aggregate)).toThrow(EditionConflictError);
    });
  });

  describe('PublicationProjectionService & Visibility', () => {
    it('source aggregate is not mutated (immutability test)', () => {
      const aggregate = createBaseAggregate();
      
      // Add prohibited block
      aggregate.chapters[0].sections[0].blocks.push({
        id: 'cuid-bl-prohibited', order: 2, blockType: 'PARAGRAPH', content: 'Secret', evidenceStatus: 'PROHIBITED_UNTIL_SOURCED'
      });

      const snapshotBeforeProjection = JSON.parse(JSON.stringify(aggregate));
      
      const dto = projectionService.projectKnowledgeReader(aggregate);

      expect(dto.chapters[0].sections[0].blocks.length).toBe(1); // Mapped DTO is filtered
      expect(aggregate).toEqual(snapshotBeforeProjection); // Source aggregate is 100% untouched
    });

    it('unpublished content never reaches a public DTO', () => {
      const aggregate = createBaseAggregate();
      aggregate.editions[0].status = 'DRAFT'; 

      expect(() => projectionService.projectPublicDetail(aggregate, 'req-id')).toThrow(PublicationNotVisibleError);
    });

    it('strict DTO schemas reject unexpected keys', () => {
      const rawDto = {
        id: '123',
        title: 'test',
        slug: 'test',
        subtitle: null,
        coverImageUrl: null,
        category: null,
        estimatedReadingTimeMinutes: null,
        contributors: [],
        edition: '1.0',
        UNKNOWN_KEY: 'LEAK' // This should crash the strict schema
      };

      const { PublicPublicationCardDtoSchemaV1 } = require('../../dto/publication.dto');
      expect(() => PublicPublicationCardDtoSchemaV1.parse(rawDto)).toThrow(z.ZodError);
    });
  });
});
