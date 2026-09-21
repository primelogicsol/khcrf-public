import { prisma } from '../config/db';

export class StudioService {
  static async getAll(skip = 0, take = 20) {
    return prisma.studio.findMany({ skip, take, include: { canonicalEntity: true } });
  }
  static async getById(id: string) {
    return prisma.studio.findUnique({ where: { id }, include: { canonicalEntity: true } });
  }
  static async create(data: any) {
    return prisma.studio.create({ data });
  }
  static async update(id: string, data: any) {
    return prisma.studio.update({ where: { id }, data });
  }
  static async remove(id: string) {
    return prisma.studio.delete({ where: { id } });
  }
}