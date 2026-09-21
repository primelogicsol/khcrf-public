-- Additive migration to align migration history with schema.prisma and production DB for skc_assessment_cycles
ALTER TABLE "skc_assessment_cycles" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'PREPARING';
ALTER TABLE "skc_assessment_cycles" ADD COLUMN IF NOT EXISTS "cycle_id" TEXT;
ALTER TABLE "skc_assessment_cycles" ADD COLUMN IF NOT EXISTS "cycle_label" TEXT;
ALTER TABLE "skc_assessment_cycles" ADD COLUMN IF NOT EXISTS "approved_by" TEXT;
ALTER TABLE "skc_assessment_cycles" ADD COLUMN IF NOT EXISTS "approval_date" TIMESTAMP(3);
ALTER TABLE "skc_assessment_cycles" ADD COLUMN IF NOT EXISTS "approval_reference" TEXT;
ALTER TABLE "skc_assessment_cycles" ADD COLUMN IF NOT EXISTS "cycle_start_date" TIMESTAMP(3);
ALTER TABLE "skc_assessment_cycles" ADD COLUMN IF NOT EXISTS "cycle_end_date" TIMESTAMP(3);
ALTER TABLE "skc_assessment_cycles" ADD COLUMN IF NOT EXISTS "publication_target_date" TIMESTAMP(3);

-- Make legacy columns nullable because they are no longer in schema.prisma and Prisma won't provide them
ALTER TABLE "skc_assessment_cycles" ALTER COLUMN "cycleYear" DROP NOT NULL;
ALTER TABLE "skc_assessment_cycles" ALTER COLUMN "title" DROP NOT NULL;

UPDATE "skc_assessment_cycles" SET "cycle_id" = "id" WHERE "cycle_id" IS NULL;
UPDATE "skc_assessment_cycles" SET "cycle_label" = 'Unknown Cycle' WHERE "cycle_label" IS NULL;

ALTER TABLE "skc_assessment_cycles" ALTER COLUMN "cycle_id" SET NOT NULL;
ALTER TABLE "skc_assessment_cycles" ALTER COLUMN "cycle_label" SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'skc_assessment_cycles_cycle_id_key') THEN
        CREATE UNIQUE INDEX "skc_assessment_cycles_cycle_id_key" ON "skc_assessment_cycles"("cycle_id");
    END IF;
END $$;
ALTER TABLE "SkcHearing" ADD COLUMN IF NOT EXISTS "assessmentQuestions" TEXT[];
ALTER TABLE "SkcHearing" ADD COLUMN IF NOT EXISTS "coverageDistricts" TEXT[];
ALTER TABLE "SkcHearing" ADD COLUMN IF NOT EXISTS "regionalCoverageLabel" TEXT;
ALTER TABLE "SkcHearing" ADD COLUMN IF NOT EXISTS "eventType" TEXT NOT NULL DEFAULT 'PUBLIC_HEARING';
ALTER TABLE "SkcHearing" ADD COLUMN IF NOT EXISTS "activityType" TEXT DEFAULT 'PUBLIC_HEARING';
ALTER TABLE "SkcHearing" ADD COLUMN IF NOT EXISTS "timelineVisible" BOOLEAN DEFAULT true;
ALTER TABLE "SkcHearing" ADD COLUMN IF NOT EXISTS "hearingVisible" BOOLEAN DEFAULT true;
ALTER TABLE "SkcHearing" ADD COLUMN IF NOT EXISTS "publicNoticeVisible" BOOLEAN DEFAULT false;
ALTER TABLE "SkcHearing" ADD COLUMN IF NOT EXISTS "hearingStartsAt" TIMESTAMPTZ(6);
ALTER TABLE "SkcHearing" ADD COLUMN IF NOT EXISTS "hearingEndsAt" TIMESTAMPTZ(6);
ALTER TABLE "SkcHearing" ADD COLUMN IF NOT EXISTS "testimonyOpensAt" TIMESTAMPTZ(6);
ALTER TABLE "SkcHearing" ADD COLUMN IF NOT EXISTS "testimonyClosesAt" TIMESTAMPTZ(6);
ALTER TABLE "SkcHearing" ADD COLUMN IF NOT EXISTS "statusOverride" TEXT;
ALTER TABLE "SkcHearing" ADD COLUMN IF NOT EXISTS "allowLateSubmission" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "SkcHearing" ADD COLUMN IF NOT EXISTS "lateSubmissionReviewRequired" BOOLEAN NOT NULL DEFAULT true;
