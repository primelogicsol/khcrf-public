require('dotenv').config({ path: '.env' });
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const newEntities = [
    {
      id: 'KHCRF-PTR-000095',
      orgName: 'Prime Logic Environmental Intelligence Platform',
      country: 'USA',
      contactName: 'System Default',
      email: 'system@primelogic.com',
      collection: 'internal-module',
      status: 'ACTIVE',
      collaborationAreas: ['Innovation and Technology', 'Environmental Research'],
      collaborationType: ['Environmental Intelligence', 'Decision Support'],
      projectDescription: 'Prime Logic Environmental Intelligence Platform provides comprehensive technological infrastructure for real-time ecological modeling, advanced environmental monitoring, and predictive analytics to support high-level institutional decision-making.'
    },
    {
      id: 'KHCRF-PTR-000096',
      orgName: 'Prime Logic Water Intelligence Platform',
      country: 'USA',
      contactName: 'System Default',
      email: 'system@primelogic.com',
      collection: 'internal-module',
      status: 'ACTIVE',
      collaborationAreas: ['Innovation and Technology', 'Environmental Research'],
      collaborationType: ['Water Intelligence', 'Utility Operations'],
      projectDescription: 'Prime Logic Water Intelligence Platform operates as a dedicated technological layer engineered for complex hydrological mapping, water resource optimization, and the digital transformation of utility operations.'
    },
    {
      id: 'KHCRF-PTR-000097',
      orgName: 'Prime Logic ESG Intelligence Platform',
      country: 'USA',
      contactName: 'System Default',
      email: 'system@primelogic.com',
      collection: 'internal-module',
      status: 'ACTIVE',
      collaborationAreas: ['Innovation and Technology', 'Policy and Advocacy'],
      collaborationType: ['ESG Intelligence', 'Sustainability Reporting'],
      projectDescription: 'Prime Logic ESG Intelligence Platform serves as a structured digital ecosystem for rigorous sustainability tracking, automated carbon accounting, and institutional ESG compliance reporting.'
    },
    {
      id: 'KHCRF-PTR-000098',
      orgName: 'Prime Logic GIS & Spatial Intelligence Platform',
      country: 'USA',
      contactName: 'System Default',
      email: 'system@primelogic.com',
      collection: 'internal-module',
      status: 'ACTIVE',
      collaborationAreas: ['Innovation and Technology', 'Environmental Research'],
      collaborationType: ['GIS', 'Spatial Intelligence'],
      projectDescription: 'Prime Logic GIS & Spatial Intelligence Platform delivers specialized geospatial analytics, sophisticated terrain mapping, and multi-layered spatial data visualization for precise territorial and environmental management.'
    },
    {
      id: 'KHCRF-PTR-000099',
      orgName: 'Prime Logic Monitoring & Command Platform',
      country: 'USA',
      contactName: 'System Default',
      email: 'system@primelogic.com',
      collection: 'internal-module',
      status: 'ACTIVE',
      collaborationAreas: ['Innovation and Technology', 'Environmental Research'],
      collaborationType: ['Operational Monitoring', 'Command Intelligence'],
      projectDescription: 'Prime Logic Monitoring & Command Platform functions as a centralized operational hub, integrating real-time field data, critical alert systems, and unified command intelligence for rapid response coordination.'
    },
    {
      id: 'KHCRF-PTR-000100',
      orgName: 'Prime Logic Telemetry Infrastructure',
      country: 'USA',
      contactName: 'System Default',
      email: 'system@primelogic.com',
      collection: 'internal-module',
      status: 'ACTIVE',
      collaborationAreas: ['Innovation and Technology', 'Environmental Research'],
      collaborationType: ['Telemetry', 'IoT Infrastructure'],
      projectDescription: 'Prime Logic Telemetry Infrastructure provides robust IoT integration services, deploying advanced sensor networks and remote data acquisition frameworks to support continuous, high-fidelity environmental tracking.'
    },
    {
      id: 'KHCRF-PTR-000101',
      orgName: 'Prime Logic Compliance Intelligence Platform',
      country: 'USA',
      contactName: 'System Default',
      email: 'system@primelogic.com',
      collection: 'internal-module',
      status: 'ACTIVE',
      collaborationAreas: ['Innovation and Technology', 'Policy and Advocacy'],
      collaborationType: ['Regulatory Compliance', 'Automation'],
      projectDescription: 'Prime Logic Compliance Intelligence Platform operates as a dedicated digital engine for tracking regulatory parameters, automating compliance workflows, and ensuring rigorous alignment with international environmental standards.'
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

  console.log('Successfully inserted 7 Prime Logic entities!');
  await client.end();
}

main().catch(console.error);
