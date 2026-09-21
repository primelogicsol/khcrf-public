require('dotenv').config({ path: '.env' });
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const newEntities = [
    {
      id: 'KHCRF-PTR-000085',
      orgName: 'KEW Biodiversity Intelligence',
      country: 'India',
      contactName: 'System Default',
      email: 'system@kew.org',
      collection: 'internal-module',
      status: 'ACTIVE',
      collaborationAreas: ['Environmental Research', 'Conservation'],
      collaborationType: ['Biodiversity', 'Conservation Intelligence'],
      projectDescription: 'KEW Biodiversity Intelligence functions as a specialized analytical engine tracking regional flora and fauna, providing actionable conservation intelligence and deep-tier mapping of critical biological networks.'
    },
    {
      id: 'KHCRF-PTR-000086',
      orgName: 'KEW Western Himalayan Protected Area Network',
      country: 'India',
      contactName: 'System Default',
      email: 'system@kew.org',
      collection: 'internal-module',
      status: 'ACTIVE',
      collaborationAreas: ['Environmental Research', 'Conservation'],
      collaborationType: ['Protected Areas', 'Conservation Intelligence'],
      projectDescription: 'The Western Himalayan Protected Area Network operates as an integrated monitoring platform managing ecological zones, evaluating conservation strategies, and securing vulnerable natural heritage habitats.'
    },
    {
      id: 'KHCRF-PTR-000087',
      orgName: 'KEW Water Systems Intelligence',
      country: 'India',
      contactName: 'System Default',
      email: 'system@kew.org',
      collection: 'internal-module',
      status: 'ACTIVE',
      collaborationAreas: ['Environmental Research', 'Conservation'],
      collaborationType: ['Hydrology', 'Water Intelligence'],
      projectDescription: 'KEW Water Systems Intelligence serves as a dedicated hydrological monitoring layer, mapping regional watersheds, analyzing glacial melt metrics, and providing critical foresight on water resource sustainability.'
    },
    {
      id: 'KHCRF-PTR-000088',
      orgName: 'KEW Environmental Monitoring Intelligence',
      country: 'India',
      contactName: 'System Default',
      email: 'system@kew.org',
      collection: 'internal-module',
      status: 'ACTIVE',
      collaborationAreas: ['Environmental Research', 'Conservation'],
      collaborationType: ['Environmental Monitoring', 'Pollution Intelligence'],
      projectDescription: 'KEW Environmental Monitoring Intelligence provides continuous real-time analysis of localized environmental health, tracking air quality indicators, tracking pollution vectors, and establishing baseline ecological parameters.'
    },
    {
      id: 'KHCRF-PTR-000089',
      orgName: 'KEW Hazard & Risk Intelligence',
      country: 'India',
      contactName: 'System Default',
      email: 'system@kew.org',
      collection: 'internal-module',
      status: 'ACTIVE',
      collaborationAreas: ['Environmental Research', 'Conservation'],
      collaborationType: ['Hazard Intelligence', 'Risk Monitoring'],
      projectDescription: 'KEW Hazard & Risk Intelligence operates as a proactive alert and assessment infrastructure, evaluating climate vulnerability, regional geo-hazards, and environmental risks for robust disaster preparedness.'
    },
    {
      id: 'KHCRF-PTR-000090',
      orgName: 'KEW Seasonal Ecology Intelligence',
      country: 'India',
      contactName: 'System Default',
      email: 'system@kew.org',
      collection: 'internal-module',
      status: 'ACTIVE',
      collaborationAreas: ['Environmental Research', 'Conservation'],
      collaborationType: ['Phenology', 'Seasonal Intelligence'],
      projectDescription: 'KEW Seasonal Ecology Intelligence delivers specialized phenological mapping, analyzing localized seasonal shifts, climate-induced biological timing, and critical seasonal ecology markers across the Kashmir region.'
    },
    {
      id: 'KHCRF-PTR-000091',
      orgName: 'KEW Ecological Atlas & GIS Intelligence',
      country: 'India',
      contactName: 'System Default',
      email: 'system@kew.org',
      collection: 'internal-module',
      status: 'ACTIVE',
      collaborationAreas: ['Environmental Research', 'Conservation'],
      collaborationType: ['Geospatial Intelligence', 'Environmental Mapping'],
      projectDescription: 'KEW Ecological Atlas & GIS Intelligence provides a comprehensive geospatial architecture, integrating satellite imagery, terrain models, and specialized mapping data for advanced environmental research.'
    },
    {
      id: 'KHCRF-PTR-000092',
      orgName: 'KEW Research & Evidence Library',
      country: 'India',
      contactName: 'System Default',
      email: 'system@kew.org',
      collection: 'internal-module',
      status: 'ACTIVE',
      collaborationAreas: ['Environmental Research', 'Conservation'],
      collaborationType: ['Scientific Research', 'Evidence Management'],
      projectDescription: 'KEW Research & Evidence Library serves as the centralized digital repository for regional environmental science, archiving peer-reviewed studies, vital ecological datasets, and comprehensive conservation evidence.'
    },
    {
      id: 'KHCRF-PTR-000093',
      orgName: 'KEW Open Data Portal',
      country: 'India',
      contactName: 'System Default',
      email: 'system@kew.org',
      collection: 'internal-module',
      status: 'ACTIVE',
      collaborationAreas: ['Environmental Research', 'Conservation'],
      collaborationType: ['Open Data', 'Environmental Research'],
      projectDescription: 'KEW Open Data Portal functions as an accessible, public-facing interface for critical environmental metrics, enabling collaborative research and data transparency for institutions, policymakers, and civic organizations.'
    },
    {
      id: 'KHCRF-PTR-000094',
      orgName: 'KEW Citizen Science & Contribution Hub',
      country: 'India',
      contactName: 'System Default',
      email: 'system@kew.org',
      collection: 'internal-module',
      status: 'ACTIVE',
      collaborationAreas: ['Environmental Research', 'Conservation'],
      collaborationType: ['Citizen Science', 'Public Participation'],
      projectDescription: 'KEW Citizen Science & Contribution Hub provides a structured operational framework for public participation, allowing local communities to report ecological observations and actively contribute to regional conservation intelligence.'
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

  console.log('Successfully inserted 10 KEW entities!');
  await client.end();
}

main().catch(console.error);
