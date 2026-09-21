import { prisma } from '../src/config/db.js';

async function main() {
  const pub = await prisma.publication.findUnique({
    where: { slug: 'premium-pricing-trends-in-authentic-kashmiri-luxury-crafts' }
  });

  if (pub) {
    const newMetadata = {
      ...((pub.metadata as any) || {}),
      executiveSummary: pub.description, // Move description to executiveSummary in metadata
      publicationCode: 'HCRF-MI-2026-0005',
      publicationSeries: '4651 | ISBN | 2025 | P',
      publisher: 'HCRF PRESS',
      estimatedReadingTimeMinutes: 45
    };

    // Shorten the description to just a short blurb
    const shortDesc = "A comprehensive analysis of premium pricing trends and market intelligence for authentic Kashmiri luxury crafts, including Pashmina and Sozni.";

    await prisma.publication.update({
      where: { id: pub.id },
      data: {
        metadata: newMetadata,
        description: shortDesc
      }
    });
    console.log("Updated executiveSummary in metadata and shortened description.");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
