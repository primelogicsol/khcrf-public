import { prisma } from '../config/db';

export class ArtisanService {
  static async getAll(skip = 0, take = 20) {
    return prisma.artisan.findMany({ skip, take, include: { canonicalEntity: true } });
  }
  static async getById(id: string) {
    return prisma.artisan.findUnique({ where: { id }, include: { canonicalEntity: true } });
  }
  static async create(data: any) {
    return prisma.artisan.create({ data });
  }
  static async update(id: string, data: any) {
    return prisma.artisan.update({ where: { id }, data });
  }
  static async remove(id: string) {
    return prisma.artisan.delete({ where: { id } });
  }
}