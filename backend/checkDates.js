const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const activities = await prisma.skcHearing.findMany({
    where: {
      slug: {
        in: [
          'assessment-launch---internal-briefing-2026',
          'stakeholder-registry-activation---approvals-2026',
          'registration-portal---outreach-launch-2026',
          'hearing-schedule-finalization-2026',
          'venue-confirmations---safety-inspections-2026'
        ]
      }
    }
  });

  activities.forEach(a => {
    console.log(`Slug: ${a.slug}`);
    console.log(`  scheduledDate: ${a.scheduledDate}`);
    console.log(`  startAt: ${a.startAt}`);
    console.log(`  date: ${a.date}`);
    console.log(`  hearingStartsAt: ${a.hearingStartsAt}`);
    console.log(`  completedAt: ${a.completedAt}`);
    console.log(`  status: ${a.status}`);
  });
}

check().catch(console.error).finally(() => prisma.$disconnect());
