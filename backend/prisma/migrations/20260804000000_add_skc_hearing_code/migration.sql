ALTER TABLE "SkcHearing" ADD COLUMN "code" TEXT NOT NULL DEFAULT 'LEGACY';
CREATE UNIQUE INDEX "SkcHearing_assessmentCycleId_code_key" ON "SkcHearing"("assessmentCycleId", "code");
