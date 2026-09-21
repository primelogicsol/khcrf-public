import { prisma } from '../src/config/db';

async function main() {
  const pubs = await prisma.publication.findMany();
  console.log(JSON.stringify(pubs.map(p => ({
    id: p.id,
    title: p.title,
    publicationType: p.publicationType,
    publishedStatus: p.publishedStatus,
    isPublic: p.isPublic
  })), null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
