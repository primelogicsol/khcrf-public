-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'RESEARCH_CONTRIBUTOR';
ALTER TYPE "Role" ADD VALUE 'FIELD_CONTRIBUTOR';
ALTER TYPE "Role" ADD VALUE 'ARTISAN_CONTRIBUTOR';
ALTER TYPE "Role" ADD VALUE 'INDUSTRY_CONTRIBUTOR';
ALTER TYPE "Role" ADD VALUE 'POLICY_CONTRIBUTOR';
ALTER TYPE "Role" ADD VALUE 'INSTITUTIONAL_PARTNER';
ALTER TYPE "Role" ADD VALUE 'EDITOR_REVIEWER';

-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "sectionType" TEXT DEFAULT 'chapter',
ADD COLUMN     "status" TEXT DEFAULT 'DRAFT',
ADD COLUMN     "summary" TEXT;

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "profileData" JSONB,
ALTER COLUMN "dob" DROP NOT NULL,
ALTER COLUMN "gender" DROP NOT NULL,
ALTER COLUMN "nationality" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Publication" ADD COLUMN     "contributorId" TEXT,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "submittedByContributor" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "publication_reviews" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "userId" TEXT,
    "reviewType" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "review" TEXT NOT NULL,
    "verifiedReader" BOOLEAN NOT NULL DEFAULT false,
    "helpfulCount" INTEGER NOT NULL DEFAULT 0,
    "recommendCount" INTEGER NOT NULL DEFAULT 0,
    "reportedCount" INTEGER NOT NULL DEFAULT 0,
    "isExpert" BOOLEAN NOT NULL DEFAULT false,
    "expertType" TEXT,
    "expertName" TEXT,
    "expertDesignation" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Submitted',
    "reviewerName" TEXT,
    "institution" TEXT,
    "country" TEXT,
    "disclosure" TEXT,
    "permissionToDisplayName" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "publication_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledge_intake" (
    "id" TEXT NOT NULL,
    "trackingId" TEXT,
    "userId" TEXT,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT NOT NULL,
    "roleType" TEXT NOT NULL,
    "institution" TEXT,
    "profileLink" TEXT,
    "purpose" TEXT NOT NULL,
    "expertise" TEXT NOT NULL,
    "craftFocus" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "contributionType" TEXT NOT NULL,
    "evidence" TEXT,
    "fileUrl" TEXT,
    "sourceNotes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Submitted',
    "assignedEditor" TEXT,
    "adminReview" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "knowledge_intake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donors" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "type" TEXT NOT NULL,
    "recognitionConsent" BOOLEAN NOT NULL DEFAULT false,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donation_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donation_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donation_intents" (
    "id" TEXT NOT NULL,
    "donorId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "donorType" TEXT NOT NULL,
    "purposeId" TEXT,
    "purpose" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "wantsReceipt" BOOLEAN NOT NULL DEFAULT true,
    "recognitionConsent" BOOLEAN NOT NULL DEFAULT false,
    "razorpayOrderId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donation_intents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donation_transactions" (
    "id" TEXT NOT NULL,
    "donationIntentId" TEXT,
    "donorId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" TEXT NOT NULL,
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "razorpaySignature" TEXT,
    "paymentMethod" TEXT,
    "capturedAt" TIMESTAMP(3),
    "settlementStatus" TEXT NOT NULL DEFAULT 'unreconciled',
    "settlementId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donation_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donation_receipts" (
    "id" TEXT NOT NULL,
    "donationTransactionId" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "receiptNumber" TEXT NOT NULL,
    "receiptUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'GENERATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "donation_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "razorpay_webhook_events" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "razorpay_webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donation_allocations" (
    "id" TEXT NOT NULL,
    "donationTransactionId" TEXT NOT NULL,
    "categoryId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "donation_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donation_refunds" (
    "id" TEXT NOT NULL,
    "donationTransactionId" TEXT NOT NULL,
    "razorpayRefundId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "donation_refunds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advisor_interest_applications" (
    "id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "organization" TEXT,
    "district" TEXT NOT NULL,
    "short_statement" TEXT NOT NULL,
    "cv_file_url" TEXT,
    "cv_file_name" TEXT,
    "cv_file_size" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'Received',
    "consent_accepted" BOOLEAN NOT NULL,
    "source_page" TEXT NOT NULL DEFAULT '/state-of-kashmir-crafts/advisory-council',
    "internal_notes" TEXT,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "advisor_interest_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsultationSubmission" (
    "id" TEXT NOT NULL,
    "consultationId" TEXT NOT NULL,
    "participantType" TEXT,
    "district" TEXT,
    "craft" TEXT,
    "stakeholderType" TEXT,
    "aiNarrative" TEXT,
    "inferredTags" TEXT[],
    "inferredThemes" TEXT[],
    "challenges" JSONB,
    "opportunityRanking" JSONB,
    "governmentRecommendation" TEXT,
    "industryRecommendation" TEXT,
    "immediateAction" TEXT,
    "intelligenceScore" INTEGER,
    "confidenceLevel" TEXT,
    "qualityIndicators" JSONB,
    "evidenceCount" INTEGER NOT NULL DEFAULT 0,
    "graphNodes" JSONB,
    "graphEdges" JSONB,
    "rawConsultationData" JSONB,
    "evidenceMetadata" JSONB,
    "submissionStatus" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "status" TEXT NOT NULL DEFAULT 'RECEIVED',
    "internalNotes" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsultationSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DashboardAuditLog" (
    "id" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "recordType" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "previousValue" TEXT,
    "newValue" TEXT,
    "notes" TEXT,
    "performedById" TEXT,
    "performedByEmail" TEXT,
    "performedByRole" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DashboardAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "publication_reviews_publicationId_idx" ON "publication_reviews"("publicationId");

-- CreateIndex
CREATE INDEX "publication_reviews_userId_idx" ON "publication_reviews"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "knowledge_intake_trackingId_key" ON "knowledge_intake"("trackingId");

-- CreateIndex
CREATE INDEX "knowledge_intake_userId_idx" ON "knowledge_intake"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "donors_userId_key" ON "donors"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "donors_email_key" ON "donors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "donation_categories_name_key" ON "donation_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "donation_categories_slug_key" ON "donation_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "donation_intents_razorpayOrderId_key" ON "donation_intents"("razorpayOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "donation_transactions_razorpayPaymentId_key" ON "donation_transactions"("razorpayPaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "donation_receipts_receiptNumber_key" ON "donation_receipts"("receiptNumber");

-- CreateIndex
CREATE UNIQUE INDEX "donation_refunds_razorpayRefundId_key" ON "donation_refunds"("razorpayRefundId");

-- CreateIndex
CREATE UNIQUE INDEX "advisor_interest_applications_application_id_key" ON "advisor_interest_applications"("application_id");

-- CreateIndex
CREATE UNIQUE INDEX "ConsultationSubmission_consultationId_key" ON "ConsultationSubmission"("consultationId");

-- AddForeignKey
ALTER TABLE "Publication" ADD CONSTRAINT "Publication_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publication_reviews" ADD CONSTRAINT "publication_reviews_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publication_reviews" ADD CONSTRAINT "publication_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge_intake" ADD CONSTRAINT "knowledge_intake_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donors" ADD CONSTRAINT "donors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donation_intents" ADD CONSTRAINT "donation_intents_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "donors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donation_intents" ADD CONSTRAINT "donation_intents_purposeId_fkey" FOREIGN KEY ("purposeId") REFERENCES "donation_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donation_transactions" ADD CONSTRAINT "donation_transactions_donationIntentId_fkey" FOREIGN KEY ("donationIntentId") REFERENCES "donation_intents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donation_transactions" ADD CONSTRAINT "donation_transactions_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "donors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donation_receipts" ADD CONSTRAINT "donation_receipts_donationTransactionId_fkey" FOREIGN KEY ("donationTransactionId") REFERENCES "donation_transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donation_receipts" ADD CONSTRAINT "donation_receipts_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "donors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donation_allocations" ADD CONSTRAINT "donation_allocations_donationTransactionId_fkey" FOREIGN KEY ("donationTransactionId") REFERENCES "donation_transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donation_allocations" ADD CONSTRAINT "donation_allocations_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "donation_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donation_refunds" ADD CONSTRAINT "donation_refunds_donationTransactionId_fkey" FOREIGN KEY ("donationTransactionId") REFERENCES "donation_transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

