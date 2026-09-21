const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const drafts = await prisma.evaluationSubmission.findMany({
    where: {
      caseStatus: 'DRAFT',
      evaluationType: 'KHCRF_16_STEP'
    },
    orderBy: { createdAt: 'desc' },
    take: 3
  });
  
  console.log("Found drafts:", drafts.length);
  if (drafts.length > 0) {
    console.log("Latest Draft ID:", drafts[0].id);
    console.log("Tracking ID:", drafts[0].trackingId);
    console.log("Case Status:", drafts[0].caseStatus);
    console.log("Type:", drafts[0].evaluationType);
    console.log("Entity Type:", drafts[0].entityType);
    console.log("Craft Type:", drafts[0].craftType);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
