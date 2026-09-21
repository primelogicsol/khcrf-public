import { retrieveEvidence } from './src/services/evidenceRetrieval.js';
import { prisma } from './src/config/db.js';

async function run() {
    const trackingId = 'VR-2026-F1C46A2C'; // From Craftlore's test outbox
    const revision = 1;

    // Craftlore already created the assessment on its side via testEvidenceTransfer.ts.
    // It is in Craftlore's DB. But wait, did it send the webhook to KHCRF?
    // No, testEvidenceTransfer.ts didn't fire the webhook to KHCRF port 4000. It just saved to Outbox.
    // I will mock the VerificationEvidence directly in KHCRF DB to match what testEvidenceTransfer created.

    const evidenceId = '454da0a0-f5c2-43a1-a0de-9aebdaf051d1';
    
    // Create dummy evaluation submission in KHCRF
    let sub = await prisma.evaluationSubmission.findUnique({ where: { trackingId } });
    if (!sub) {
        sub = await prisma.evaluationSubmission.create({
            data: {
                trackingId,
                entityType: 'BUSINESS',
                caseStatus: 'RECEIVED',
                origin: 'CRAFTLORE',
                currentRevision: 1
            }
        });
    }

    await prisma.verificationEvidence.create({
        data: {
            submissionId: sub.id,
            revision: 1,
            evidenceId: evidenceId,
            factorCode: 'CHILD_LABOUR_SAFEGUARDS',
            originalFilename: 'harmless_test_doc.pdf',
            mimeType: 'application/pdf',
            sizeBytes: 25,
            expectedSha256: '8aeee2ed1c42b24ca6bf9d31f00dbcde72b33ce02be56e83bcbf3687cbb1045b',
            storageKey: 'khcrf-test-storage-key-1234.pdf'
        }
    });

    console.log("Starting retrieval...");
    await retrieveEvidence(sub.id, 1, trackingId);
    
    const verify = await prisma.verificationEvidence.findFirst({
        where: { evidenceId }
    });
    
    console.log("Final Record:");
    console.log(verify);
}
run().finally(() => prisma.$disconnect());
