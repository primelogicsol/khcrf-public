import { prisma } from './src/index';
import { ECOSYSTEM_PARTNERS } from '../frontend/src/config/ecosystemPartners';

async function seed() {
    for (const p of ECOSYSTEM_PARTNERS) {
        await prisma.$executeRawUnsafe(
            'INSERT INTO "PartnerRegistryEntity" ("id", "registryId", "orgName", "collection", "entityType", "parentId", "parentName", "country", "status", "projectDescription") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT ("registryId") DO NOTHING',
            p.id, p.id, p.orgName, p.collection, p.entityType, null, null, p.country, p.status, p.projectDescription
        );
    }
    console.log("Seeded " + ECOSYSTEM_PARTNERS.length + " partners!");
}

seed().catch(console.error).finally(() => process.exit(0));
