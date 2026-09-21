import { EndangermentStatus, SustainabilityStatus, ComplexityLevel, TermContext } from '@prisma/client';
import { prisma } from '../src/config/db';

async function main() {
  console.log('Seeding development dataset for Sprint 1A & 1B...');

  // Create an Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hcrf.org' },
    update: {},
    create: {
      email: 'admin@hcrf.org',
      name: 'Admin HCRF',
      password: 'password123', // In real app, this should be hashed
      isAdmin: true,
      role: 'ADMIN',
    },
  });

  // Create Taxonomy Category
  const taxonomy = await prisma.taxonomyCategory.create({
    data: {
      name: 'Kashmiri Handicrafts',
      slug: 'kashmiri-handicrafts',
      description: 'Traditional crafts of the Kashmir Valley',
    }
  });

  // 1. CRAFT: Papier-Mâché
  const papierMache = await prisma.canonicalEntity.create({
    data: {
      title: 'Papier-Mâché',
      slug: 'papier-mache',
      entityType: 'KNOWLEDGE_OBJECT',
      lifecycle: 'VERIFIED',
      visibility: 'PUBLIC',
      summary: 'The delicate art of paper pulp and painting from Kashmir.',
      createdById: admin.id,
      taxonomies: { connect: { id: taxonomy.id } },
      craft: {
        create: {
          historicalOrigin: 'Introduced by Mir Sayyid Ali Hamadani in the 14th century.',
          culturalSignificance: 'A hallmark of Kashmiri aesthetics.',
          endangermentStatus: EndangermentStatus.STABLE
        }
      }
    }
  });

  // 2. MATERIAL: Walnut Wood
  const walnutWood = await prisma.canonicalEntity.create({
    data: {
      title: 'Walnut Wood',
      slug: 'walnut-wood',
      entityType: 'HERITAGE_OBJECT',
      lifecycle: 'VERIFIED',
      visibility: 'PUBLIC',
      summary: 'Premium hardwood native to Kashmir, used for carving.',
      createdById: admin.id,
      material: {
        create: {
          sourcingRegion: 'Kashmir Valley',
          sustainabilityStatus: SustainabilityStatus.CONCERN,
          processingMethod: 'Seasoned for 1-2 years before carving.'
        }
      }
    }
  });

  // 3. TOOL: Kander-e-Qalam (Engraving Tool)
  const qalamTool = await prisma.canonicalEntity.create({
    data: {
      title: 'Kander-e-Qalam',
      slug: 'kander-e-qalam',
      entityType: 'KNOWLEDGE_OBJECT',
      lifecycle: 'VERIFIED',
      visibility: 'PUBLIC',
      summary: 'Precision carving tool used in copperware and wood carving.',
      createdById: admin.id,
      tool: {
        create: {
          primaryMaterial: 'Iron/Steel',
          maintenanceRequirements: 'Requires frequent sharpening.'
        }
      }
    }
  });

  // 4. TECHNIQUE: Naqashi
  const naqashi = await prisma.canonicalEntity.create({
    data: {
      title: 'Naqashi',
      slug: 'naqashi',
      entityType: 'KNOWLEDGE_OBJECT',
      lifecycle: 'VERIFIED',
      visibility: 'PUBLIC',
      summary: 'The painting technique used over Papier-Mâché.',
      createdById: admin.id,
      technique: {
        create: {
          complexityLevel: ComplexityLevel.MASTER,
          learningDurationMonths: 60
        }
      }
    }
  });

  // 5. MOTIF: Chinar Leaf
  const chinarMotif = await prisma.canonicalEntity.create({
    data: {
      title: 'Chinar Leaf (Booyn)',
      slug: 'chinar-leaf',
      entityType: 'KNOWLEDGE_OBJECT',
      lifecycle: 'VERIFIED',
      visibility: 'PUBLIC',
      summary: 'The iconic leaf of the Oriental Plane tree.',
      createdById: admin.id,
      motif: {
        create: {
          symbolicMeaning: 'Strength, longevity, and Kashmir identity.'
        }
      }
    }
  });

  // 6. PRODUCT: Samovar
  const samovar = await prisma.canonicalEntity.create({
    data: {
      title: 'Kashmiri Samovar',
      slug: 'samovar',
      entityType: 'HERITAGE_OBJECT',
      lifecycle: 'VERIFIED',
      visibility: 'PUBLIC',
      summary: 'Traditional tea boiler, usually made of copper.',
      createdById: admin.id,
      product: {
        create: {
          typicalUse: 'Brewing Noon Chai and Kahwa.',
          averageCreationTimeDays: 14
        }
      }
    }
  });

  // 7. GLOSSARY TERM: Karkhanadar
  const karkhanadar = await prisma.canonicalEntity.create({
    data: {
      title: 'Karkhanadar',
      slug: 'karkhanadar',
      entityType: 'KNOWLEDGE_OBJECT',
      lifecycle: 'VERIFIED',
      visibility: 'PUBLIC',
      summary: 'Workshop owner or master artisan who manages production.',
      createdById: admin.id,
      glossaryTerm: {
        create: {
          termContext: TermContext.WORKSHOP,
          regionalDialect: 'Kashmiri'
        }
      }
    }
  });

  // Establish Relationships
  await prisma.entityRelationship.create({
    data: {
      sourceEntityId: papierMache.id,
      targetEntityId: naqashi.id,
      relationshipType: 'USES_TECHNIQUE',
      confidenceScore: 100,
      createdById: admin.id
    }
  });

  console.log('Seed data successfully planted!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
