import { prisma } from '../config/db';

export class ResearchPublicationService {
  static async getAll(skip = 0, take = 20) {
    return prisma.researchPublication.findMany({ skip, take, include: { canonicalEntity: true } });
  }
  static async getById(id: string) {
    return prisma.researchPublication.findUnique({ where: { id }, include: { canonicalEntity: true } });
  }
  static async create(data: any) {
    return prisma.researchPublication.create({ data });
  }
  static async update(id: string, data: any) {
    return prisma.researchPublication.update({ where: { id }, data });
  }
  static async remove(id: string) {
    return prisma.researchPublication.delete({ where: { id } });
  }
}