require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  await pool.query(`
    CREATE TYPE "EvidenceTransferStatus" AS ENUM ('PENDING', 'RETRIEVING', 'RECEIVED', 'HASH_VERIFIED', 'FAILED');
    CREATE TABLE "VerificationEvidence" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "submissionId" TEXT NOT NULL,
      "revision" INTEGER NOT NULL,
      "evidenceId" TEXT NOT NULL,
      "factorCode" TEXT NOT NULL,
      "originalFilename" TEXT NOT NULL,
      "mimeType" TEXT NOT NULL,
      "sizeBytes" INTEGER NOT NULL,
      "expectedSha256" TEXT NOT NULL,
      "receivedSha256" TEXT,
      "storageKey" TEXT NOT NULL UNIQUE,
      "transferStatus" "EvidenceTransferStatus" NOT NULL DEFAULT 'PENDING',
      "integrityVerified" BOOLEAN NOT NULL DEFAULT false,
      "receivedAt" TIMESTAMP(3),
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "VerificationEvidence_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "EvaluationSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE
    );
    CREATE UNIQUE INDEX "VerificationEvidence_submissionId_revision_evidenceId_key" ON "VerificationEvidence"("submissionId", "revision", "evidenceId");
  `);
  console.log("Created table");
}
run().catch(console.error).finally(() => pool.end());
