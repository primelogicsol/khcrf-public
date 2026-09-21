import crypto from 'crypto';
import fetch from 'node-fetch';

const KHCRF_PORT = 4000;
const CRAFTLORE_TO_KHCRF_SECRET = process.env.CRAFTLORE_TO_KHCRF_SECRET || 'test_secret_for_craftlore';

async function delay(ms: number) {
    return new Promise(r => setTimeout(r, ms));
}

import { prisma } from './src/config/db.js';

async function runLoop() {
    console.log("--- STARTING FULL LOOP TEST ---");

    // ... (keep the webhook simulation)
    const eventId = "ae294af1-e76b-471d-985c-7d8edfe57123";
    const verificationRequestId = "VR-2026-497A2BED";
    
    const payload = {
        contract_version: "CKTRE-KHCRF-1.0",
        event_id: eventId,
        event_type: "VERIFICATION_REQUESTED",
        verification_request_id: verificationRequestId,
        entity_id: "ENT-1234",
        entity_type: "BUSINESS",
        revision: 1,
        snapshot_id: "snap_999",
        snapshot_sha256: "abcd1234hash",
        methodology_version: "PTS-v1.0",
        self_reported_pts: 42.5,
        factor_findings: [
            { factor_code: "CHILD_LABOUR_SAFEGUARDS", self_reported_value: "YES" },
            { factor_code: "FAIR_WAGES", self_reported_value: "YES" },
            { factor_code: "GROUND_PRESENCE", self_reported_value: "YES" },
            { factor_code: "AUTHENTICITY_PROVENANCE", self_reported_value: "YES" }
        ]
    };

    const rawBody = JSON.stringify(payload);
    const timestamp = Date.now().toString();
    const path = '/api/integrations/craftlore/verification-request';
    const payloadSha256 = crypto.createHash('sha256').update(rawBody).digest('hex');
    const message = `${timestamp}.${eventId}.POST.${path}.${payloadSha256}`;
    const signature = crypto.createHmac('sha256', CRAFTLORE_TO_KHCRF_SECRET).update(message).digest('hex');

    console.log("-> 1. Receiving Webhook from Craftlore...");
    let res = await fetch(`http://localhost:${KHCRF_PORT}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-craftlore-timestamp': timestamp,
            'x-craftlore-signature': signature
        },
        body: rawBody
    });
    console.log(`   Webhook HTTP status: ${res.status}`);
    const resBody = await res.json();
    console.log(`   Response:`, resBody);

    if (res.status !== 200) {
        console.error("Failed to receive webhook.");
        await prisma.$disconnect();
        return;
    }

    await delay(1000);

    const submission = await prisma.evaluationSubmission.findUnique({
        where: { trackingId: verificationRequestId },
        include: { verificationFindings: true }
    });

    if (!submission) {
        console.error("Submission not found in DB.");
        await prisma.$disconnect();
        return;
    }

    const id = submission.id;

    console.log("-> 2. Moving to UNDER_REVIEW");
    res = await fetch(`http://localhost:${KHCRF_PORT}/api/verification/${id}/start`, { method: 'POST' });
    console.log(`   Status: ${res.status}`);

    console.log("-> 3. Entering synthetic verified findings");
    for (const factor of ["CHILD_LABOUR_SAFEGUARDS", "FAIR_WAGES", "GROUND_PRESENCE", "AUTHENTICITY_PROVENANCE"]) {
        res = await fetch(`http://localhost:${KHCRF_PORT}/api/verification/${id}/factors/${factor}/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: "DOCUMENT_VERIFIED",
                verifiedValue: "VERIFIED_YES",
                confidence: 0.95,
                reviewerNotes: "Looks good"
            })
        });
        console.log(`   Factor ${factor} verified: ${res.status}`);
    }

    console.log("-> 4. Completing verification");
    res = await fetch(`http://localhost:${KHCRF_PORT}/api/verification/${id}/complete`, { method: 'POST' });
    console.log(`   Status: ${res.status}`);
    
    // Summary
    const updated = await prisma.evaluationSubmission.findUnique({
        where: { id },
        include: { verificationFindings: true }
    });

    console.log("--- TEST REPORT ---");
    console.log(`verification_request_id: ${updated?.trackingId}`);
    console.log(`KHCRF case status: ${updated?.caseStatus}`);
    console.log(`number of factors reviewed: 4`);
    console.log(`number verified: ${updated?.verificationFindings.filter(f => f.status === 'DOCUMENT_VERIFIED').length}`);
    console.log(`number partially verified: ${updated?.verificationFindings.filter(f => f.status === 'PARTIALLY_VERIFIED').length}`);
    console.log(`return HTTP status: Simulated 200 to Craftlore endpoint (check Craftlore log)`);

    await prisma.$disconnect();
}

runLoop().catch(e => { console.error(e); prisma.$disconnect(); });
