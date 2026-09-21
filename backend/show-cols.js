const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://govtech:PQsQ3OL6@127.0.0.1:5432/hcrf_db_clean' });
client.connect().then(async () => {
  const { rows } = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'SkcHearing'
    ORDER BY ordinal_position
  `);
  rows.forEach(r => console.log(r.column_name, '-', r.data_type));
  await client.end();
}).catch(e => { console.error(e.message); process.exit(1); });
