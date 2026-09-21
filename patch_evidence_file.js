const fs = require('fs');
let c = fs.readFileSync('backend/src/controllers/evaluationController.ts', 'utf8');

c += `
export const getEvaluationEvidenceFile = async (req: any, res: any) => {
    try {
        const { evaluationId, evidenceId } = req.params;
        const evidence = await prisma.evaluationEvidence.findUnique({
            where: { id: evidenceId },
            include: { evaluation: true }
        });
        if (!evidence || evidence.evaluationId !== evaluationId) return res.status(404).json({ error: 'Not found' });
        const filePath = require('path').join(process.cwd(), 'secure_uploads', evidence.storageKey);
        if (!require('fs').existsSync(filePath)) return res.status(404).json({ error: 'File not found on disk' });
        res.sendFile(filePath);
    } catch(e) {
        res.status(500).json({ error: 'Failed to download file' });
    }
};
`;

fs.writeFileSync('backend/src/controllers/evaluationController.ts', c);
