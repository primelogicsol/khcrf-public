import { prisma } from '../src/config/db.js';

async function main() {
  const pub = await prisma.publication.findUnique({
    where: { slug: 'premium-pricing-trends-in-authentic-kashmiri-luxury-crafts' }
  });

  if (pub) {
    const newMetadata = {
      ...((pub.metadata as any) || {}),
      publicationCode: 'HCRF-MI-2026-0005',
      publicationSeries: '4651 | ISBN | 2025 | P',
      publisher: 'HCRF PRESS',
      estimatedReadingTimeMinutes: 45
    };

    await prisma.publication.update({
      where: { id: pub.id },
      data: {
        metadata: newMetadata,
        publisher: 'HCRF PRESS'
      }
    });
    console.log("Updated publication publisher to HCRF PRESS");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
