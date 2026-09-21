-- CreateEnum
CREATE TYPE "DonationPaymentMethod" AS ENUM ('RAZORPAY', 'BANK_TRANSFER', 'UPI_STATIC_QR', 'CHEQUE', 'DEMAND_DRAFT');

-- DropForeignKey
ALTER TABLE "donation_receipts" DROP CONSTRAINT "donation_receipts_donorId_fkey";

-- AlterTable
ALTER TABLE "audit_logs" ADD COLUMN     "entityId" TEXT,
ADD COLUMN     "entityType" TEXT,
ADD COLUMN     "newValue" TEXT,
ADD COLUMN     "oldValue" TEXT,
ADD COLUMN     "userAgent" TEXT;

-- AlterTable
ALTER TABLE "donation_intents" ADD COLUMN     "paymentMethod" "DonationPaymentMethod" NOT NULL DEFAULT 'RAZORPAY';

-- AlterTable
ALTER TABLE "donation_receipts" ALTER COLUMN "donorId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "offline_payment_submissions" (
    "id" TEXT NOT NULL,
    "donationIntentId" TEXT,
    "paymentMethod" "DonationPaymentMethod" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "utrNumber" TEXT,
    "paymentDate" TIMESTAMP(3),
    "originatingBank" TEXT,
    "accountHolderName" TEXT,
    "paymentProofUrl" TEXT,
    "instrumentType" TEXT,
    "instrumentNumber" TEXT,
    "issuingBank" TEXT,
    "instrumentDate" TIMESTAMP(3),
    "courierTracking" TEXT,
    "submissionStatus" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "paymentStatus" TEXT NOT NULL DEFAULT 'AWAITING_VERIFICATION',
    "receiptStatus" TEXT NOT NULL DEFAULT 'NOT_ELIGIBLE',
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "adminNotes" TEXT,
    "rejectionReason" TEXT,
    "duplicateOfId" TEXT,
    "duplicateReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offline_payment_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "offline_payment_submissions_utrNumber_key" ON "offline_payment_submissions"("utrNumber");

-- CreateIndex
CREATE INDEX "offline_payment_submissions_paymentStatus_idx" ON "offline_payment_submissions"("paymentStatus");

-- CreateIndex
CREATE INDEX "offline_payment_submissions_paymentMethod_idx" ON "offline_payment_submissions"("paymentMethod");

-- CreateIndex
CREATE INDEX "offline_payment_submissions_donationIntentId_idx" ON "offline_payment_submissions"("donationIntentId");

-- CreateIndex
CREATE INDEX "offline_payment_submissions_createdAt_idx" ON "offline_payment_submissions"("createdAt");

-- CreateIndex
CREATE INDEX "offline_payment_submissions_verifiedBy_idx" ON "offline_payment_submissions"("verifiedBy");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "donation_receipts_donationTransactionId_idx" ON "donation_receipts"("donationTransactionId");

-- CreateIndex
CREATE INDEX "donation_receipts_donorId_idx" ON "donation_receipts"("donorId");

-- CreateIndex
CREATE INDEX "donation_transactions_status_idx" ON "donation_transactions"("status");

-- CreateIndex
CREATE INDEX "donation_transactions_donorId_idx" ON "donation_transactions"("donorId");

-- CreateIndex
CREATE INDEX "donation_transactions_donationIntentId_idx" ON "donation_transactions"("donationIntentId");

-- CreateIndex
CREATE INDEX "donation_transactions_razorpayOrderId_idx" ON "donation_transactions"("razorpayOrderId");

-- CreateIndex
CREATE INDEX "donation_transactions_createdAt_idx" ON "donation_transactions"("createdAt");

-- CreateIndex
CREATE INDEX "razorpay_webhook_events_processed_idx" ON "razorpay_webhook_events"("processed");

-- CreateIndex
CREATE INDEX "razorpay_webhook_events_eventType_idx" ON "razorpay_webhook_events"("eventType");

-- AddForeignKey
ALTER TABLE "offline_payment_submissions" ADD CONSTRAINT "offline_payment_submissions_duplicateOfId_fkey" FOREIGN KEY ("duplicateOfId") REFERENCES "offline_payment_submissions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offline_payment_submissions" ADD CONSTRAINT "offline_payment_submissions_donationIntentId_fkey" FOREIGN KEY ("donationIntentId") REFERENCES "donation_intents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donation_receipts" ADD CONSTRAINT "donation_receipts_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "donors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Create Partial Unique Index
CREATE UNIQUE INDEX "offline_payment_submissions_active_instrument_unique" ON "offline_payment_submissions" ("paymentMethod", "instrumentNumber") WHERE "instrumentNumber" IS NOT NULL AND "submissionStatus" = 'SUBMITTED' AND "paymentStatus" IN ('AWAITING_VERIFICATION', 'RECEIVED', 'DEPOSITED', 'VERIFIED', 'CLEARED');

