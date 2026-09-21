-- DropForeignKey
ALTER TABLE "donation_receipts" DROP CONSTRAINT "donation_receipts_donorId_fkey";

-- AlterTable
ALTER TABLE "donation_receipts" ALTER COLUMN "donorId" DROP NOT NULL;

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
CREATE UNIQUE INDEX "offline_payment_submissions_paymentMethod_instrumentNumber_key" ON "offline_payment_submissions"("paymentMethod", "instrumentNumber");

-- CreateIndex
CREATE INDEX "razorpay_webhook_events_processed_idx" ON "razorpay_webhook_events"("processed");

-- CreateIndex
CREATE INDEX "razorpay_webhook_events_eventType_idx" ON "razorpay_webhook_events"("eventType");

-- AddForeignKey
ALTER TABLE "donation_receipts" ADD CONSTRAINT "donation_receipts_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "donors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

