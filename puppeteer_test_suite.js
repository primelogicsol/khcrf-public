const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

async function fillForm(page, email, fileType) {
  await page.evaluate((email) => {
    const inputs = Array.from(document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]'));
    inputs[0].value = 'Puppeteer UI Test';
    inputs[1].value = email;
    inputs[2].value = '1234567890';
    inputs[3].value = 'Srinagar';
    inputs[4].value = 'PhD';
    inputs[5].value = 'Institution';
    
    for(let i=0; i<6; i++) {
        inputs[i].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[i].dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, email);
  
  await page.select('select', 'research-fellow-supply-chain');
  
  await page.evaluate(() => {
      const ta = document.querySelector('textarea');
      ta.value = 'My statement';
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      ta.dispatchEvent(new Event('change', { bubbles: true }));
  });
  
  const fileInput = await page.$('input[type="file"]');
  let filePath = '';
  if (fileType === 'large') filePath = path.resolve(__dirname, 'large-cv.pdf');
  else if (fileType === 'invalid') filePath = path.resolve(__dirname, 'invalid-cv.txt');
  else filePath = path.resolve(__dirname, 'test-cv.pdf');
  
  await fileInput.uploadFile(filePath);
  
  await new Promise(r => setTimeout(r, 500));
  
  await page.evaluate(() => {
      const cb = document.querySelector('input[type="checkbox"]');
      cb.checked = true;
      cb.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  let page = await browser.newPage();
  
  console.log('--- TEST A: > 5MB PDF ---');
  await page.goto('http://localhost:3000/state-of-kashmir-crafts/become-a-fellow', { waitUntil: 'networkidle0' });
  await page.waitForSelector('form');
  await fillForm(page, 'test-large@example.com', 'large');
  
  let html = await page.content();
  if (html.includes('CV exceeds the 5 MB limit')) {
    console.log('CLIENT SIDE VALIDATION: SUCCESS (Blocked large file)');
  } else {
    await page.evaluate(() => document.querySelector('button[type="submit"]').click());
    await new Promise(r => setTimeout(r, 2000));
    html = await page.content();
    if (html.includes('CV exceeds the 5 MB limit')) console.log('SERVER/CLIENT VALIDATION: SUCCESS (Blocked large file)');
    else console.log('VALIDATION FAILED');
  }

  console.log('--- TEST B: non-PDF CV ---');
  await page.goto('http://localhost:3000/state-of-kashmir-crafts/become-a-fellow', { waitUntil: 'networkidle0' });
  await page.waitForSelector('form');
  await fillForm(page, 'test-invalid@example.com', 'invalid');
  html = await page.content();
  if (html.includes('Invalid file type')) {
    console.log('CLIENT SIDE VALIDATION: SUCCESS (Blocked invalid file)');
  } else {
    await page.evaluate(() => document.querySelector('button[type="submit"]').click());
    await new Promise(r => setTimeout(r, 2000));
    html = await page.content();
    if (html.includes('Invalid file type')) console.log('SERVER/CLIENT VALIDATION: SUCCESS (Blocked invalid file)');
    else console.log('VALIDATION FAILED');
  }

  const testEmail = 'ui-canary-test-' + Date.now() + '@example.com';
  console.log('--- TEST C: valid PDF under 5 MB ---');
  await page.goto('http://localhost:3000/state-of-kashmir-crafts/become-a-fellow', { waitUntil: 'networkidle0' });
  await page.waitForSelector('form');
  
  const getDbCount = () => parseInt(execSync('psql -U govtech -d hcrf_db_clean -t -c "SELECT count(*) FROM \\"FellowshipApplication\\";"').toString().trim());
  const dbBefore = getDbCount();

  await fillForm(page, testEmail, 'valid');
  await page.evaluate(() => document.querySelector('button[type="submit"]').click());
  await new Promise(r => setTimeout(r, 3000));
  html = await page.content();
  
  if (html.includes('APPLICATION SUBMITTED')) console.log('SUBMISSION: SUCCESS (201)');
  else console.log('SUBMISSION: FAILED (No success UI)');

  const dbAfter = getDbCount();
  console.log(`DB Rows: Before ${dbBefore}, After ${dbAfter}`);

  console.log('--- TEST D: duplicate ---');
  await page.goto('http://localhost:3000/state-of-kashmir-crafts/become-a-fellow', { waitUntil: 'networkidle0' });
  await page.waitForSelector('form');
  await fillForm(page, testEmail, 'valid'); // same email
  await page.evaluate(() => document.querySelector('button[type="submit"]').click());
  await new Promise(r => setTimeout(r, 3000));
  html = await page.content();

  if (html.includes('APPLICATION ALREADY RECEIVED')) console.log('DUPLICATE HANDLING: SUCCESS (409 handled as success UI)');
  else console.log('DUPLICATE HANDLING: FAILED');
  
  const dbDuplicate = getDbCount();
  console.log(`DB Rows: After Duplicate Attempt ${dbDuplicate} (Should be same as ${dbAfter})`);

  await browser.close();
})();
