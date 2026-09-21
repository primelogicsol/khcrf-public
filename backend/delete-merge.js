require('dotenv').config({ path: '.env' });
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const idsToDelete = [
    'KHCRF-PTR-000037', // ArtStay CPS
    'KHCRF-PTR-000041', // ArtStay KTR
    'KHCRF-PTR-000013'  // DKC Blockchain
  ];
  
  const placeholders = idsToDelete.map((_, i) => `$${i + 1}`).join(',');
  const res = await client.query(`DELETE FROM "PartnerApplication" WHERE "id" IN (${placeholders})`, idsToDelete);
  console.log('Deleted records:', res.rowCount);
  await client.end();
}

main().catch(console.error);
