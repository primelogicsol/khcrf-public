import { prisma } from '../config/db';
export class MediaAssetService {
  static async create(data: any, userId: string) {
    return prisma.mediaAsset.create({
      data: {
        ...data,
        uploadedById: userId,
      }
    });
  }

  static async getAll(skip: number = 0, take: number = 20, search?: string, mediaType?: string) {
    const where: any = { deletedAt: null };
    
    if (mediaType) {
      where.mediaType = mediaType;
    }
    
    if (search) {
      where.OR = [
        { fileName: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { caption: { contains: search, mode: 'insensitive' } },
        { altText: { contains: search, mode: 'insensitive' } },
        { storageKey: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [total, data] = await prisma.$transaction([
      prisma.mediaAsset.count({ where }),
      prisma.mediaAsset.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      })
    ]);
    return { total, skip, take, data };
  }

  static async getById(id: string) {
    return prisma.mediaAsset.findFirst({
      where: { id, deletedAt: null }
    });
  }

  static async update(id: string, data: any, userId: string) {
    return prisma.mediaAsset.update({
      where: { id },
      data
    });
  }

  static async softDelete(id: string, userId: string) {
    return prisma.mediaAsset.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}
