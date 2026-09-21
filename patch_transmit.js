const fs = require('fs');
let c = fs.readFileSync('backend/src/controllers/evaluationController.ts', 'utf8');

const newTransmit = `
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
                            evidenceReferenceCount: 1,
                            findingId: f.id
                        }))
                    }
                },
                include: { factors: true }
            });
        }

        const transmission = await prisma.verificationTransmission.create({
            data: {
                verifiedResultId: verifiedResult.id,
                destination: 'CRAFTLORE_CKTRE',
                status: 'PENDING'
            }
        });

        const eventId = transmission.id;
        
        const payload = {
            contract_version: "1.0",
            event_type: "VERIFICATION_COMPLETED",
            event_id: eventId,
            verification_request_id: verifiedResult.trackingId,
            revision: verifiedResult.verificationVersion,
            methodology_version: "PTS-v1.0",
            verified_factors: verifiedResult.factors.map(f => ({
                factor_code: f.factorCode,
                verification_status: f.findingStatus
            })),
            verification_status: "VERIFICATION_COMPLETED",
            confidence: 1.0,
            khcrf_entity: {
                sourceEntityId: verifiedResult.entityId,
                entityType: verifiedResult.entityType,
                name: evaluation.businessName,
                craft: verifiedResult.craftType
            }
        };

        const payloadStr = JSON.stringify(payload);
        const payloadSha256 = require('crypto').createHash('sha256').update(payloadStr).digest('hex');
        const timestamp = Date.now().toString();
        
        const CRAFTLORE_URL = process.env.CRAFTLORE_API_BASE_URL || 'http://127.0.0.1:5000';
        const path = '/api/cktre/integrations/khcrf/events';
        const method = 'POST';
        
        const SECRET = process.env.KHCRF_TO_CRAFTLORE_SECRET || 'test_secret_for_khcrf';
        const signatureBase = \`\${timestamp}.\${eventId}.\${method}.\${path}.\${payloadSha256}\`;
        const signature = require('crypto').createHmac('sha256', SECRET).update(signatureBase).digest('hex');

        try {
            const craftloreRes = await axios.post(\`\${CRAFTLORE_URL}\${path}\`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-khcrf-signature': signature,
                    'x-khcrf-timestamp': timestamp,
                    'x-khcrf-payload-sha256': payloadSha256
                }
            });
            
            await prisma.verificationTransmission.update({
                where: { id: transmission.id },
                data: {
                    status: 'ACKNOWLEDGED',
                    transmittedAt: new Date(),
                    externalReference: craftloreRes.data.importId
                }
            });

            return res.json({
                importId: craftloreRes.data.importId,
                status: craftloreRes.data.status,
                craftloreEntityId: craftloreRes.data.craftloreEntityId
            });
        } catch (apiErr: any) {
            console.error('Transmission failed:', apiErr.response?.data || apiErr.message);
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

const regex = /export const transmitToCraftlore = async \([\s\S]*?res\.status\(500\)\.json\(\{ error: 'Failed to transmit' \}\);\s*\}\s*};/;
c = c.replace(regex, newTransmit.trim());

fs.writeFileSync('backend/src/controllers/evaluationController.ts', c);
