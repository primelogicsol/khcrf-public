-- CreateEnum
CREATE TYPE "CanonicalEntityType" AS ENUM ('KNOWLEDGE_OBJECT', 'HUMAN_OBJECT', 'HERITAGE_OBJECT', 'ADMINISTRATIVE_OBJECT', 'SKC_RECORD');

-- CreateEnum
CREATE TYPE "LifecycleStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'VERIFIED', 'PUBLISHED', 'SUPERSEDED', 'DEPRECATED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "VisibilityStatus" AS ENUM ('PUBLIC', 'RESTRICTED', 'INTERNAL', 'CLASSIFIED');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('UNVERIFIED', 'PARTIALLY_VERIFIED', 'VERIFIED', 'DISPUTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SensitivityClassification" AS ENUM ('NONE', 'CULTURALLY_SENSITIVE', 'COMMERCIALLY_SENSITIVE', 'PII_SENSITIVE');

-- CreateEnum
CREATE TYPE "RelationshipType" AS ENUM ('RELATES_TO', 'USES_MATERIAL', 'USES_TOOL', 'USES_TECHNIQUE', 'PRACTICES_CRAFT', 'MENTORS', 'PART_OF', 'CREATED_BY', 'APPEARS_IN', 'REFERENCES', 'DERIVED_FROM', 'LOCATED_IN', 'CERTIFIED_BY', 'VERIFIED_BY', 'DOCUMENTED_IN');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'ARCHIVE', 'CAD', 'MODEL_3D');

-- CreateEnum
CREATE TYPE "WorkflowStage" AS ENUM ('DRAFTING', 'EDITORIAL_REVIEW', 'EXPERT_REVIEW', 'APPROVAL', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('FIELD_SURVEY', 'INTERVIEW', 'ARCHIVAL_DOCUMENT', 'ACADEMIC_PUBLICATION', 'MUSEUM_RECORD', 'GOVERNMENT_RECORD', 'OTHER');

-- CreateEnum
CREATE TYPE "EndangermentStatus" AS ENUM ('THRIVING', 'STABLE', 'VULNERABLE', 'ENDANGERED', 'EXTINCT');

-- CreateEnum
CREATE TYPE "SustainabilityStatus" AS ENUM ('SUSTAINABLE', 'CONCERN', 'DEPLETED');

-- CreateEnum
CREATE TYPE "ComplexityLevel" AS ENUM ('BASIC', 'INTERMEDIATE', 'MASTER');

-- CreateEnum
CREATE TYPE "TermContext" AS ENUM ('WORKSHOP', 'TRADE', 'GENERAL');

-- CreateEnum
CREATE TYPE "ParticipationStatus" AS ENUM ('SUBMITTED', 'SCREENING', 'UNDER_REVIEW', 'INFORMATION_REQUESTED', 'EVIDENCE_VERIFICATION', 'FACT_CHECK', 'RIGHTS_REVIEW', 'EDITORIAL_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'SCHEDULED', 'PUBLISHED', 'REJECTED', 'CONVERTED_TO_ARTISAN', 'ARCHIVED', 'SHORTLISTED', 'SOURCE_VERIFICATION', 'TECHNICAL_REVIEW', 'VERIFIED', 'LINKED', 'FIELD_VERIFICATION');

-- CreateEnum
CREATE TYPE "FindingStatus" AS ENUM ('DRAFT_INTERNAL', 'ANALYSIS_IN_PROGRESS', 'READY_FOR_EDITORIAL_REVIEW', 'APPROVED_FOR_DRAFT_PUBLICATION', 'PUBLISHED_FOR_VALIDATION', 'UNDER_VALIDATION', 'REVISED_AFTER_VALIDATION', 'APPROVED_FOR_EXPERT_REVIEW', 'FINALIZED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ValidationResponseStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'PARTIALLY_ACCEPTED', 'REJECTED', 'REQUIRES_CLARIFICATION', 'INCORPORATED');

-- CreateEnum
CREATE TYPE "PublicationWorkflowStatus" AS ENUM ('CONCEPT', 'BLUEPRINT_DRAFT', 'BLUEPRINT_REVIEW', 'BLUEPRINT_APPROVED', 'RESEARCH', 'WRITING', 'INTERNAL_REVIEW', 'TECHNICAL_REVIEW', 'EDITORIAL_REVIEW', 'PUBLISHED', 'REVISION', 'SUPERSEDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ChapterWorkflowStatus" AS ENUM ('DRAFT', 'READY', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "SectionWorkflowStatus" AS ENUM ('DRAFT', 'READY', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "ContentBlockType" AS ENUM ('PARAGRAPH', 'HEADING', 'QUOTE', 'TABLE', 'FIGURE', 'IMAGE', 'CALLOUT', 'CODE', 'MERMAID', 'CHECKLIST', 'FORMULA', 'VIDEO', 'AUDIO', 'EMBED', 'REFERENCE');

-- CreateEnum
CREATE TYPE "KnowledgeEntityType" AS ENUM ('CRAFT', 'POLICY', 'LAW', 'REGULATION', 'STANDARD', 'PERSON', 'INSTITUTION', 'MARKET', 'COUNTRY', 'CITY', 'DATASET', 'TECHNOLOGY', 'PROCESS', 'GLOSSARY', 'PUBLICATION');

-- CreateEnum
CREATE TYPE "KnowledgeRelationshipType" AS ENUM ('ANALYZES', 'REFERENCES', 'USES', 'REGULATED_BY', 'RELATED_TO', 'COMPARES', 'SUPPORTED_BY', 'LOCATED_IN', 'DERIVED_FROM');

-- CreateEnum
CREATE TYPE "ContributorRole" AS ENUM ('EDITORIAL_OWNER', 'SCIENTIFIC_REVIEWER', 'TECHNICAL_REVIEWER', 'LANGUAGE_EDITOR', 'CITATION_REVIEWER', 'SEO_REVIEWER', 'FINAL_APPROVER');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('CRAFTLORE_ARTICLE', 'GLOSSARY_ENTRY', 'DATASET', 'INFOGRAPHIC', 'TIMELINE', 'CASE_STUDY', 'VIDEO', 'PODCAST', 'POLICY_BRIEF', 'FAQ', 'KNOWLEDGE_GRAPH_NODE');

-- CreateEnum
CREATE TYPE "EvidenceStatus" AS ENUM ('VERIFIED', 'UNVERIFIED', 'HYPOTHESIS', 'PROHIBITED_UNTIL_SOURCED');

-- CreateEnum
CREATE TYPE "MembershipApplicationStatus" AS ENUM ('NOT_SUBMITTED', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('INACTIVE', 'ACTIVE', 'SUSPENDED', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED', 'DEACTIVATED');

-- CreateEnum
CREATE TYPE "ReviewerRole" AS ENUM ('PRIMARY_REVIEWER', 'SECONDARY_REVIEWER', 'SUBJECT_EXPERT', 'TECHNICAL_REVIEWER', 'COPY_EDITOR', 'MANAGING_EDITOR');

-- CreateEnum
CREATE TYPE "BlindReviewType" AS ENUM ('SINGLE_BLIND', 'DOUBLE_BLIND', 'OPEN');

-- CreateEnum
CREATE TYPE "ReviewRecommendation" AS ENUM ('ACCEPT', 'MINOR_REVISION', 'MAJOR_REVISION', 'REJECT', 'WITHDRAW');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'SUBMITTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ReviewCommentType" AS ENUM ('PUBLIC_EDITORIAL', 'INTERNAL_NOTE', 'REQUIRED_REVISION', 'SUGGESTED_IMPROVEMENT', 'BLOCKING_ISSUE');

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "applicationStatus" "MembershipApplicationStatus" NOT NULL DEFAULT 'NOT_SUBMITTED',
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "membershipStatus" "MembershipStatus" NOT NULL DEFAULT 'INACTIVE',
ADD COLUMN     "permissions" TEXT[],
ADD COLUMN     "rejectedAt" TIMESTAMP(3),
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "suspendedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Publication" ADD COLUMN     "revision" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "CanonicalEntity" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "aliases" JSONB,
    "transliterations" JSONB,
    "entityType" "CanonicalEntityType" NOT NULL,
    "lifecycle" "LifecycleStatus" NOT NULL DEFAULT 'DRAFT',
    "visibility" "VisibilityStatus" NOT NULL DEFAULT 'INTERNAL',
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "sensitivity" "SensitivityClassification" NOT NULL DEFAULT 'NONE',
    "metadata" JSONB,
    "aiEmbeddings" JSONB,
    "seoMetadata" JSONB,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdById" TEXT,
    "publishedAt" TIMESTAMP(3),
    "coverStoryTitle" TEXT,
    "issueOverview" TEXT,
    "featuredCraftName" TEXT,
    "featuredCraftLabel" TEXT,
    "coverImageAlt" TEXT,
    "readerAssetKey" TEXT,
    "downloadable" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isSeedData" BOOLEAN NOT NULL DEFAULT false,
    "displayPriority" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CanonicalEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxonomyCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TaxonomyCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityRelationship" (
    "id" TEXT NOT NULL,
    "sourceEntityId" TEXT NOT NULL,
    "targetEntityId" TEXT NOT NULL,
    "relationshipType" "RelationshipType" NOT NULL,
    "confidenceScore" INTEGER,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "sourceReferenceId" TEXT,
    "notes" TEXT,
    "metadata" JSONB,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "EntityRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SourceReference" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "sourceType" "SourceType" NOT NULL,
    "title" TEXT,
    "author" TEXT,
    "publisher" TEXT,
    "year" INTEGER,
    "doi" TEXT,
    "citationText" TEXT NOT NULL,
    "url" TEXT,
    "confidenceScore" INTEGER,
    "metadata" JSONB,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SourceReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationRecord" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "verifierId" TEXT NOT NULL,
    "status" "VerificationStatus" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowRecord" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "fromStage" "WorkflowStage",
    "toStage" "WorkflowStage" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkflowRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "mediaType" "MediaType" NOT NULL,
    "storageProvider" TEXT NOT NULL,
    "providerId" TEXT,
    "storageKey" TEXT,
    "publicUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "durationSeconds" INTEGER,
    "checksum" TEXT,
    "title" TEXT,
    "altText" TEXT,
    "caption" TEXT,
    "credit" TEXT,
    "photographer" TEXT,
    "copyrightOwner" TEXT,
    "license" TEXT,
    "attribution" TEXT,
    "sourceReference" TEXT,
    "thumbnailUrl" TEXT,
    "sensitivityClassification" "SensitivityClassification" NOT NULL DEFAULT 'NONE',
    "metadata" JSONB,
    "aiTags" JSONB,
    "uploadedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Craft" (
    "id" TEXT NOT NULL,
    "canonicalEntityId" TEXT NOT NULL,
    "historicalOrigin" TEXT,
    "culturalSignificance" TEXT,
    "endangermentStatus" "EndangermentStatus" NOT NULL DEFAULT 'STABLE',

    CONSTRAINT "Craft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "canonicalEntityId" TEXT NOT NULL,
    "sourcingRegion" TEXT NOT NULL,
    "sustainabilityStatus" "SustainabilityStatus" NOT NULL DEFAULT 'SUSTAINABLE',
    "processingMethod" TEXT,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tool" (
    "id" TEXT NOT NULL,
    "canonicalEntityId" TEXT NOT NULL,
    "primaryMaterial" TEXT NOT NULL,
    "maintenanceRequirements" TEXT,

    CONSTRAINT "Tool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Technique" (
    "id" TEXT NOT NULL,
    "canonicalEntityId" TEXT NOT NULL,
    "complexityLevel" "ComplexityLevel" NOT NULL DEFAULT 'INTERMEDIATE',
    "learningDurationMonths" INTEGER,

    CONSTRAINT "Technique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Motif" (
    "id" TEXT NOT NULL,
    "canonicalEntityId" TEXT NOT NULL,
    "symbolicMeaning" TEXT,
    "geometricProperties" JSONB,

    CONSTRAINT "Motif_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "canonicalEntityId" TEXT NOT NULL,
    "typicalUse" TEXT,
    "averageCreationTimeDays" INTEGER,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlossaryTerm" (
    "id" TEXT NOT NULL,
    "canonicalEntityId" TEXT NOT NULL,
    "termContext" "TermContext" NOT NULL DEFAULT 'GENERAL',
    "regionalDialect" TEXT,

    CONSTRAINT "GlossaryTerm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artisan" (
    "id" TEXT NOT NULL,
    "canonicalEntityId" TEXT NOT NULL,
    "birthYear" INTEGER,
    "deathYear" INTEGER,
    "activeRegion" TEXT,
    "biography" TEXT,

    CONSTRAINT "Artisan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Studio" (
    "id" TEXT NOT NULL,
    "canonicalEntityId" TEXT NOT NULL,
    "address" TEXT,
    "foundingYear" INTEGER,

    CONSTRAINT "Studio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "canonicalEntityId" TEXT NOT NULL,
    "institutionName" TEXT,
    "curationFocus" TEXT,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchPublication" (
    "id" TEXT NOT NULL,
    "canonicalEntityId" TEXT NOT NULL,
    "doi" TEXT,
    "journalName" TEXT,
    "publicationYear" INTEGER,

    CONSTRAINT "ResearchPublication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterArtisan" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "craft" TEXT NOT NULL,
    "loc" TEXT NOT NULL,
    "award" TEXT,
    "img" TEXT NOT NULL,
    "stage" TEXT,
    "desc" TEXT,
    "years" INTEGER,
    "sig" TEXT,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MasterArtisan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtisanNomination" (
    "id" TEXT NOT NULL,
    "submissionNumber" TEXT NOT NULL,
    "status" "ParticipationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "nomineeName" TEXT NOT NULL,
    "localName" TEXT,
    "craft" TEXT,
    "primaryCraft" TEXT,
    "secondaryCrafts" TEXT,
    "unionTerritory" TEXT,
    "district" TEXT,
    "tehsil" TEXT,
    "village" TEXT,
    "pinCode" TEXT,
    "fullAddress" TEXT,
    "landmark" TEXT,
    "workshop" TEXT,
    "biography" TEXT,
    "yearsOfPractice" INTEGER,
    "skills" TEXT,
    "awards" TEXT,
    "familyLineage" TEXT,
    "contactInfo" TEXT,
    "nominatorInfo" TEXT,
    "relationship" TEXT,
    "references" TEXT,
    "consentGiven" BOOLEAN NOT NULL DEFAULT false,
    "hasGovtArtisanId" TEXT,
    "govtArtisanId" TEXT,
    "artisanRegistrationType" TEXT,
    "artisanIssuingAuthority" TEXT,
    "artisanYearOfRegistration" TEXT,
    "existingHcrfArtisanId" TEXT,
    "hasWorkshop" TEXT,
    "workshopName" TEXT,
    "workshopType" TEXT,
    "isWorkshopRegistered" TEXT,
    "workshopId" TEXT,
    "workshopRegistrationType" TEXT,
    "workshopIssuingAuthority" TEXT,
    "workshopYearOfRegistration" TEXT,
    "workshopAddress" TEXT,
    "workshopPinCode" TEXT,
    "existingHcrfWorkshopId" TEXT,
    "notes" TEXT,
    "reviewerId" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArtisanNomination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StorySubmission" (
    "id" TEXT NOT NULL,
    "submissionNumber" TEXT NOT NULL,
    "status" "ParticipationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "submissionType" TEXT NOT NULL,
    "submissionStage" TEXT NOT NULL,
    "primaryEditorialTheme" TEXT NOT NULL,
    "primaryCraft" TEXT NOT NULL,
    "secondaryCrafts" TEXT,
    "geographicScope" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorEmail" TEXT NOT NULL,
    "authorPhone" TEXT NOT NULL,
    "contributorCategory" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "stateRegion" TEXT,
    "cityDistrict" TEXT,
    "institutionalAffiliation" TEXT,
    "professionalRole" TEXT,
    "shortBio" TEXT NOT NULL,
    "portfolioUrl" TEXT,
    "title" TEXT NOT NULL,
    "synopsis" TEXT NOT NULL,
    "subjectFeatured" TEXT,
    "subjectLocation" TEXT,
    "researchDetails" TEXT,
    "previousPublicationStatus" TEXT NOT NULL,
    "conflictOfInterest" TEXT,
    "interviewsIncluded" BOOLEAN NOT NULL DEFAULT false,
    "fieldResearchIncluded" BOOLEAN NOT NULL DEFAULT false,
    "archiveConsulted" BOOLEAN NOT NULL DEFAULT false,
    "bibliographyIncluded" BOOLEAN NOT NULL DEFAULT false,
    "supportingEvidenceAvailable" BOOLEAN NOT NULL DEFAULT false,
    "existingRecordIds" TEXT,
    "originalityDeclaration" BOOLEAN NOT NULL DEFAULT false,
    "copyrightDeclaration" BOOLEAN NOT NULL DEFAULT false,
    "interviewConsent" BOOLEAN NOT NULL DEFAULT false,
    "accuracyDeclaration" BOOLEAN NOT NULL DEFAULT false,
    "priorPublicationDeclaration" BOOLEAN NOT NULL DEFAULT false,
    "sensitiveKnowledgeDeclaration" BOOLEAN NOT NULL DEFAULT false,
    "editorialReviewAcknowledgement" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "accessRestrictions" TEXT,
    "translationSupportRequired" TEXT,
    "preferredTimeframe" TEXT,
    "story" TEXT,
    "contributor" TEXT,
    "source" TEXT,
    "reviewerId" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorySubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContributorApplication" (
    "id" TEXT NOT NULL,
    "submissionNumber" TEXT NOT NULL,
    "status" "ParticipationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "stateRegion" TEXT NOT NULL,
    "districtCity" TEXT NOT NULL,
    "pinCode" TEXT,
    "currentAddress" TEXT,
    "preferredContactMethod" TEXT,
    "contributorCategory" TEXT NOT NULL,
    "currentProfession" TEXT NOT NULL,
    "organization" TEXT,
    "highestQualification" TEXT,
    "shortBio" TEXT NOT NULL,
    "linkedinProfile" TEXT,
    "personalWebsite" TEXT,
    "portfolioUrl" TEXT,
    "orcidProfile" TEXT,
    "existingHcrfMemberId" TEXT,
    "areasOfContribution" TEXT NOT NULL,
    "primaryCraftSpecialisation" TEXT,
    "additionalCraftSpecialisations" TEXT,
    "natureOfKnowledge" TEXT,
    "yearsOfExperience" TEXT NOT NULL,
    "geographicAvailability" TEXT NOT NULL,
    "accessibleDistricts" TEXT,
    "preferredEngagementType" TEXT NOT NULL,
    "availability" TEXT NOT NULL,
    "timeCommitment" TEXT NOT NULL,
    "equipmentAndSoftware" TEXT,
    "relevantCertifications" TEXT,
    "relevantTraining" TEXT,
    "referenceName" TEXT,
    "referenceOrganization" TEXT,
    "referenceRelationship" TEXT,
    "referenceEmail" TEXT,
    "referencePhone" TEXT,
    "motivation" TEXT NOT NULL,
    "proposedContribution" TEXT,
    "relevantCommunityAccess" TEXT,
    "conflictOfInterest" TEXT,
    "declarationAccuracy" BOOLEAN NOT NULL DEFAULT false,
    "declarationRights" BOOLEAN NOT NULL DEFAULT false,
    "declarationEthical" BOOLEAN NOT NULL DEFAULT false,
    "declarationConfidentiality" BOOLEAN NOT NULL DEFAULT false,
    "declarationRepresentation" BOOLEAN NOT NULL DEFAULT false,
    "declarationSelection" BOOLEAN NOT NULL DEFAULT false,
    "declarationPrivacy" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "reviewerId" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContributorApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportDocumentation" (
    "id" TEXT NOT NULL,
    "submissionNumber" TEXT NOT NULL,
    "status" "ParticipationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "purpose" TEXT NOT NULL,
    "purposeOther" TEXT,
    "title" TEXT NOT NULL,
    "materialType" TEXT NOT NULL,
    "primaryCraft" TEXT NOT NULL,
    "secondaryCrafts" TEXT,
    "peopleOrInstitutions" TEXT,
    "identifiablePersons" TEXT NOT NULL,
    "identifiablePersonsDetails" TEXT,
    "historicalContext" TEXT NOT NULL,
    "dateType" TEXT NOT NULL,
    "dateEstimate" TEXT,
    "basisForDate" TEXT,
    "placeAssociated" TEXT,
    "placeFound" TEXT,
    "currentLocation" TEXT,
    "legalOwner" TEXT NOT NULL,
    "currentCustodian" TEXT,
    "ownerType" TEXT,
    "relationshipToOwner" TEXT NOT NULL,
    "ownerAuthorisation" BOOLEAN NOT NULL,
    "ownershipDisputed" BOOLEAN,
    "ownershipHistory" TEXT,
    "copyrightStatus" TEXT NOT NULL,
    "copyrightHolder" TEXT,
    "permissionPrivateReview" BOOLEAN NOT NULL,
    "publicUsePermissions" TEXT,
    "attributionPreference" TEXT NOT NULL,
    "preferredCreditLine" TEXT,
    "containsSensitiveInfo" TEXT NOT NULL,
    "sensitiveInfoDetails" TEXT,
    "requestedRestrictions" TEXT,
    "digitisationInfo" TEXT,
    "alterationStatus" TEXT,
    "submitterName" TEXT NOT NULL,
    "submitterEmail" TEXT NOT NULL,
    "submitterPhone" TEXT NOT NULL,
    "submitterLocation" TEXT,
    "relationshipToMaterial" TEXT NOT NULL,
    "submitterOrganisation" TEXT,
    "authToSubmit" BOOLEAN NOT NULL,
    "accuracyDeclaration" BOOLEAN NOT NULL,
    "rightsDisclosure" BOOLEAN NOT NULL,
    "sensitiveDisclosure" BOOLEAN NOT NULL,
    "noAutomaticTransfer" BOOLEAN NOT NULL,
    "noGuaranteedPublication" BOOLEAN NOT NULL,
    "notes" TEXT,
    "reviewerId" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupportDocumentation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HearingEvidence" (
    "id" TEXT NOT NULL,
    "hearingId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HearingEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkcInstitution" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "district" TEXT,
    "contactPerson" TEXT,
    "email" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "participationType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkcInstitution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkcInstitutionRegistration" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "referenceNumber" TEXT NOT NULL,
    "participationScope" TEXT NOT NULL,
    "institutionName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "website" TEXT,
    "country" TEXT NOT NULL,
    "stateProvince" TEXT,
    "districtCity" TEXT,
    "primaryLocation" TEXT,
    "operationalCoverage" TEXT,
    "representativeName" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "participationTypes" TEXT[],
    "areasOfExpertise" TEXT[],
    "profile" TEXT,
    "proposedContribution" TEXT,
    "authConsent" BOOLEAN NOT NULL DEFAULT false,
    "authConsentAt" TIMESTAMP(3),
    "privacyConsent" BOOLEAN NOT NULL DEFAULT false,
    "privacyConsentAt" TIMESTAMP(3),
    "publicDirectoryConsent" BOOLEAN NOT NULL DEFAULT false,
    "communicationsConsent" BOOLEAN NOT NULL DEFAULT false,
    "communicationsConsentAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "reviewerNotes" TEXT,
    "assignedReviewerId" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkcInstitutionRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkcStakeholderRegistration" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "referenceNumber" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "organization" TEXT,
    "category" TEXT NOT NULL,
    "designation" TEXT,
    "district" TEXT,
    "country" TEXT,
    "stateProvinceRegion" TEXT,
    "city" TEXT,
    "districtOfOrigin" TEXT,
    "locationType" TEXT,
    "craftSector" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "website" TEXT,
    "participationModes" TEXT[],
    "consent" BOOLEAN NOT NULL DEFAULT false,
    "consentAt" TIMESTAMP(3),
    "participationScope" TEXT NOT NULL DEFAULT 'BOTH',
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkcStakeholderRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkcConfig" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkcConfig_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "SkcFinding" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "phase" TEXT,
    "district" TEXT,
    "author" TEXT,
    "attachmentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkcFinding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkcAdvisoryMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "bio" TEXT,
    "imageUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkcAdvisoryMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdvisoryApplication" (
    "id" TEXT NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "advisoryScope" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "organization" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "district" TEXT,
    "statement" TEXT NOT NULL,
    "cvFileUrl" TEXT,
    "cvOriginalFilename" TEXT,
    "cvMimeType" TEXT,
    "cvSizeBytes" INTEGER,
    "consentAccepted" BOOLEAN NOT NULL DEFAULT false,
    "consentAcceptedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "assignedReviewerId" TEXT,
    "internalNotes" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "decisionAt" TIMESTAMP(3),
    "appointmentScope" TEXT,
    "publicProfilePublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdvisoryApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfficialMessage" (
    "id" TEXT NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "body" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "translatedBody" TEXT,
    "category" TEXT NOT NULL,
    "contributorType" TEXT NOT NULL,
    "institutionType" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "contributorName" TEXT NOT NULL,
    "publicDisplayName" TEXT,
    "designation" TEXT,
    "organization" TEXT,
    "biography" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "website" TEXT,
    "publicProfileUrl" TEXT,
    "district" TEXT,
    "region" TEXT,
    "country" TEXT,
    "portraitUrl" TEXT,
    "organizationLogoUrl" TEXT,
    "signedLetterUrl" TEXT,
    "formattedPdfUrl" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "authorityVerified" BOOLEAN NOT NULL DEFAULT false,
    "publicationConsent" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "scheduledAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "reviewedById" TEXT,
    "approvedById" TEXT,
    "editorialNote" TEXT,
    "rejectionReason" TEXT,
    "internalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfficialMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkcOfficialMessageCategory" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "visibility" BOOLEAN NOT NULL DEFAULT true,
    "disclaimer" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkcOfficialMessageCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkcOfficialMessageSettings" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "consultationOpeningDate" TIMESTAMP(3),
    "consultationClosingDate" TIMESTAMP(3),
    "invitedSubmissionsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "invitationRequestsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "publicRegisterEnabled" BOOLEAN NOT NULL DEFAULT true,
    "featuredMessagesEnabled" BOOLEAN NOT NULL DEFAULT true,
    "emptyCategoryVisibility" BOOLEAN NOT NULL DEFAULT true,
    "defaultSort" TEXT NOT NULL DEFAULT 'publishedAt_desc',
    "recordsPerPage" INTEGER NOT NULL DEFAULT 20,
    "downloadCenterVisibility" BOOLEAN NOT NULL DEFAULT true,
    "invitationValidityDays" INTEGER NOT NULL DEFAULT 30,
    "messageLengthLimit" INTEGER NOT NULL DEFAULT 2000,
    "requirePhotograph" BOOLEAN NOT NULL DEFAULT true,
    "requireSignedLetter" BOOLEAN NOT NULL DEFAULT true,
    "requireInstitutionLogo" BOOLEAN NOT NULL DEFAULT false,
    "requireContributorApproval" BOOLEAN NOT NULL DEFAULT true,
    "referenceNumberPrefix" TEXT NOT NULL DEFAULT 'SKC2026',
    "referenceNumberType" TEXT NOT NULL DEFAULT 'OM',
    "nextSequenceNumber" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkcOfficialMessageSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkcOfficialMessageInvitation" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "tokenLastFour" TEXT NOT NULL,
    "purpose" TEXT,
    "fullName" TEXT NOT NULL,
    "publicDisplayName" TEXT,
    "honorific" TEXT,
    "designation" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "department" TEXT,
    "contributorCategory" TEXT NOT NULL,
    "institutionType" TEXT,
    "officialEmail" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT NOT NULL,
    "region" TEXT,
    "district" TEXT,
    "preferredLanguage" TEXT NOT NULL DEFAULT 'English',
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "assignedReviewerId" TEXT,
    "internalPriority" TEXT NOT NULL DEFAULT 'NORMAL',
    "invitationNote" TEXT,
    "targetPublicationDate" TIMESTAMP(3),
    "categoryId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "maxUses" INTEGER NOT NULL DEFAULT 1,
    "useCount" INTEGER NOT NULL DEFAULT 0,
    "resubmissionAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "sentAt" TIMESTAMP(3),
    "firstAccessedAt" TIMESTAMP(3),
    "lastAccessedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "revokedBy" TEXT,
    "revocationReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkcOfficialMessageInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkcOfficialMessageAccessRequest" (
    "id" TEXT NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "officialEmail" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "requestedCategory" TEXT NOT NULL,
    "reasonForRequest" TEXT NOT NULL,
    "proposedRelevance" TEXT NOT NULL,
    "consentToTerms" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "assignedReviewerId" TEXT,
    "internalNotes" TEXT,
    "rejectionReason" TEXT,
    "invitationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkcOfficialMessageAccessRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkcOfficialMessage" (
    "id" TEXT NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "publicDisplayName" TEXT,
    "honorific" TEXT,
    "designation" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "department" TEXT,
    "contributorCategory" TEXT NOT NULL,
    "institutionType" TEXT,
    "officialEmail" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT NOT NULL,
    "region" TEXT,
    "district" TEXT,
    "title" TEXT,
    "fullBody" TEXT,
    "excerpt" TEXT,
    "themes" TEXT[],
    "language" TEXT NOT NULL DEFAULT 'English',
    "translation" TEXT,
    "photographUrl" TEXT,
    "photographStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "photographAltText" TEXT,
    "photographSettings" JSONB,
    "institutionLogoUrl" TEXT,
    "signedLetterUrl" TEXT,
    "signedLetterStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "supportingFiles" JSONB,
    "identityStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "authorityStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "editorialStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "consentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "contributorApproval" TEXT NOT NULL DEFAULT 'PENDING',
    "workflowStatus" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "editorialNotes" TEXT,
    "internalNotes" TEXT,
    "assignedReviewerId" TEXT,
    "categoryId" TEXT NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "displayPriority" INTEGER NOT NULL DEFAULT 0,
    "scheduledFor" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "unpublishedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "pageViews" INTEGER NOT NULL DEFAULT 0,
    "pdfDownloads" INTEGER NOT NULL DEFAULT 0,
    "invitationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkcOfficialMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkcOfficialMessageRevision" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "title" TEXT,
    "changedBy" TEXT NOT NULL,
    "changeReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SkcOfficialMessageRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkcOfficialMessageAuditLog" (
    "id" TEXT NOT NULL,
    "messageId" TEXT,
    "invitationId" TEXT,
    "actorId" TEXT NOT NULL,
    "actorName" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "previousValue" JSONB,
    "newValue" JSONB,
    "reason" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SkcOfficialMessageAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentCycle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "timezone" TEXT NOT NULL DEFAULT 'IST',
    "consultationStartAt" TIMESTAMP(3),
    "consultationEndAt" TIMESTAMP(3),
    "validationStartAt" TIMESTAMP(3),
    "validationEndAt" TIMESTAMP(3),
    "reportReleaseAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssessmentCycle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "District" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "region" TEXT,
    "description" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HearingTopic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "thematicArea" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HearingTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HearingType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HearingType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HearingFormat" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HearingFormat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HearingStakeholderCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HearingStakeholderCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkcHearing" (
    "id" TEXT NOT NULL,
    "assessmentCycleId" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortSummary" TEXT NOT NULL,
    "fullDescription" TEXT,
    "purpose" TEXT,
    "objectives" TEXT,
    "expectedOutcomes" TEXT,
    "hearingTypeId" TEXT,
    "formatId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "publicationStatus" TEXT NOT NULL DEFAULT 'DRAFT',
    "registrationStatus" TEXT NOT NULL DEFAULT 'CLOSED',
    "startAt" TIMESTAMP(3),
    "endAt" TIMESTAMP(3),
    "timezone" TEXT NOT NULL DEFAULT 'IST',
    "registrationOpensAt" TIMESTAMP(3),
    "registrationClosesAt" TIMESTAMP(3),
    "capacity" INTEGER NOT NULL DEFAULT 0,
    "waitlistEnabled" BOOLEAN NOT NULL DEFAULT false,
    "venueName" TEXT,
    "venueAddress" TEXT,
    "virtualPlatform" TEXT,
    "virtualJoinUrlEncrypted" TEXT,
    "publicMeetingUrl" TEXT,
    "accessibilityInformation" TEXT,
    "contactName" TEXT,
    "contactEmail" TEXT,
    "publicNoticeId" TEXT,
    "agendaId" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "publishedBy" TEXT,
    "publishedAt" TIMESTAMP(3),
    "postponedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "cancellationReason" TEXT,
    "postponementNotice" TEXT,
    "date" TIMESTAMP(3),
    "time" TEXT,
    "venue" TEXT,
    "meetingLink" TEXT,
    "district" TEXT,
    "craftFocus" TEXT,
    "topics" TEXT[],
    "agenda" TEXT,
    "stakeholderCategories" TEXT[],
    "panelChair" TEXT,
    "moderators" TEXT[],
    "registrationDeadline" TIMESTAMP(3),
    "contactInfo" TEXT,
    "accessibilityInfo" TEXT,
    "summary" TEXT,
    "recordingUrl" TEXT,
    "transcriptUrl" TEXT,
    "minutesUrl" TEXT,
    "recommendations" TEXT,
    "photos" TEXT[],
    "statistics" JSONB,
    "attendeeCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkcHearing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HearingDistrict" (
    "hearingId" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,

    CONSTRAINT "HearingDistrict_pkey" PRIMARY KEY ("hearingId","districtId")
);

-- CreateTable
CREATE TABLE "HearingCraft" (
    "hearingId" TEXT NOT NULL,
    "craftId" TEXT NOT NULL,

    CONSTRAINT "HearingCraft_pkey" PRIMARY KEY ("hearingId","craftId")
);

-- CreateTable
CREATE TABLE "HearingTopicAssignment" (
    "hearingId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,

    CONSTRAINT "HearingTopicAssignment_pkey" PRIMARY KEY ("hearingId","topicId")
);

-- CreateTable
CREATE TABLE "SkcHearingStakeholderCategory" (
    "hearingId" TEXT NOT NULL,
    "stakeholderCategoryId" TEXT NOT NULL,

    CONSTRAINT "SkcHearingStakeholderCategory_pkey" PRIMARY KEY ("hearingId","stakeholderCategoryId")
);

-- CreateTable
CREATE TABLE "HearingRegistration" (
    "id" TEXT NOT NULL,
    "hearingId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "organization" TEXT,
    "designation" TEXT,
    "stakeholderCategoryId" TEXT,
    "districtId" TEXT,
    "craftInterests" TEXT[],
    "attendanceType" TEXT NOT NULL,
    "accessibilityRequirements" TEXT,
    "consentAccepted" BOOLEAN NOT NULL DEFAULT false,
    "privacyPolicyVersion" TEXT,
    "publicListingConsent" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "referenceNumber" TEXT NOT NULL,
    "verificationTokenHash" TEXT,
    "verificationExpiresAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "checkedInAt" TIMESTAMP(3),
    "attended" BOOLEAN NOT NULL DEFAULT false,
    "cancellationAt" TIMESTAMP(3),
    "cancellationReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stakeholderCategory" TEXT,
    "district" TEXT,
    "craftInterest" TEXT,
    "accessibilityReq" TEXT,
    "consent" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "HearingRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HearingTestimony" (
    "id" TEXT NOT NULL,
    "hearingId" TEXT NOT NULL,
    "assessmentCycleId" TEXT,
    "topicId" TEXT,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "testimonyBody" TEXT NOT NULL,
    "submitterName" TEXT NOT NULL,
    "submitterEmail" TEXT NOT NULL,
    "organization" TEXT,
    "designation" TEXT,
    "stakeholderCategoryId" TEXT,
    "districtId" TEXT,
    "publicAttributionConsent" BOOLEAN NOT NULL DEFAULT true,
    "confidentialityLevel" TEXT NOT NULL DEFAULT 'PUBLIC',
    "consentAccepted" BOOLEAN NOT NULL DEFAULT true,
    "privacyPolicyVersion" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "reviewerNotes" TEXT,
    "clarificationRequestedAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "topic" TEXT,
    "writtenSubmission" TEXT,
    "supportingEvidence" TEXT,
    "attachmentUrl" TEXT,
    "consent" BOOLEAN NOT NULL DEFAULT true,
    "publicAttribution" BOOLEAN NOT NULL DEFAULT true,
    "confidential" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "HearingTestimony_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestimonyAttachment" (
    "id" TEXT NOT NULL,
    "testimonyId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "checksum" TEXT,
    "scanStatus" TEXT,
    "publicAccess" BOOLEAN NOT NULL DEFAULT false,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestimonyAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Speaker" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "designation" TEXT,
    "institution" TEXT,
    "biography" TEXT,
    "expertise" TEXT,
    "photo" TEXT,
    "publicEmailOptional" TEXT,
    "profileVisibility" BOOLEAN NOT NULL DEFAULT true,
    "consentConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Speaker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HearingSpeakerAssignment" (
    "hearingId" TEXT NOT NULL,
    "speakerId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "sessionTitle" TEXT,
    "speakingTopic" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',

    CONSTRAINT "HearingSpeakerAssignment_pkey" PRIMARY KEY ("hearingId","speakerId")
);

-- CreateTable
CREATE TABLE "HearingDocument" (
    "id" TEXT NOT NULL,
    "hearingId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "version" TEXT,
    "publicationStatus" TEXT NOT NULL DEFAULT 'DRAFT',
    "fileKey" TEXT,
    "externalUrl" TEXT,
    "mimeType" TEXT,
    "fileSize" INTEGER,
    "checksum" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HearingDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HearingNotificationSubscriber" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "verificationTokenHash" TEXT,
    "verificationExpiresAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "unsubscribedAt" TIMESTAMP(3),
    "privacyPolicyVersion" TEXT,
    "consentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "formatPreferences" TEXT[],
    "notificationFrequency" TEXT NOT NULL DEFAULT 'all',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HearingNotificationSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriberDistrict" (
    "subscriberId" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,

    CONSTRAINT "SubscriberDistrict_pkey" PRIMARY KEY ("subscriberId","districtId")
);

-- CreateTable
CREATE TABLE "SubscriberCraft" (
    "subscriberId" TEXT NOT NULL,
    "craftId" TEXT NOT NULL,

    CONSTRAINT "SubscriberCraft_pkey" PRIMARY KEY ("subscriberId","craftId")
);

-- CreateTable
CREATE TABLE "SubscriberTopic" (
    "subscriberId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,

    CONSTRAINT "SubscriberTopic_pkey" PRIMARY KEY ("subscriberId","topicId")
);

-- CreateTable
CREATE TABLE "SubscriberStakeholderCategory" (
    "subscriberId" TEXT NOT NULL,
    "stakeholderCategoryId" TEXT NOT NULL,

    CONSTRAINT "SubscriberStakeholderCategory_pkey" PRIMARY KEY ("subscriberId","stakeholderCategoryId")
);

-- CreateTable
CREATE TABLE "HearingNotificationDelivery" (
    "id" TEXT NOT NULL,
    "hearingId" TEXT NOT NULL,
    "campaignId" TEXT,
    "subscriberId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SENT',
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveredAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "bouncedAt" TIMESTAMP(3),
    "errorCode" TEXT,

    CONSTRAINT "HearingNotificationDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HearingAuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "beforeData" JSONB,
    "afterData" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HearingAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkcEvidence" (
    "id" TEXT NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "evidenceType" TEXT NOT NULL,
    "category" TEXT,
    "district" TEXT,
    "craftSector" TEXT,
    "organization" TEXT,
    "contributorName" TEXT,
    "email" TEXT,
    "source" TEXT,
    "publicationDate" TIMESTAMP(3),
    "provenance" TEXT,
    "relevance" TEXT,
    "copyrightDeclaration" BOOLEAN NOT NULL DEFAULT false,
    "attributionPreference" BOOLEAN NOT NULL DEFAULT false,
    "confidentialityExplanation" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'REVIEW_ONLY',
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "fileUrl" TEXT,
    "fileType" TEXT,
    "fileSize" INTEGER,
    "tags" TEXT[],
    "assessmentCycle" TEXT NOT NULL DEFAULT '2026',
    "isReferencedInDraft" BOOLEAN NOT NULL DEFAULT false,
    "isReferencedInFinal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkcEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkcEvidenceAuditLog" (
    "id" TEXT NOT NULL,
    "evidenceId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SkcEvidenceAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DraftFinding" (
    "id" TEXT NOT NULL,
    "assessmentCycleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "findingType" TEXT NOT NULL,
    "craftId" TEXT,
    "districtId" TEXT,
    "themeId" TEXT,
    "stakeholderGroupId" TEXT,
    "summary" TEXT NOT NULL,
    "fullAnalysis" TEXT NOT NULL,
    "majorConcern" TEXT,
    "emergingOpportunity" TEXT,
    "primaryIssue" TEXT,
    "keyOpportunity" TEXT,
    "evidenceStrength" TEXT,
    "confidenceLevel" TEXT,
    "stakeholderCount" INTEGER NOT NULL DEFAULT 0,
    "evidenceRecordCount" INTEGER NOT NULL DEFAULT 0,
    "hearingCount" INTEGER NOT NULL DEFAULT 0,
    "sourceMethod" TEXT,
    "limitations" TEXT,
    "status" "FindingStatus" NOT NULL DEFAULT 'DRAFT_INTERNAL',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdBy" TEXT,
    "reviewedBy" TEXT,
    "approvedBy" TEXT,
    "publishedAt" TIMESTAMP(3),
    "validationOpensAt" TIMESTAMP(3),
    "validationClosesAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DraftFinding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FindingEvidence" (
    "id" TEXT NOT NULL,
    "findingId" TEXT NOT NULL,
    "evidenceId" TEXT NOT NULL,
    "relevanceNote" TEXT,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FindingEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FindingHearing" (
    "id" TEXT NOT NULL,
    "findingId" TEXT NOT NULL,
    "hearingId" TEXT NOT NULL,
    "relevanceNote" TEXT,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FindingHearing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FindingConsultation" (
    "id" TEXT NOT NULL,
    "findingId" TEXT NOT NULL,
    "consultationId" TEXT NOT NULL,
    "relevanceNote" TEXT,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FindingConsultation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FindingValidationResponse" (
    "id" TEXT NOT NULL,
    "findingId" TEXT NOT NULL,
    "respondentName" TEXT NOT NULL,
    "respondentEmail" TEXT,
    "organization" TEXT,
    "stakeholderCategory" TEXT,
    "responseType" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "evidenceUrl" TEXT,
    "status" "ValidationResponseStatus" NOT NULL DEFAULT 'SUBMITTED',
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FindingValidationResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FindingVersion" (
    "id" TEXT NOT NULL,
    "findingId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "snapshotData" JSONB NOT NULL,
    "commitMessage" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FindingVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FindingAuditLog" (
    "id" TEXT NOT NULL,
    "findingId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actor" TEXT,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FindingAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroConfiguration" (
    "id" TEXT NOT NULL,
    "pageKey" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "pageFamily" TEXT NOT NULL,
    "variant" TEXT NOT NULL,
    "fixedEyebrow" TEXT,
    "fixedTitle" TEXT,
    "fixedIdentity" TEXT,
    "autoplayEnabled" BOOLEAN NOT NULL DEFAULT true,
    "autoplayIntervalMs" INTEGER NOT NULL DEFAULT 6000,
    "transitionType" TEXT NOT NULL DEFAULT 'crossfade',
    "accentColor" TEXT NOT NULL DEFAULT '#C5A437',
    "animationEnabled" BOOLEAN NOT NULL DEFAULT true,
    "reducedMotionFallback" BOOLEAN NOT NULL DEFAULT true,
    "showBreadcrumb" BOOLEAN NOT NULL DEFAULT true,
    "showProgress" BOOLEAN NOT NULL DEFAULT true,
    "showPauseControl" BOOLEAN NOT NULL DEFAULT true,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "HeroConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroSlide" (
    "id" TEXT NOT NULL,
    "heroConfigurationId" TEXT NOT NULL,
    "internalName" TEXT NOT NULL,
    "eyebrow" TEXT,
    "titleLineOne" TEXT NOT NULL,
    "titleConnector" TEXT,
    "titleLineTwo" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quotation" TEXT,
    "primaryCtaLabel" TEXT,
    "primaryCtaUrl" TEXT,
    "secondaryCtaLabel" TEXT,
    "secondaryCtaUrl" TEXT,
    "tertiaryLinkLabel" TEXT,
    "tertiaryLinkUrl" TEXT,
    "meta1" TEXT,
    "meta2" TEXT,
    "meta3" TEXT,
    "meta4" TEXT,
    "layoutVariant" TEXT NOT NULL DEFAULT 'editorial-split',
    "contentAlignment" TEXT NOT NULL DEFAULT 'left',
    "theme" TEXT NOT NULL DEFAULT 'dark',
    "metadata" JSONB,
    "tags" TEXT[],
    "displayOrder" INTEGER NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "phaseTargets" TEXT[],
    "audienceTargets" TEXT[],
    "geographyTargets" TEXT[],
    "stakeholderTargets" TEXT[],
    "campaignPriority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "HeroSlide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroRevision" (
    "id" TEXT NOT NULL,
    "heroConfigurationId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "snapshot" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "changeSummary" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" TIMESTAMP(3),
    "rollbackSourceId" TEXT,

    CONSTRAINT "HeroRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroAnalytics" (
    "id" TEXT NOT NULL,
    "heroSlideId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "manualViews" INTEGER NOT NULL DEFAULT 0,
    "completedViews" INTEGER NOT NULL DEFAULT 0,
    "ctaClicks" INTEGER NOT NULL DEFAULT 0,
    "secondaryCtaClicks" INTEGER NOT NULL DEFAULT 0,
    "pauseEvents" INTEGER NOT NULL DEFAULT 0,
    "previousClicks" INTEGER NOT NULL DEFAULT 0,
    "nextClicks" INTEGER NOT NULL DEFAULT 0,
    "deviceType" TEXT,
    "audienceSegment" TEXT,

    CONSTRAINT "HeroAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfficialMessageInvitationRequest" (
    "id" TEXT NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "designation" TEXT,
    "institution" TEXT NOT NULL,
    "officialEmail" TEXT NOT NULL,
    "proposedRelevance" TEXT,
    "contributorCategory" TEXT NOT NULL,
    "reasonForRequest" TEXT NOT NULL,
    "consentAccepted" BOOLEAN NOT NULL,
    "consentAcceptedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "reviewPriority" TEXT,
    "assignedReviewerId" TEXT,
    "reviewerNotes" TEXT,
    "decisionReason" TEXT,
    "invitationIssuedAt" TIMESTAMP(3),
    "invitationToken" TEXT,
    "invitationExpiresAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfficialMessageInvitationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfficialMessageInvitation" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "codeDisplaySuffix" TEXT NOT NULL,
    "applicantEmail" TEXT NOT NULL,
    "applicantName" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "contributorCategory" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "firstAccessedAt" TIMESTAMP(3),
    "lastAccessedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "submissionId" TEXT,
    "issuedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfficialMessageInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfficialMessageSubmission" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OfficialMessageSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfficialMessageReview" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OfficialMessageReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfficialMessagePublication" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OfficialMessagePublication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkcRegistryResource" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "longDescription" TEXT,
    "category" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "language" TEXT NOT NULL DEFAULT 'en',
    "fileUrl" TEXT NOT NULL,
    "storageKey" TEXT,
    "originalFilename" TEXT,
    "publicFilename" TEXT,
    "mimeType" TEXT,
    "fileSizeBytes" INTEGER,
    "checksum" TEXT,
    "publicationDate" TIMESTAMP(3),
    "effectiveDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "lastUpdatedAt" TIMESTAMP(3),
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkcRegistryResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkcRegistryResourceVersion" (
    "id" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "storageKey" TEXT,
    "originalFilename" TEXT,
    "publicFilename" TEXT,
    "mimeType" TEXT,
    "fileSizeBytes" INTEGER,
    "checksum" TEXT,
    "createdBy" TEXT,
    "notes" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkcRegistryResourceVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicationEditorial" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "executiveSummary" TEXT,
    "whyItMatters" TEXT,
    "objectives" JSONB,
    "researchQuestions" JSONB,
    "scope" TEXT,
    "audience" JSONB,
    "learningOutcomes" JSONB,

    CONSTRAINT "PublicationEditorial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicationResearch" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "methodology" TEXT,
    "primarySources" TEXT,
    "secondarySources" TEXT,
    "standards" JSONB,
    "regulations" JSONB,
    "geographicScope" JSONB,
    "timePeriod" TEXT,

    CONSTRAINT "PublicationResearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicationMetadata" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "isbn" TEXT,
    "doi" TEXT,
    "publisher" TEXT NOT NULL DEFAULT 'HCRF Heritage Press',
    "copyright" TEXT,
    "license" TEXT,
    "keywords" JSONB,
    "recommendedCitation" TEXT,

    CONSTRAINT "PublicationMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicationReaderExperience" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "estimatedReadingTime" INTEGER,
    "estimatedPageCount" INTEGER,
    "estimatedWordCount" INTEGER,
    "difficultyLevel" TEXT,
    "prerequisites" JSONB,

    CONSTRAINT "PublicationReaderExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicationDiscoverability" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "jsonLdType" TEXT NOT NULL DEFAULT 'Book',
    "canonicalUrl" TEXT,

    CONSTRAINT "PublicationDiscoverability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicationEdition" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "edition" TEXT NOT NULL,
    "publicationDate" TIMESTAMP(3),
    "isbn" TEXT,
    "doi" TEXT,
    "manuscriptSnapshot" JSONB,
    "status" "PublicationWorkflowStatus" NOT NULL DEFAULT 'CONCEPT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublicationEdition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicationWorkflowHistory" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "expectedRevision" INTEGER,
    "status" "PublicationWorkflowStatus" NOT NULL,
    "changedBy" TEXT NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "comments" TEXT,

    CONSTRAINT "PublicationWorkflowHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicationContributor" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "ContributorRole" NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublicationContributor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicationRelation" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "relationship" "KnowledgeRelationshipType" NOT NULL DEFAULT 'RELATED_TO',

    CONSTRAINT "PublicationRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicationEntityRelation" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "entityType" "KnowledgeEntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityName" TEXT NOT NULL,
    "relationship" "KnowledgeRelationshipType",

    CONSTRAINT "PublicationEntityRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicationAsset" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "originChapterId" TEXT,
    "assetType" "AssetType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "referenceId" TEXT,
    "isReusable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PublicationAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Citation" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "claim" TEXT NOT NULL,
    "evidenceStatus" "EvidenceStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "sourceData" TEXT,
    "chapterId" TEXT,
    "sectionId" TEXT,
    "blockId" TEXT,

    CONSTRAINT "Citation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "parentId" TEXT,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "status" "SectionWorkflowStatus" NOT NULL DEFAULT 'DRAFT',

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentBlock" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "blockType" "ContentBlockType" NOT NULL,
    "content" TEXT NOT NULL,
    "evidenceStatus" "EvidenceStatus",

    CONSTRAINT "ContentBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdempotencyRecord" (
    "idempotencyKey" TEXT NOT NULL,
    "commandType" TEXT NOT NULL,
    "aggregateId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "requestHash" TEXT,
    "resultStatus" TEXT NOT NULL,
    "resultPayload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "IdempotencyRecord_pkey" PRIMARY KEY ("userId","commandType","idempotencyKey")
);

-- CreateTable
CREATE TABLE "skc_lifecycle_stages" (
    "id" TEXT NOT NULL,
    "assessmentCycleId" TEXT NOT NULL DEFAULT '2026',
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "order" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 10,
    "startDate" TIMESTAMP(3),
    "targetEndDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "progressPercent" INTEGER DEFAULT 0,
    "publicVisible" BOOLEAN NOT NULL DEFAULT true,
    "linkedRoute" TEXT,
    "statusMode" TEXT NOT NULL DEFAULT 'MANUAL',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "skc_lifecycle_stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skc_lifecycle_audit_logs" (
    "id" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,
    "stageKey" TEXT NOT NULL,
    "previousStatus" TEXT NOT NULL,
    "newStatus" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "publicVisible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "skc_lifecycle_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skc_assessment_cycles" (
    "id" TEXT NOT NULL,
    "cycleYear" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PREPARING',
    "consultationStart" TIMESTAMP(3),
    "consultationEnd" TIMESTAMP(3),
    "finalReportRelease" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skc_assessment_cycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skc_districts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT NOT NULL DEFAULT 'Kashmir',
    "displayOrder" INTEGER NOT NULL DEFAULT 1,
    "publicVisible" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'Preparing',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "launchSchedule" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skc_districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skc_institution_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "invitedCount" INTEGER NOT NULL DEFAULT 0,
    "displayOrder" INTEGER NOT NULL DEFAULT 1,
    "publicVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skc_institution_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skc_consultation_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skc_consultation_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skc_consultation_themes" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "icon" TEXT,
    "color" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "currentStatus" TEXT NOT NULL DEFAULT 'PLANNING',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "nextMilestoneDate" TEXT,
    "nextMilestoneLoc" TEXT,
    "nextMilestoneMode" TEXT,
    "assessmentCycleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skc_consultation_themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skc_hearing_theme_assignments" (
    "hearingId" TEXT NOT NULL,
    "themeId" TEXT NOT NULL,

    CONSTRAINT "skc_hearing_theme_assignments_pkey" PRIMARY KEY ("hearingId","themeId")
);

-- CreateTable
CREATE TABLE "MagazineIssue" (
    "id" TEXT NOT NULL,
    "issueNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "slug" TEXT NOT NULL,
    "coverImage" TEXT,
    "thumbnail" TEXT,
    "coverStory" TEXT,
    "featuredCraft" TEXT,
    "edition" TEXT,
    "shortDescription" TEXT,
    "featureHighlights" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "visibility" TEXT NOT NULL DEFAULT 'MEMBERS_ONLY',
    "publishedAt" TIMESTAMP(3),
    "coverStoryTitle" TEXT,
    "issueOverview" TEXT,
    "featuredCraftName" TEXT,
    "featuredCraftLabel" TEXT,
    "coverImageAlt" TEXT,
    "readerAssetKey" TEXT,
    "downloadable" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MagazineIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FellowshipApplication" (
    "id" TEXT NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "district" TEXT,
    "education" TEXT,
    "institution" TEXT,
    "position" TEXT,
    "skills" TEXT,
    "statement" TEXT,
    "cvUrl" TEXT,
    "portfolioUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FellowshipApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChapterReview" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "role" "ReviewerRole" NOT NULL DEFAULT 'PRIMARY_REVIEWER',
    "blindType" "BlindReviewType" NOT NULL DEFAULT 'OPEN',
    "recommendation" "ReviewRecommendation",
    "scores" JSONB,
    "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChapterReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewComment" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commentType" "ReviewCommentType" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EditorialAuditLog" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "chapterId" TEXT,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EditorialAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EntityTaxonomy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EntityTaxonomy_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_EntityMedia" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EntityMedia_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_StoryMedia" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_StoryMedia_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_SupportDocMedia" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SupportDocMedia_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_NominationMedia" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_NominationMedia_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ContributorMedia" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ContributorMedia_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "CanonicalEntity_slug_key" ON "CanonicalEntity"("slug");

-- CreateIndex
CREATE INDEX "CanonicalEntity_entityType_lifecycle_idx" ON "CanonicalEntity"("entityType", "lifecycle");

-- CreateIndex
CREATE INDEX "CanonicalEntity_slug_idx" ON "CanonicalEntity"("slug");

-- CreateIndex
CREATE INDEX "CanonicalEntity_title_idx" ON "CanonicalEntity"("title");

-- CreateIndex
CREATE INDEX "CanonicalEntity_visibility_idx" ON "CanonicalEntity"("visibility");

-- CreateIndex
CREATE INDEX "CanonicalEntity_verificationStatus_idx" ON "CanonicalEntity"("verificationStatus");

-- CreateIndex
CREATE INDEX "CanonicalEntity_createdById_idx" ON "CanonicalEntity"("createdById");

-- CreateIndex
CREATE INDEX "CanonicalEntity_deletedAt_idx" ON "CanonicalEntity"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TaxonomyCategory_slug_key" ON "TaxonomyCategory"("slug");

-- CreateIndex
CREATE INDEX "TaxonomyCategory_parentId_idx" ON "TaxonomyCategory"("parentId");

-- CreateIndex
CREATE INDEX "EntityRelationship_sourceEntityId_idx" ON "EntityRelationship"("sourceEntityId");

-- CreateIndex
CREATE INDEX "EntityRelationship_targetEntityId_idx" ON "EntityRelationship"("targetEntityId");

-- CreateIndex
CREATE INDEX "EntityRelationship_relationshipType_sourceEntityId_idx" ON "EntityRelationship"("relationshipType", "sourceEntityId");

-- CreateIndex
CREATE INDEX "EntityRelationship_relationshipType_targetEntityId_idx" ON "EntityRelationship"("relationshipType", "targetEntityId");

-- CreateIndex
CREATE UNIQUE INDEX "EntityRelationship_sourceEntityId_targetEntityId_relationsh_key" ON "EntityRelationship"("sourceEntityId", "targetEntityId", "relationshipType");

-- CreateIndex
CREATE INDEX "SourceReference_entityId_idx" ON "SourceReference"("entityId");

-- CreateIndex
CREATE INDEX "VerificationRecord_entityId_idx" ON "VerificationRecord"("entityId");

-- CreateIndex
CREATE INDEX "VerificationRecord_verifierId_idx" ON "VerificationRecord"("verifierId");

-- CreateIndex
CREATE INDEX "WorkflowRecord_entityId_idx" ON "WorkflowRecord"("entityId");

-- CreateIndex
CREATE INDEX "MediaAsset_mediaType_idx" ON "MediaAsset"("mediaType");

-- CreateIndex
CREATE UNIQUE INDEX "Craft_canonicalEntityId_key" ON "Craft"("canonicalEntityId");

-- CreateIndex
CREATE UNIQUE INDEX "Material_canonicalEntityId_key" ON "Material"("canonicalEntityId");

-- CreateIndex
CREATE UNIQUE INDEX "Tool_canonicalEntityId_key" ON "Tool"("canonicalEntityId");

-- CreateIndex
CREATE UNIQUE INDEX "Technique_canonicalEntityId_key" ON "Technique"("canonicalEntityId");

-- CreateIndex
CREATE UNIQUE INDEX "Motif_canonicalEntityId_key" ON "Motif"("canonicalEntityId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_canonicalEntityId_key" ON "Product"("canonicalEntityId");

-- CreateIndex
CREATE UNIQUE INDEX "GlossaryTerm_canonicalEntityId_key" ON "GlossaryTerm"("canonicalEntityId");

-- CreateIndex
CREATE UNIQUE INDEX "Artisan_canonicalEntityId_key" ON "Artisan"("canonicalEntityId");

-- CreateIndex
CREATE UNIQUE INDEX "Studio_canonicalEntityId_key" ON "Studio"("canonicalEntityId");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_canonicalEntityId_key" ON "Collection"("canonicalEntityId");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchPublication_canonicalEntityId_key" ON "ResearchPublication"("canonicalEntityId");

-- CreateIndex
CREATE UNIQUE INDEX "MasterArtisan_slug_key" ON "MasterArtisan"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ArtisanNomination_submissionNumber_key" ON "ArtisanNomination"("submissionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "StorySubmission_submissionNumber_key" ON "StorySubmission"("submissionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ContributorApplication_submissionNumber_key" ON "ContributorApplication"("submissionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SupportDocumentation_submissionNumber_key" ON "SupportDocumentation"("submissionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SkcInstitutionRegistration_userId_key" ON "SkcInstitutionRegistration"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SkcInstitutionRegistration_referenceNumber_key" ON "SkcInstitutionRegistration"("referenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SkcStakeholderRegistration_userId_key" ON "SkcStakeholderRegistration"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SkcStakeholderRegistration_referenceNumber_key" ON "SkcStakeholderRegistration"("referenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "AdvisoryApplication_referenceNumber_key" ON "AdvisoryApplication"("referenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "OfficialMessage_referenceNumber_key" ON "OfficialMessage"("referenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "OfficialMessage_slug_key" ON "OfficialMessage"("slug");

-- CreateIndex
CREATE INDEX "OfficialMessage_status_publishedAt_idx" ON "OfficialMessage"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "OfficialMessage_category_status_idx" ON "OfficialMessage"("category", "status");

-- CreateIndex
CREATE INDEX "OfficialMessage_organization_idx" ON "OfficialMessage"("organization");

-- CreateIndex
CREATE INDEX "OfficialMessage_district_idx" ON "OfficialMessage"("district");

-- CreateIndex
CREATE INDEX "OfficialMessage_country_idx" ON "OfficialMessage"("country");

-- CreateIndex
CREATE UNIQUE INDEX "SkcOfficialMessageCategory_slug_key" ON "SkcOfficialMessageCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SkcOfficialMessageInvitation_tokenHash_key" ON "SkcOfficialMessageInvitation"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "SkcOfficialMessageAccessRequest_referenceNumber_key" ON "SkcOfficialMessageAccessRequest"("referenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SkcOfficialMessage_referenceNumber_key" ON "SkcOfficialMessage"("referenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SkcOfficialMessage_slug_key" ON "SkcOfficialMessage"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SkcOfficialMessage_invitationId_key" ON "SkcOfficialMessage"("invitationId");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentCycle_slug_key" ON "AssessmentCycle"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "District_name_key" ON "District"("name");

-- CreateIndex
CREATE UNIQUE INDEX "District_slug_key" ON "District"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "HearingTopic_name_key" ON "HearingTopic"("name");

-- CreateIndex
CREATE UNIQUE INDEX "HearingTopic_slug_key" ON "HearingTopic"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "HearingType_name_key" ON "HearingType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "HearingType_slug_key" ON "HearingType"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "HearingFormat_name_key" ON "HearingFormat"("name");

-- CreateIndex
CREATE UNIQUE INDEX "HearingFormat_slug_key" ON "HearingFormat"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "HearingStakeholderCategory_name_key" ON "HearingStakeholderCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "HearingStakeholderCategory_slug_key" ON "HearingStakeholderCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SkcHearing_slug_key" ON "SkcHearing"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "HearingRegistration_referenceNumber_key" ON "HearingRegistration"("referenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Speaker_slug_key" ON "Speaker"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "HearingNotificationSubscriber_email_key" ON "HearingNotificationSubscriber"("email");

-- CreateIndex
CREATE UNIQUE INDEX "HearingNotificationSubscriber_verificationTokenHash_key" ON "HearingNotificationSubscriber"("verificationTokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "SkcEvidence_referenceNumber_key" ON "SkcEvidence"("referenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SkcEvidence_slug_key" ON "SkcEvidence"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "DraftFinding_slug_key" ON "DraftFinding"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "HeroConfiguration_pageKey_key" ON "HeroConfiguration"("pageKey");

-- CreateIndex
CREATE UNIQUE INDEX "OfficialMessageInvitationRequest_referenceNumber_key" ON "OfficialMessageInvitationRequest"("referenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "OfficialMessageInvitationRequest_invitationToken_key" ON "OfficialMessageInvitationRequest"("invitationToken");

-- CreateIndex
CREATE UNIQUE INDEX "OfficialMessageInvitation_requestId_key" ON "OfficialMessageInvitation"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "OfficialMessageInvitation_codeHash_key" ON "OfficialMessageInvitation"("codeHash");

-- CreateIndex
CREATE UNIQUE INDEX "OfficialMessageInvitation_submissionId_key" ON "OfficialMessageInvitation"("submissionId");

-- CreateIndex
CREATE UNIQUE INDEX "SkcRegistryResource_slug_key" ON "SkcRegistryResource"("slug");

-- CreateIndex
CREATE INDEX "SkcRegistryResource_status_idx" ON "SkcRegistryResource"("status");

-- CreateIndex
CREATE INDEX "SkcRegistryResource_category_idx" ON "SkcRegistryResource"("category");

-- CreateIndex
CREATE INDEX "SkcRegistryResourceVersion_resourceId_idx" ON "SkcRegistryResourceVersion"("resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "PublicationEditorial_publicationId_key" ON "PublicationEditorial"("publicationId");

-- CreateIndex
CREATE UNIQUE INDEX "PublicationResearch_publicationId_key" ON "PublicationResearch"("publicationId");

-- CreateIndex
CREATE UNIQUE INDEX "PublicationMetadata_publicationId_key" ON "PublicationMetadata"("publicationId");

-- CreateIndex
CREATE UNIQUE INDEX "PublicationMetadata_isbn_key" ON "PublicationMetadata"("isbn");

-- CreateIndex
CREATE UNIQUE INDEX "PublicationMetadata_doi_key" ON "PublicationMetadata"("doi");

-- CreateIndex
CREATE UNIQUE INDEX "PublicationReaderExperience_publicationId_key" ON "PublicationReaderExperience"("publicationId");

-- CreateIndex
CREATE UNIQUE INDEX "PublicationDiscoverability_publicationId_key" ON "PublicationDiscoverability"("publicationId");

-- CreateIndex
CREATE UNIQUE INDEX "PublicationEdition_publicationId_version_edition_key" ON "PublicationEdition"("publicationId", "version", "edition");

-- CreateIndex
CREATE INDEX "PublicationWorkflowHistory_publicationId_idx" ON "PublicationWorkflowHistory"("publicationId");

-- CreateIndex
CREATE INDEX "PublicationWorkflowHistory_changedAt_idx" ON "PublicationWorkflowHistory"("changedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PublicationContributor_publicationId_userId_role_key" ON "PublicationContributor"("publicationId", "userId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "PublicationRelation_sourceId_targetId_relationship_key" ON "PublicationRelation"("sourceId", "targetId", "relationship");

-- CreateIndex
CREATE UNIQUE INDEX "PublicationEntityRelation_publicationId_entityType_entityId_key" ON "PublicationEntityRelation"("publicationId", "entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "Section_chapterId_parentId_order_key" ON "Section"("chapterId", "parentId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "ContentBlock_sectionId_order_key" ON "ContentBlock"("sectionId", "order");

-- CreateIndex
CREATE INDEX "IdempotencyRecord_aggregateId_idx" ON "IdempotencyRecord"("aggregateId");

-- CreateIndex
CREATE INDEX "IdempotencyRecord_createdAt_idx" ON "IdempotencyRecord"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "skc_lifecycle_stages_key_key" ON "skc_lifecycle_stages"("key");

-- CreateIndex
CREATE UNIQUE INDEX "skc_assessment_cycles_cycleYear_key" ON "skc_assessment_cycles"("cycleYear");

-- CreateIndex
CREATE UNIQUE INDEX "skc_districts_name_key" ON "skc_districts"("name");

-- CreateIndex
CREATE UNIQUE INDEX "skc_institution_categories_name_key" ON "skc_institution_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "skc_consultation_categories_name_key" ON "skc_consultation_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "skc_consultation_categories_slug_key" ON "skc_consultation_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "skc_consultation_themes_slug_key" ON "skc_consultation_themes"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MagazineIssue_issueNumber_key" ON "MagazineIssue"("issueNumber");

-- CreateIndex
CREATE UNIQUE INDEX "MagazineIssue_slug_key" ON "MagazineIssue"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "FellowshipApplication_referenceNumber_key" ON "FellowshipApplication"("referenceNumber");

-- CreateIndex
CREATE INDEX "_EntityTaxonomy_B_index" ON "_EntityTaxonomy"("B");

-- CreateIndex
CREATE INDEX "_EntityMedia_B_index" ON "_EntityMedia"("B");

-- CreateIndex
CREATE INDEX "_StoryMedia_B_index" ON "_StoryMedia"("B");

-- CreateIndex
CREATE INDEX "_SupportDocMedia_B_index" ON "_SupportDocMedia"("B");

-- CreateIndex
CREATE INDEX "_NominationMedia_B_index" ON "_NominationMedia"("B");

-- CreateIndex
CREATE INDEX "_ContributorMedia_B_index" ON "_ContributorMedia"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_publicationId_order_key" ON "Chapter"("publicationId", "order");

-- CreateIndex
CREATE INDEX "Publication_revision_idx" ON "Publication"("revision");

-- AddForeignKey
ALTER TABLE "CanonicalEntity" ADD CONSTRAINT "CanonicalEntity_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxonomyCategory" ADD CONSTRAINT "TaxonomyCategory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "TaxonomyCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityRelationship" ADD CONSTRAINT "EntityRelationship_sourceEntityId_fkey" FOREIGN KEY ("sourceEntityId") REFERENCES "CanonicalEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityRelationship" ADD CONSTRAINT "EntityRelationship_targetEntityId_fkey" FOREIGN KEY ("targetEntityId") REFERENCES "CanonicalEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityRelationship" ADD CONSTRAINT "EntityRelationship_sourceReferenceId_fkey" FOREIGN KEY ("sourceReferenceId") REFERENCES "SourceReference"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityRelationship" ADD CONSTRAINT "EntityRelationship_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SourceReference" ADD CONSTRAINT "SourceReference_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "CanonicalEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SourceReference" ADD CONSTRAINT "SourceReference_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRecord" ADD CONSTRAINT "VerificationRecord_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "CanonicalEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRecord" ADD CONSTRAINT "VerificationRecord_verifierId_fkey" FOREIGN KEY ("verifierId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowRecord" ADD CONSTRAINT "WorkflowRecord_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "CanonicalEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowRecord" ADD CONSTRAINT "WorkflowRecord_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Craft" ADD CONSTRAINT "Craft_canonicalEntityId_fkey" FOREIGN KEY ("canonicalEntityId") REFERENCES "CanonicalEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_canonicalEntityId_fkey" FOREIGN KEY ("canonicalEntityId") REFERENCES "CanonicalEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_canonicalEntityId_fkey" FOREIGN KEY ("canonicalEntityId") REFERENCES "CanonicalEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Technique" ADD CONSTRAINT "Technique_canonicalEntityId_fkey" FOREIGN KEY ("canonicalEntityId") REFERENCES "CanonicalEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Motif" ADD CONSTRAINT "Motif_canonicalEntityId_fkey" FOREIGN KEY ("canonicalEntityId") REFERENCES "CanonicalEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_canonicalEntityId_fkey" FOREIGN KEY ("canonicalEntityId") REFERENCES "CanonicalEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlossaryTerm" ADD CONSTRAINT "GlossaryTerm_canonicalEntityId_fkey" FOREIGN KEY ("canonicalEntityId") REFERENCES "CanonicalEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artisan" ADD CONSTRAINT "Artisan_canonicalEntityId_fkey" FOREIGN KEY ("canonicalEntityId") REFERENCES "CanonicalEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Studio" ADD CONSTRAINT "Studio_canonicalEntityId_fkey" FOREIGN KEY ("canonicalEntityId") REFERENCES "CanonicalEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_canonicalEntityId_fkey" FOREIGN KEY ("canonicalEntityId") REFERENCES "CanonicalEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchPublication" ADD CONSTRAINT "ResearchPublication_canonicalEntityId_fkey" FOREIGN KEY ("canonicalEntityId") REFERENCES "CanonicalEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HearingEvidence" ADD CONSTRAINT "HearingEvidence_hearingId_fkey" FOREIGN KEY ("hearingId") REFERENCES "SkcHearing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkcInstitutionRegistration" ADD CONSTRAINT "SkcInstitutionRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkcStakeholderRegistration" ADD CONSTRAINT "SkcStakeholderRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkcOfficialMessage" ADD CONSTRAINT "SkcOfficialMessage_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "SkcOfficialMessageCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkcOfficialMessage" ADD CONSTRAINT "SkcOfficialMessage_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "SkcOfficialMessageInvitation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkcOfficialMessageRevision" ADD CONSTRAINT "SkcOfficialMessageRevision_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "SkcOfficialMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkcOfficialMessageAuditLog" ADD CONSTRAINT "SkcOfficialMessageAuditLog_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "SkcOfficialMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkcHearing" ADD CONSTRAINT "SkcHearing_assessmentCycleId_fkey" FOREIGN KEY ("assessmentCycleId") REFERENCES "AssessmentCycle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkcHearing" ADD CONSTRAINT "SkcHearing_hearingTypeId_fkey" FOREIGN KEY ("hearingTypeId") REFERENCES "HearingType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkcHearing" ADD CONSTRAINT "SkcHearing_formatId_fkey" FOREIGN KEY ("formatId") REFERENCES "HearingFormat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HearingDistrict" ADD CONSTRAINT "HearingDistrict_hearingId_fkey" FOREIGN KEY ("hearingId") REFERENCES "SkcHearing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HearingDistrict" ADD CONSTRAINT "HearingDistrict_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HearingCraft" ADD CONSTRAINT "HearingCraft_hearingId_fkey" FOREIGN KEY ("hearingId") REFERENCES "SkcHearing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HearingCraft" ADD CONSTRAINT "HearingCraft_craftId_fkey" FOREIGN KEY ("craftId") REFERENCES "Craft"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HearingTopicAssignment" ADD CONSTRAINT "HearingTopicAssignment_hearingId_fkey" FOREIGN KEY ("hearingId") REFERENCES "SkcHearing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HearingTopicAssignment" ADD CONSTRAINT "HearingTopicAssignment_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "HearingTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkcHearingStakeholderCategory" ADD CONSTRAINT "SkcHearingStakeholderCategory_hearingId_fkey" FOREIGN KEY ("hearingId") REFERENCES "SkcHearing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkcHearingStakeholderCategory" ADD CONSTRAINT "SkcHearingStakeholderCategory_stakeholderCategoryId_fkey" FOREIGN KEY ("stakeholderCategoryId") REFERENCES "HearingStakeholderCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HearingRegistration" ADD CONSTRAINT "HearingRegistration_hearingId_fkey" FOREIGN KEY ("hearingId") REFERENCES "SkcHearing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HearingTestimony" ADD CONSTRAINT "HearingTestimony_hearingId_fkey" FOREIGN KEY ("hearingId") REFERENCES "SkcHearing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestimonyAttachment" ADD CONSTRAINT "TestimonyAttachment_testimonyId_fkey" FOREIGN KEY ("testimonyId") REFERENCES "HearingTestimony"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HearingSpeakerAssignment" ADD CONSTRAINT "HearingSpeakerAssignment_hearingId_fkey" FOREIGN KEY ("hearingId") REFERENCES "SkcHearing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HearingSpeakerAssignment" ADD CONSTRAINT "HearingSpeakerAssignment_speakerId_fkey" FOREIGN KEY ("speakerId") REFERENCES "Speaker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HearingDocument" ADD CONSTRAINT "HearingDocument_hearingId_fkey" FOREIGN KEY ("hearingId") REFERENCES "SkcHearing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriberDistrict" ADD CONSTRAINT "SubscriberDistrict_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "HearingNotificationSubscriber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriberDistrict" ADD CONSTRAINT "SubscriberDistrict_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriberCraft" ADD CONSTRAINT "SubscriberCraft_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "HearingNotificationSubscriber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriberCraft" ADD CONSTRAINT "SubscriberCraft_craftId_fkey" FOREIGN KEY ("craftId") REFERENCES "Craft"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriberTopic" ADD CONSTRAINT "SubscriberTopic_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "HearingNotificationSubscriber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriberTopic" ADD CONSTRAINT "SubscriberTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "HearingTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriberStakeholderCategory" ADD CONSTRAINT "SubscriberStakeholderCategory_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "HearingNotificationSubscriber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriberStakeholderCategory" ADD CONSTRAINT "SubscriberStakeholderCategory_stakeholderCategoryId_fkey" FOREIGN KEY ("stakeholderCategoryId") REFERENCES "HearingStakeholderCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HearingNotificationDelivery" ADD CONSTRAINT "HearingNotificationDelivery_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "HearingNotificationSubscriber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkcEvidenceAuditLog" ADD CONSTRAINT "SkcEvidenceAuditLog_evidenceId_fkey" FOREIGN KEY ("evidenceId") REFERENCES "SkcEvidence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DraftFinding" ADD CONSTRAINT "DraftFinding_assessmentCycleId_fkey" FOREIGN KEY ("assessmentCycleId") REFERENCES "AssessmentCycle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FindingEvidence" ADD CONSTRAINT "FindingEvidence_findingId_fkey" FOREIGN KEY ("findingId") REFERENCES "DraftFinding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FindingHearing" ADD CONSTRAINT "FindingHearing_findingId_fkey" FOREIGN KEY ("findingId") REFERENCES "DraftFinding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FindingHearing" ADD CONSTRAINT "FindingHearing_hearingId_fkey" FOREIGN KEY ("hearingId") REFERENCES "SkcHearing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FindingConsultation" ADD CONSTRAINT "FindingConsultation_findingId_fkey" FOREIGN KEY ("findingId") REFERENCES "DraftFinding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FindingValidationResponse" ADD CONSTRAINT "FindingValidationResponse_findingId_fkey" FOREIGN KEY ("findingId") REFERENCES "DraftFinding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FindingVersion" ADD CONSTRAINT "FindingVersion_findingId_fkey" FOREIGN KEY ("findingId") REFERENCES "DraftFinding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FindingAuditLog" ADD CONSTRAINT "FindingAuditLog_findingId_fkey" FOREIGN KEY ("findingId") REFERENCES "DraftFinding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeroSlide" ADD CONSTRAINT "HeroSlide_heroConfigurationId_fkey" FOREIGN KEY ("heroConfigurationId") REFERENCES "HeroConfiguration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeroRevision" ADD CONSTRAINT "HeroRevision_heroConfigurationId_fkey" FOREIGN KEY ("heroConfigurationId") REFERENCES "HeroConfiguration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeroAnalytics" ADD CONSTRAINT "HeroAnalytics_heroSlideId_fkey" FOREIGN KEY ("heroSlideId") REFERENCES "HeroSlide"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfficialMessageInvitation" ADD CONSTRAINT "OfficialMessageInvitation_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "OfficialMessageInvitationRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationEditorial" ADD CONSTRAINT "PublicationEditorial_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationResearch" ADD CONSTRAINT "PublicationResearch_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationMetadata" ADD CONSTRAINT "PublicationMetadata_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationReaderExperience" ADD CONSTRAINT "PublicationReaderExperience_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationDiscoverability" ADD CONSTRAINT "PublicationDiscoverability_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationEdition" ADD CONSTRAINT "PublicationEdition_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationWorkflowHistory" ADD CONSTRAINT "PublicationWorkflowHistory_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationContributor" ADD CONSTRAINT "PublicationContributor_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationRelation" ADD CONSTRAINT "PublicationRelation_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationRelation" ADD CONSTRAINT "PublicationRelation_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationEntityRelation" ADD CONSTRAINT "PublicationEntityRelation_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationAsset" ADD CONSTRAINT "PublicationAsset_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citation" ADD CONSTRAINT "Citation_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citation" ADD CONSTRAINT "Citation_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citation" ADD CONSTRAINT "Citation_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citation" ADD CONSTRAINT "Citation_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "ContentBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentBlock" ADD CONSTRAINT "ContentBlock_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skc_consultation_themes" ADD CONSTRAINT "skc_consultation_themes_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "skc_consultation_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skc_consultation_themes" ADD CONSTRAINT "skc_consultation_themes_assessmentCycleId_fkey" FOREIGN KEY ("assessmentCycleId") REFERENCES "AssessmentCycle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skc_hearing_theme_assignments" ADD CONSTRAINT "skc_hearing_theme_assignments_hearingId_fkey" FOREIGN KEY ("hearingId") REFERENCES "SkcHearing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skc_hearing_theme_assignments" ADD CONSTRAINT "skc_hearing_theme_assignments_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "skc_consultation_themes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterReview" ADD CONSTRAINT "ChapterReview_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterReview" ADD CONSTRAINT "ChapterReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewComment" ADD CONSTRAINT "ReviewComment_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "ChapterReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewComment" ADD CONSTRAINT "ReviewComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditorialAuditLog" ADD CONSTRAINT "EditorialAuditLog_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditorialAuditLog" ADD CONSTRAINT "EditorialAuditLog_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditorialAuditLog" ADD CONSTRAINT "EditorialAuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EntityTaxonomy" ADD CONSTRAINT "_EntityTaxonomy_A_fkey" FOREIGN KEY ("A") REFERENCES "CanonicalEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EntityTaxonomy" ADD CONSTRAINT "_EntityTaxonomy_B_fkey" FOREIGN KEY ("B") REFERENCES "TaxonomyCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EntityMedia" ADD CONSTRAINT "_EntityMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "CanonicalEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EntityMedia" ADD CONSTRAINT "_EntityMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StoryMedia" ADD CONSTRAINT "_StoryMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StoryMedia" ADD CONSTRAINT "_StoryMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "StorySubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SupportDocMedia" ADD CONSTRAINT "_SupportDocMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SupportDocMedia" ADD CONSTRAINT "_SupportDocMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "SupportDocumentation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NominationMedia" ADD CONSTRAINT "_NominationMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "ArtisanNomination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NominationMedia" ADD CONSTRAINT "_NominationMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContributorMedia" ADD CONSTRAINT "_ContributorMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "ContributorApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContributorMedia" ADD CONSTRAINT "_ContributorMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

