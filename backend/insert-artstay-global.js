const { Client } = require('pg');
const { randomBytes } = require('crypto');

const DB = 'postgresql://govtech:PQsQ3OL6@127.0.0.1:5432/hcrf_db_clean';

function makeId() {
  return 'c' + randomBytes(11).toString('hex');
}

async function main() {
  const client = new Client({ connectionString: DB });
  await client.connect();

  const id        = makeId();
  const registryId = 'KHCRF-PTR-ATS-USA';

  await client.query(`
    INSERT INTO "PartnerRegistryEntity"
      ("id", "registryId", "orgName", "collection", "entityType",
       "country", "parentId", "parentName",
       "collaborationAreas", "collaborationType",
       "projectDescription", "status", "displayOrder",
       "createdAt", "updatedAt")
    VALUES
      ($1, $2,
       'Kashmir ArtStay Global USA',
       'core-ecosystem',
       'organization',
       'United States',
       NULL, NULL,
       $3::jsonb,
       $4::jsonb,
       'Kashmir ArtStay Global USA leads international hospitality, cultural tourism, artisan-stay and experiential travel programming connecting global visitors with authentic Kashmir craftsmanship, heritage and community through curated stays, tours and immersive experiences.',
       'ACTIVE', 2,
       NOW(), NOW())
  `, [
    id,
    registryId,
    JSON.stringify(['Cultural Preservation', 'Artisan Welfare', 'Innovation and Technology']),
    JSON.stringify(['Tourism', 'Ecosystem'])
  ]);

  console.log('Inserted Kashmir ArtStay Global USA —', registryId);

  // Verify
  const { rows } = await client.query(`
    SELECT "registryId", "orgName", "collection", "country", "parentName"
    FROM "PartnerRegistryEntity"
    WHERE "orgName" ILIKE '%ArtStay%'
    ORDER BY "orgName"
  `);
  console.log('\nAll ArtStay records:');
  rows.forEach(r => console.log(`  [${r.collection}] ${r.orgName} (${r.country}) ← ${r.parentName || 'no parent'}`));

  // Collection A check
  const { rows: core } = await client.query(`
    SELECT "orgName" FROM "PartnerRegistryEntity" WHERE "collection" = 'core-ecosystem' ORDER BY "orgName"
  `);
  console.log(`\nCollection A records (${core.length}):`);
  core.forEach(r => console.log(' ', r.orgName));

  await client.end();
}

main().catch(e => { console.error(e); process.exit(1); });
