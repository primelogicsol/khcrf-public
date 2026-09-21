/**
 * backfill-partners-pg.js
 * Uses direct pg connection to hcrf_db_clean to backfill
 * collaborationAreas, collaborationType, and parentName
 * into PartnerRegistryEntity from the ecosystemPartners.ts source.
 */
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const DB_URL = 'postgresql://govtech:PQsQ3OL6@127.0.0.1:5432/hcrf_db_clean';

function deriveParent(orgName) {
  if (orgName === 'Craftlore') return null;
  if (orgName.startsWith('Craftlore ')) return 'Craftlore';
  if (orgName === 'De Koshur Crafts') return null;
  if (orgName.startsWith('De Koshur Crafts ') || orgName.startsWith('DKC ')) return 'De Koshur Crafts';
  if (orgName === 'Kashmir ArtStay') return null;
  if (orgName.startsWith('ArtStay ')) return 'Kashmir ArtStay';
  if (orgName === 'Kashmir EcoWatch') return null;
  if (orgName.startsWith('EcoWatch ')) return 'Kashmir EcoWatch';
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

async function main() {
  const client = new Client({ connectionString: DB_URL });
  await client.connect();
  console.log('Connected to hcrf_db_clean');

  // Load and parse source TS file
  const sourcePath = path.join(__dirname, '..', 'frontend', 'src', 'config', 'ecosystemPartners.ts');
  const raw = fs.readFileSync(sourcePath, 'utf8');
  const match = raw.match(/=\s*(\[[\s\S]*?\])\s*(?:as\s+\w+\[\])?\s*;?\s*$/m);
  if (!match) {
    // Try broader match
    const idx = raw.indexOf('[');
    const lastIdx = raw.lastIndexOf(']');
    const arr = raw.slice(idx, lastIdx + 1);
    eval(`var sourceData = ${arr}`);
  } else {
    eval(`var sourceData = ${match[1]}`);
  }
  console.log(`Loaded ${sourceData.length} source records`);

  const sourceMap = new Map(sourceData.map(r => [r.id, r]));

  // Get all DB records
  const { rows } = await client.query(`SELECT "registryId", "orgName" FROM "PartnerRegistryEntity"`);
  console.log(`Found ${rows.length} DB records`);

  let updated = 0;
  for (const row of rows) {
    const src = sourceMap.get(row.registryId);
    const parentName = deriveParent(row.orgName);
    const collaborationAreas = (src && Array.isArray(src.collaborationAreas)) ? src.collaborationAreas : [];
    const collaborationType = (src && Array.isArray(src.collaborationType)) ? src.collaborationType : [];

    await client.query(
      `UPDATE "PartnerRegistryEntity"
       SET "collaborationAreas" = $1::jsonb,
           "collaborationType" = $2::jsonb,
           "parentName" = $3
       WHERE "registryId" = $4`,
      [
        JSON.stringify(collaborationAreas),
        JSON.stringify(collaborationType),
        parentName,
        row.registryId
      ]
    );
    updated++;
  }

  console.log(`Updated ${updated} records.`);

  // Verify
  const v = await client.query(`
    SELECT 
      COUNT(*) FILTER (WHERE "collaborationAreas" IS NOT NULL AND jsonb_array_length("collaborationAreas") > 0) as with_areas,
      COUNT(*) FILTER (WHERE "parentName" IS NOT NULL) as with_parent,
      COUNT(*) as total
    FROM "PartnerRegistryEntity"
  `);
  console.log('Verification:', v.rows[0]);

  // Unique areas
  const areas = await client.query(`
    SELECT DISTINCT jsonb_array_elements_text("collaborationAreas") as area
    FROM "PartnerRegistryEntity"
    WHERE "collaborationAreas" IS NOT NULL AND jsonb_array_length("collaborationAreas") > 0
    ORDER BY area
  `);
  console.log('Unique areas:', areas.rows.map(r => r.area));

  // Sample parent records
  const parents = await client.query(`
    SELECT "orgName", "parentName", "collection"
    FROM "PartnerRegistryEntity"
    WHERE "parentName" IS NOT NULL
    LIMIT 8
  `);
  console.log('Sample parent assignments:', parents.rows);

  await client.end();
}

main().catch(err => { console.error(err); process.exit(1); });
