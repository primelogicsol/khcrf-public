require('dotenv').config({ path: '.env' });
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const res = await client.query('SELECT * FROM "PartnerApplication" LIMIT 1');
  console.log(Object.keys(res.rows[0]));
  await client.end();
}
main().catch(console.error);
