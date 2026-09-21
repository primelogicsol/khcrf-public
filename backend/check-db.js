const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://govtech:PQsQ3OL6@127.0.0.1:5432/hcrf_db_clean?schema=public' });
pool.query('SELECT "orgName", "collection" FROM "PartnerApplication" WHERE collection = \'institutional-alliance\'').then(r => console.log(r.rows)).catch(console.error).finally(()=>pool.end());
