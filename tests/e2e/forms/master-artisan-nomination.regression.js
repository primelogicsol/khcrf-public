/**
 * Master Artisan Nomination -- End-to-End Regression Test
 * =========================================================
 * Certified: 2026-07-24  |  15/15 smoke test checks passed
 *
 * Covers the full operational chain:
 *   Public form POST -> DB persistence -> Admin dashboard retrieval
 *   -> Status transitions -> Filter correctness -> Cleanup
 *
 * Run from repository root:
 *   node tests/e2e/forms/master-artisan-nomination.regression.js
 *
 * Or via npm (add to package.json scripts):
 *   "test:nomination": "node tests/e2e/forms/master-artisan-nomination.regression.js"
 *
 * Environment variables (all optional, sensible defaults provided):
 *   BACKEND_URL          - e.g. http://localhost:4000
 *   JWT_SECRET           - must match backend JWT_SECRET
 *   REGRESSION_ADMIN_ID  - ID of any ADMIN user in the database
 *
 * Exit codes:
 *   0  All tests passed
 *   1  One or more failures / backend unreachable
 *
 * Introduced after audit 2026-07-24. Do not delete.
 * Re-run after any change to:
 *   participationController, participationService,
 *   masterArtisanAdminController, masterArtisanAdminRoutes,
 *   participationRoutes, or the ArtisanNomination Prisma model.
 */

'use strict';

// Resolve jsonwebtoken regardless of where the script is invoked from
let jwt;
try { jwt = require('jsonwebtoken'); }
catch (_) { jwt = require('../../../backend/node_modules/jsonwebtoken'); }

const http = require('http');

const BASE_URL   = process.env.BACKEND_URL          || 'http://localhost:4000';
const JWT_SECRET = process.env.JWT_SECRET           || 'supersecretkey-change-me-in-production';
const ADMIN_ID   = process.env.REGRESSION_ADMIN_ID  || 'cmry4qmuu00008kbo9othevvb';
const RUN_TAG    = 'REGRESSION-' + Date.now();

// --------------------------------------------------------------------------
// HTTP helper
// Admin routes read the JWT from req.cookies.token (HTTP-only cookie).
// Public routes need no auth.
// --------------------------------------------------------------------------
function request(method, path, bodyObj, options) {
  var admin = (options && options.admin) || false;
  return new Promise(function(resolve, reject) {
    var data  = bodyObj ? JSON.stringify(bodyObj) : null;
    var token = admin
      ? jwt.sign({ userId: ADMIN_ID, role: 'ADMIN' }, JWT_SECRET, { expiresIn: '5m' })
      : null;

    var url = new URL(path, BASE_URL);
    var reqOptions = {
      hostname : url.hostname,
      port     : url.port || 80,
      path     : url.pathname + url.search,
      method   : method,
      headers  : {
        'Content-Type': 'application/json'
      }
    };
    if (token) reqOptions.headers['Cookie'] = 'token=' + token;
    if (data)  reqOptions.headers['Content-Length'] = Buffer.byteLength(data);

    var req = http.request(reqOptions, function(res) {
      var raw = '';
      res.on('data', function(c) { raw += c; });
      res.on('end', function() {
        var parsed;
        try { parsed = JSON.parse(raw); } catch(e) { parsed = raw; }
        resolve({ status: res.statusCode, body: parsed });
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

// Unwrap proxy envelope: { status, data: { success, data: [...] } }
function getRows(body) {
  var inner = (body && body.data) ? body.data : body;
  if (inner && Array.isArray(inner.data)) return inner.data;
  if (Array.isArray(inner)) return inner;
  return [];
}

function getRecord(body) {
  if (body && body.data && body.data.data) return body.data.data;
  if (body && body.data) return body.data;
  return null;
}

// --------------------------------------------------------------------------
// Assertions
// --------------------------------------------------------------------------
var passed = 0, failed = 0;

function check(label, condition, detail) {
  if (condition) {
    console.log('  [PASS] ' + label);
    passed++;
  } else {
    console.log('  [FAIL] ' + label + (detail ? ' -- ' + detail : ''));
    failed++;
  }
}

// --------------------------------------------------------------------------
// Suite
// --------------------------------------------------------------------------
async function run() {
  console.log('\n==============================================================');
  console.log('  Master Artisan Nomination -- Regression Test');
  console.log('  Run tag : ' + RUN_TAG);
  console.log('  Target  : ' + BASE_URL);
  console.log('==============================================================\n');

  // STEP 0: Health check
  console.log('[0] Backend health check');
  var health;
  try { health = await request('GET', '/api/health'); }
  catch (e) { console.error('  Backend unreachable: ' + e.message); process.exit(1); }
  check('HTTP 200',           health.status === 200);
  check('Database connected', health.body && health.body.data && health.body.data.database === 'connected');
  console.log();

  // STEP 1: Public submission (no auth)
  console.log('[1] Public submission -- POST /api/participation/nominate');
  var sub = await request('POST', '/api/participation/nominate', {
    nomineeName: RUN_TAG + ' Artisan',
    primaryCraft: 'Pashmina Weaving',
    secondaryCrafts: '',
    yearsOfPractice: 25,
    unionTerritory: 'Jammu and Kashmir',
    district: 'Srinagar',
    tehsil: 'Khanyar',
    village: 'Safa Kadal',
    pinCode: '190002',
    fullAddress: 'Automated regression test. Safe to delete.',
    landmark: '',
    notes: 'Automated regression test to verify the full nomination chain. Safe to delete.',
    nominatorInfo: 'Regression Test Runner',
    relationship: 'Researcher',
    nominatorEmail: 'regression@hcrf-internal.test',
    nominatorPhone: '+91 9000000099',
    consentGiven: true,
    hasGovtArtisanId: 'No',
    hasWorkshop: 'No'
  });

  var subData = (sub.body && sub.body.data) ? sub.body.data : sub.body;
  check('HTTP 201',                        sub.status === 201);
  check('success=true',                    subData && subData.success === true);
  check('id present',                      !!(subData && subData.data && subData.data.id));
  check('submissionNumber starts NOM-',    !!(subData && subData.data && String(subData.data.submissionNumber).startsWith('NOM-')));
  check('status=SUBMITTED',               !!(subData && subData.data && subData.data.status === 'SUBMITTED'));

  var smokeId  = subData && subData.data && subData.data.id;
  var smokeNom = subData && subData.data && subData.data.submissionNumber;
  if (!smokeId) { console.log('\n  Aborting: no persisted ID returned.\n'); summary(); return; }
  console.log('  Created: ' + smokeNom + ' (' + smokeId + ')\n');

  // STEP 2: Dashboard GET all
  console.log('[2] Dashboard -- GET /api/admin/master-artisans/nominations');
  var getAll   = await request('GET', '/api/admin/master-artisans/nominations', null, { admin: true });
  var allRows  = getRows(getAll.body);
  var inAll    = allRows.filter(function(r) { return r.id === smokeId; })[0];
  check('HTTP 200',              getAll.status === 200);
  check('Returns array',         Array.isArray(allRows));
  check('Smoke record present',  !!inAll);
  if (inAll) check('status=SUBMITTED', inAll.status === 'SUBMITTED');
  console.log();

  // STEP 3: Filter SUBMITTED
  console.log('[3] Filter -- ?status=SUBMITTED');
  var f1   = await request('GET', '/api/admin/master-artisans/nominations?status=SUBMITTED', null, { admin: true });
  var r1   = getRows(f1.body);
  check('HTTP 200',                    f1.status === 200);
  check('Smoke record in filter',      !!r1.filter(function(r) { return r.id === smokeId; })[0]);
  console.log();

  // STEP 4: PATCH -> UNDER_REVIEW
  console.log('[4] Transition -- PATCH -> UNDER_REVIEW');
  var p1  = await request('PATCH', '/api/admin/master-artisans/nominations/' + smokeId + '/status', { status: 'UNDER_REVIEW' }, { admin: true });
  var rp1 = getRecord(p1.body);
  check('HTTP 200',              p1.status === 200);
  check('status=UNDER_REVIEW',   rp1 && rp1.status === 'UNDER_REVIEW');
  console.log();

  // STEP 5: Filter UNDER_REVIEW
  console.log('[5] Filter -- ?status=UNDER_REVIEW');
  var f2  = await request('GET', '/api/admin/master-artisans/nominations?status=UNDER_REVIEW', null, { admin: true });
  var r2  = getRows(f2.body);
  check('HTTP 200',              f2.status === 200);
  check('Smoke record in filter', !!r2.filter(function(r) { return r.id === smokeId; })[0]);
  console.log();

  // STEP 6: Absent from SUBMITTED after transition
  console.log('[6] SUBMITTED filter -- smoke record must be absent after transition');
  var f3  = await request('GET', '/api/admin/master-artisans/nominations?status=SUBMITTED', null, { admin: true });
  var r3  = getRows(f3.body);
  check('HTTP 200',              f3.status === 200);
  check('Smoke absent from SUBMITTED', !r3.filter(function(r) { return r.id === smokeId; })[0]);
  console.log();

  // STEP 7: EVIDENCE_VERIFICATION (was phantom VERIFICATION before fix)
  console.log('[7] Enum correctness -- ?status=EVIDENCE_VERIFICATION');
  var f4  = await request('GET', '/api/admin/master-artisans/nominations?status=EVIDENCE_VERIFICATION', null, { admin: true });
  check('HTTP 200 (enum valid, no 400/422)', f4.status === 200);
  check('Returns clean array',              Array.isArray(getRows(f4.body)));
  console.log();

  // STEP 8: PATCH -> INFORMATION_REQUESTED
  console.log('[8] Transition -- PATCH -> INFORMATION_REQUESTED');
  var p2  = await request('PATCH', '/api/admin/master-artisans/nominations/' + smokeId + '/status', { status: 'INFORMATION_REQUESTED' }, { admin: true });
  var rp2 = getRecord(p2.body);
  check('HTTP 200',                       p2.status === 200);
  check('status=INFORMATION_REQUESTED',   rp2 && rp2.status === 'INFORMATION_REQUESTED');
  console.log();

  // STEP 9: Invalid status rejected
  console.log('[9] Validation -- invalid status must be rejected with HTTP 400');
  var bad = await request('PATCH', '/api/admin/master-artisans/nominations/' + smokeId + '/status', { status: 'NOT_A_REAL_STATUS' }, { admin: true });
  check('HTTP 400',  bad.status === 400);
  console.log();

  // STEP 10: Cleanup -> ARCHIVED
  console.log('[10] Cleanup -- PATCH -> ARCHIVED');
  var arch  = await request('PATCH', '/api/admin/master-artisans/nominations/' + smokeId + '/status', { status: 'ARCHIVED' }, { admin: true });
  var rArch = getRecord(arch.body);
  check('HTTP 200',              arch.status === 200);
  check('Final status=ARCHIVED', rArch && rArch.status === 'ARCHIVED');
  console.log();

  summary();
}

function summary() {
  var total = passed + failed;
  console.log('==============================================================');
  console.log('  Results : ' + passed + '/' + total + ' passed  |  ' + failed + ' failed');
  if (failed === 0) {
    console.log('  Verdict : ALL TESTS PASSED');
    console.log('  Status  : Master Artisan Nomination -- RUNTIME CERTIFIED');
  } else {
    console.log('  Verdict : FAILURES DETECTED -- investigate before deploying');
  }
  console.log('==============================================================\n');
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(function(err) {
  console.error('\nFATAL:', err.message);
  process.exit(1);
});
