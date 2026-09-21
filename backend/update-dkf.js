require('dotenv').config({ path: '.env' });
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const updates = [
    { id: 'KHCRF-PTR-000033', types: ['Foundation', 'Philanthropy'] },
    { id: 'KHCRF-PTR-000081', types: ['Community Registry', 'Engagement Archive'] },
    { id: 'KHCRF-PTR-000082', types: ['Community Healing', 'Ethical Support'] },
    { id: 'KHCRF-PTR-000083', types: ['Environmental Stewardship', 'Conservation'] },
    { id: 'KHCRF-PTR-000084', types: ['Youth Development', 'Mentorship'] }
  ];

  for (const up of updates) {
    await client.query(`UPDATE "PartnerApplication" SET "collaborationType" = $1 WHERE "id" = $2`, [JSON.stringify(up.types), up.id]);
  }

  // Insert DKF Interfaith Dialogue Center
  await client.query(`
    INSERT INTO "PartnerApplication" (
      "id", "orgName", "country", "contactName", "email",
      "collection", "status", "collaborationAreas", "collaborationType", "projectDescription", "updatedAt",
      "ecosystem_id", "is_parent_ecosystem", "parent_entity_id"
    ) VALUES (
      'KHCRF-PTR-000106', 'DKF Interfaith Dialogue Center', 'USA', 'System Default', 'system@dkf.org',
      'internal-module', 'ACTIVE', '["Community Engagement"]', '["Interfaith Dialogue", "Institutional Engagement"]',
      'Dedicated institutional platform for interfaith dialogue and institutional engagement.', NOW(),
      'Dr. Kumar Foundation USA', false, 'KHCRF-PTR-000033'
    )
    ON CONFLICT ("id") DO NOTHING
  `);

  console.log('Successfully updated DKF list!');
  await client.end();
}

main().catch(console.error);
