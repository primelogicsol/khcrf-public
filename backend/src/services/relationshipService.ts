import { prisma } from '../config/db';
export class RelationshipService {
  static async create(data: any, userId: string) {
    return prisma.entityRelationship.create({
      data: {
        ...data,
        createdById: userId,
      }
    });
  }

  static async getAll(skip: number = 0, take: number = 20, sourceEntityId?: string, targetEntityId?: string, relationshipType?: string) {
    const where: any = { deletedAt: null };
    if (sourceEntityId) where.sourceEntityId = sourceEntityId;
    if (targetEntityId) where.targetEntityId = targetEntityId;
    if (relationshipType) where.relationshipType = relationshipType;

    const [total, data] = await prisma.$transaction([
      prisma.entityRelationship.count({ where }),
      prisma.entityRelationship.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          sourceEntity: { select: { id: true, title: true, entityType: true } },
          targetEntity: { select: { id: true, title: true, entityType: true } }
        }
      })
    ]);
    return { total, skip, take, data };
  }

  static async getById(id: string) {
    return prisma.entityRelationship.findFirst({
      where: { id, deletedAt: null }
    });
  }

  static async update(id: string, data: any, userId: string) {
    return prisma.entityRelationship.update({
      where: { id },
      data
    });
  }

  static async softDelete(id: string, userId: string) {
    return prisma.entityRelationship.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}
