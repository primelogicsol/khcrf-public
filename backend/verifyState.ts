import { prisma } from './src/config/db.js';

async function verifyState() {
  const c1 = await prisma.evaluationSubmission.count({ where: { trackingId: 'VR-2026-497A2BED' } });
  const c2 = await prisma.verificationSubmissionRevision.count({ where: { origin: 'CRAFTLORE' } }); // Or maybe specific to tracking ID, but since it's wiped it's 0 anyway
  const c3 = await prisma.verificationFinding.count();
  const c4 = await prisma.craftloreIntegrationEvent.count({ where: { eventId: 'ae294af1-e76b-471d-985c-7d8edfe57123' } });

  console.log('--- CLEAN STATE CHECK ---');
  console.log(`EvaluationSubmission: ${c1}`);
  console.log(`VerificationSubmissionRevision: ${c2}`);
  console.log(`VerificationFinding: ${c3}`);
  console.log(`CraftloreIntegrationEvent: ${c4}`);
}

verifyState().catch(console.error).finally(() => prisma.$disconnect());
