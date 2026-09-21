require('dotenv').config({ path: '.env' });
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  await client.query(`
    INSERT INTO "PartnerApplication" (
      "id", "orgName", "country", "contactName", "email",
      "collection", "status", "collaborationAreas", "collaborationType", "projectDescription", "updatedAt"
    ) VALUES (
      'KHCRF-PTR-000013', 'DKC Blockchain', 'India', 'System Default', 'system@dekoshurcrafts.com',
      'internal-module', 'ACTIVE', '["Innovation and Technology"]', '["Blockchain", "Infrastructure"]',
      'Distinct DKC blockchain infrastructure and technology service layer.', NOW()
    )
    ON CONFLICT ("id") DO NOTHING
  `);

  console.log('Restored DKC Blockchain!');
  await client.end();
}

main().catch(console.error);
