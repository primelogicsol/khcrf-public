const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://govtech:PQsQ3OL6@127.0.0.1:5432/hcrf_db_clean?schema=public' });
client.connect()
  .then(() => client.query(`ALTER TABLE "EvaluationSubmission" ALTER COLUMN "caseStatus" DROP NOT NULL;`))
  .then(() => client.query(`UPDATE "EvaluationSubmission" SET "caseStatus" = NULL, "trackingId" = NULL WHERE "evaluationType" = 'SELF_ASSESSMENT';`))
  .then(res => { console.log('Updated legacy rows:', res.rowCount); client.end(); })
  .catch(console.error);
