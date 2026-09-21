-- AlterTable
ALTER TABLE "MagazineIssue" ADD COLUMN     "heroEyebrow" TEXT,
ADD COLUMN     "heroFooterLine" TEXT,
ADD COLUMN     "heroKicker" TEXT,
ADD COLUMN     "heroOverlayStrength" TEXT DEFAULT 'MEDIUM',
ADD COLUMN     "heroTextPosition" TEXT DEFAULT 'BOTTOM_LEFT',
ADD COLUMN     "publicationMasthead" TEXT;

