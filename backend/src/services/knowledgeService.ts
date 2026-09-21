import { prisma } from '../config/db';
import { Prisma } from '@prisma/client';
export class KnowledgeService {
  /**
   * CREATE Canonical Entity
   */
  static async createEntity(data: any, userId: string) {
    const { taxonomies, ...entityData } = data;
    
    return prisma.canonicalEntity.create({
      data: {
        ...entityData,
        createdById: userId,
        ...(taxonomies && taxonomies.length > 0 && {
          taxonomies: {
            connect: taxonomies.map((id: string) => ({ id }))
          }
        })
      },
      include: {
        taxonomies: true,
        creator: {
          select: { id: true, name: true }
        }
      }
    });
  }

  /**
   * READ Canonical Entities (Paginated & Filtered)
   */
  static async getEntities(filters: any, skip: number = 0, take: number = 20) {
    const where: Prisma.CanonicalEntityWhereInput = { deletedAt: null };

    if (filters.entityType) where.entityType = filters.entityType;
    if (filters.lifecycle) where.lifecycle = filters.lifecycle;
    if (filters.visibility) where.visibility = filters.visibility;
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { slug: { contains: filters.search, mode: 'insensitive' } },
        { summary: { contains: filters.search, mode: 'insensitive' } }
      ];
    }
    if (filters.taxonomyId) {
      where.taxonomies = {
        some: { id: filters.taxonomyId }
      };
    }

    const [total, entities] = await prisma.$transaction([
      prisma.canonicalEntity.count({ where }),
      prisma.canonicalEntity.findMany({
        where,
        skip,
        take,
        orderBy: { updatedAt: 'desc' },
        include: {
          taxonomies: true,
          creator: { select: { id: true, name: true } }
        }
      })
    ]);

    return { total, skip, take, data: entities };
  }

  /**
   * READ by ID or Slug
   */
  static async getEntityByIdOrSlug(idOrSlug: string) {
    return prisma.canonicalEntity.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        deletedAt: null
      },
      include: {
        taxonomies: true,
        sourceRelations: {
          include: { targetEntity: true }
        },
        targetRelations: {
          include: { sourceEntity: true }
        },
        mediaAssets: true,
        sourceRefs: true,
        creator: { select: { id: true, name: true } }
      }
    });
  }

  /**
   * UPDATE Canonical Entity
   */
  static async updateEntity(id: string, data: any, userId: string) {
    const { taxonomies, ...updateData } = data;

    // We can also create a workflow record here if the lifecycle state changes
    // Assuming the controller handles that or we do it inside a transaction

    return prisma.canonicalEntity.update({
      where: { id },
      data: {
        ...updateData,
        version: { increment: 1 },
        ...(taxonomies && {
          taxonomies: {
            set: taxonomies.map((id: string) => ({ id }))
          }
        })
      },
      include: { taxonomies: true }
    });
  }

  /**
   * SOFT DELETE Canonical Entity
   */
  static async softDeleteEntity(id: string, userId: string) {
    return prisma.canonicalEntity.update({
      where: { id },
      data: { 
        deletedAt: new Date(),
        lifecycle: 'ARCHIVED'
      }
    });
  }
}
