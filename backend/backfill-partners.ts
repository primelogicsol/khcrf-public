import { prisma } from './src/index';

// Canonical parent derivation — maps orgName prefix to canonical parent name
function deriveParent(orgName: string): string | null {
  if (orgName === 'Craftlore') return null; // is itself a parent
  if (orgName.startsWith('Craftlore ')) return 'Craftlore';
  if (orgName === 'De Koshur Crafts') return null;
  if (orgName.startsWith('De Koshur Crafts ') || orgName.startsWith('DKC ')) return 'De Koshur Crafts';
  if (orgName === 'Kashmir ArtStay') return null;
  if (orgName.startsWith('ArtStay ') || orgName === 'Kashmir ArtStay') return 'Kashmir ArtStay';
  if (orgName === 'Kashmir EcoWatch') return null;
  if (orgName.startsWith('Kashmir EcoWatch ') || orgName.startsWith('EcoWatch ')) return 'Kashmir EcoWatch';
  if (orgName === 'Dr. Kumar Foundation USA') return null;
  if (orgName.startsWith('Dr. Kumar ')) return 'Dr. Kumar Foundation USA';
  if (orgName === 'Prime Logic Solutions USA') return null;
  if (orgName.startsWith('Prime Logic ')) return 'Prime Logic Solutions USA';
  if (orgName === 'Purple Soul USA') return null;
  if (orgName.startsWith('Purple Soul ')) return 'Purple Soul USA';
  if (orgName === 'Team Collab') return null;
  if (orgName.startsWith('Team Collab ')) return 'Team Collab';
  return null;
}

async function backfill() {
  const records = await prisma.$queryRawUnsafe(
    `SELECT "registryId", "orgName", "collaborationAreas", "collaborationType", "parentName" FROM "PartnerRegistryEntity"`
  ) as any[];

  console.log(`Found ${records.length} records to backfill`);

  // Load source data
  // We will use raw SQL updates to avoid Prisma schema mismatch issues
  // Source: read the ecosystemPartners.ts as a JSON fixture
  const fs = await import('fs');
  const path = await import('path');
  
  const sourcePath = path.join(process.cwd(), '..', 'frontend', 'src', 'config', 'ecosystemPartners.ts');
  const raw = fs.readFileSync(sourcePath, 'utf8');
  
  // Extract the array from the TS file — it's exported as ECOSYSTEM_PARTNERS = [...]
  const match = raw.match(/=\s*(\[[\s\S]*\])\s*(?:as\s+\w+\[\])?\s*;/);
  if (!match) throw new Error('Could not parse ecosystemPartners.ts');
  
  // eslint-disable-next-line no-eval
  const sourceData: any[] = eval(`(${match[1]})`);
  console.log(`Loaded ${sourceData.length} source records`);

  const sourceMap = new Map(sourceData.map((r: any) => [r.id, r]));

  let updated = 0;
  for (const record of records) {
    const src = sourceMap.get(record.registryId);
    const parentName = deriveParent(record.orgName);
    
    const collaborationAreas = src?.collaborationAreas ?? [];
    const collaborationType = src?.collaborationType ?? [];

    await prisma.$executeRawUnsafe(
      `UPDATE "PartnerRegistryEntity" 
       SET "collaborationAreas" = $1::jsonb,
           "collaborationType" = $2::jsonb,
           "parentName" = $3
       WHERE "registryId" = $4`,
      JSON.stringify(collaborationAreas),
      JSON.stringify(collaborationType),
      parentName,
      record.registryId
    );
    updated++;
    if (updated % 10 === 0) console.log(`Updated ${updated}/${records.length}...`);
  }

  console.log(`\nBackfill complete. ${updated} records updated.`);

  // Verification
  const verify = await prisma.$queryRawUnsafe(
    `SELECT 
       COUNT(*) FILTER (WHERE "collaborationAreas" IS NOT NULL AND "collaborationAreas" != 'null'::jsonb) as with_areas,
       COUNT(*) FILTER (WHERE "parentName" IS NOT NULL) as with_parent,
       COUNT(*) as total
     FROM "PartnerRegistryEntity"`
  ) as any[];
  console.log('Verification:', verify[0]);

  // Print unique areas
  const areaRows = await prisma.$queryRawUnsafe(
    `SELECT DISTINCT jsonb_array_elements_text("collaborationAreas") as area 
     FROM "PartnerRegistryEntity" 
     WHERE "collaborationAreas" IS NOT NULL AND "collaborationAreas" != 'null'::jsonb
     ORDER BY area`
  ) as any[];
  console.log('Unique collaboration areas in DB:', areaRows.map((r: any) => r.area));
}

backfill().catch(console.error).finally(() => process.exit(0));
