-- AlterTable
ALTER TABLE "Certification" ADD COLUMN     "adminCertificateUrl" TEXT,
ALTER COLUMN "razorpayPaymentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Initiative" ADD COLUMN     "link" TEXT;

-- AlterTable
ALTER TABLE "LegislativeOffice" ADD COLUMN     "lcadUpdatesConfig" JSONB,
ADD COLUMN     "overviewConfig" JSONB,
ADD COLUMN     "referralCode" TEXT;

-- AlterTable
ALTER TABLE "Publication" ADD COLUMN     "accessType" TEXT NOT NULL DEFAULT 'PUBLIC',
ADD COLUMN     "citationEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "downloadUrl" TEXT,
ADD COLUMN     "fullContent" TEXT,
ADD COLUMN     "isMemberOnly" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "memberDownloadUrl" TEXT,
ADD COLUMN     "previewContent" TEXT,
ADD COLUMN     "publicationType" TEXT NOT NULL DEFAULT 'EBOOK',
ADD COLUMN     "publishedStatus" TEXT NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoTitle" TEXT,
ADD COLUMN     "structuredDataType" TEXT DEFAULT 'Book';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authProvider" TEXT NOT NULL DEFAULT 'local',
ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "isTrashed" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "OfficeSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "officeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OfficeSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CertificatePackage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "features" JSONB,
    "validity" TEXT,
    "annualFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CertificatePackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CcsiProfile" (
    "id" TEXT NOT NULL,
    "legislativeOfficeId" TEXT,
    "batchId" TEXT,
    "userId" TEXT,
    "applicationCode" TEXT,
    "jurisdictionExpiresAt" TIMESTAMP(3),
    "auditLog" JSONB,
    "applicantCategory" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "businessName" TEXT,
    "fatherName" TEXT,
    "gender" TEXT,
    "primaryContact" TEXT NOT NULL,
    "alternateContact" TEXT,
    "email" TEXT,
    "village" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "clusterName" TEXT,
    "primaryCraft" TEXT NOT NULL,
    "secondaryCraft" TEXT,
    "yearsExperience" INTEGER,
    "familyLineage" BOOLEAN,
    "giAssociation" TEXT,
    "monthlyCapacity" TEXT,
    "capacityUnit" TEXT,
    "numberOfWorkers" INTEGER,
    "workshopAddress" TEXT,
    "workshopSeparate" BOOLEAN,
    "rawMaterials" TEXT,
    "toolsUsed" TEXT,
    "geoCaptured" BOOLEAN DEFAULT false,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "docGovId" TEXT,
    "docArtisanCard" TEXT,
    "docGiCertificate" TEXT,
    "docGst" TEXT,
    "docUdyam" TEXT,
    "docInstitution" TEXT,
    "completenessScore" INTEGER,
    "salesChannels" JSONB,
    "consentDeclared" BOOLEAN NOT NULL DEFAULT false,
    "digitalSignature" TEXT,
    "signature" TEXT,
    "signatureTimestamp" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "isCommerceInterested" BOOLEAN NOT NULL DEFAULT false,
    "isProfileCompleted" BOOLEAN NOT NULL DEFAULT false,
    "sellingOutsideDistrict" BOOLEAN,
    "bankAccountAvailable" BOOLEAN,
    "gstAvailable" TEXT,
    "maintainsPricingRecords" BOOLEAN,
    "productionType" TEXT,
    "productionLeadTime" TEXT,
    "standardPackaging" BOOLEAN,
    "courierCapability" BOOLEAN,
    "digitalTools" JSONB,
    "digitalPaymentsReady" BOOLEAN,
    "productSamples" JSONB,
    "commerceConsent" BOOLEAN,
    "commerceStatus" TEXT DEFAULT 'INTEREST_SUBMITTED',
    "referralId" TEXT,
    "referralCode" TEXT,
    "referralStatus" TEXT,
    "riskScore" TEXT,
    "auditAssigned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CcsiProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CcsiBatch" (
    "id" TEXT NOT NULL,
    "legislativeOfficeId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "totalProfiles" INTEGER NOT NULL DEFAULT 0,
    "validProfiles" INTEGER NOT NULL DEFAULT 0,
    "errorProfiles" INTEGER NOT NULL DEFAULT 0,
    "riskLevel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CcsiBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CceApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "legislativeOfficeId" TEXT,
    "referenceNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "stakeholderCategory" TEXT NOT NULL,
    "entityName" TEXT NOT NULL,
    "ccsiRegistrationId" TEXT NOT NULL,
    "referralCode" TEXT,
    "craftCategory" TEXT NOT NULL,
    "clusterName" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "awardCategory" TEXT NOT NULL,
    "yearsExperience" INTEGER NOT NULL,
    "productionScale" TEXT NOT NULL,
    "teamSize" INTEGER,
    "marketsServed" JSONB NOT NULL,
    "giStatus" BOOLEAN NOT NULL DEFAULT false,
    "giAuthorizedNumber" TEXT,
    "giSupportingDoc" TEXT,
    "meritStatement" TEXT NOT NULL,
    "productImages" JSONB,
    "certifications" JSONB,
    "giDocumentation" JSONB,
    "exportRecords" JSONB,
    "mediaCoverage" JSONB,
    "testimonials" JSONB,
    "complianceDocs" JSONB,
    "complianceAccurate" BOOLEAN NOT NULL DEFAULT false,
    "meritBasedAck" BOOLEAN NOT NULL DEFAULT false,
    "noSponsorshipImpact" BOOLEAN NOT NULL DEFAULT false,
    "publicDisplayConsent" BOOLEAN NOT NULL DEFAULT false,
    "signature" TEXT NOT NULL,
    "signatureDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "communityImpact" JSONB,
    "sustainability" JSONB,
    "complianceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "craftQualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "innovationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "clusterContributionScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "marketReadinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CceApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OfficeSubscription_userId_officeId_key" ON "OfficeSubscription"("userId", "officeId");

-- CreateIndex
CREATE UNIQUE INDEX "CcsiProfile_applicationCode_key" ON "CcsiProfile"("applicationCode");

-- CreateIndex
CREATE UNIQUE INDEX "CcsiProfile_referralId_key" ON "CcsiProfile"("referralId");

-- CreateIndex
CREATE INDEX "CcsiProfile_legislativeOfficeId_idx" ON "CcsiProfile"("legislativeOfficeId");

-- CreateIndex
CREATE INDEX "CcsiProfile_primaryContact_idx" ON "CcsiProfile"("primaryContact");

-- CreateIndex
CREATE UNIQUE INDEX "CceApplication_referenceNumber_key" ON "CceApplication"("referenceNumber");

-- CreateIndex
CREATE INDEX "CceApplication_userId_idx" ON "CceApplication"("userId");

-- CreateIndex
CREATE INDEX "CceApplication_ccsiRegistrationId_idx" ON "CceApplication"("ccsiRegistrationId");

-- CreateIndex
CREATE INDEX "CceApplication_referenceNumber_idx" ON "CceApplication"("referenceNumber");

-- AddForeignKey
ALTER TABLE "OfficeSubscription" ADD CONSTRAINT "OfficeSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfficeSubscription" ADD CONSTRAINT "OfficeSubscription_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "LegislativeOffice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CcsiProfile" ADD CONSTRAINT "CcsiProfile_legislativeOfficeId_fkey" FOREIGN KEY ("legislativeOfficeId") REFERENCES "LegislativeOffice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CcsiProfile" ADD CONSTRAINT "CcsiProfile_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "CcsiBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CcsiProfile" ADD CONSTRAINT "CcsiProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CcsiBatch" ADD CONSTRAINT "CcsiBatch_legislativeOfficeId_fkey" FOREIGN KEY ("legislativeOfficeId") REFERENCES "LegislativeOffice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CceApplication" ADD CONSTRAINT "CceApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CceApplication" ADD CONSTRAINT "CceApplication_legislativeOfficeId_fkey" FOREIGN KEY ("legislativeOfficeId") REFERENCES "LegislativeOffice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX "LegislativeOffice_referralCode_key" ON "LegislativeOffice"("referralCode");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
