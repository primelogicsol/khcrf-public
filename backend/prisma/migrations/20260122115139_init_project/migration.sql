-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'MODERATOR_MEMBERSHIP', 'MODERATOR_DONATION', 'MODERATOR_CAREER', 'MODERATOR_CERTIFICATIONS', 'MODERATOR_ACCREDITATION', 'MODERATOR_EBOOKS', 'COLLABORATOR_ADVOCACY', 'COLLABORATOR_CAMPAIGNING', 'COLLABORATOR_LOBBYING', 'COLLABORATOR_EBOOKS');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "MembershipType" AS ENUM ('ARTISAN', 'INDIVIDUAL', 'PROFESSIONAL', 'CORPORATE', 'PATRON', 'STUDENT');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('UPI', 'BANK_TRANSFER', 'RAZORPAY', 'PAYPAL', 'STRIPE');

-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "RegisterType" AS ENUM ('ARTISAN', 'BUSINESS', 'INSTITUTION');

-- CreateEnum
CREATE TYPE "InitiativeType" AS ENUM ('ADVOCACY', 'CAMPAIGN', 'LOBBYING');

-- CreateEnum
CREATE TYPE "PublicationType" AS ENUM ('PDF', 'WRITTEN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "otp" TEXT,
    "otpExpiresAt" TIMESTAMP(3),
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "nationality" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "streetAddress" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "postalCode" TEXT,
    "membershipType" "MembershipType" NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "status" "MemberStatus" NOT NULL DEFAULT 'PENDING',
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "type" "RegisterType" NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "status" "MemberStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtisanProfile" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "specialty" TEXT,
    "skillLevel" TEXT,
    "experienceYears" INTEGER,
    "awards" TEXT,
    "catalogUrl" TEXT,

    CONSTRAINT "ArtisanProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessProfile" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "address" TEXT,
    "foundedYear" INTEGER,
    "type" TEXT,
    "websiteUrl" TEXT,
    "productsSold" TEXT,
    "employeeCount" INTEGER,
    "licenseNumber" TEXT,

    CONSTRAINT "BusinessProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstituteProfile" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "address" TEXT,
    "representative" TEXT,
    "repDesignation" TEXT,
    "type" TEXT,
    "websiteUrl" TEXT,
    "missionStatement" TEXT,

    CONSTRAINT "InstituteProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingCompliance" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "materialSource" TEXT,
    "craftingProcess" TEXT,
    "isSustainable" BOOLEAN,
    "sustainableDesc" TEXT,
    "paysFairWage" BOOLEAN,
    "supportsGender" BOOLEAN,
    "femaleEmployeePct" INTEGER,
    "hasWorkplaceStd" BOOLEAN,
    "workplaceStdDesc" TEXT,
    "childLaborPolicy" BOOLEAN,
    "fairTradeCert" BOOLEAN,
    "fairTradeDoc" TEXT,
    "giCert" BOOLEAN,
    "giCertNumber" TEXT,
    "giCertDoc" TEXT,
    "blockchainCert" BOOLEAN,
    "blockchainCertDoc" TEXT,
    "qualityConsent" BOOLEAN,
    "profileConsent" BOOLEAN,
    "complianceAck" BOOLEAN,

    CONSTRAINT "ListingCompliance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprenticeshipApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "fullName" TEXT NOT NULL,
    "dob" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "otherQualification" TEXT,
    "fieldOfStudy" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "completionYear" TEXT NOT NULL,
    "apprenticeTrack" JSONB NOT NULL,
    "preferredLocation" JSONB NOT NULL,
    "availability" JSONB NOT NULL,
    "skills" JSONB NOT NULL,
    "otherSkill" TEXT,
    "experience" TEXT,
    "motivation" TEXT NOT NULL,
    "heritageMeaning" TEXT,
    "contribution" TEXT NOT NULL,
    "cvUrl" TEXT,
    "portfolioLink" TEXT,
    "portfolioFileUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApprenticeshipApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegislativeOffice" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "representativeName" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "constituency" TEXT NOT NULL,
    "party" TEXT,
    "termStart" TEXT NOT NULL,
    "termEnd" TEXT NOT NULL,
    "officeAddress" TEXT NOT NULL,
    "officialEmail" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "officeRepName" TEXT,
    "officeRepDesignation" TEXT,
    "officeRepMobile" TEXT,
    "username" TEXT NOT NULL,
    "primaryGroups" JSONB,
    "craftSectors" JSONB NOT NULL,
    "intendedUse" JSONB,
    "campaignDisclaimer" BOOLEAN NOT NULL DEFAULT true,
    "authDocUrl" TEXT,
    "sealDocUrl" TEXT,
    "digitalSignature" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "artisanPopulation" TEXT,
    "artisanPresence" TEXT,
    "craftClusters" TEXT,
    "craftIssues" JSONB,
    "district" TEXT,
    "engagementSummary" TEXT,
    "legislativeBody" TEXT,
    "officialWebsite" TEXT,
    "orgTypes" JSONB,
    "priorityAreas" TEXT,
    "socialHandle" TEXT,
    "supportRequests" JSONB,
    "verificationPreference" JSONB,

    CONSTRAINT "LegislativeOffice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfficeBlogPost" (
    "id" TEXT NOT NULL,
    "officeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tags" JSONB NOT NULL,
    "documents" JSONB,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfficeBlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "donationType" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "country" TEXT,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pool" TEXT,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "razorpayOrderId" TEXT NOT NULL,
    "razorpayPaymentId" TEXT NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Initiative" (
    "id" TEXT NOT NULL,
    "type" "InitiativeType" NOT NULL,
    "title" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "hashtags" JSONB NOT NULL,
    "images" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Initiative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageVisit" (
    "id" TEXT NOT NULL,
    "pagePath" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "visitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageVisit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationSubmission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessName" TEXT,
    "yearsInOperation" INTEGER,
    "craftType" TEXT,
    "annualRevenue" TEXT,
    "website" TEXT,
    "score" DOUBLE PRECISION NOT NULL,
    "tier" TEXT,
    "answers" JSONB NOT NULL,
    "status" "MemberStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "evaluationType" TEXT DEFAULT 'SELF_ASSESSMENT',

    CONSTRAINT "EvaluationSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrantApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicantName" TEXT NOT NULL,
    "organizationName" TEXT,
    "applicantType" TEXT NOT NULL,
    "otherApplicantType" TEXT,
    "contactNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "village" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "primaryCraft" TEXT NOT NULL,
    "experienceYears" TEXT NOT NULL,
    "artisansInvolved" TEXT NOT NULL,
    "businessStage" TEXT NOT NULL,
    "certificationStatus" TEXT NOT NULL,
    "grantTypes" JSONB NOT NULL,
    "grantAmount" TEXT NOT NULL,
    "grantPurpose" JSONB NOT NULL,
    "briefDescription" TEXT NOT NULL,
    "projectDescription" TEXT NOT NULL,
    "livelihoodImpact" TEXT NOT NULL,
    "heritageContribution" TEXT NOT NULL,
    "budgetTools" TEXT,
    "budgetMaterials" TEXT,
    "budgetLabor" TEXT,
    "budgetMarketing" TEXT,
    "budgetOther" TEXT,
    "timeline" TEXT NOT NULL,
    "previousGrants" TEXT NOT NULL,
    "previousGrantDetails" TEXT,
    "progressUpdates" TEXT NOT NULL,
    "identityDoc" TEXT,
    "businessDoc" TEXT,
    "craftPhotosDoc" TEXT,
    "supportingDoc" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GrantApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccreditationApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "businessName" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "businessAddress" TEXT NOT NULL,
    "badges" JSONB NOT NULL,
    "businessDescription" TEXT NOT NULL,
    "productionMethods" TEXT NOT NULL,
    "documentation" JSONB NOT NULL,
    "otherDocumentation" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccreditationApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "paymentId" TEXT,
    "signature" TEXT,
    "entityId" TEXT,
    "entityType" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerApplication" (
    "id" TEXT NOT NULL,
    "orgName" TEXT NOT NULL,
    "website" TEXT,
    "contactName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT NOT NULL,
    "collaborationAreas" JSONB NOT NULL,
    "otherArea" TEXT,
    "projectTitle" TEXT,
    "projectDescription" TEXT,
    "expectedOutcomes" TEXT,
    "collaborationType" JSONB NOT NULL,
    "otherCollaboration" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "supportingDoc" TEXT,
    "userId" TEXT,

    CONSTRAINT "PartnerApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publication" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "author" TEXT NOT NULL,
    "published" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "pages" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "features" JSONB,
    "tableOfContents" JSONB,
    "language" TEXT,
    "formats" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT,
    "pdfPath" TEXT,
    "type" "PublicationType" NOT NULL DEFAULT 'PDF',

    CONSTRAINT "Publication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "publicationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookPage" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "pageNumber" INTEGER NOT NULL,
    "chapterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPurchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DOUBLE PRECISION NOT NULL,
    "transactionId" TEXT,

    CONSTRAINT "UserPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicationCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublicationCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Member_userId_key" ON "Member"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Member_razorpayOrderId_key" ON "Member"("razorpayOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Member_razorpayPaymentId_key" ON "Member"("razorpayPaymentId");

-- CreateIndex
CREATE INDEX "Listing_email_idx" ON "Listing"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ArtisanProfile_listingId_key" ON "ArtisanProfile"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessProfile_listingId_key" ON "BusinessProfile"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "InstituteProfile_listingId_key" ON "InstituteProfile"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "ListingCompliance_listingId_key" ON "ListingCompliance"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "LegislativeOffice_username_key" ON "LegislativeOffice"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_orderId_key" ON "Transaction"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Publication_slug_key" ON "Publication"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "UserPurchase_userId_publicationId_key" ON "UserPurchase"("userId", "publicationId");

-- CreateIndex
CREATE UNIQUE INDEX "PublicationCategory_name_key" ON "PublicationCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PublicationCategory_slug_key" ON "PublicationCategory"("slug");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtisanProfile" ADD CONSTRAINT "ArtisanProfile_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessProfile" ADD CONSTRAINT "BusinessProfile_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstituteProfile" ADD CONSTRAINT "InstituteProfile_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingCompliance" ADD CONSTRAINT "ListingCompliance_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprenticeshipApplication" ADD CONSTRAINT "ApprenticeshipApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegislativeOffice" ADD CONSTRAINT "LegislativeOffice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfficeBlogPost" ADD CONSTRAINT "OfficeBlogPost_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "LegislativeOffice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationSubmission" ADD CONSTRAINT "EvaluationSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrantApplication" ADD CONSTRAINT "GrantApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccreditationApplication" ADD CONSTRAINT "AccreditationApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerApplication" ADD CONSTRAINT "PartnerApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Publication" ADD CONSTRAINT "Publication_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PublicationCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookPage" ADD CONSTRAINT "BookPage_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPurchase" ADD CONSTRAINT "UserPurchase_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPurchase" ADD CONSTRAINT "UserPurchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
