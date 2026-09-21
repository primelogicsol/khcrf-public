const fs = require('fs');
let c = fs.readFileSync('backend/src/controllers/evaluationController.ts', 'utf8');

if (!c.includes('import axios')) {
    c = 'import axios from "axios";\n' + c;
}

c += `
export const transmitToCraftlore = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const evaluation = await prisma.evaluationSubmission.findUnique({
            where: { id },
            include: { VerificationFinding: true }
        });

        if (!evaluation) return res.status(404).json({ error: 'Not found' });
        if (evaluation.evaluationType !== 'KHCRF_16_STEP') return res.status(400).json({ error: 'Invalid type' });
        if (evaluation.caseStatus !== 'VERIFICATION_COMPLETED') return res.status(409).json({ error: 'Must be VERIFICATION_COMPLETED' });

        // 1. Create/get KHCRFVerifiedResult (Version 1)
        let verifiedResult = await prisma.kHCRFVerifiedResult.findFirst({
            where: { evaluationId: id },
            orderBy: { verificationVersion: 'desc' },
            include: { factors: true }
        });

        if (!verifiedResult) {
            verifiedResult = await prisma.kHCRFVerifiedResult.create({
                data: {
                    evaluationId: id,
                    trackingId: evaluation.trackingId || id,
                    entityId: evaluation.userId,
                    entityType: evaluation.entityType || 'BUSINESS',
                    craftType: evaluation.craftType || 'Pashmina',
                    verificationVersion: 1,
                    factors: {
                        create: evaluation.VerificationFinding.map(f => ({
                            factorCode: f.factorKey,
                            findingStatus: f.status,
                            evidenceReferenceCount: 1, // simplified
                            findingId: f.id
                        }))
                    }
                },
                include: { factors: true }
            });
        }

        // 2. Create Transmission Record
        const transmission = await prisma.verificationTransmission.create({
            data: {
                verifiedResultId: verifiedResult.id,
                destination: 'CRAFTLORE_CKTRE',
                status: 'PENDING'
            }
        });

        // 3. Send to Craftlore API (idempotent POST)
        const payload = {
            source: "KHCRF",
            verificationReference: verifiedResult.trackingId,
            verificationResultId: verifiedResult.id,
            verificationVersion: verifiedResult.verificationVersion,
            verifiedAt: verifiedResult.verifiedAt,
            entity: {
                sourceEntityId: verifiedResult.entityId,
                entityType: verifiedResult.entityType,
                name: evaluation.businessName,
                craft: verifiedResult.craftType
            },
            findings: verifiedResult.factors.map(f => ({
                factorCode: f.factorCode,
                findingStatus: f.findingStatus
            }))
        };

        try {
            // Using localhost:4000 (itself) to simulate inter-service call
            const port = process.env.PORT || 4000;
            const craftloreRes = await axios.post(\`http://localhost:\${port}/api/cktre/integrations/khcrf/verified-results\`, payload);
            
            await prisma.verificationTransmission.update({
                where: { id: transmission.id },
                data: {
                    status: 'ACKNOWLEDGED',
                    transmittedAt: new Date(),
                    externalReference: craftloreRes.data.importId
                }
            });

            return res.json(craftloreRes.data);
        } catch (apiErr: any) {
            console.error('Transmission failed:', apiErr.message);
            await prisma.verificationTransmission.update({
                where: { id: transmission.id },
                data: {
                    status: 'FAILED',
                    lastError: apiErr.message,
                    attemptCount: { increment: 1 }
                }
            });
            return res.status(502).json({ error: 'Transmission failed', detail: apiErr.message });
        }
    } catch (error) {
        console.error('Error transmitting:', error);
        res.status(500).json({ error: 'Failed to transmit' });
    }
};
`;

fs.writeFileSync('backend/src/controllers/evaluationController.ts', c);
console.log('Appended transmit endpoint');
