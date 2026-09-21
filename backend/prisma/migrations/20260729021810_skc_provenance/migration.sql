-- CreateEnum
CREATE TYPE "DataProvenance" AS ENUM ('UNKNOWN', 'PRODUCTION', 'IMPORTED', 'SEED', 'DEMO', 'TEST');

-- CreateEnum
CREATE TYPE "RecordSourceSystem" AS ENUM ('ONLINE_PORTAL', 'CSV_IMPORT', 'ADMIN_ENTRY', 'LEGACY_IMPORT', 'API', 'MIGRATION');

-- CreateEnum
CREATE TYPE "SkcScheduleOverrideStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'REVOKED');

-- CreateEnum
CREATE TYPE "SkcMilestoneCode" AS ENUM ('DESIGN_START', 'STAKEHOLDER_REGISTRATION_OPEN', 'PUBLIC_PARTICIPATION_OPEN', 'HEARING_ORIENTATION', 'PUBLIC_HEARINGS_START', 'PUBLIC_HEARINGS_END', 'EVIDENCE_REVIEW_START', 'DRAFT_FINDINGS_REVIEW', 'STAKEHOLDER_VALIDATION', 'EXPERT_REVIEW', 'FINAL_REPORT_TABLED');

-- CreateEnum
CREATE TYPE "SkcClassifiedEntityType" AS ENUM ('SKC_STAKEHOLDER_REGISTRATION', 'SKC_INSTITUTION_REGISTRATION', 'SKC_HEARING', 'HEARING_REGISTRATION', 'HEARING_TESTIMONY', 'SKC_EVIDENCE');

-- AlterTable HearingRegistration
ALTER TABLE "HearingRegistration" ADD COLUMN "dataProvenance" "DataProvenance" NULL,
ADD COLUMN "sourceSystem" "RecordSourceSystem" NULL;

UPDATE "HearingRegistration" SET "sourceSystem" = 'LEGACY_IMPORT', "dataProvenance" = 'UNKNOWN';

ALTER TABLE "HearingRegistration" ALTER COLUMN "sourceSystem" SET DEFAULT 'ONLINE_PORTAL';
ALTER TABLE "HearingRegistration" ALTER COLUMN "sourceSystem" SET NOT NULL;
ALTER TABLE "HearingRegistration" ALTER COLUMN "dataProvenance" SET DEFAULT 'UNKNOWN';
ALTER TABLE "HearingRegistration" ALTER COLUMN "dataProvenance" SET NOT NULL;

-- AlterTable HearingTestimony
ALTER TABLE "HearingTestimony" ADD COLUMN "dataProvenance" "DataProvenance" NULL,
ADD COLUMN "sourceSystem" "RecordSourceSystem" NULL;

UPDATE "HearingTestimony" SET "sourceSystem" = 'LEGACY_IMPORT', "dataProvenance" = 'UNKNOWN';

ALTER TABLE "HearingTestimony" ALTER COLUMN "sourceSystem" SET DEFAULT 'ONLINE_PORTAL';
ALTER TABLE "HearingTestimony" ALTER COLUMN "sourceSystem" SET NOT NULL;
ALTER TABLE "HearingTestimony" ALTER COLUMN "dataProvenance" SET DEFAULT 'UNKNOWN';
ALTER TABLE "HearingTestimony" ALTER COLUMN "dataProvenance" SET NOT NULL;

-- AlterTable SkcEvidence
ALTER TABLE "SkcEvidence" ADD COLUMN "dataProvenance" "DataProvenance" NULL,
ADD COLUMN "sourceSystem" "RecordSourceSystem" NULL;

UPDATE "SkcEvidence" SET "sourceSystem" = 'LEGACY_IMPORT', "dataProvenance" = 'UNKNOWN';

ALTER TABLE "SkcEvidence" ALTER COLUMN "sourceSystem" SET DEFAULT 'ONLINE_PORTAL';
ALTER TABLE "SkcEvidence" ALTER COLUMN "sourceSystem" SET NOT NULL;
ALTER TABLE "SkcEvidence" ALTER COLUMN "dataProvenance" SET DEFAULT 'UNKNOWN';
ALTER TABLE "SkcEvidence" ALTER COLUMN "dataProvenance" SET NOT NULL;

-- AlterTable SkcHearing
ALTER TABLE "SkcHearing" ADD COLUMN "dataProvenance" "DataProvenance" NULL,
ADD COLUMN "isPublic" BOOLEAN NULL,
ADD COLUMN "sourceSystem" "RecordSourceSystem" NULL;

UPDATE "SkcHearing" SET "sourceSystem" = 'LEGACY_IMPORT', "dataProvenance" = 'UNKNOWN', "isPublic" = false;

ALTER TABLE "SkcHearing" ALTER COLUMN "sourceSystem" SET DEFAULT 'ONLINE_PORTAL';
ALTER TABLE "SkcHearing" ALTER COLUMN "sourceSystem" SET NOT NULL;
ALTER TABLE "SkcHearing" ALTER COLUMN "dataProvenance" SET DEFAULT 'UNKNOWN';
ALTER TABLE "SkcHearing" ALTER COLUMN "dataProvenance" SET NOT NULL;
ALTER TABLE "SkcHearing" ALTER COLUMN "isPublic" SET DEFAULT false;
ALTER TABLE "SkcHearing" ALTER COLUMN "isPublic" SET NOT NULL;

-- AlterTable SkcInstitutionRegistration
ALTER TABLE "SkcInstitutionRegistration" ADD COLUMN "dataProvenance" "DataProvenance" NULL,
ADD COLUMN "sourceSystem" "RecordSourceSystem" NULL;

UPDATE "SkcInstitutionRegistration" SET "sourceSystem" = 'LEGACY_IMPORT', "dataProvenance" = 'UNKNOWN';

ALTER TABLE "SkcInstitutionRegistration" ALTER COLUMN "sourceSystem" SET DEFAULT 'ONLINE_PORTAL';
ALTER TABLE "SkcInstitutionRegistration" ALTER COLUMN "sourceSystem" SET NOT NULL;
ALTER TABLE "SkcInstitutionRegistration" ALTER COLUMN "dataProvenance" SET DEFAULT 'UNKNOWN';
ALTER TABLE "SkcInstitutionRegistration" ALTER COLUMN "dataProvenance" SET NOT NULL;

-- AlterTable SkcStakeholderRegistration
ALTER TABLE "SkcStakeholderRegistration" ADD COLUMN "dataProvenance" "DataProvenance" NULL,
ADD COLUMN "sourceSystem" "RecordSourceSystem" NULL,
ADD COLUMN "verifiedAt" TIMESTAMP(3),
ADD COLUMN "verifiedById" TEXT;

UPDATE "SkcStakeholderRegistration" SET "sourceSystem" = 'LEGACY_IMPORT', "dataProvenance" = 'UNKNOWN';

ALTER TABLE "SkcStakeholderRegistration" ALTER COLUMN "sourceSystem" SET DEFAULT 'ONLINE_PORTAL';
ALTER TABLE "SkcStakeholderRegistration" ALTER COLUMN "sourceSystem" SET NOT NULL;
ALTER TABLE "SkcStakeholderRegistration" ALTER COLUMN "dataProvenance" SET DEFAULT 'UNKNOWN';
ALTER TABLE "SkcStakeholderRegistration" ALTER COLUMN "dataProvenance" SET NOT NULL;

-- CreateTable
CREATE TABLE "SkcScheduleOverride" (
    "id" TEXT NOT NULL,
    "cycleYear" INTEGER NOT NULL DEFAULT 2026,
    "milestoneCode" "SkcMilestoneCode" NOT NULL,
    "originalAt" TIMESTAMP(3) NOT NULL,
    "overrideAt" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "SkcScheduleOverrideStatus" NOT NULL DEFAULT 'DRAFT',
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkcScheduleOverride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkcDataClassificationAudit" (
    "id" TEXT NOT NULL,
    "entityType" "SkcClassifiedEntityType" NOT NULL,
    "recordId" TEXT NOT NULL,
    "previousProvenance" "DataProvenance" NOT NULL,
    "newProvenance" "DataProvenance" NOT NULL,
    "previousSource" "RecordSourceSystem" NOT NULL,
    "newSource" "RecordSourceSystem" NOT NULL,
    "reason" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "classifiedById" TEXT,
    "classifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SkcDataClassificationAudit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SkcScheduleOverride_cycleYear_milestoneCode_status_isActive_idx" ON "SkcScheduleOverride"("cycleYear", "milestoneCode", "status", "isActive");

-- CreateIndex
CREATE INDEX "SkcScheduleOverride_approvedById_idx" ON "SkcScheduleOverride"("approvedById");

-- CreateIndex
CREATE UNIQUE INDEX "SkcDataClassificationAudit_idempotencyKey_key" ON "SkcDataClassificationAudit"("idempotencyKey");

-- CreateIndex
CREATE INDEX "SkcDataClassificationAudit_entityType_recordId_idx" ON "SkcDataClassificationAudit"("entityType", "recordId");

-- CreateIndex
CREATE INDEX "SkcDataClassificationAudit_batchId_idx" ON "SkcDataClassificationAudit"("batchId");

-- CreateIndex
CREATE INDEX "SkcDataClassificationAudit_classifiedById_idx" ON "SkcDataClassificationAudit"("classifiedById");

-- CreateIndex
CREATE INDEX "SkcDataClassificationAudit_classifiedAt_idx" ON "SkcDataClassificationAudit"("classifiedAt");

-- CreateIndex
CREATE INDEX "HearingRegistration_dataProvenance_status_idx" ON "HearingRegistration"("dataProvenance", "status");

-- CreateIndex
CREATE INDEX "HearingTestimony_dataProvenance_status_idx" ON "HearingTestimony"("dataProvenance", "status");

-- CreateIndex
CREATE INDEX "SkcEvidence_dataProvenance_status_idx" ON "SkcEvidence"("dataProvenance", "status");

-- CreateIndex
CREATE INDEX "SkcHearing_dataProvenance_publicationStatus_status_idx" ON "SkcHearing"("dataProvenance", "publicationStatus", "status");

-- CreateIndex
CREATE INDEX "SkcInstitutionRegistration_dataProvenance_status_idx" ON "SkcInstitutionRegistration"("dataProvenance", "status");

-- CreateIndex
CREATE INDEX "SkcStakeholderRegistration_verifiedById_idx" ON "SkcStakeholderRegistration"("verifiedById");

-- CreateIndex
CREATE INDEX "SkcStakeholderRegistration_dataProvenance_status_idx" ON "SkcStakeholderRegistration"("dataProvenance", "status");

-- CreateIndex
CREATE INDEX "SkcStakeholderRegistration_dataProvenance_verifiedAt_idx" ON "SkcStakeholderRegistration"("dataProvenance", "verifiedAt");

-- AddForeignKey
ALTER TABLE "SkcStakeholderRegistration" ADD CONSTRAINT "SkcStakeholderRegistration_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkcScheduleOverride" ADD CONSTRAINT "SkcScheduleOverride_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkcDataClassificationAudit" ADD CONSTRAINT "SkcDataClassificationAudit_classifiedById_fkey" FOREIGN KEY ("classifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- Create Partial Unique Index for SkcScheduleOverride
CREATE UNIQUE INDEX "skc_override_active_unique"
ON "SkcScheduleOverride" ("cycleYear", "milestoneCode")
WHERE "isActive" = true AND "status" = 'APPROVED';
