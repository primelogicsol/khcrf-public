const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://govtech:PQsQ3OL6@127.0.0.1:5432/hcrf_db_clean' });
client.connect().then(async () => {
  const { rows } = await client.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`
  );
  console.log('All tables:');
  rows.forEach(r => console.log(' ', r.table_name));
  await client.end();
}).catch(e => { console.error(e); process.exit(1); });
