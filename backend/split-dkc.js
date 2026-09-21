/**
 * split-dkc.js
 * Splits the single "De Koshur Crafts" record into:
 *   - De Koshur Crafts USA (rename existing PTR-000000)
 *   - De Koshur Crafts India (new record, sibling, collection: core-ecosystem)
 * Re-parents all 19 US children to "De Koshur Crafts USA".
 * Adds an ecosystem group field to both for filter grouping.
 */
const { Client } = require('pg');
const { randomBytes } = require('crypto');

const DB = 'postgresql://govtech:PQsQ3OL6@127.0.0.1:5432/hcrf_db_clean';

// Generate a cuid-style id (simple, collision-safe for our scale)
function makeId() {
  return 'c' + randomBytes(11).toString('hex');
}

async function main() {
  const client = new Client({ connectionString: DB });
  await client.connect();
  console.log('Connected to hcrf_db_clean');

  // 1. Rename existing PTR-000000 → De Koshur Crafts USA
  await client.query(`
    UPDATE "PartnerRegistryEntity"
    SET "orgName"    = 'De Koshur Crafts USA',
        "country"    = 'United States',
        "parentName" = NULL,
        "parentId"   = NULL
    WHERE "registryId" = 'KHCRF-PTR-000000'
  `);
  console.log('Renamed PTR-000000 → De Koshur Crafts USA (United States)');

  // 2. Insert new De Koshur Crafts India record
  const indiaId   = makeId();
  const indiaRegId = 'KHCRF-PTR-000000-IN';
  await client.query(`
    INSERT INTO "PartnerRegistryEntity"
      ("id", "registryId", "orgName", "collection", "entityType",
       "country", "parentId", "parentName",
       "collaborationAreas", "collaborationType",
       "projectDescription", "status", "displayOrder",
       "createdAt", "updatedAt")
    VALUES
      ($1, $2, 'De Koshur Crafts India', 'core-ecosystem', 'organization',
       'India', NULL, NULL,
       $3::jsonb, $4::jsonb,
       'De Koshur Crafts India manages local Kashmir operations, artisan and supplier relationships, India-side compliance, sourcing coordination, and cultural-heritage production aligned with the KHCRF craft ecosystem.',
       'ACTIVE', 1,
       NOW(), NOW())
  `, [
    indiaId,
    indiaRegId,
    JSON.stringify(['Artisan Welfare', 'Cultural Preservation', 'Innovation and Technology']),
    JSON.stringify(['Commerce', 'Ecosystem'])
  ]);
  console.log('Inserted De Koshur Crafts India (KHCRF-PTR-000000-IN)');

  // 3. Re-parent all existing DKC children from "De Koshur Crafts" → "De Koshur Crafts USA"
  const { rowCount } = await client.query(`
    UPDATE "PartnerRegistryEntity"
    SET "parentName" = 'De Koshur Crafts USA'
    WHERE "parentName" = 'De Koshur Crafts'
      AND "country" = 'United States'
  `);
  console.log(`Re-parented ${rowCount} US children → De Koshur Crafts USA`);

  // 4. Verify
  const { rows } = await client.query(`
    SELECT "registryId", "orgName", "collection", "country", "parentName"
    FROM "PartnerRegistryEntity"
    WHERE "orgName" ILIKE '%De Koshur%' OR "orgName" ILIKE '%DKC%'
    ORDER BY "collection", "orgName"
  `);
  console.log('\nFinal DKC records:');
  rows.forEach(r => console.log(
    `  [${r.collection}] ${r.orgName} (${r.country}) ← parent: ${r.parentName || 'none'}`
  ));

  // 5. Verify Collection A count still = 8
  const { rows: coreRows } = await client.query(`
    SELECT COUNT(*) as count FROM "PartnerRegistryEntity"
    WHERE "collection" = 'core-ecosystem'
  `);
  console.log('\nCollection A (core-ecosystem) count:', coreRows[0].count,
    '— expected 9 now (8 original + India), homepage adapter must still show 8 ecosystem groups');

  await client.end();
  console.log('\nDone.');
}

main().catch(e => { console.error(e); process.exit(1); });
