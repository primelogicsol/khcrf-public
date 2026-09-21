import { prisma } from '../config/db';
export class TechniqueService {
  static async create(data: any, userId: string) {
    // In reality, this would also create the CanonicalEntity hub object.
    return prisma.technique.create({
      data: {
        ...data,
      }
    });
  }

  static async getAll(skip: number = 0, take: number = 20) {
    const [total, data] = await prisma.$transaction([
      prisma.technique.count(),
      prisma.technique.findMany({
        skip,
        take,
        include: { canonicalEntity: true }
      })
    ]);
    return { total, skip, take, data };
  }

  static async getById(id: string) {
    return prisma.technique.findUnique({
      where: { id },
      include: { canonicalEntity: true }
    });
  }

  static async update(id: string, data: any, userId: string) {
    return prisma.technique.update({
      where: { id },
      data
    });
  }

  static async hardDelete(id: string, userId: string) {
    return prisma.technique.delete({
      where: { id }
    });
  }
}
