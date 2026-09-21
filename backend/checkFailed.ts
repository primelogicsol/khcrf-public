import { prisma } from './src/config/db.js';

async function checkFailedEvent() {
  const c1 = await prisma.evaluationSubmission.count({ where: { trackingId: 'KHCRF-VR-2026-02509CCD' } });
  const c2 = await prisma.verificationSubmissionRevision.count({ where: { origin: 'CRAFTLORE' } });
  const c3 = await prisma.verificationFinding.count();

  console.log('--- DATABASE COUNTS AFTER REJECTED DELIVERY ---');
  console.log(`EvaluationSubmission (trackingId=KHCRF-VR-2026-02509CCD): ${c1}`);
  console.log(`VerificationSubmissionRevision: ${c2}`);
  console.log(`VerificationFinding: ${c3}`);
}

checkFailedEvent().catch(console.error).finally(() => prisma.$disconnect());
