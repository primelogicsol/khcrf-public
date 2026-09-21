import { prisma } from './src/config/db.js';

async function checkCounts() {
  const c1 = await prisma.craftloreIntegrationEvent.count();
  const c2 = await prisma.evaluationSubmission.count({ where: { origin: 'CRAFTLORE' } });
  const c3 = await prisma.verificationSubmissionRevision.count({ where: { origin: 'CRAFTLORE' } });
  const c4 = await prisma.verificationFinding.count();

  console.log('--- DATABASE COUNTS AFTER 500 ---');
  console.log(`CraftloreIntegrationEvent: ${c1}`);
  console.log(`EvaluationSubmission (origin=CRAFTLORE): ${c2}`);
  console.log(`VerificationSubmissionRevision (origin=CRAFTLORE): ${c3}`);
  console.log(`VerificationFinding: ${c4}`);
}

checkCounts().catch(console.error).finally(() => prisma.$disconnect());
