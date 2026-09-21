const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://govtech:PQsQ3OL6@127.0.0.1:5432/hcrf_db_clean' });
client.connect().then(async () => {
  const { rowCount } = await client.query(
    `UPDATE "PartnerRegistryEntity"
     SET "projectDescription" = $1
     WHERE "orgName" = 'Kashmir EcoWatch'`,
    ['Kashmir EcoWatch advances CSR and public-interest initiatives focused on sustainable tourism, handicrafts, environmental awareness and responsible development, supporting ecological resilience, community livelihoods and long-term sustainability across Kashmir.']
  );
  console.log(`Updated Kashmir EcoWatch: ${rowCount} row(s)`);
  const { rows } = await client.query(
    `SELECT "orgName", "projectDescription" FROM "PartnerRegistryEntity" WHERE "orgName" = 'Kashmir EcoWatch'`
  );
  console.log('Verified:', rows[0]);
  await client.end();
}).catch(e => { console.error(e); process.exit(1); });
