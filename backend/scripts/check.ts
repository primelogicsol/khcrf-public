import { prisma } from '../src/config/db.js';

async function main() {
  const pub = await prisma.publication.findUnique({
    where: { slug: 'premium-pricing-trends-in-authentic-kashmiri-luxury-crafts' }
  });
  console.log("DB Publication Code:", pub?.publicationCode);
  console.log("DB Metadata:", pub?.metadata);
}
main().catch(console.error).finally(() => prisma.$disconnect());
