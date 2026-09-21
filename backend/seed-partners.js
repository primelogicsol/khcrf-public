const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
dotenv.config();

const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const partners = [
  {
    "id": "KHCRF-PTR-000000",
    "orgName": "De Koshur Crafts",
    "status": "ACTIVE",
    "country": "India",
    "collaborationType": ["Commerce", "Ecosystem"],
    "collaborationAreas": ["Innovation and Technology", "Artisan Welfare"],
    "projectDescription": "De Koshur Crafts is the core commercial ecosystem for authentic Kashmir crafts.",
    "collection": "core-ecosystem",
    "entityType": "organization"
  },
  {
    "id": "KHCRF-PTR-000001",
    "orgName": "Craftlore",
    "status": "ACTIVE",
    "country": "India",
    "collaborationType": ["Research", "Provenance"],
    "collaborationAreas": ["Cultural Preservation", "Academic Research"],
    "projectDescription": "Craftlore maintains the digital provenance registry for Kashmir master artisans.",
    "collection": "core-ecosystem",
    "entityType": "organization"
  },
  {
    "id": "KHCRF-PTR-000002",
    "orgName": "Kashmir ArtStay",
    "status": "ACTIVE",
    "country": "India",
    "collaborationType": ["Tourism", "Ecosystem"],
    "collaborationAreas": ["Cultural Preservation", "Sustainability and Ethical Trade"],
    "projectDescription": "Kashmir ArtStay connects visitors with authentic heritage accommodations and artisan experiences.",
    "collection": "core-ecosystem",
    "entityType": "organization"
  },
  {
    "id": "KHCRF-PTR-000003",
    "orgName": "Kashmir EcoWatch",
    "status": "ACTIVE",
    "country": "India",
    "collaborationType": ["Sustainability", "Ecosystem"],
    "collaborationAreas": ["Sustainability and Ethical Trade", "Policy and Advocacy"],
    "projectDescription": "Kashmir EcoWatch monitors the environmental impact and sustainability of craft practices.",
    "collection": "core-ecosystem",
    "entityType": "organization"
  },
  {
    "id": "KHCRF-PTR-000010",
    "orgName": "De Koshur Crafts USA",
    "status": "ACTIVE",
    "country": "USA",
    "collaborationType": ["Commerce", "Market Access"],
    "collaborationAreas": ["Innovation and Technology", "Sustainability and Ethical Trade"],
    "projectDescription": "De Koshur Crafts USA facilitates international market access for authentic Kashmir crafts.",
    "collection": "specialized-enterprise",
    "entityType": "organization"
  },
  {
    "id": "KHCRF-PTR-000011",
    "orgName": "Kashmir ArtStay Global USA",
    "status": "ACTIVE",
    "country": "USA",
    "collaborationType": ["Tourism", "Market Access"],
    "collaborationAreas": ["Cultural Preservation", "Sustainability and Ethical Trade"],
    "projectDescription": "Kashmir ArtStay Global USA promotes heritage tourism and artisan stays to international travelers.",
    "collection": "specialized-enterprise",
    "entityType": "organization"
  },
  {
    "id": "KHCRF-PTR-000020",
    "orgName": "Dr. Kumar Foundation USA",
    "status": "APPROVED",
    "country": "USA",
    "collaborationType": ["Philanthropy", "Funding"],
    "collaborationAreas": ["Artisan Welfare", "Cultural Preservation"],
    "projectDescription": "Dr. Kumar Foundation USA provides philanthropic support for artisan welfare programs.",
    "collection": "institutional-alliance",
    "entityType": "organization"
  },
  {
    "id": "KHCRF-PTR-000021",
    "orgName": "Prime Logic Solutions USA",
    "status": "APPROVED",
    "country": "USA",
    "collaborationType": ["Technology", "Infrastructure"],
    "collaborationAreas": ["Innovation and Technology"],
    "projectDescription": "Prime Logic Solutions USA provides essential technology infrastructure for the KHCRF ecosystem.",
    "collection": "institutional-alliance",
    "entityType": "organization"
  },
  {
    "id": "KHCRF-PTR-000022",
    "orgName": "Purple Soul USA",
    "status": "APPROVED",
    "country": "USA",
    "collaborationType": ["Advocacy", "Awareness"],
    "collaborationAreas": ["Policy and Advocacy", "Artisan Welfare"],
    "projectDescription": "Purple Soul USA advocates for the welfare and recognition of Kashmir artisans globally.",
    "collection": "institutional-alliance",
    "entityType": "organization"
  },
  {
    "id": "KHCRF-PTR-000023",
    "orgName": "Team Collab",
    "status": "APPROVED",
    "country": "Global",
    "collaborationType": ["Collaboration", "Network"],
    "collaborationAreas": ["Innovation and Technology", "Cultural Preservation"],
    "projectDescription": "Team Collab facilitates cross-border collaboration and networking within the craft sector.",
    "collection": "institutional-alliance",
    "entityType": "organization"
  }
];

async function seed() {
  await prisma.partnerApplication.deleteMany({});
  console.log('Cleared existing partners');
  
  for (const partner of partners) {
    await prisma.partnerApplication.create({
      data: {
        id: partner.id,
        orgName: partner.orgName,
        contactName: partner.orgName + " Admin",
        email: "contact@" + partner.orgName.toLowerCase().replace(/\s/g, '') + ".com",
        country: partner.country,
        collaborationAreas: partner.collaborationAreas,
        collaborationType: partner.collaborationType,
        projectDescription: partner.projectDescription,
        status: partner.status,
        collection: partner.collection
      }
    });
  }
  
  console.log('Seeded partners');
  process.exit(0);
}

seed().catch(e => {
  console.error(e);
  process.exit(1);
});
