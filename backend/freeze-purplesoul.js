require('dotenv').config({ path: '.env' });
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const updates = [
    { id: 'KHCRF-PTR-000010', orgName: 'Purple Soul USA', types: ['Commerce', 'Cultural Outreach'] },
    { id: 'KHCRF-PTR-000075', orgName: 'Purple Soul Gift Intelligence Engine', types: ['Artificial Intelligence', 'Gift Curation'] },
    { id: 'KHCRF-PTR-000076', orgName: 'Purple Soul Life Journeys', types: ['Life Planning', 'Cultural Guidance'] },
    { id: 'KHCRF-PTR-000077', orgName: 'Purple Soul Registry Center', types: ['Gift Registry', 'Group Funding'] },
    { id: 'KHCRF-PTR-000078', orgName: 'Purple Soul Sacred Origins & Living Atlas', types: ['Cultural Heritage', 'Geographic Intelligence'] },
    { id: 'KHCRF-PTR-000079', orgName: 'Purple Soul Faith Institutional Supply', types: ['Institutional Procurement', 'B2B Commerce'] },
    { id: 'KHCRF-PTR-000080', orgName: 'Purple Soul Partner & Vendor Hub', types: ['Vendor Management', 'Partnership Development'] }
  ];

  for (const up of updates) {
    await client.query(`
      UPDATE "PartnerApplication" 
      SET "orgName" = $1, "collaborationType" = $2 
      WHERE "id" = $3
    `, [up.orgName, JSON.stringify(up.types), up.id]);
  }

  // Insert missing #5
  await client.query(`
    INSERT INTO "PartnerApplication" (
      "id", "orgName", "country", "contactName", "email",
      "collection", "status", "collaborationAreas", "collaborationType", "projectDescription", "updatedAt",
      "ecosystem_id", "is_parent_ecosystem", "parent_entity_id"
    ) VALUES (
      'KHCRF-PTR-000107', 'Purple Soul Traditions & Cultural Intelligence', 'USA', 'System Default', 'system@purplesoul.com',
      'internal-module', 'ACTIVE', '["Cultural Preservation"]', '["Cultural Intelligence", "Interfaith Learning"]',
      'Dedicated intelligence engine and cultural mapping platform supporting cross-cultural engagement and tradition preservation.', NOW(),
      'Purple Soul USA', false, 'KHCRF-PTR-000010'
    )
    ON CONFLICT ("id") DO NOTHING
  `);

  console.log('Successfully applied Purple Soul freeze!');
  await client.end();
}

main().catch(console.error);
