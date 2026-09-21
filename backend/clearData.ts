import { prisma } from './src/config/db.js';

async function clearData() {
  await prisma.craftloreIntegrationEvent.deleteMany({});
  await prisma.verificationFinding.deleteMany({});
  await prisma.verificationSubmissionRevision.deleteMany({});
  await prisma.evaluationSubmission.deleteMany({ where: { origin: 'CRAFTLORE' } });
  console.log("Cleared test data.");
  
  const events = await prisma.craftloreIntegrationEvent.count();
  const cases = await prisma.evaluationSubmission.count({ where: { origin: 'CRAFTLORE' }});
  const revisions = await prisma.verificationSubmissionRevision.count({ where: { origin: 'CRAFTLORE' }});

  console.log(`CraftloreIntegrationEvent: ${events}`);
  console.log(`EvaluationSubmission (origin=CRAFTLORE): ${cases}`);
  console.log(`VerificationSubmissionRevision (origin=CRAFTLORE): ${revisions}`);
}

clearData().catch(console.error).finally(() => prisma.$disconnect());
