require('dotenv').config({ path: '.env' });
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const newEntities = [
    {
      id: 'KHCRF-PTR-000102',
      orgName: 'Craftlore Craft Intelligence',
      country: 'India',
      contactName: 'System Default',
      email: 'system@craftlore.org',
      collection: 'internal-module',
      status: 'ACTIVE',
      collaborationAreas: ['Innovation and Technology', 'Policy and Advocacy'],
      collaborationType: ['Craft Intelligence', 'Buyer Knowledge'],
      projectDescription: 'Craftlore Craft Intelligence functions as a specialized market intelligence layer, providing deep-tier buyer knowledge, trend analytics, and strategic insights for informed engagement with authentic Kashmiri crafts.'
    },
    {
      id: 'KHCRF-PTR-000103',
      orgName: 'Craftlore Craft Knowledge',
      country: 'India',
      contactName: 'System Default',
      email: 'system@craftlore.org',
      collection: 'internal-module',
      status: 'ACTIVE',
      collaborationAreas: ['Innovation and Technology', 'Cultural Preservation'],
      collaborationType: ['Knowledge', 'Heritage Intelligence'],
      projectDescription: 'Craftlore Craft Knowledge serves as the definitive digital repository for traditional craft methodologies, archiving heritage intelligence and ensuring the preservation of generationally transmitted artisan skills.'
    },
    {
      id: 'KHCRF-PTR-000104',
      orgName: 'Craftlore Craft Atlas & Geographic Intelligence',
      country: 'India',
      contactName: 'System Default',
      email: 'system@craftlore.org',
      collection: 'internal-module',
      status: 'ACTIVE',
      collaborationAreas: ['Innovation and Technology', 'Cultural Preservation'],
      collaborationType: ['GIS', 'Geographic Intelligence'],
      projectDescription: 'Craftlore Craft Atlas & Geographic Intelligence provides advanced spatial mapping of artisan clusters, integrating geographic information systems with demographic data to visualize the regional distribution of craft traditions.'
    },
    {
      id: 'KHCRF-PTR-000105',
      orgName: 'Craftlore Research & Publication System',
      country: 'India',
      contactName: 'System Default',
      email: 'system@craftlore.org',
      collection: 'internal-module',
      status: 'ACTIVE',
      collaborationAreas: ['Innovation and Technology', 'Policy and Advocacy'],
      collaborationType: ['Research', 'Publications'],
      projectDescription: 'Craftlore Research & Publication System operates as an institutional platform for scholarly engagement, managing the dissemination of peer-reviewed research, impact studies, and official publications concerning the artisan economy.'
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

  console.log('Successfully inserted 4 Craftlore entities!');
  await client.end();
}

main().catch(console.error);
