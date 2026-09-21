require('dotenv').config({ path: '.env' });
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  
  try {
    await client.query(`
      ALTER TABLE "PartnerApplication" 
      ADD COLUMN IF NOT EXISTS ecosystem_id VARCHAR(255),
      ADD COLUMN IF NOT EXISTS is_parent_ecosystem BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS parent_entity_id VARCHAR(255);
    `);
    console.log('Added schema columns!');
  } catch (err) {
    console.error(err);
  }

  await client.end();
}

main();
