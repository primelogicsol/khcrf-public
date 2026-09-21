require('dotenv').config({ path: '.env' });
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const result = await client.query('SELECT * FROM "PartnerApplication"');
  
  const snapshotPath = path.join(__dirname, 'database_freeze_registry.json');
  fs.writeFileSync(snapshotPath, JSON.stringify(result.rows, null, 2));

  console.log(`Frozen ${result.rows.length} records into ${snapshotPath}`);
  await client.end();
}

main().catch(console.error);
