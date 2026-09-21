const fs = require('fs');

async function runTest() {
  const fileBuf = fs.readFileSync('test-cv.pdf');
  const cvBlob = new Blob([fileBuf], { type: 'application/pdf' });

  const formData = new FormData();
  formData.append('fullName', 'KHCRF Fellowship E2E Test');
  formData.append('email', 'not-an-email'); // INVALID
  formData.append('district', 'Srinagar');
  formData.append('education', 'PhD');
  formData.append('position', 'research-fellow-documentation');
  formData.append('statement', 'Automated end-to-end fellowship application verification record.');
  formData.append('consent', 'true');
  formData.append('cvFile', cvBlob, 'test-cv.pdf');

  try {
    const res = await fetch('http://localhost:4000/api/skc/fellowships/register', {
      method: 'POST',
      body: formData
    });

    const json = await res.json();
    console.log('STATUS:', res.status);
    console.log('RESPONSE:', json);
  } catch (err) {
    console.error('ERROR:', err);
  }
}

runTest();
