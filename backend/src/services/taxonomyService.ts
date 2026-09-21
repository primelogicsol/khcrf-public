import { prisma } from '../config/db';
export class TaxonomyService {
  static async create(data: any, userId: string) {
    return prisma.taxonomyCategory.create({
      data: {
        ...data,
        
      }
    });
  }

  static async getAll(skip: number = 0, take: number = 20) {
    const [total, data] = await prisma.$transaction([
      prisma.taxonomyCategory.count({ where: { deletedAt: null } }),
      prisma.taxonomyCategory.findMany({
        where: { deletedAt: null },
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      })
    ]);
    return { total, skip, take, data };
  }

  static async getById(id: string) {
    return prisma.taxonomyCategory.findFirst({
      where: { id, deletedAt: null }
    });
  }

  static async update(id: string, data: any, userId: string) {
    return prisma.taxonomyCategory.update({
      where: { id },
      data
    });
  }

  static async softDelete(id: string, userId: string) {
    return prisma.taxonomyCategory.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}
