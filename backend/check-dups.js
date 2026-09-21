require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

async function checkDuplicates() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  
  try {
    const res = await client.query(`
      SELECT display_id, name, ecosystem 
      FROM partner_registry 
      WHERE name LIKE '%Craftlore%' 
         OR name LIKE '%CKTRE%'
         OR name LIKE '%CGIS%'
         OR name LIKE '%CLIE%'
         OR name LIKE '%CAIS%'
         OR name LIKE '%CSEME%'
         OR name LIKE '%CRVAS%'
         OR name LIKE '%Craft Guru%'
         OR name LIKE '%Craft Digital Passport%'
      ORDER BY display_id
    `);
    console.table(res.rows);
  } finally {
    await client.end();
  }
}

checkDuplicates();
