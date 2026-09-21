import { prisma } from '../config/db';

export const resolvers = {
  Query: {
    canonicalEntities: async (_: any, { limit = 50, offset = 0 }) => {
      return prisma.canonicalEntity.findMany({
        take: limit,
        skip: offset,
        orderBy: { updatedAt: 'desc' },
      });
    },
    canonicalEntity: async (_: any, { id }: { id: string }) => {
      return prisma.canonicalEntity.findUnique({
        where: { id },
      });
    },
    canonicalEntityBySlug: async (_: any, { slug }: { slug: string }) => {
      return prisma.canonicalEntity.findUnique({
        where: { slug },
      });
    },
  },
};
