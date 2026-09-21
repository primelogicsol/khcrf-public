import { prisma } from '../config/db';
export class WorkflowService {
  static async create(data: any, userId: string) {
    return prisma.workflowRecord.create({
      data: {
        ...data,
        createdById: userId,
      }
    });
  }

  static async getAll(skip: number = 0, take: number = 20) {
    const [total, data] = await prisma.$transaction([
      prisma.workflowRecord.count(),
      prisma.workflowRecord.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      })
    ]);
    return { total, skip, take, data };
  }

  static async getById(id: string) {
    return prisma.workflowRecord.findUnique({
      where: { id }
    });
  }

  static async update(id: string, data: any, userId: string) {
    return prisma.workflowRecord.update({
      where: { id },
      data
    });
  }

  static async softDelete(id: string, userId: string) {
    return prisma.workflowRecord.delete({
      where: { id }
    });
  }
}
