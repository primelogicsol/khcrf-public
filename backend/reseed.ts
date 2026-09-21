import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// We have to import from frontend
import { ECOSYSTEM_PARTNERS } from '../frontend/src/config/ecosystemPartners';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seed() {
  await prisma.partnerApplication.deleteMany({});
  console.log('Cleared existing partners');
  
  for (const partner of ECOSYSTEM_PARTNERS) {
    await prisma.partnerApplication.create({
      data: {
        id: partner.id,
        orgName: partner.orgName,
        contactName: partner.orgName + " Admin",
        email: "contact@" + partner.orgName.toLowerCase().replace(/[^a-z0-9]/g, '') + ".com",
        country: partner.country,
        collaborationAreas: partner.collaborationAreas,
        collaborationType: partner.collaborationType,
        projectDescription: partner.projectDescription,
        status: partner.status,
        collection: partner.collection
      }
    });
  }
  
  console.log('Seeded', ECOSYSTEM_PARTNERS.length, 'partners');
  process.exit(0);
}

seed().catch(e => {
  console.error(e);
  process.exit(1);
});
