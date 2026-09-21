const fs = require('fs');

async function runCanary() {
  const fileBuf = fs.readFileSync('test-cv.pdf');
  const cvBlob = new Blob([fileBuf], { type: 'application/pdf' });

  const formData = new FormData();
  formData.append('fullName', 'UI Canary Test');
  formData.append('email', 'ui-canary-test-1789537788810@example.com');
  formData.append('district', 'Srinagar');
  formData.append('education', 'PhD');
  formData.append('position', 'research-fellow-documentation');
  formData.append('statement', 'Canary test statement');
  formData.append('consent', 'true');
  formData.append('cvFile', cvBlob, 'test-cv.pdf');

  try {
    console.log('Sending first submission...');
    const res1 = await fetch('http://localhost:3000/api/backend/skc/fellowships/register', {
      method: 'POST',
      body: formData
    });
    console.log('Submission 1:', res1.status, await res1.json());

    console.log('Sending duplicate submission...');
    const formData2 = new FormData();
    formData2.append('fullName', 'UI Canary Test');
    formData2.append('email', 'ui-canary-test-1789537788810@example.com');
    formData2.append('district', 'Srinagar');
    formData2.append('education', 'PhD');
    formData2.append('position', 'research-fellow-documentation');
    formData2.append('statement', 'Canary test statement duplicate');
    formData2.append('consent', 'true');
    formData2.append('cvFile', cvBlob, 'test-cv.pdf');

    const res2 = await fetch('http://localhost:3000/api/backend/skc/fellowships/register', {
      method: 'POST',
      body: formData2
    });
    console.log('Submission 2:', res2.status, await res2.json());
  } catch(e) {
    console.error(e);
  }
}
runCanary();
