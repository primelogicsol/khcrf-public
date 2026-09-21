-- CreateEnum
CREATE TYPE "MasterArtisanPublicationStatus" AS ENUM ('DRAFT', 'REVIEW', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MasterArtisanAccessLevel" AS ENUM ('PUBLIC', 'REGISTERED_USERS', 'MEMBERS_ONLY');

-- CreateEnum
CREATE TYPE "MasterArtisanSeriesStatus" AS ENUM ('PLANNED', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MasterArtisanFeatureStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'ACTIVE', 'EXPIRED');

-- CreateTable
CREATE TABLE "MasterArtisanStory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "excerpt" TEXT,
    "bodyMarkdown" TEXT,
    "bodyJson" JSONB,
    "heroImage" TEXT,
    "contributorId" TEXT,
    "authorDisplayName" TEXT,
    "storyType" TEXT NOT NULL,
    "primaryCraft" TEXT NOT NULL,
    "publicationStatus" "MasterArtisanPublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "accessLevel" "MasterArtisanAccessLevel" NOT NULL DEFAULT 'PUBLIC',
    "publishedAt" TIMESTAMP(3),
    "readingMinutes" INTEGER,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "MasterArtisanStory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterArtisanSeries" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "coverImage" TEXT,
    "status" "MasterArtisanSeriesStatus" NOT NULL DEFAULT 'PLANNED',
    "accessLevel" "MasterArtisanAccessLevel" NOT NULL DEFAULT 'PUBLIC',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "MasterArtisanSeries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterArtisanSeriesStory" (
    "id" TEXT NOT NULL,
    "seriesId" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MasterArtisanSeriesStory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterArtisanIssueStory" (
    "id" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "isCoverStory" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MasterArtisanIssueStory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterArtisanFeature" (
    "id" TEXT NOT NULL,
    "artisanId" TEXT NOT NULL,
    "linkedStoryId" TEXT,
    "headline" TEXT,
    "summary" TEXT,
    "featureImage" TEXT,
    "status" "MasterArtisanFeatureStatus" NOT NULL DEFAULT 'DRAFT',
    "accessLevel" "MasterArtisanAccessLevel" NOT NULL DEFAULT 'PUBLIC',
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "MasterArtisanFeature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MasterArtisanStory_slug_key" ON "MasterArtisanStory"("slug");

-- CreateIndex
CREATE INDEX "MasterArtisanStory_publicationStatus_publishedAt_idx" ON "MasterArtisanStory"("publicationStatus", "publishedAt");

-- CreateIndex
CREATE INDEX "MasterArtisanStory_accessLevel_idx" ON "MasterArtisanStory"("accessLevel");

-- CreateIndex
CREATE INDEX "MasterArtisanStory_storyType_idx" ON "MasterArtisanStory"("storyType");

-- CreateIndex
CREATE INDEX "MasterArtisanStory_primaryCraft_idx" ON "MasterArtisanStory"("primaryCraft");

-- CreateIndex
CREATE INDEX "MasterArtisanStory_contributorId_idx" ON "MasterArtisanStory"("contributorId");

-- CreateIndex
CREATE UNIQUE INDEX "MasterArtisanSeries_slug_key" ON "MasterArtisanSeries"("slug");

-- CreateIndex
CREATE INDEX "MasterArtisanSeries_status_publishedAt_idx" ON "MasterArtisanSeries"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "MasterArtisanSeries_accessLevel_idx" ON "MasterArtisanSeries"("accessLevel");

-- CreateIndex
CREATE INDEX "MasterArtisanSeriesStory_seriesId_position_idx" ON "MasterArtisanSeriesStory"("seriesId", "position");

-- CreateIndex
CREATE INDEX "MasterArtisanSeriesStory_storyId_idx" ON "MasterArtisanSeriesStory"("storyId");

-- CreateIndex
CREATE UNIQUE INDEX "MasterArtisanSeriesStory_seriesId_storyId_key" ON "MasterArtisanSeriesStory"("seriesId", "storyId");

-- CreateIndex
CREATE INDEX "MasterArtisanIssueStory_issueId_position_idx" ON "MasterArtisanIssueStory"("issueId", "position");

-- CreateIndex
CREATE INDEX "MasterArtisanIssueStory_storyId_idx" ON "MasterArtisanIssueStory"("storyId");

-- CreateIndex
CREATE UNIQUE INDEX "MasterArtisanIssueStory_issueId_storyId_key" ON "MasterArtisanIssueStory"("issueId", "storyId");

-- CreateIndex
CREATE INDEX "MasterArtisanFeature_status_idx" ON "MasterArtisanFeature"("status");

-- CreateIndex
CREATE INDEX "MasterArtisanFeature_startsAt_idx" ON "MasterArtisanFeature"("startsAt");

-- CreateIndex
CREATE INDEX "MasterArtisanFeature_endsAt_idx" ON "MasterArtisanFeature"("endsAt");

-- AddForeignKey
ALTER TABLE "MasterArtisanStory" ADD CONSTRAINT "MasterArtisanStory_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterArtisanSeriesStory" ADD CONSTRAINT "MasterArtisanSeriesStory_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "MasterArtisanSeries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterArtisanSeriesStory" ADD CONSTRAINT "MasterArtisanSeriesStory_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "MasterArtisanStory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterArtisanIssueStory" ADD CONSTRAINT "MasterArtisanIssueStory_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "MagazineIssue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterArtisanIssueStory" ADD CONSTRAINT "MasterArtisanIssueStory_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "MasterArtisanStory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterArtisanFeature" ADD CONSTRAINT "MasterArtisanFeature_artisanId_fkey" FOREIGN KEY ("artisanId") REFERENCES "Artisan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterArtisanFeature" ADD CONSTRAINT "MasterArtisanFeature_linkedStoryId_fkey" FOREIGN KEY ("linkedStoryId") REFERENCES "MasterArtisanStory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
