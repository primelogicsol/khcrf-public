import { prisma } from '../config/db';

export class SearchService {
  /**
   * Unified search across knowledge graph entities and taxonomies
   */
  static async globalSearch(query: string, limit: number = 10) {
    if (!query || query.length < 2) {
      return { entities: [], taxonomies: [] };
    }

    const [entities, taxonomies] = await Promise.all([
      prisma.canonicalEntity.findMany({
        where: {
          deletedAt: null,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { summary: { contains: query, mode: 'insensitive' } },
            { aliases: { array_contains: query } }
          ]
        },
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          entityType: true,
          summary: true
        }
      }),
      prisma.taxonomyCategory.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true
        }
      })
    ]);

    return {
      entities,
      taxonomies,
      totalCount: entities.length + taxonomies.length
    };
  }
  static async discoverySearch(filters: any, skip: number = 0, take: number = 20) {
    const where: any = { deletedAt: null };

    if (filters.q && filters.q.length >= 2) {
      where.OR = [
        { title: { contains: filters.q, mode: 'insensitive' } },
        { summary: { contains: filters.q, mode: 'insensitive' } },
        { slug: { contains: filters.q, mode: 'insensitive' } },
        { aliases: { array_contains: filters.q } },
        { transliterations: { array_contains: filters.q } }
      ];
    }

    if (filters.entityTypes && filters.entityTypes.length > 0) {
      where.entityType = { in: filters.entityTypes };
    }
    
    if (filters.verificationStatus && filters.verificationStatus.length > 0) {
      where.verificationStatus = { in: filters.verificationStatus };
    }

    if (filters.visibility && filters.visibility.length > 0) {
      where.visibility = { in: filters.visibility };
    }

    if (filters.lifecycle && filters.lifecycle.length > 0) {
      where.lifecycle = { in: filters.lifecycle };
    }

    // Faceting / counting (simple approach for now)
    const [total, data] = await prisma.$transaction([
      prisma.canonicalEntity.count({ where }),
      prisma.canonicalEntity.findMany({
        where,
        skip,
        take,
        orderBy: { updatedAt: 'desc' },
        include: {
          sourceRelations: {
            select: { id: true, relationshipType: true, targetEntity: { select: { id: true, title: true, entityType: true } } }
          },
          targetRelations: {
            select: { id: true, relationshipType: true, sourceEntity: { select: { id: true, title: true, entityType: true } } }
          },
          mediaAssets: {
            take: 1,
            select: { id: true, publicUrl: true, mediaType: true }
          }
        }
      })
    ]);

    // Format output to calculate relation counts efficiently without N+1
    const formattedData = data.map(entity => ({
      ...entity,
      relationshipCount: entity.sourceRelations.length + entity.targetRelations.length,
      primaryImage: entity.mediaAssets.length > 0 ? entity.mediaAssets[0].publicUrl : null
    }));

    return { total, skip, take, data: formattedData };
  }
}
