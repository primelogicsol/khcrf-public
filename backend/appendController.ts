import fs from 'fs';
import path from 'path';

export const downloadEvidence = async (req: any, res: any) => {
    try {
        const { id, evidenceId } = req.params;
        const evidence = await prisma.verificationEvidence.findUnique({
            where: { id: evidenceId }
        });

        if (!evidence || evidence.submissionId !== id) {
            return res.status(404).json({ message: 'Evidence not found' });
        }

        if (evidence.transferStatus !== 'HASH_VERIFIED' || !evidence.integrityVerified) {
            return res.status(400).json({ message: 'Evidence is not verified or still retrieving' });
        }

        const storagePath = path.join(__dirname, '../../storage/evidence', evidence.storageKey);
        
        if (!fs.existsSync(storagePath)) {
            return res.status(404).json({ message: 'Physical file missing from storage' });
        }

        res.set({
            'Content-Type': evidence.mimeType,
            'Content-Length': evidence.sizeBytes,
            'Content-Disposition': `inline; filename="${evidence.originalFilename}"`
        });

        fs.createReadStream(storagePath).pipe(res);
    } catch (e: any) {
        res.status(500).json({ message: e.message });
    }
};
