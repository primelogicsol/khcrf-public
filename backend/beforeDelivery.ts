import { prisma } from './src/config/db.js';

async function reportCounts() {
  const events = await prisma.craftloreIntegrationEvent.count();
  const cases = await prisma.evaluationSubmission.count({ where: { origin: 'CRAFTLORE' }});
  const revisions = await prisma.verificationSubmissionRevision.count({ where: { origin: 'CRAFTLORE' }});

  console.log(`CraftloreIntegrationEvent: ${events}`);
  console.log(`EvaluationSubmission (origin=CRAFTLORE): ${cases}`);
  console.log(`VerificationSubmissionRevision (origin=CRAFTLORE): ${revisions}`);
}

reportCounts().catch(console.error).finally(() => prisma.$disconnect());
