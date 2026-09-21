const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://govtech:PQsQ3OL6@127.0.0.1:5432/hcrf_db_clean' });

async function run() {
  await client.connect();

  const CANONICAL_VENUE = 'SKC Online Secretariat';

  // Update all SkcHearing records — venue, venueName, and mode
  const r = await client.query(`
    UPDATE "SkcHearing"
    SET
      venue     = $1,
      "venueName" = $1
    WHERE 1=1
  `, [CANONICAL_VENUE]);
  console.log(`Updated venue on ${r.rowCount} SkcHearing records → "${CANONICAL_VENUE}"`);

  // Verify
  const { rows } = await client.query(`
    SELECT DISTINCT venue, "venueName" FROM "SkcHearing" LIMIT 5
  `);
  console.log('Sample venues after update:', rows);

  await client.end();
}

run().catch(e => { console.error(e); process.exit(1); });
