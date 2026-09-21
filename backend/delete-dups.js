require('dotenv').config({ path: '.env' });
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const idsToDelete = [
    'KHCRF-PTR-000062',
    'KHCRF-PTR-000063',
    'KHCRF-PTR-000064',
    'KHCRF-PTR-000065',
    'KHCRF-PTR-000066',
    'KHCRF-PTR-000067',
    'KHCRF-PTR-000068',
    'KHCRF-PTR-000069',
    'KHCRF-PTR-000070',
    'KHCRF-PTR-000071',
    'KHCRF-PTR-000072',
    'KHCRF-PTR-000073',
    'KHCRF-PTR-000074'
  ];
  
  const placeholders = idsToDelete.map((_, i) => `$${i + 1}`).join(',');
  const res = await client.query(`DELETE FROM "PartnerApplication" WHERE "id" IN (${placeholders})`, idsToDelete);
  console.log('Deleted records:', res.rowCount);
  await client.end();
}

main().catch(console.error);
