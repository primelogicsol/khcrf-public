const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://govtech:PQsQ3OL6@127.0.0.1:5432/hcrf_db_clean?schema=public' });
client.connect().then(() => client.query(`
CREATE TYPE "EvaluationCaseStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'GROUND_VERIFICATION_REQUIRED', 'VERIFICATION_COMPLETED', 'REJECTED');
ALTER TABLE "EvaluationSubmission" ADD COLUMN "caseStatus" "EvaluationCaseStatus";
ALTER TABLE "EvaluationSubmission" ADD COLUMN "trackingId" TEXT;
CREATE UNIQUE INDEX "EvaluationSubmission_trackingId_key" ON "EvaluationSubmission"("trackingId");
`)).then(() => { console.log('SQL applied'); client.end(); }).catch(e => { console.error(e); client.end(); });
