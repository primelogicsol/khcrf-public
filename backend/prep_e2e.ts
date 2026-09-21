import { prisma } from './src/config/db.ts';
import crypto from 'crypto';

const BUSINESS_FACTORS = [
  "CRAFT_QUALITY", "AUTHENTICITY_PROVENANCE", "FULFILLMENT", "BUYER_EXPERIENCE",
  "FAIR_WAGES", "CHILD_LABOUR_SAFEGUARDS", "WOMEN_EMPOWERMENT", "GROUND_PRESENCE",
  "TRANSPARENCY", "TECHNOLOGY", "DIGITAL_TRACEABILITY", "SUSTAINABILITY"
];

async function prepareE2E() {
  let evaluation = await prisma.evaluationSubmission.findFirst({
    where: { evaluationType: 'KHCRF_16_STEP' }
  });

  if (!evaluation) {
    console.log("No evaluation found");
    process.exit(1);
  }

  // Get a user ID to satisfy the foreign key, or use the evaluation's user
  const user = await prisma.user.findFirst();

  await prisma.evaluationSubmission.update({
    where: { id: evaluation.id },
    data: {
      caseStatus: 'VERIFICATION_COMPLETED',
      trackingId: 'KHCRF-VR-2026-915EC48E' // Re-use the entity we tested
    }
  });

  for (const factor of BUSINESS_FACTORS) {
    const existing = await prisma.verificationFinding.findFirst({
      where: { submissionId: evaluation.id, factorKey: factor }
    });
    if (!existing) {
      await prisma.verificationFinding.create({
        data: {
          id: crypto.randomUUID(),
          submissionId: evaluation.id,
          factorKey: factor,
          status: 'DOCUMENT_VERIFIED',
          reviewerId: user?.id || null,
          confidence: 1.0,
          revision: 1,
          updatedAt: new Date(),
          createdAt: new Date()
        }
      });
    } else {
      await prisma.verificationFinding.update({
        where: { id: existing.id },
        data: { status: 'DOCUMENT_VERIFIED', updatedAt: new Date() }
      });
    }
  }

  console.log("E2E Prep completed. Evaluation ID:", evaluation.id);
  process.exit(0);
}

prepareE2E();
