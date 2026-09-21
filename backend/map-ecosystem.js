require('dotenv').config({ path: '.env' });
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  
  // Define ecosystems
  const ecosystems = {
    'De Koshur Crafts': { parentId: 'KHCRF-PTR-000000', prefix: ['DKC', 'De Koshur Crafts'] },
    'Craftlore': { parentId: 'KHCRF-PTR-000001', prefix: ['Craftlore', 'Craft Guru', 'Craft Digital'] },
    'Kashmir ArtStay': { parentId: 'KHCRF-PTR-000009', prefix: ['ArtStay', 'Kashmir ArtStay'] },
    'Purple Soul USA': { parentId: 'KHCRF-PTR-000010', prefix: ['Purple Soul'] },
    'Prime Logic Solutions USA': { parentId: 'KHCRF-PTR-000012', prefix: ['Prime Logic'] },
    'Kashmir EcoWatch': { parentId: 'KHCRF-PTR-000032', prefix: ['KEW', 'EcoWatch', 'Kashmir EcoWatch'] },
    'Dr. Kumar Foundation USA': { parentId: 'KHCRF-PTR-000033', prefix: ['Dr. Kumar Foundation', 'DKF'] },
  };

  const res = await client.query('SELECT id, "orgName" FROM "PartnerApplication"');
  for (const row of res.rows) {
    let ecosystem_id = null;
    let is_parent_ecosystem = false;
    let parent_entity_id = null;

    for (const [ecoName, config] of Object.entries(ecosystems)) {
      if (row.id === config.parentId) {
        ecosystem_id = ecoName;
        is_parent_ecosystem = true;
        parent_entity_id = null;
        break;
      }
      
      const matches = config.prefix.some(p => row.orgName && row.orgName.includes(p));
      if (matches) {
        ecosystem_id = ecoName;
        is_parent_ecosystem = false;
        parent_entity_id = config.parentId;
        break;
      }
    }

    if (ecosystem_id) {
      await client.query(`
        UPDATE "PartnerApplication"
        SET ecosystem_id = $1, is_parent_ecosystem = $2, parent_entity_id = $3
        WHERE id = $4
      `, [ecosystem_id, is_parent_ecosystem, parent_entity_id, row.id]);
    }
  }

  console.log('Updated structural model in DB for all ecosystems!');
  await client.end();
}

main().catch(console.error);
