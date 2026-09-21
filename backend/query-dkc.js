const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://govtech:PQsQ3OL6@127.0.0.1:5432/hcrf_db_clean' });
client.connect().then(async () => {
  const { rows } = await client.query(
    `SELECT "registryId", "orgName", "collection", "entityType", "country", "parentName"
     FROM "PartnerRegistryEntity"
     WHERE "orgName" ILIKE '%De Koshur%' OR "orgName" ILIKE '%DKC%'
     ORDER BY "registryId"`
  );
  console.log('DKC records in DB:');
  rows.forEach(r => console.log(JSON.stringify(r)));
  console.log('\nTotal DKC records:', rows.length);
  await client.end();
}).catch(e => { console.error(e); process.exit(1); });
