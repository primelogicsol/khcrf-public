import { prisma } from '../config/db';

export class CollectionService {
  static async getAll(skip = 0, take = 20) {
    return prisma.collection.findMany({ skip, take, include: { canonicalEntity: true } });
  }
  static async getById(id: string) {
    return prisma.collection.findUnique({ where: { id }, include: { canonicalEntity: true } });
  }
  static async create(data: any) {
    return prisma.collection.create({ data });
  }
  static async update(id: string, data: any) {
    return prisma.collection.update({ where: { id }, data });
  }
  static async remove(id: string) {
    return prisma.collection.delete({ where: { id } });
  }
}