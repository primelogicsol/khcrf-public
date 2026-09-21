const fs = require('fs');
let c = fs.readFileSync('src/controllers/evaluationController.ts', 'utf8');
c += `
export const getEvaluationEvidenceFile = async (req: any, res: any) => {
    try {
        const { evaluationId, evidenceId } = req.params;
        const userId = req.user.userId;
        // In my current setup, Prisma is imported at the top.
        const draft = await require('../config/db.js').prisma.evaluationSubmission.findUnique({ where: { id: evaluationId } });
        if (!draft) return res.status(404).json({ error: 'Not found' });
        if (draft.userId !== userId && !req.user.isAdmin) return res.status(403).json({ error: 'Forbidden' });
        const evidence = await require('../config/db.js').prisma.evaluationEvidence.findUnique({ where: { id: evidenceId } });
        if (!evidence || evidence.evaluationId !== evaluationId) return res.status(404).json({ error: 'Not found' });
        const filePath = require('path').join(process.cwd(), 'secure_uploads', evidence.storageKey);
        if (!require('fs').existsSync(filePath)) return res.status(404).json({ error: 'File not found on disk' });
        res.setHeader('Content-Disposition', 'inline; filename="' + evidence.originalFilename + '"');
        require('fs').createReadStream(filePath).pipe(res);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
};
`;
fs.writeFileSync('src/controllers/evaluationController.ts', c);
