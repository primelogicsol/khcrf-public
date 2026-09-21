import { prisma } from './src/config/db.js';
import { handleCraftloreWebhook } from './src/controllers/integrationController.js';
import crypto from 'crypto';

const CRAFTLORE_TO_KHCRF_SECRET = process.env.CRAFTLORE_TO_KHCRF_SECRET || 'test_secret_for_craftlore';

const mockReqRes = (body: any, timestamp: string, eventId: string, method: string, path: string, secret = CRAFTLORE_TO_KHCRF_SECRET, modifyAfterSign?: (req: any) => void) => {
  const rawBody = Buffer.from(JSON.stringify(body), 'utf8');
  const payloadSha256 = crypto.createHash('sha256').update(rawBody).digest('hex');
  const message = `${timestamp}.${eventId}.${method}.${path}.${payloadSha256}`;
  const signature = crypto.createHmac('sha256', secret).update(message).digest('hex');

  const req = {
    method,
    originalUrl: path,
    rawBody,
    headers: {
      'x-craftlore-signature': signature,
      'x-craftlore-timestamp': timestamp
    }
  } as any;

  if (modifyAfterSign) {
    modifyAfterSign(req);
  }

  const res = {
    statusCode: 0,
    data: null,
    status: function (code: number) {
      this.statusCode = code;
      return this;
    },
    json: function (data: any) {
      this.data = data;
      return this;
    }
  } as any;
  return { req, res };
};

async function runTests() {
  console.log('--- PHASE 3: CANONICAL CONTRACT TESTS ---');

  const timestamp = Date.now().toString();
  const method = 'POST';
  const path = '/api/integrations/craftlore/verification-request';

  let eventId = crypto.randomUUID();
  let basePayload = {
    event_id: eventId,
    event_type: 'VERIFICATION_REQUESTED',
    verification_request_id: 'VR-2026-F9A3B2',
    entity_id: 'ENT-999',
    entity_type: 'BUSINESS',
    revision: 1,
    snapshot_id: 'snap_123',
    snapshot_sha256: 'abc...',
    self_reported_pts: 85.5,
    methodology_version: 'PTS-v1.0',
    contract_version: 'CKTRE-KHCRF-1.0',
    factor_findings: [
      { factor_code: 'FAIR_WAGES', self_reported_value: "YES" },
      { factor_code: 'GROUND_PRESENCE', self_reported_value: "YES" },
      { factor_code: 'CHILD_LABOUR_SAFEGUARDS', self_reported_value: "YES" },
      { factor_code: 'AUTHENTICITY_PROVENANCE', self_reported_value: "YES" }
    ]
  };

  const expect = async (name: string, p: any, ev: string, ts: string, m: string, ph: string, expCode: number) => {
    const { req, res } = mockReqRes(p, ts, ev, m, ph, CRAFTLORE_TO_KHCRF_SECRET);
    await handleCraftloreWebhook(req, res);
    const pass = res.statusCode === expCode;
    console.log(`${pass ? '✅' : '❌'} ${name} (Expected ${expCode}, Got ${res.statusCode})`);
    if (!pass) console.log('   Response:', res.data);
  };

  // 1. Array accepted
  await expect('factor_findings array accepted', basePayload, eventId, timestamp, method, path, 200);

  // 2. Object rejected
  const objPayload = { ...basePayload, event_id: crypto.randomUUID(), factor_findings: { FAIR_WAGES: "YES" } };
  await expect('factor_findings object/dictionary rejected', objPayload, objPayload.event_id, timestamp, method, path, 400);

  // 3. Genuine unknown factor
  const badFactorPayload = { ...basePayload, event_id: crypto.randomUUID(), factor_findings: [{ factor_code: 'BOGUS_FACTOR', self_reported_value: 'NO' }] };
  await expect('genuinely unknown BUSINESS factor rejected', badFactorPayload, badFactorPayload.event_id, timestamp, method, path, 400);

  // 4. Verify Database Values
  const findings = await prisma.verificationFinding.findMany({ where: { submissionId: { not: '' } } });
  
  const hasFairWages = findings.some(f => f.factorKey === 'FAIR_WAGES');
  const hasGroundPresence = findings.some(f => f.factorKey === 'GROUND_PRESENCE');
  const hasChildLabour = findings.some(f => f.factorKey === 'CHILD_LABOUR_SAFEGUARDS');
  const hasAuthenticity = findings.some(f => f.factorKey === 'AUTHENTICITY_PROVENANCE');
  
  console.log(`${hasFairWages ? '✅' : '❌'} BUSINESS + FAIR_WAGES accepted`);
  console.log(`${hasGroundPresence ? '✅' : '❌'} BUSINESS + GROUND_PRESENCE accepted`);
  console.log(`${hasChildLabour ? '✅' : '❌'} BUSINESS + CHILD_LABOUR_SAFEGUARDS accepted`);
  console.log(`${hasAuthenticity ? '✅' : '❌'} BUSINESS + AUTHENTICITY_PROVENANCE accepted`);

  const verifiedIsNull = findings.every(f => f.verifiedValue === null);
  const statusIsSelf = findings.every(f => f.status === 'SELF_REPORTED');
  console.log(`${verifiedIsNull && statusIsSelf ? '✅' : '❌'} verifiedValue remains NULL, status remains SELF_REPORTED`);

}

runTests().catch(console.error).finally(() => prisma.$disconnect());
