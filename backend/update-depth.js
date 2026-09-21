require('dotenv').config({ path: '.env' });
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const updates = [
    {
      id: 'KHCRF-PTR-000075',
      desc: 'Purple Soul Gift Intelligence Engine is an advanced AI-driven discovery platform utilizing semantic analysis to provide hyper-personalized recommendations based on faith traditions, personality profiles, and significant life occasions.'
    },
    {
      id: 'KHCRF-PTR-000076',
      desc: 'Purple Soul Life Journeys provides comprehensive sacred-event planning infrastructure, offering structured journey planners, interactive checklists, budget management, and milestone tracking within a centralized organizational cockpit.'
    },
    {
      id: 'KHCRF-PTR-000077',
      desc: 'Purple Soul Registry Hub serves as a unified, multi-faith smart registry engine tailored for significant life events including weddings, pilgrimages, births, home blessings, and institutional remembrances.'
    },
    {
      id: 'KHCRF-PTR-000078',
      desc: 'Purple Soul Sacred Origins & Living Atlas functions as an interactive educational resource mapping sacred geography, artisan guild histories, origin stories, and enduring craft traditions across global cultures.'
    },
    {
      id: 'KHCRF-PTR-000079',
      desc: 'Purple Soul Faith Institutional Supply offers dedicated B2B sourcing and procurement infrastructure supporting the operational and material needs of mosques, churches, synagogues, temples, and interfaith centers.'
    },
    {
      id: 'KHCRF-PTR-000080',
      desc: 'Purple Soul Vendor & Artisan Hub delivers a distinct operational backend, providing streamlined vendor onboarding, comprehensive artisan registration, and a dedicated management dashboard for independent marketplace suppliers.'
    },
    {
      id: 'KHCRF-PTR-000081',
      desc: 'DKF The Circle operates as a distinct, moderated engagement archive and member directory, facilitating structured registration and fostering dedicated community interactions within the foundation\'s network.'
    },
    {
      id: 'KHCRF-PTR-000082',
      desc: 'DKF Healing Support Platform is a dedicated applied health ecosystem focused on establishing structured healing pathways, supporting facilitator development, and enabling localized community care initiatives.'
    },
    {
      id: 'KHCRF-PTR-000083',
      desc: 'DKF Environmental Stewardship Platform drives the foundation\'s ecological initiatives, coordinating dedicated environmental action, conservation programs, and sustainability education across participating communities.'
    },
    {
      id: 'KHCRF-PTR-000084',
      desc: 'DKF Youth Development Platform provides structural support for the next generation through dedicated mentorship programs, structured youth development pathways, and comprehensive leadership training.'
    }
  ];

  for (const update of updates) {
    await client.query(`UPDATE "PartnerApplication" SET "projectDescription" = $1 WHERE "id" = $2`, [update.desc, update.id]);
  }

  console.log('Successfully updated the content depth for 10 entities.');
  await client.end();
}

main().catch(console.error);
