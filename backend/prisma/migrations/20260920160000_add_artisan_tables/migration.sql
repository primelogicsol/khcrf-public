-- CreateEnum
CREATE TYPE "VerificationCaseStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'RECEIVED', 'UNDER_REVIEW', 'MORE_EVIDENCE_REQUIRED', 'GROUND_VERIFICATION_REQUIRED', 'GROUND_VERIFICATION_SCHEDULED', 'GROUND_VERIFICATION_COMPLETE', 'READY_FOR_DECISION', 'VERIFICATION_COMPLETED', 'REJECTED', 'SUSPENDED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "EvidenceTransferStatus" AS ENUM ('PENDING', 'RETRIEVING', 'RECEIVED', 'HASH_VERIFIED', 'FAILED');

-- CreateEnum
CREATE TYPE "FactorVerificationState" AS ENUM ('NOT_VERIFIED', 'INSUFFICIENT_EVIDENCE', 'NOT_APPLICABLE', 'SELF_REPORTED', 'EVIDENCE_SUBMITTED', 'UNDER_REVIEW', 'DOCUMENT_VERIFIED', 'GROUND_VERIFIED', 'PARTIALLY_VERIFIED', 'MORE_EVIDENCE_REQUIRED', 'DISPUTED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "IntegrationEventType" AS ENUM ('VERIFICATION_REQUESTED');

-- CreateEnum
CREATE TYPE "IntegrationProcessingStatus" AS ENUM ('RECEIVED', 'PROCESSING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "VerificationOrigin" AS ENUM ('CRAFTLORE', 'KHCRF');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('SYSTEM_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'USER', 'MEMBERSHIP_MODERATOR', 'MEMBERSHIP_REVIEWER', 'VOLUNTEER_COORDINATOR', 'COMMUNITY_COORDINATOR', 'MASTER_ARTISAN_MODERATOR', 'MASTER_ARTISAN_REVIEWER', 'NOMINATION_REVIEWER', 'STORY_EDITOR', 'RESEARCH_MODERATOR', 'RESEARCH_REVIEWER', 'POLICY_MODERATOR', 'POLICY_REVIEWER', 'ASSESSMENT_ADMINISTRATOR', 'ASSESSMENT_MODERATOR', 'EVIDENCE_REVIEWER', 'PUBLIC_HEARING_MODERATOR', 'EXPERT_REVIEWER', 'VALIDATION_REVIEWER', 'MAGAZINE_EDITOR', 'PUBLICATIONS_EDITOR', 'EDITORIAL_REVIEWER', 'EBOOKS_MODERATOR', 'KNOWLEDGE_MODERATOR', 'GLOSSARY_EDITOR', 'LEARNING_CONTENT_MODERATOR', 'ARCHIVE_CURATOR', 'DOCUMENTATION_MODERATOR', 'ORAL_HISTORY_MODERATOR', 'MEDIA_ARCHIVIST', 'MUSEUM_CURATOR', 'COLLECTIONS_MANAGER', 'ARTIFACT_DOCUMENTATION_MODERATOR', 'COLLECTIONS_CURATOR', 'BUSINESS_SUPPORT_MODERATOR', 'EXPORT_ADVISOR', 'MARKET_DEVELOPMENT_MODERATOR', 'BUYER_RELATIONS_COORDINATOR', 'ADVOCACY_COLLABORATOR', 'CAMPAIGN_COORDINATOR', 'LOBBYING_COLLABORATOR', 'CERTIFICATION_MODERATOR', 'CERTIFICATION_REVIEWER', 'ACCREDITATION_MODERATOR', 'ACCREDITATION_REVIEWER', 'COMPLIANCE_REVIEWER', 'DONATIONS_MODERATOR', 'FINANCE_REVIEWER', 'GRANT_COORDINATOR', 'FUNDRAISING_COORDINATOR', 'MEDIA_MODERATOR', 'PRESS_COORDINATOR', 'PHOTO_EDITOR', 'VIDEO_EDITOR', 'EVENTS_MODERATOR', 'WORKSHOP_COORDINATOR', 'CONFERENCE_COORDINATOR', 'TRAINING_COORDINATOR', 'PARTNER_COORDINATOR', 'INSTITUTION_COORDINATOR', 'INTERNATIONAL_RELATIONS_COORDINATOR', 'WEBSITE_CONTENT_MANAGER', 'SEO_MANAGER', 'DASHBOARD_AUDITOR', 'API_MANAGER', 'DEVELOPER', 'QA_REVIEWER', 'MODERATOR_DONATION', 'MODERATOR_CAREER', 'MODERATOR_CERTIFICATIONS', 'MODERATOR_ACCREDITATION', 'MODERATOR_EBOOKS', 'COLLABORATOR_ADVOCACY', 'COLLABORATOR_CAMPAIGNING', 'COLLABORATOR_LOBBYING', 'COLLABORATOR_EBOOKS', 'RESEARCH_CONTRIBUTOR', 'FIELD_CONTRIBUTOR', 'ARTISAN_CONTRIBUTOR', 'INDUSTRY_CONTRIBUTOR', 'POLICY_CONTRIBUTOR', 'INSTITUTIONAL_PARTNER', 'EDITOR_REVIEWER');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- DropIndex
DROP INDEX "MasterArtisan_slug_key";

-- DropIndex
DROP INDEX "skc_assessment_cycles_cycleYear_key";

-- AlterTable
ALTER TABLE "ContactSubmission" ADD COLUMN     "artisanId" TEXT;

-- AlterTable
ALTER TABLE "EvaluationSubmission" ADD COLUMN     "caseStatus" "VerificationCaseStatus" DEFAULT 'DRAFT',
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "craftloreEntityId" TEXT,
ADD COLUMN     "currentRevision" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "entityType" "RegisterType",
ADD COLUMN     "methodologyVersion" TEXT,
ADD COLUMN     "origin" "VerificationOrigin" NOT NULL DEFAULT 'KHCRF',
ADD COLUMN     "receivedAt" TIMESTAMP(3),
ADD COLUMN     "reviewStartedAt" TIMESTAMP(3),
ADD COLUMN     "selfReportedPts" DOUBLE PRECISION,
ADD COLUMN     "snapshotId" TEXT,
ADD COLUMN     "snapshotSha256" TEXT,
ADD COLUMN     "submittedAt" TIMESTAMP(3),
ADD COLUMN     "trackingId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "score" DROP NOT NULL,
ALTER COLUMN "answers" DROP NOT NULL;

-- AlterTable
ALTER TABLE "FellowshipApplication" ADD COLUMN     "cohortId" TEXT NOT NULL DEFAULT '2026',
ADD COLUMN     "normalizedEmail" TEXT;

-- AlterTable
ALTER TABLE "MasterArtisan" DROP COLUMN "award",
DROP COLUMN "bio",
DROP COLUMN "craft",
DROP COLUMN "createdAt",
DROP COLUMN "desc",
DROP COLUMN "img",
DROP COLUMN "loc",
DROP COLUMN "name",
DROP COLUMN "sig",
DROP COLUMN "slug",
DROP COLUMN "stage",
DROP COLUMN "updatedAt",
DROP COLUMN "years",
ADD COLUMN     "age" INTEGER,
ADD COLUMN     "artisanClass" TEXT,
ADD COLUMN     "artisan_name" TEXT NOT NULL,
ADD COLUMN     "birth_year" INTEGER,
ADD COLUMN     "contact_search_status" TEXT DEFAULT 'NOT_SEARCHED',
ADD COLUMN     "craftlore_id" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "current_public_address" TEXT,
ADD COLUMN     "current_ut" TEXT,
ADD COLUMN     "district" TEXT,
ADD COLUMN     "documentation_level" TEXT,
ADD COLUMN     "evidence_grade" TEXT,
ADD COLUMN     "father_husband_name" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "gi_search_status" TEXT DEFAULT 'NOT_SEARCHED',
ADD COLUMN     "gi_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "gov_artisan_id_search_status" TEXT DEFAULT 'NOT_SEARCHED',
ADD COLUMN     "government_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "historical_address" TEXT,
ADD COLUMN     "historical_state" TEXT,
ADD COLUMN     "identity_status" TEXT DEFAULT 'PROVISIONAL',
ADD COLUMN     "internal_contact_note" TEXT,
ADD COLUMN     "internal_contact_source" TEXT,
ADD COLUMN     "internal_mobile" TEXT,
ADD COLUMN     "khcrf_master_id" TEXT,
ADD COLUMN     "khcrf_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_verified_at" TIMESTAMP(3),
ADD COLUMN     "master_status_basis" TEXT,
ADD COLUMN     "merged_into_artisan_id" TEXT,
ADD COLUMN     "panchayat" TEXT,
ADD COLUMN     "pehchan_search_status" TEXT DEFAULT 'NOT_SEARCHED',
ADD COLUMN     "pehchan_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "practice_status" TEXT,
ADD COLUMN     "primary_craft_id" TEXT,
ADD COLUMN     "public_email" TEXT,
ADD COLUMN     "public_mobile" TEXT,
ADD COLUMN     "reconciliation_status" TEXT DEFAULT 'PENDING',
ADD COLUMN     "record_completeness" TEXT DEFAULT 'INCOMPLETE',
ADD COLUMN     "status" TEXT,
ADD COLUMN     "tehsil" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "village_locality" TEXT;

-- AlterTable
ALTER TABLE "PartnerApplication" ADD COLUMN     "collection" TEXT,
ADD COLUMN     "ecosystem_id" VARCHAR(255),
ADD COLUMN     "is_parent_ecosystem" BOOLEAN DEFAULT false,
ADD COLUMN     "parent_entity_id" VARCHAR(255);

-- AlterTable
ALTER TABLE "skc_assessment_cycles" DROP COLUMN "consultationEnd",
DROP COLUMN "consultationStart",
DROP COLUMN "cycleYear",
DROP COLUMN "finalReportRelease",
DROP COLUMN "title";

-- CreateTable
CREATE TABLE "KHCRFVerifiedResult" (
    "id" TEXT NOT NULL,
    "evaluationId" TEXT NOT NULL,
    "trackingId" TEXT NOT NULL,
    "entityId" TEXT,
    "entityType" TEXT NOT NULL,
    "craftType" TEXT,
    "verificationVersion" INTEGER NOT NULL,
    "verifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KHCRFVerifiedResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KHCRFVerifiedFactorResult" (
    "id" TEXT NOT NULL,
    "verifiedResultId" TEXT NOT NULL,
    "factorCode" TEXT NOT NULL,
    "findingStatus" TEXT NOT NULL,
    "evidenceReferenceCount" INTEGER NOT NULL,
    "findingId" TEXT,

    CONSTRAINT "KHCRFVerifiedFactorResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationTransmission" (
    "id" TEXT NOT NULL,
    "verifiedResultId" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "lastAttemptAt" TIMESTAMP(3),
    "transmittedAt" TIMESTAMP(3),
    "externalReference" TEXT,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationTransmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtisanAssertion" (
    "id" TEXT NOT NULL,
    "artisan_id" TEXT NOT NULL,
    "field_name" TEXT NOT NULL,
    "raw_value" TEXT,
    "normalized_value" TEXT,
    "source_id" TEXT NOT NULL,
    "source_page" TEXT,
    "source_row" TEXT,
    "source_record_reference" TEXT,
    "confidence" DOUBLE PRECISION,
    "match_method" TEXT,
    "is_canonical" BOOLEAN NOT NULL DEFAULT false,
    "valid_from" TIMESTAMP(3),
    "valid_to" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reconciliation_reason" TEXT,

    CONSTRAINT "ArtisanAssertion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtisanIdentifier" (
    "id" TEXT NOT NULL,
    "artisan_id" TEXT NOT NULL,
    "identifier_type" TEXT NOT NULL,
    "identifier_value" TEXT NOT NULL,
    "issuer" TEXT,
    "status" TEXT,
    "issued_date" TIMESTAMP(3),
    "source_id" TEXT,
    "source_page" TEXT,
    "source_row" TEXT,
    "source_record_reference" TEXT,

    CONSTRAINT "ArtisanIdentifier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtisanGiAuthorization" (
    "id" TEXT NOT NULL,
    "artisan_id" TEXT NOT NULL,
    "craft_id" TEXT NOT NULL,
    "gi_authorized_user_id" TEXT,
    "gi_application_number" TEXT,
    "gi_registration_number" TEXT,
    "authorization_status" TEXT,
    "authorization_date" TIMESTAMP(3),
    "source_id" TEXT,
    "source_page" TEXT,
    "source_row" TEXT,
    "source_record_reference" TEXT,

    CONSTRAINT "ArtisanGiAuthorization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtisanAward" (
    "id" TEXT NOT NULL,
    "award_name" TEXT NOT NULL,
    "award_year" INTEGER,
    "award_year_text" TEXT,
    "award_level" TEXT,
    "awarding_authority" TEXT,
    "award_craft_original" TEXT,
    "normalized_craft_id" TEXT,
    "source_id" TEXT,
    "source_page" TEXT,
    "source_row" TEXT,
    "source_record_reference" TEXT,
    "verification_status" TEXT,
    "associated_work" TEXT,
    "joint_awardee" TEXT,
    "normalized_award_type" TEXT,
    "award_search_status" TEXT DEFAULT 'NOT_SEARCHED',
    "recognition_exact_title" TEXT,
    "recognition_level" TEXT,

    CONSTRAINT "ArtisanAward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtisanAwardRecipient" (
    "id" TEXT NOT NULL,
    "award_id" TEXT NOT NULL,
    "artisan_id" TEXT NOT NULL,
    "recipient_role" TEXT,
    "source_name_spelling" TEXT,

    CONSTRAINT "ArtisanAwardRecipient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiCraft" (
    "id" TEXT NOT NULL,
    "canonical_name" TEXT NOT NULL,
    "gi_application_no" TEXT,
    "gi_registration_no" TEXT,
    "gi_year" INTEGER,
    "category" TEXT,
    "craftlore_url" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "GiCraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtisanCraftAffiliation" (
    "id" TEXT NOT NULL,
    "artisan_id" TEXT NOT NULL,
    "craft_id" TEXT NOT NULL,
    "relationship_type" TEXT NOT NULL,
    "verification_status" TEXT,
    "source_id" TEXT,
    "source_page" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArtisanCraftAffiliation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StagingArtisan" (
    "id" TEXT NOT NULL,
    "source_authority" TEXT,
    "source_title" TEXT,
    "source_url" TEXT,
    "source_page" TEXT,
    "source_date" TEXT,
    "source_name_spelling" TEXT,
    "candidate_name" TEXT NOT NULL,
    "candidate_father_name" TEXT,
    "candidate_gender" TEXT,
    "craft_raw" TEXT,
    "craft_normalized" TEXT,
    "craft_gi_no" TEXT,
    "district_raw" TEXT,
    "locality_raw" TEXT,
    "recognition_raw" TEXT,
    "recognition_normalized" TEXT,
    "recognition_year" INTEGER,
    "recognition_year_text" TEXT,
    "recognition_authority" TEXT,
    "pehchan_id" TEXT,
    "government_artisan_id" TEXT,
    "gi_au_id" TEXT,
    "entity_type" TEXT,
    "candidate_match_artisan_id" TEXT,
    "match_confidence" TEXT,
    "reconciliation_status" TEXT DEFAULT 'DISCOVERED',
    "reject_reason" TEXT,
    "promoted_at" TIMESTAMP(3),
    "promoted_to_artisan_id" TEXT,
    "mining_batch" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StagingArtisan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtisanLineage" (
    "id" TEXT NOT NULL,
    "lineage_id" TEXT,
    "lineage_name" TEXT NOT NULL,
    "primary_craft_id" TEXT,
    "district" TEXT,
    "risk_level" TEXT,
    "notes" TEXT,

    CONSTRAINT "ArtisanLineage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtisanLineageMember" (
    "id" TEXT NOT NULL,
    "lineage_id" TEXT NOT NULL,
    "artisan_id" TEXT NOT NULL,
    "related_artisan_id" TEXT,
    "relationship_type" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "source_id" TEXT,
    "source_page" TEXT,
    "source_row" TEXT,
    "source_record_reference" TEXT,

    CONSTRAINT "ArtisanLineageMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "source_agency" TEXT,
    "source_title" TEXT NOT NULL,
    "source_url" TEXT,
    "document_date" TIMESTAMP(3),
    "retrieved_at" TIMESTAMP(3),
    "source_type" TEXT,
    "document_hash" TEXT,
    "document_hash_algorithm" TEXT,
    "notes" TEXT,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkshopCommunity" (
    "id" TEXT NOT NULL,
    "khcrf_community_id" TEXT NOT NULL,
    "community_name" TEXT NOT NULL,
    "alternative_names" TEXT,
    "record_type" TEXT NOT NULL DEFAULT 'Living Workshop Community',
    "community_type" TEXT NOT NULL,
    "primary_craft_id" TEXT,
    "associated_crafts" TEXT,
    "specialization" TEXT,
    "materials" TEXT,
    "products" TEXT,
    "production_processes" TEXT,
    "division" TEXT,
    "district" TEXT,
    "tehsil" TEXT,
    "block" TEXT,
    "village_locality" TEXT,
    "postal_address" TEXT,
    "pin_code" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "historical_location_name" TEXT,
    "documented_artisans" INTEGER,
    "estimated_artisans" INTEGER,
    "craft_households" INTEGER,
    "registered_workshops" INTEGER,
    "informal_workshops" INTEGER,
    "master_artisans" INTEGER,
    "women_artisans" INTEGER,
    "trainees_apprentices" INTEGER,
    "shgs" INTEGER,
    "cooperatives" INTEGER,
    "gi_authorized_users_in_community" INTEGER,
    "karkhandar_scheme_units" INTEGER,
    "registered_artisans" INTEGER,
    "pehchan_linked_artisans" INTEGER,
    "government_artisan_ids" INTEGER,
    "gi_status" TEXT,
    "evidence_grade" TEXT,
    "current_status" TEXT,
    "last_verified" TIMESTAMP(3),
    "sources_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkshopCommunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workshop" (
    "id" TEXT NOT NULL,
    "khcrf_workshop_id" TEXT,
    "workshop_name" TEXT NOT NULL,
    "karkhandar_name" TEXT,
    "registration_id" TEXT,
    "address" TEXT,
    "status" TEXT,
    "community_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workshop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityOrganization" (
    "id" TEXT NOT NULL,
    "org_type" TEXT NOT NULL,
    "org_name" TEXT NOT NULL,
    "description" TEXT,
    "community_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityOrganization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationEvidence" (
    "id" TEXT NOT NULL,
    "evaluationId" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "uploadedBy" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "EvaluationEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationEvidenceFactor" (
    "id" TEXT NOT NULL,
    "evidenceId" TEXT NOT NULL,
    "factorCode" TEXT NOT NULL,

    CONSTRAINT "EvaluationEvidenceFactor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CraftloreIntegrationEvent" (
    "eventId" TEXT NOT NULL,
    "verificationRequestId" TEXT NOT NULL,
    "eventType" "IntegrationEventType" NOT NULL,
    "payloadSha256" TEXT NOT NULL,
    "signatureValid" BOOLEAN NOT NULL,
    "processingStatus" "IntegrationProcessingStatus" NOT NULL,
    "assessmentRevision" INTEGER,
    "snapshotId" TEXT,
    "snapshotSha256" TEXT,
    "responseStatus" INTEGER,
    "errorCode" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "CraftloreIntegrationEvent_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "PartnerRegistryEntity" (
    "id" TEXT NOT NULL,
    "registryId" TEXT NOT NULL,
    "orgName" TEXT NOT NULL,
    "collection" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "parentId" TEXT,
    "parentName" TEXT,
    "country" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "collaborationType" JSONB,
    "collaborationAreas" JSONB,
    "projectDescription" TEXT,
    "website" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartnerRegistryEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationEvidence" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "revision" INTEGER NOT NULL,
    "evidenceId" TEXT NOT NULL,
    "factorCode" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "expectedSha256" TEXT NOT NULL,
    "receivedSha256" TEXT,
    "storageKey" TEXT NOT NULL,
    "transferStatus" "EvidenceTransferStatus" NOT NULL DEFAULT 'PENDING',
    "integrityVerified" BOOLEAN NOT NULL DEFAULT false,
    "receivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationFinding" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "revision" INTEGER NOT NULL,
    "factorKey" TEXT NOT NULL,
    "selfReportedValue" JSONB,
    "verifiedValue" JSONB,
    "status" "FactorVerificationState" NOT NULL DEFAULT 'SELF_REPORTED',
    "confidence" DOUBLE PRECISION,
    "reviewerNotes" TEXT,
    "reviewerId" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationFinding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationSubmissionRevision" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "revision" INTEGER NOT NULL,
    "origin" "VerificationOrigin" NOT NULL,
    "snapshotId" TEXT,
    "snapshotSha256" TEXT,
    "methodologyVersion" TEXT,
    "selfReportedPts" DOUBLE PRECISION,
    "answersSnapshot" JSONB NOT NULL,
    "factorSnapshot" JSONB NOT NULL,
    "evidenceManifest" JSONB,
    "submittedAt" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationSubmissionRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationFindingEvidence" (
    "findingId" TEXT NOT NULL,
    "evidenceId" TEXT NOT NULL,

    CONSTRAINT "VerificationFindingEvidence_pkey" PRIMARY KEY ("findingId","evidenceId")
);

-- CreateTable
CREATE TABLE "_MasterArtisanSources" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MasterArtisanSources_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "ArtisanIdentifier_identifier_type_identifier_value_idx" ON "ArtisanIdentifier"("identifier_type", "identifier_value");

-- CreateIndex
CREATE INDEX "ArtisanAwardRecipient_award_id_idx" ON "ArtisanAwardRecipient"("award_id");

-- CreateIndex
CREATE INDEX "ArtisanAwardRecipient_artisan_id_idx" ON "ArtisanAwardRecipient"("artisan_id");

-- CreateIndex
CREATE INDEX "ArtisanCraftAffiliation_artisan_id_idx" ON "ArtisanCraftAffiliation"("artisan_id");

-- CreateIndex
CREATE INDEX "ArtisanCraftAffiliation_craft_id_idx" ON "ArtisanCraftAffiliation"("craft_id");

-- CreateIndex
CREATE UNIQUE INDEX "ArtisanCraftAffiliation_artisan_id_craft_id_relationship_ty_key" ON "ArtisanCraftAffiliation"("artisan_id", "craft_id", "relationship_type");

-- CreateIndex
CREATE UNIQUE INDEX "ArtisanLineage_lineage_id_key" ON "ArtisanLineage"("lineage_id");

-- CreateIndex
CREATE UNIQUE INDEX "WorkshopCommunity_khcrf_community_id_key" ON "WorkshopCommunity"("khcrf_community_id");

-- CreateIndex
CREATE UNIQUE INDEX "Workshop_khcrf_workshop_id_key" ON "Workshop"("khcrf_workshop_id");

-- CreateIndex
CREATE INDEX "CraftloreIntegrationEvent_verificationRequestId_idx" ON "CraftloreIntegrationEvent"("verificationRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "PartnerRegistryEntity_registryId_key" ON "PartnerRegistryEntity"("registryId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationEvidence_storageKey_key" ON "VerificationEvidence"("storageKey");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationEvidence_submissionId_revision_evidenceId_key" ON "VerificationEvidence"("submissionId", "revision", "evidenceId");

-- CreateIndex
CREATE INDEX "VerificationFinding_status_idx" ON "VerificationFinding"("status");

-- CreateIndex
CREATE INDEX "VerificationFinding_submissionId_revision_idx" ON "VerificationFinding"("submissionId", "revision");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationFinding_submissionId_revision_factorKey_key" ON "VerificationFinding"("submissionId", "revision", "factorKey");

-- CreateIndex
CREATE INDEX "VerificationSubmissionRevision_snapshotId_idx" ON "VerificationSubmissionRevision"("snapshotId");

-- CreateIndex
CREATE INDEX "VerificationSubmissionRevision_snapshotSha256_idx" ON "VerificationSubmissionRevision"("snapshotSha256");

-- CreateIndex
CREATE INDEX "VerificationSubmissionRevision_submissionId_idx" ON "VerificationSubmissionRevision"("submissionId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationSubmissionRevision_submissionId_revision_key" ON "VerificationSubmissionRevision"("submissionId", "revision");

-- CreateIndex
CREATE INDEX "VerificationFindingEvidence_findingId_idx" ON "VerificationFindingEvidence"("findingId");

-- CreateIndex
CREATE INDEX "VerificationFindingEvidence_evidenceId_idx" ON "VerificationFindingEvidence"("evidenceId");

-- CreateIndex
CREATE INDEX "_MasterArtisanSources_B_index" ON "_MasterArtisanSources"("B");

-- CreateIndex
CREATE UNIQUE INDEX "EvaluationSubmission_trackingId_key" ON "EvaluationSubmission"("trackingId");

-- CreateIndex
CREATE INDEX "EvaluationSubmission_caseStatus_idx" ON "EvaluationSubmission"("caseStatus");

-- CreateIndex
CREATE INDEX "EvaluationSubmission_craftloreEntityId_idx" ON "EvaluationSubmission"("craftloreEntityId");

-- CreateIndex
CREATE INDEX "EvaluationSubmission_entityType_idx" ON "EvaluationSubmission"("entityType");

-- CreateIndex
CREATE INDEX "EvaluationSubmission_origin_idx" ON "EvaluationSubmission"("origin");

-- CreateIndex
CREATE UNIQUE INDEX "FellowshipApplication_cohortId_normalizedEmail_position_key" ON "FellowshipApplication"("cohortId", "normalizedEmail", "position");

-- CreateIndex
CREATE UNIQUE INDEX "MasterArtisan_khcrf_master_id_key" ON "MasterArtisan"("khcrf_master_id");

-- CreateIndex
CREATE UNIQUE INDEX "MasterArtisan_craftlore_id_key" ON "MasterArtisan"("craftlore_id");

-- AddForeignKey
ALTER TABLE "KHCRFVerifiedFactorResult" ADD CONSTRAINT "KHCRFVerifiedFactorResult_verifiedResultId_fkey" FOREIGN KEY ("verifiedResultId") REFERENCES "KHCRFVerifiedResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationTransmission" ADD CONSTRAINT "VerificationTransmission_verifiedResultId_fkey" FOREIGN KEY ("verifiedResultId") REFERENCES "KHCRFVerifiedResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterArtisan" ADD CONSTRAINT "MasterArtisan_primary_craft_id_fkey" FOREIGN KEY ("primary_craft_id") REFERENCES "GiCraft"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtisanAssertion" ADD CONSTRAINT "ArtisanAssertion_artisan_id_fkey" FOREIGN KEY ("artisan_id") REFERENCES "MasterArtisan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtisanAssertion" ADD CONSTRAINT "ArtisanAssertion_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtisanIdentifier" ADD CONSTRAINT "ArtisanIdentifier_artisan_id_fkey" FOREIGN KEY ("artisan_id") REFERENCES "MasterArtisan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtisanIdentifier" ADD CONSTRAINT "ArtisanIdentifier_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtisanGiAuthorization" ADD CONSTRAINT "ArtisanGiAuthorization_artisan_id_fkey" FOREIGN KEY ("artisan_id") REFERENCES "MasterArtisan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtisanGiAuthorization" ADD CONSTRAINT "ArtisanGiAuthorization_craft_id_fkey" FOREIGN KEY ("craft_id") REFERENCES "GiCraft"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtisanGiAuthorization" ADD CONSTRAINT "ArtisanGiAuthorization_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtisanAward" ADD CONSTRAINT "ArtisanAward_normalized_craft_id_fkey" FOREIGN KEY ("normalized_craft_id") REFERENCES "GiCraft"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtisanAward" ADD CONSTRAINT "ArtisanAward_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtisanAwardRecipient" ADD CONSTRAINT "ArtisanAwardRecipient_artisan_id_fkey" FOREIGN KEY ("artisan_id") REFERENCES "MasterArtisan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtisanAwardRecipient" ADD CONSTRAINT "ArtisanAwardRecipient_award_id_fkey" FOREIGN KEY ("award_id") REFERENCES "ArtisanAward"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtisanCraftAffiliation" ADD CONSTRAINT "ArtisanCraftAffiliation_artisan_id_fkey" FOREIGN KEY ("artisan_id") REFERENCES "MasterArtisan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtisanCraftAffiliation" ADD CONSTRAINT "ArtisanCraftAffiliation_craft_id_fkey" FOREIGN KEY ("craft_id") REFERENCES "GiCraft"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtisanCraftAffiliation" ADD CONSTRAINT "ArtisanCraftAffiliation_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtisanLineageMember" ADD CONSTRAINT "ArtisanLineageMember_artisan_id_fkey" FOREIGN KEY ("artisan_id") REFERENCES "MasterArtisan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtisanLineageMember" ADD CONSTRAINT "ArtisanLineageMember_lineage_id_fkey" FOREIGN KEY ("lineage_id") REFERENCES "ArtisanLineage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtisanLineageMember" ADD CONSTRAINT "ArtisanLineageMember_related_artisan_id_fkey" FOREIGN KEY ("related_artisan_id") REFERENCES "MasterArtisan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtisanLineageMember" ADD CONSTRAINT "ArtisanLineageMember_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkshopCommunity" ADD CONSTRAINT "WorkshopCommunity_primary_craft_id_fkey" FOREIGN KEY ("primary_craft_id") REFERENCES "GiCraft"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workshop" ADD CONSTRAINT "Workshop_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "WorkshopCommunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityOrganization" ADD CONSTRAINT "CommunityOrganization_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "WorkshopCommunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationEvidence" ADD CONSTRAINT "EvaluationEvidence_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "EvaluationSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationEvidenceFactor" ADD CONSTRAINT "EvaluationEvidenceFactor_evidenceId_fkey" FOREIGN KEY ("evidenceId") REFERENCES "EvaluationEvidence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationEvidence" ADD CONSTRAINT "VerificationEvidence_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "EvaluationSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationFinding" ADD CONSTRAINT "VerificationFinding_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationFinding" ADD CONSTRAINT "VerificationFinding_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "EvaluationSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationSubmissionRevision" ADD CONSTRAINT "VerificationSubmissionRevision_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "EvaluationSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationFindingEvidence" ADD CONSTRAINT "VerificationFindingEvidence_findingId_fkey" FOREIGN KEY ("findingId") REFERENCES "VerificationFinding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationFindingEvidence" ADD CONSTRAINT "VerificationFindingEvidence_evidenceId_fkey" FOREIGN KEY ("evidenceId") REFERENCES "EvaluationEvidence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MasterArtisanSources" ADD CONSTRAINT "_MasterArtisanSources_A_fkey" FOREIGN KEY ("A") REFERENCES "MasterArtisan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MasterArtisanSources" ADD CONSTRAINT "_MasterArtisanSources_B_fkey" FOREIGN KEY ("B") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;
