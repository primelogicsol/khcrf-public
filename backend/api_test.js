const fs = require('fs');

async function runTest() {
  console.log("Starting Step 15 API Test...");
  
  // 1. Authenticate
  const loginRes = await fetch('http://127.0.0.1:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@hcrf.org', password: 'password123' })
  });
  const loginData = await loginRes.json();
  const token = loginData.data?.token || loginData.token;
  const cookieStr = loginRes.headers.get('set-cookie');
  
  let headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (cookieStr) headers['Cookie'] = cookieStr;
  
  // 2. Get latest draft
  const evalRes = await fetch('http://127.0.0.1:4000/api/evaluation/my-evaluation', { headers });
  const evalData = await evalRes.json();
  
  if (!Array.isArray(evalData.data)) {
    console.error("Not array:", evalData);
    return;
  }
  
  const draft = evalData.data.find(d => d.caseStatus === 'DRAFT' && d.evaluationType === 'KHCRF_16_STEP');
  if (!draft) {
    console.log("No draft found. I'll create one.");
    // POST /evaluation to create one
    const createRes = await fetch('http://127.0.0.1:4000/api/evaluation', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entityType: 'BUSINESS',
        entityName: 'API Test',
        craftType: 'PASHMINA',
        additionalInfo: {}
      })
    });
    const created = await createRes.json();
    console.log("Created:", created.data.id);
    return;
  }
  
  const draftId = draft.id;
  console.log(`\n1. Found Draft:\n   ID: ${draftId}\n   Tracking: ${draft.trackingId}`);
  
  // 3. Upload first evidence
  const formData = new FormData();
  formData.append('file', new Blob(['%PDF-1.4 dummy 1'], { type: 'application/pdf' }), 'auth.pdf');
  formData.append('factorCodes', 'AUTHENTICITY_PROVENANCE');
  
  const upRes = await fetch(`http://127.0.0.1:4000/api/evaluation/${draftId}/evidence`, {
    method: 'POST',
    headers,
    body: formData
  });
  const upData = await upRes.json();
  console.log("Upload 1 Status:", upRes.status, JSON.stringify(upData).substring(0,200));
  
  // 4. Upload second evidence
  const formData2 = new FormData();
  formData2.append('file', new Blob(['%PDF-1.4 dummy 2'], { type: 'application/pdf' }), 'child.pdf');
  formData2.append('factorCodes', 'CHILD_LABOUR_SAFEGUARDS');
  
  const upRes2 = await fetch(`http://127.0.0.1:4000/api/evaluation/${draftId}/evidence`, {
    method: 'POST',
    headers,
    body: formData2
  });
  const upData2 = await upRes2.json();
  console.log("Upload 2 Status:", upRes2.status, JSON.stringify(upData2).substring(0,200));
}

runTest();
