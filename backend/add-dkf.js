require('dotenv').config({ path: '.env' });
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const newEntities = [
    {
      id: 'KHCRF-PTR-000081',
      orgName: 'DKF The Circle',
      country: 'USA',
      contactName: 'System Default',
      email: 'system@dkf.org',
      collection: 'internal-module',
      status: 'ACTIVE',
      collaborationAreas: ['Community Engagement', 'Cultural Preservation'],
      collaborationType: ['Directory', 'Registration'],
      projectDescription: 'Distinct moderated member/engagement archive with directory and registration'
    },
    {
      id: 'KHCRF-PTR-000082',
      orgName: 'DKF Healing Support Platform',
      country: 'USA',
      contactName: 'System Default',
      email: 'system@dkf.org',
      collection: 'internal-module',
      status: 'ACTIVE',
      collaborationAreas: ['Healthcare', 'Community Care'],
      collaborationType: ['Healing Pathways', 'Facilitator Development'],
      projectDescription: 'Dedicated applied platform for healing pathways, facilitator development and community care'
    },
    {
      id: 'KHCRF-PTR-000083',
      orgName: 'DKF Environmental Stewardship Platform',
      country: 'USA',
      contactName: 'System Default',
      email: 'system@dkf.org',
      collection: 'internal-module',
      status: 'ACTIVE',
      collaborationAreas: ['Environmental Action', 'Conservation'],
      collaborationType: ['Stewardship', 'Sustainability'],
      projectDescription: 'Dedicated environmental action, conservation and stewardship platform'
    },
    {
      id: 'KHCRF-PTR-000084',
      orgName: 'DKF Youth Development Platform',
      country: 'USA',
      contactName: 'System Default',
      email: 'system@dkf.org',
      collection: 'internal-module',
      status: 'ACTIVE',
      collaborationAreas: ['Youth Development', 'Mentorship'],
      collaborationType: ['Leadership', 'Education'],
      projectDescription: 'Dedicated mentorship, youth development and leadership platform'
    }
  ];

  for (const entity of newEntities) {
    await client.query(`
      INSERT INTO "PartnerApplication" (
        "id", "orgName", "country", "contactName", "email",
        "collection", "status", "collaborationAreas", "collaborationType", "projectDescription", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()
      )
      ON CONFLICT ("id") DO NOTHING
    `, [
      entity.id,
      entity.orgName,
      entity.country,
      entity.contactName,
      entity.email,
      entity.collection,
      entity.status,
      JSON.stringify(entity.collaborationAreas),
      JSON.stringify(entity.collaborationType),
      entity.projectDescription
    ]);
  }

  console.log('Successfully inserted 4 DKF entities!');
  await client.end();
}

main().catch(console.error);
