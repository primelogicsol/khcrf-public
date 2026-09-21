import { prisma } from './src/config/db.js';

async function poll() {
  console.log("Polling for VR-2026-497A2BED...");
  let found = false;
  let attempts = 0;
  
  while (!found && attempts < 150) {
    const submission = await prisma.evaluationSubmission.findUnique({
      where: { trackingId: 'VR-2026-497A2BED' }
    });

    if (submission) {
      const findings = await prisma.verificationFinding.findMany({
        where: { submissionId: submission.id }
      });
      const revision = await prisma.verificationSubmissionRevision.findFirst({
        where: { submissionId: submission.id }
      });

      console.log('--- EVENT FOUND ---');
      console.log(`EvaluationSubmission: ${submission.trackingId}`);
      console.log(`Origin: ${submission.origin}`);
      console.log(`Case Status: ${submission.caseStatus}`);
      console.log(`Revision: ${submission.currentRevision}`);
      
      console.log(`Revision Snapshot ID: ${revision?.snapshotId}`);
      console.log(`Revision Snapshot Hash: ${revision?.snapshotSha256}`);
      
      console.log(`Findings Count: ${findings.length}`);
      findings.forEach(f => {
        console.log(`- ${f.factorKey}: status=${f.status}, selfReportedValue=${JSON.stringify(f.selfReportedValue)}, verifiedValue=${f.verifiedValue}`);
      });
      
      found = true;
      break;
    }
    
    attempts++;
    await new Promise(r => setTimeout(r, 2000));
  }
  
  if (!found) {
    console.log("Timed out waiting for event.");
  }
}

poll().catch(console.error).finally(() => prisma.$disconnect());
