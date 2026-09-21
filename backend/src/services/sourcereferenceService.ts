import { prisma } from '../config/db';
export class SourceReferenceService {
  static async create(data: any, userId: string) {
    return prisma.sourceReference.create({
      data: {
        ...data,
        createdById: userId,
      }
    });
  }

  static async getAll(skip: number = 0, take: number = 20) {
    const [total, data] = await prisma.$transaction([
      prisma.sourceReference.count({ where: { deletedAt: null } }),
      prisma.sourceReference.findMany({
        where: { deletedAt: null },
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      })
    ]);
    return { total, skip, take, data };
  }

  static async getById(id: string) {
    return prisma.sourceReference.findFirst({
      where: { id, deletedAt: null }
    });
  }

  static async update(id: string, data: any, userId: string) {
    return prisma.sourceReference.update({
      where: { id },
      data
    });
  }

  static async softDelete(id: string, userId: string) {
    return prisma.sourceReference.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}
