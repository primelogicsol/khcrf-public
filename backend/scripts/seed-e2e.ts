import { MasterArtisanPublicationStatus, MasterArtisanAccessLevel, MasterArtisanSeriesStatus, MasterArtisanFeatureStatus, CanonicalEntityType, VisibilityStatus, LifecycleStatus } from '@prisma/client';
import { prisma } from '../src/config/db';

async function runE2E() {
  console.log("Starting E2E seed and verification...");

  // Cleanup existing E2E data
  await prisma.masterArtisanFeature.deleteMany({ where: { headline: 'E2E Featured Artisan' } });
  await prisma.masterArtisanSeriesStory.deleteMany({ where: { story: { slug: 'e2e-published-story' } } });
  await prisma.masterArtisanSeries.deleteMany({ where: { slug: 'e2e-editorial-series' } });
  await prisma.masterArtisanIssueStory.deleteMany({ where: { story: { slug: 'e2e-published-story' } } });
  await prisma.magazineIssue.deleteMany({ where: { slug: 'e2e-magazine-issue' } });
  await prisma.masterArtisanStory.deleteMany({ where: { slug: 'e2e-published-story' } });
  await prisma.artisan.deleteMany({ where: { canonicalEntity: { slug: 'e2e-artisan-entity' } } });
  await prisma.canonicalEntity.deleteMany({ where: { slug: 'e2e-artisan-entity' } });
  console.log("Cleaned up existing E2E records.");

  // 1. Create a published story
  const story = await prisma.masterArtisanStory.create({
    data: {
      slug: 'e2e-published-story',
      title: 'E2E Published Story',
      subtitle: 'Testing the end-to-end workflow',
      excerpt: 'This is a test story for the e2e workflow.',
      storyType: 'Article',
      primaryCraft: 'Testing',
      publicationStatus: MasterArtisanPublicationStatus.PUBLISHED,
      accessLevel: MasterArtisanAccessLevel.PUBLIC,
      publishedAt: new Date(),
    }
  });
  console.log("Created published story:", story.id);

  // 2. Create an editorial series containing that story
  const series = await prisma.masterArtisanSeries.create({
    data: {
      slug: 'e2e-editorial-series',
      title: 'E2E Editorial Series',
      status: MasterArtisanSeriesStatus.ACTIVE,
      accessLevel: MasterArtisanAccessLevel.PUBLIC,
      publishedAt: new Date(),
      stories: {
        create: [
          {
            storyId: story.id,
            position: 1
          }
        ]
      }
    }
  });
  console.log("Created series and series-story assignment:", series.id);

  // 3. Create a featured artisan
  const canonicalEntity = await prisma.canonicalEntity.create({
    data: {
      slug: 'e2e-artisan-entity',
      title: 'E2E Artisan Entity',
      entityType: CanonicalEntityType.HUMAN_OBJECT,
      visibility: VisibilityStatus.PUBLIC,
      lifecycle: LifecycleStatus.PUBLISHED
    }
  });

  const artisan = await prisma.artisan.create({
    data: {
      canonicalEntityId: canonicalEntity.id,
      activeRegion: 'Test Region',
      biography: 'A test artisan for e2e.',
    }
  });
  console.log("Created artisan:", artisan.id);

  const feature = await prisma.masterArtisanFeature.create({
    data: {
      artisanId: artisan.id,
      headline: 'E2E Featured Artisan',
      status: MasterArtisanFeatureStatus.ACTIVE,
      accessLevel: MasterArtisanAccessLevel.PUBLIC,
      startsAt: new Date(Date.now() - 100000),
      endsAt: new Date(Date.now() + 1000000),
      linkedStoryId: story.id
    }
  });
  console.log("Created active featured artisan:", feature.id);

  // 4. Create a magazine issue assignment
  const issue = await prisma.magazineIssue.create({
    data: {
      issueNumber: '999',
      title: 'E2E Magazine Issue',
      slug: 'e2e-magazine-issue',
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      publishedAt: new Date(),
      masterArtisanStories: {
        create: [
          {
            storyId: story.id,
            position: 1,
            isCoverStory: true
          }
        ]
      }
    }
  });
  console.log("Created published magazine issue with cover-story assignment:", issue.id);

  console.log("E2E Seed complete.");
}

runE2E().catch((e) => {
  console.error("E2E Seed failed:", e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
