import { prisma } from './src/config/db';

async function run() {
  console.log("Simulating Step 15 Database Proofs...\n");
  
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
       data: { email: `test-${Date.now()}@example.com`, name: 'Test User', password: 'abc' }
    });
  }
  
  // 1. Create a draft as if POST /evaluation happened
  const draft = await prisma.evaluationSubmission.create({
    data: {
      evaluationType: 'KHCRF_16_STEP',
      caseStatus: 'DRAFT',
      trackingId: `VR-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      craftType: 'PASHMINA',
      answers: { entityType: 'BUSINESS', roleInValueChain: 'MANUFACTURER' },
      score: 0,
      user: { connect: { id: user.id } }
    }
  });
  
  console.log("1. DRAFT CREATED (Simulation of Steps 1-14)");
  console.log("   EvaluationSubmission.id:", draft.id);
  console.log("   trackingId:", draft.trackingId);
  console.log("   caseStatus:", draft.caseStatus);
  console.log("   evaluationType:", draft.evaluationType);
  
  // 2. Upload Document 1 (Authenticity)
  const ev1 = await prisma.evaluationEvidence.create({
    data: {
      evaluationId: draft.id,
      originalFilename: 'authenticity_proof.pdf',
      mimeType: 'application/pdf',
      fileSize: 2048,
      storageKey: 'test/auth.pdf',
      factors: {
        create: [
          { factorCode: 'AUTHENTICITY_PROVENANCE' }
        ]
      }
    }
  });
  
  console.log("\n2. UPLOAD 1 (Authenticity)");
  console.log("   Evidence ID:", ev1.id);
  console.log("   Mapping Created: AUTHENTICITY_PROVENANCE");
  
  // 3. Upload Document 2 (Child Labour)
  const ev2 = await prisma.evaluationEvidence.create({
    data: {
      evaluationId: draft.id,
      originalFilename: 'child_labour_policy.pdf',
      mimeType: 'application/pdf',
      fileSize: 4096,
      storageKey: 'test/child.pdf',
      factors: {
        create: [
          { factorCode: 'CHILD_LABOUR_SAFEGUARDS' }
        ]
      }
    }
  });
  
  console.log("\n3. UPLOAD 2 (Child Labour)");
  console.log("   Evidence ID:", ev2.id);
  console.log("   Mapping Created: CHILD_LABOUR_SAFEGUARDS");
  
  // 4. Verification Proof
  const proof = await prisma.evaluationEvidence.findMany({
    where: { evaluationId: draft.id },
    include: { factors: true },
    orderBy: { originalFilename: 'asc' }
  });
  
  console.log("\n4. DATABASE PROOF (Evidence Tree)");
  for (const p of proof) {
    console.log(`\nEvidence Document: ${p.originalFilename} (${p.fileSize} bytes)`);
    for (const f of p.factors) {
      console.log(`└── ${f.factorCode}`);
    }
  }
  
  // 5. Delete Document 1
  await prisma.evaluationEvidenceFactor.deleteMany({
    where: { evidenceId: ev1.id }
  });
  await prisma.evaluationEvidence.delete({
    where: { id: ev1.id }
  });
  
  console.log("\n5. DELETE UPLOAD 1");
  console.log("   Document 1 and its factor mappings deleted.");
  
  // 6. Final State Proof
  const finalProof = await prisma.evaluationEvidence.findMany({
    where: { evaluationId: draft.id },
    include: { factors: true }
  });
  
  console.log("\n6. FINAL STATE (After Delete)");
  for (const p of finalProof) {
    console.log(`\nEvidence Document: ${p.originalFilename}`);
    for (const f of p.factors) {
      console.log(`└── ${f.factorCode}`);
    }
  }
  
  // Clean up remaining
  await prisma.evaluationEvidenceFactor.deleteMany({
    where: { evidenceId: ev2.id }
  });
  await prisma.evaluationEvidence.delete({
    where: { id: ev2.id }
  });
  await prisma.evaluationSubmission.delete({
    where: { id: draft.id }
  });
}

run().catch(console.error).finally(() => prisma.$disconnect());
