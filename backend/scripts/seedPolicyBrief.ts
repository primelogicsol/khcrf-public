import { prisma } from '../src/config/db.js';

async function seed() {
  const slug = 'reducing-counterfeit-trade-in-heritage-products';
  
  const pub = await prisma.publication.upsert({
    where: { slug },
    update: {
      title: 'Reducing Counterfeit Trade in Heritage Products',
      subtitle: 'A Policy Framework for Authentication, Enforcement, Market Surveillance, and Consumer Protection in Kashmir Crafts',
      author: 'HCRF Policy Working Group',
      published: '2026',
      category: 'Craft Governance and Policy Series',
      price: 0.0,
      pages: 24,
      description: 'Counterfeit and misrepresented heritage products weaken artisan livelihoods, distort market prices, undermine Geographical Indication protections, and reduce consumer trust in authentic Kashmir crafts. This policy brief examines the institutional, legal, technological, and marketplace failures that allow counterfeit trade to persist. It proposes a coordinated framework combining stronger GI enforcement, digital product authentication, marketplace accountability, customs cooperation, consumer awareness, and transparent artisan attribution. The objective is to protect authentic producers, strengthen buyer confidence, and ensure that the economic value associated with Kashmir’s heritage products reaches legitimate artisan communities.',
      publicationType: 'Policy Brief',
      isPublic: true,
      publishedStatus: 'PUBLISHED',
      seoTitle: 'Reducing Counterfeit Trade in Heritage Products | Policy Brief',
      seoDescription: 'A policy framework for authentication, enforcement, market surveillance, and consumer protection in Kashmir Crafts.',
      metadata: {
        subtitle: 'A Policy Framework for Authentication, Enforcement, Market Surveillance, and Consumer Protection in Kashmir Crafts',
        estimatedReadingTimeMinutes: 15,
        isbn: null,
        publicationCode: null,
        doi: null,
        publisher: 'HCRF Press',
      }
    },
    create: {
      slug,
      title: 'Reducing Counterfeit Trade in Heritage Products',
      subtitle: 'A Policy Framework for Authentication, Enforcement, Market Surveillance, and Consumer Protection in Kashmir Crafts',
      author: 'HCRF Policy Working Group',
      published: '2026',
      category: 'Craft Governance and Policy Series',
      price: 0.0,
      pages: 24,
      description: 'Counterfeit and misrepresented heritage products weaken artisan livelihoods, distort market prices, undermine Geographical Indication protections, and reduce consumer trust in authentic Kashmir crafts. This policy brief examines the institutional, legal, technological, and marketplace failures that allow counterfeit trade to persist. It proposes a coordinated framework combining stronger GI enforcement, digital product authentication, marketplace accountability, customs cooperation, consumer awareness, and transparent artisan attribution. The objective is to protect authentic producers, strengthen buyer confidence, and ensure that the economic value associated with Kashmir’s heritage products reaches legitimate artisan communities.',
      publicationType: 'Policy Brief',
      isPublic: true,
      publishedStatus: 'PUBLISHED',
      seoTitle: 'Reducing Counterfeit Trade in Heritage Products | Policy Brief',
      seoDescription: 'A policy framework for authentication, enforcement, market surveillance, and consumer protection in Kashmir Crafts.',
      metadata: {
        subtitle: 'A Policy Framework for Authentication, Enforcement, Market Surveillance, and Consumer Protection in Kashmir Crafts',
        estimatedReadingTimeMinutes: 15,
        isbn: null,
        publicationCode: null,
        doi: null,
        publisher: 'HCRF Press',
      }
    }
  });

  // Create an initial Published Edition to satisfy the canonical visibility rules
  const existingEditions = await prisma.publicationEdition.findMany({ where: { publicationId: pub.id }});
  if (existingEditions.length === 0) {
    await prisma.publicationEdition.create({
      data: {
        publicationId: pub.id,
        version: '1.0.0',
        edition: '1st Edition',
        publicationDate: new Date('2026-01-01T00:00:00Z'),
        status: 'PUBLISHED'
      }
    });
  }

  // Clear existing chapters so we can seed the correct TOC
  await prisma.chapter.deleteMany({
    where: { publicationId: pub.id }
  });

  const toc = [
    { title: 'Front Matter', sectionType: 'part' },
    { title: 'Policy Brief Summary', sectionType: 'front-matter' },
    { title: 'Key Recommendations', sectionType: 'front-matter' },
    { title: 'Definitions and Scope', sectionType: 'front-matter' },
    { title: 'Section 1 — The Counterfeit Threat', sectionType: 'part' },
    { title: 'Nature of counterfeit heritage products', sectionType: 'chapter' },
    { title: 'Machine-made products sold as handmade', sectionType: 'chapter' },
    { title: 'False GI and origin claims', sectionType: 'chapter' },
    { title: 'Misuse of artisan identities and craft terminology', sectionType: 'chapter' },
    { title: 'Section 2 — Economic and Cultural Impact', sectionType: 'part' },
    { title: 'Artisan income loss', sectionType: 'chapter' },
    { title: 'Price suppression', sectionType: 'chapter' },
    { title: 'Consumer distrust', sectionType: 'chapter' },
    { title: 'Damage to heritage reputation', sectionType: 'chapter' },
    { title: 'Export-market consequences', sectionType: 'chapter' },
    { title: 'Section 3 — Current Enforcement Gaps', sectionType: 'part' },
    { title: 'Weak GI enforcement', sectionType: 'chapter' },
    { title: 'Marketplace liability gaps', sectionType: 'chapter' },
    { title: 'Limited customs coordination', sectionType: 'chapter' },
    { title: 'Inadequate product traceability', sectionType: 'chapter' },
    { title: 'Fragmented institutional responsibility', sectionType: 'chapter' },
    { title: 'Section 4 — Recommended Policy Framework', sectionType: 'part' },
    { title: 'Product-level authentication', sectionType: 'chapter' },
    { title: 'Verified seller systems', sectionType: 'chapter' },
    { title: 'Marketplace compliance obligations', sectionType: 'chapter' },
    { title: 'Customs and export screening', sectionType: 'chapter' },
    { title: 'Consumer education', sectionType: 'chapter' },
    { title: 'Artisan attribution requirements', sectionType: 'chapter' },
    { title: 'Section 5 — Implementation Roadmap', sectionType: 'part' },
    { title: 'Immediate actions: 0–6 months', sectionType: 'chapter' },
    { title: 'Institutional actions: 6–18 months', sectionType: 'chapter' },
    { title: 'Long-term reforms: 18–36 months', sectionType: 'chapter' },
    { title: 'Final Recommendations', sectionType: 'part' },
    { title: 'Ten priority policy actions', sectionType: 'chapter' },
    { title: 'Responsible institutions', sectionType: 'chapter' },
    { title: 'Suggested performance indicators', sectionType: 'chapter' },
    { title: 'Annexes', sectionType: 'part' },
    { title: 'Model enforcement checklist', sectionType: 'back-matter' },
    { title: 'Marketplace notice template', sectionType: 'back-matter' },
    { title: 'Authentication data fields', sectionType: 'back-matter' },
    { title: 'Institutional responsibility matrix', sectionType: 'back-matter' },
  ];

  for (let i = 0; i < toc.length; i++) {
    await prisma.chapter.create({
      data: {
        publicationId: pub.id,
        title: toc[i].title,
        order: i + 1,
        sectionType: toc[i].sectionType,
        status: 'PUBLISHED'
      }
    });
  }

  console.log('✅ Canonical Policy Brief successfully seeded into database');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
