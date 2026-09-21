import { prisma } from '../config/db.js';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const CRAFTLORE_URL = process.env.CRAFTLORE_URL || 'http://localhost:5000';
const SECRET = process.env.KHCRF_TO_CRAFTLORE_SECRET || 'test_secret_for_khcrf';
const STORAGE_DIR = path.join(__dirname, '../../storage/evidence');

export async function retrieveEvidence(submissionId: string, revision: number, verificationRequestId: string) {
    if (!fs.existsSync(STORAGE_DIR)) {
        fs.mkdirSync(STORAGE_DIR, { recursive: true });
    }

    const evidences = await prisma.verificationEvidence.findMany({
        where: { submissionId, revision, transferStatus: 'PENDING' }
    });

    for (const ev of evidences) {
        await prisma.verificationEvidence.update({
            where: { id: ev.id },
            data: { transferStatus: 'RETRIEVING' }
        });

        try {
            const url = `${CRAFTLORE_URL}/api/cktre/integrations/khcrf/verifications/${verificationRequestId}/revisions/${revision}/evidence/${ev.evidenceId}`;
            const timestamp = Date.now().toString();
            const signature = crypto.createHmac('sha256', SECRET)
                .update(`${timestamp}.GET./api/cktre/integrations/khcrf/verifications/${verificationRequestId}/revisions/${revision}/evidence/${ev.evidenceId}`)
                .digest('hex');

            const response = await axios({
                method: 'GET',
                url,
                responseType: 'stream',
                headers: {
                    'x-khcrf-signature': signature,
                    'x-khcrf-timestamp': timestamp
                }
            });

            const storagePath = path.join(STORAGE_DIR, ev.storageKey);
            const writer = fs.createWriteStream(storagePath);
            const hash = crypto.createHash('sha256');

            response.data.on('data', (chunk: Buffer) => {
                hash.update(chunk);
            });

            await new Promise((resolve, reject) => {
                response.data.pipe(writer);
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            const receivedSha256 = hash.digest('hex');

            if (receivedSha256 === ev.expectedSha256) {
                await prisma.verificationEvidence.update({
                    where: { id: ev.id },
                    data: {
                        receivedSha256,
                        transferStatus: 'HASH_VERIFIED',
                        integrityVerified: true,
                        receivedAt: new Date()
                    }
                });
            } else {
                // Delete corrupt copy
                fs.unlinkSync(storagePath);
                await prisma.verificationEvidence.update({
                    where: { id: ev.id },
                    data: {
                        receivedSha256,
                        transferStatus: 'FAILED',
                        integrityVerified: false
                    }
                });
            }
        } catch (e) {
            console.error(`Failed to retrieve evidence ${ev.evidenceId}`, e);
            await prisma.verificationEvidence.update({
                where: { id: ev.id },
                data: { transferStatus: 'FAILED', integrityVerified: false }
            });
        }
    }
}
