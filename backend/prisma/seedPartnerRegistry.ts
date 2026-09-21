import { prisma } from '../src/config/db';
import fs from 'fs';
import path from 'path';

async function main() {
    console.log("Seeding canonical partner registry...");

    const tsCode = fs.readFileSync(path.join(__dirname, '../../frontend/src/config/ecosystemPartners.ts'), 'utf-8');
    
    const match = tsCode.match(/export const ECOSYSTEM_PARTNERS = (\[[\s\S]*\]);/);
    if (!match) {
        throw new Error("Could not parse ECOSYSTEM_PARTNERS");
    }
    
    let partners;
    try {
        partners = eval(match[1]);
    } catch (e) {
        throw new Error("Failed to eval partners JSON");
    }
    
    let displayOrder = 1;
    for (const p of partners) {
        const id = p.id;
        await prisma.partnerRegistryEntity.upsert({
            where: { registryId: id },
            update: {
                orgName: p.orgName,
                collection: p.collection,
                entityType: p.entityType || 'organization',
                country: p.country,
                status: p.status || 'ACTIVE',
                collaborationType: p.collaborationType || [],
                collaborationAreas: p.collaborationAreas || [],
                projectDescription: p.projectDescription,
                displayOrder: displayOrder++
            },
            create: {
                id: id,
                registryId: id,
                orgName: p.orgName,
                collection: p.collection,
                entityType: p.entityType || 'organization',
                country: p.country,
                status: p.status || 'ACTIVE',
                collaborationType: p.collaborationType || [],
                collaborationAreas: p.collaborationAreas || [],
                projectDescription: p.projectDescription,
                displayOrder: displayOrder++
            }
        });
    }
    
    console.log(`Seeded ${partners.length} canonical partners into PartnerRegistryEntity!`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
