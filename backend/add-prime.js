require('dotenv').config({ path: '.env' });
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  await client.query(`
    INSERT INTO "PartnerApplication" (
      "id", "orgName", "country", "contactName", "email",
      "collection", "status", "collaborationAreas", "collaborationType", "projectDescription", "updatedAt",
      "ecosystem_id", "is_parent_ecosystem", "parent_entity_id"
    ) VALUES 
    (
      'KHCRF-PTR-000108', 'Prime Logic Environmental Intelligence Hub', 'USA', 'System Default', 'system@primelogic.com',
      'internal-module', 'ACTIVE', '["Research and Publications"]', '["Research", "Intelligence Briefings"]',
      'Dedicated research, regulatory, market, and intelligence publications hub providing critical environmental briefings and data synthesis.', NOW(),
      'Prime Logic Solutions USA', false, 'KHCRF-PTR-000012'
    ),
    (
      'KHCRF-PTR-000109', 'Prime Logic Expert Network', 'USA', 'System Default', 'system@primelogic.com',
      'internal-module', 'ACTIVE', '["Capacity Building"]', '["Technical Expertise", "Expert Engagement"]',
      'A vetted human technical and expert engagement network supporting deployment, consultation, and operational deployment strategies.', NOW(),
      'Prime Logic Solutions USA', false, 'KHCRF-PTR-000012'
    )
    ON CONFLICT ("id") DO NOTHING
  `);

  const res = await client.query('SELECT COUNT(*) FROM "PartnerApplication"');
  console.log('Total entities after insert:', res.rows[0].count);

  await client.end();
}

main().catch(console.error);
