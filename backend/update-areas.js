require('dotenv').config({ path: '.env' });
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const updates = [
    {
      id: 'KHCRF-PTR-000033', // DKF
      areas: ["CSR & Philanthropy", "Artisan Welfare", "Community Development", "Education & Skills", "Institutional Support"]
    },
    {
      id: 'KHCRF-PTR-000032', // KEW
      areas: ["Environmental Sustainability", "Climate Resilience", "Natural Resources", "Research", "Evidence & Monitoring"]
    },
    {
      id: 'KHCRF-PTR-000012', // Prime Logic
      areas: ["Technology & Innovation", "Digital Infrastructure", "Data Systems", "Research", "Technical Assistance"]
    },
    {
      id: 'KHCRF-PTR-000011', // Team Collab
      areas: ["Programme Coordination", "Collaboration Infrastructure", "Workflow Management", "Institutional Operations"]
    }
  ];

  for (const up of updates) {
    await client.query(`
      UPDATE "PartnerApplication"
      SET "collaborationAreas" = $1
      WHERE id = $2
    `, [JSON.stringify(up.areas), up.id]);
  }

  console.log('Updated collaboration areas for institutional partners');
  await client.end();
}

main().catch(console.error);
