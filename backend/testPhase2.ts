import { prisma } from './src/config/db.js';
import { createEvaluation, updateEvaluation, submitEvaluationDraft } from './src/controllers/evaluationController.js';

const mockReqRes = (body: any, userId = 'test-user') => {
  const req = { body, params: {}, user: { userId } } as any;
  const res = {
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
  await prisma.user.upsert({
    where: { id: 'test-user' },
    update: {},
    create: { id: 'test-user', name: 'Test', email: 'test@example.com', password: 'test' }
  });

  console.log('--- TEST 1: Artisan Draft & Invalid Factor Rejection ---');
  let { req, res } = mockReqRes({ entityType: 'ARTISAN', entityName: 'Test Artisan', craftType: 'Pottery' });
  await createEvaluation(req, res);
  const artisanId = res.data.id;
  console.log('Created Artisan:', res.data);

  req = mockReqRes({ answers: { INSTITUTIONAL_GOVERNANCE: 'Excellent' } }).req;
  res = mockReqRes({ answers: { INSTITUTIONAL_GOVERNANCE: 'Excellent' } }).res;
  req.params = { id: artisanId };
  await updateEvaluation(req, res);
  console.log('Attempt Invalid Factor:', res.statusCode, res.data?.message);

  req = mockReqRes({ answers: { AUTHENTICITY_PROVENANCE: 'YES' } }).req;
  res = mockReqRes({ answers: { AUTHENTICITY_PROVENANCE: 'YES' } }).res;
  req.params = { id: artisanId };
  await updateEvaluation(req, res);
  console.log('Valid Factor Update:', res.statusCode, 'Success');

  req = mockReqRes({}).req;
  res = mockReqRes({}).res;
  req.params = { id: artisanId };
  await submitEvaluationDraft(req, res);
  console.log('Submitted Artisan:', res.data);

  const finalArtisan = await prisma.evaluationSubmission.findUnique({ where: { id: artisanId }});
  console.log('Artisan DB record:', finalArtisan?.score, finalArtisan?.tier, finalArtisan?.selfReportedPts);
  const findings = await prisma.verificationFinding.findMany({ where: { submissionId: artisanId }});
  console.log('Artisan Findings created:', findings.length);

  console.log('\n--- TEST 2: Business Draft ---');
  let mock = mockReqRes({ entityType: 'BUSINESS', entityName: 'Test Business', craftType: 'Woodcarving' });
  req = mock.req; res = mock.res;
  await createEvaluation(req, res);
  const businessId = res.data.id;
  
  mock = mockReqRes({ answers: { CHILD_LABOUR_SAFEGUARDS: 'YES', FAIR_WAGES: 'YES' } });
  req = mock.req; res = mock.res;
  req.params = { id: businessId };
  await updateEvaluation(req, res);
  await submitEvaluationDraft(req, res);
  console.log('Business Submitted:', res.data?.trackingId);

  console.log('\n--- TEST 3: Institution Draft ---');
  mock = mockReqRes({ entityType: 'INSTITUTION', entityName: 'Test Institution', craftType: 'Weaving' });
  req = mock.req; res = mock.res;
  await createEvaluation(req, res);
  const instId = res.data.id;
  
  mock = mockReqRes({ answers: { GROUND_PRESENCE: 'YES', TRAINING_PROGRAMS: 'YES' } });
  req = mock.req; res = mock.res;
  req.params = { id: instId };
  await updateEvaluation(req, res);
  await submitEvaluationDraft(req, res);
  console.log('Institution Submitted:', res.data?.trackingId);

  console.log('\n--- TEST 4: Browser Authority Ignored ---');
  mock = mockReqRes({ entityType: 'ARTISAN', entityName: 'Hacker', craftType: 'Hack', score: 100, tier: 'Gold' });
  req = mock.req; res = mock.res;
  await createEvaluation(req, res);
  const hackerId = res.data.id;
  const hackerRecord = await prisma.evaluationSubmission.findUnique({ where: { id: hackerId }});
  console.log('Hacker DB Record (Score/Tier):', hackerRecord?.score, hackerRecord?.tier);

}

runTests().catch(console.error).finally(() => prisma.$disconnect());
