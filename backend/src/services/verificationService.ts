import { prisma } from '../config/db';
export class VerificationService {
  static async create(data: any, userId: string) {
    return prisma.verificationRecord.create({
      data: {
        ...data,
        createdById: userId,
      }
    });
  }

  static async getAll(skip: number = 0, take: number = 20) {
    const [total, data] = await prisma.$transaction([
      prisma.verificationRecord.count(),
      prisma.verificationRecord.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      })
    ]);
    return { total, skip, take, data };
  }

  static async getById(id: string) {
    return prisma.verificationRecord.findUnique({
      where: { id }
    });
  }

  static async update(id: string, data: any, userId: string) {
    return prisma.verificationRecord.update({
      where: { id },
      data
    });
  }

  static async softDelete(id: string, userId: string) {
    return prisma.verificationRecord.delete({
      where: { id }
    });
  }
}
