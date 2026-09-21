require('dotenv').config({ path: '.env' });
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const idsToExpand = [
    'KHCRF-PTR-000058', 'KHCRF-PTR-000059', 'KHCRF-PTR-000060', 'KHCRF-PTR-000061', // Craftlore
    'KHCRF-PTR-000075', 'KHCRF-PTR-000076', 'KHCRF-PTR-000077', 'KHCRF-PTR-000078', 'KHCRF-PTR-000079', 'KHCRF-PTR-000080', // Purple Soul
    'KHCRF-PTR-000081', 'KHCRF-PTR-000082', 'KHCRF-PTR-000083', 'KHCRF-PTR-000084'  // DKF
  ];

  const placeholders = idsToExpand.map((_, i) => `$${i + 1}`).join(',');
  const res = await client.query(`SELECT id, "orgName", "projectDescription" FROM "PartnerApplication" WHERE id IN (${placeholders})`, idsToExpand);
  console.table(res.rows);

  await client.end();
}

main().catch(console.error);
