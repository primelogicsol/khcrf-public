import { prisma } from '../config/db';
export class ToolService {
  static async create(data: any, userId: string) {
    // In reality, this would also create the CanonicalEntity hub object.
    return prisma.tool.create({
      data: {
        ...data,
      }
    });
  }

  static async getAll(skip: number = 0, take: number = 20) {
    const [total, data] = await prisma.$transaction([
      prisma.tool.count(),
      prisma.tool.findMany({
        skip,
        take,
        include: { canonicalEntity: true }
      })
    ]);
    return { total, skip, take, data };
  }

  static async getById(id: string) {
    return prisma.tool.findUnique({
      where: { id },
      include: { canonicalEntity: true }
    });
  }

  static async update(id: string, data: any, userId: string) {
    return prisma.tool.update({
      where: { id },
      data
    });
  }

  static async hardDelete(id: string, userId: string) {
    return prisma.tool.delete({
      where: { id }
    });
  }
}
