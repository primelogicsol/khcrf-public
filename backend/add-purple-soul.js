require('dotenv').config({ path: '.env' });
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const newEntities = [
    {
      id: 'KHCRF-PTR-000075',
      orgName: 'Purple Soul Gift Intelligence Engine',
      country: 'USA',
      contactName: 'System Default',
      email: 'system@purplesoul.com',
      collection: 'internal-module',
      status: 'ACTIVE',
      collaborationAreas: ['Innovation and Technology', 'E-Commerce'],
      collaborationType: ['AI Matching', 'Semantic Search'],
      projectDescription: 'AI Gift Finder, semantic matching, faith/personality/occasion matching'
    },
    {
      id: 'KHCRF-PTR-000076',
      orgName: 'Purple Soul Life Journeys',
      country: 'USA',
      contactName: 'System Default',
      email: 'system@purplesoul.com',
      collection: 'internal-module',
      status: 'ACTIVE',
      collaborationAreas: ['Culture and Faith', 'Event Planning'],
      collaborationType: ['Journey Planning', 'Event Coordination'],
      projectDescription: 'Sacred-event planning system, journey planners, checklists, budgets, milestones and cockpit'
    },
    {
      id: 'KHCRF-PTR-000077',
      orgName: 'Purple Soul Registry Hub',
      country: 'USA',
      contactName: 'System Default',
      email: 'system@purplesoul.com',
      collection: 'internal-module',
      status: 'ACTIVE',
      collaborationAreas: ['E-Commerce', 'Life Events'],
      collaborationType: ['Registry Services', 'Multi-faith Support'],
      projectDescription: 'Unified smart registry engine across weddings, pilgrimage, birth, home blessings, remembrance, institutions, etc.'
    },
    {
      id: 'KHCRF-PTR-000078',
      orgName: 'Purple Soul Sacred Origins & Living Atlas',
      country: 'USA',
      contactName: 'System Default',
      email: 'system@purplesoul.com',
      collection: 'internal-module',
      status: 'ACTIVE',
      collaborationAreas: ['Cultural Preservation', 'Education'],
      collaborationType: ['Interactive Mapping', 'Storytelling'],
      projectDescription: 'Origin stories, sacred geography, artisan/guild histories, craft traditions and interactive Living Atlas'
    },
    {
      id: 'KHCRF-PTR-000079',
      orgName: 'Purple Soul Faith Institutional Supply',
      country: 'USA',
      contactName: 'System Default',
      email: 'system@purplesoul.com',
      collection: 'specialized-enterprise',
      status: 'ACTIVE',
      collaborationAreas: ['B2B Commerce', 'Institutional Support'],
      collaborationType: ['Sourcing', 'Procurement'],
      projectDescription: 'B2B sourcing/procurement for mosques, churches, synagogues, temples, gurdwaras, monasteries, schools and interfaith centers'
    },
    {
      id: 'KHCRF-PTR-000080',
      orgName: 'Purple Soul Vendor & Artisan Hub',
      country: 'USA',
      contactName: 'System Default',
      email: 'system@purplesoul.com',
      collection: 'internal-module',
      status: 'ACTIVE',
      collaborationAreas: ['Artisan Welfare', 'Vendor Management'],
      collaborationType: ['Onboarding', 'Dashboard Services'],
      projectDescription: 'Vendor onboarding, artisan registration, vendor management and dashboard infrastructure for independent suppliers.'
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

  console.log('Successfully inserted 6 Purple Soul entities!');
  await client.end();
}

main().catch(console.error);
