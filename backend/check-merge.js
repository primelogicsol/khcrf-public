require('dotenv').config({ path: '.env' });
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const res = await client.query(`SELECT id, "orgName" FROM "PartnerApplication" WHERE id IN ('KHCRF-PTR-000037', 'KHCRF-PTR-000038', 'KHCRF-PTR-000041', 'KHCRF-PTR-000013')`);
  console.table(res.rows);
  await client.end();
}

main().catch(console.error);
