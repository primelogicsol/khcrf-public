const fs = require('fs');
let c = fs.readFileSync('backend/src/controllers/integrationController.ts', 'utf8');

c += `
export const ingestKhcrfVerifiedResult = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        if (!payload || payload.source !== 'KHCRF') return res.status(400).json({ error: 'Invalid payload source' });

        const existing = await prisma.verificationSubmissionRevision.findFirst({ where: { snapshotId: payload.verificationResultId } });
        if (existing) {
            return res.status(200).json({
                success: true,
                importId: existing.id,
                sourceReference: payload.verificationReference,
                verificationVersion: payload.verificationVersion,
                entityMatchStatus: 'MATCHED',
                note: 'Idempotent success'
            });
        }

        const entityMatchStatus = payload.entity?.sourceEntityId ? 'MATCHED' : 'PENDING';
        
        const importId = 'cktre-import-' + Date.now();
        await prisma.verificationSubmissionRevision.create({
            data: {
                id: importId,
                submissionId: payload.verificationReference,
                revision: payload.verificationVersion,
                origin: 'KHCRF',
                snapshotId: payload.verificationResultId,
                answersSnapshot: payload.entity || {},
                factorSnapshot: payload.findings || [],
                evidenceManifest: {}
            }
        });

        return res.status(201).json({
            success: true,
            importId,
            sourceReference: payload.verificationReference,
            verificationVersion: payload.verificationVersion,
            entityMatchStatus
        });
    } catch (e) {
        console.error('Ingestion error', e);
        return res.status(500).json({ error: 'Internal ingestion error' });
    }
};
`;

fs.writeFileSync('backend/src/controllers/integrationController.ts', c);
console.log('Appended ingest endpoint');
