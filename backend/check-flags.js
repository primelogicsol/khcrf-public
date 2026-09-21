const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://govtech:PQsQ3OL6@127.0.0.1:5432/hcrf_db_clean' });
client.connect().then(async () => {
  const { rows } = await client.query(`SELECT COUNT(*) as total, 
    SUM(CASE WHEN "hearingVisible" = true THEN 1 ELSE 0 END) as hearing_visible,
    SUM(CASE WHEN "publicNoticeVisible" = true AND "hearingVisible" = false THEN 1 ELSE 0 END) as notice_only
    FROM "SkcHearing"`);
  console.log('Total:', rows[0].total, '| hearingVisible=true:', rows[0].hearing_visible, '| publicNotice only:', rows[0].notice_only);
  
  // Check what Prisma sees via raw query through the API layer
  const { rows: sample } = await client.query(`SELECT title, "hearingVisible", "publicNoticeVisible", "activityType", venue FROM "SkcHearing" LIMIT 5`);
  sample.forEach(r => console.log(r.hearingVisible, r.publicNoticeVisible, r.activityType, r.venue, '-', r.title.substring(0,40)));
  
  await client.end();
}).catch(e => { console.error(e); process.exit(1); });
