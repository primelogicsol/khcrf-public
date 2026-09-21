const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

async function fillFormProperly(page, email, fileType) {
  const inputs = await page.$$('input[type="text"], input[type="email"], input[type="tel"]');
  await inputs[0].type('Puppeteer UI Test');
  await inputs[1].type(email);
  await inputs[2].type('1234567890');
  await inputs[3].type('Srinagar');
  await inputs[4].type('PhD');
  await inputs[5].type('Institution');
  
  await page.select('select', 'research-fellow-supply-chain');
  
  const textarea = await page.$('textarea');
  await textarea.type('My statement');
  
  const fileInput = await page.$('input[type="file"]');
  let filePath = '';
  if (fileType === 'large') filePath = path.resolve(__dirname, 'large-cv.pdf');
  else if (fileType === 'invalid') filePath = path.resolve(__dirname, 'invalid-cv.txt');
  else filePath = path.resolve(__dirname, 'test-cv.pdf');
  
  await fileInput.uploadFile(filePath);
  await new Promise(r => setTimeout(r, 500));
  
  const cb = await page.$('input[type="checkbox"]');
  await cb.click();
}

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  let page = await browser.newPage();
  
  const testEmail = 'ui-canary-test-' + Date.now() + '@example.com';
  
  console.log('--- TEST C: valid PDF under 5 MB ---');
  await page.goto('http://localhost:3000/state-of-kashmir-crafts/become-a-fellow', { waitUntil: 'networkidle0' });
  await page.waitForSelector('form');
  
  const getDbCount = () => parseInt(execSync('psql -U govtech -d hcrf_db_clean -t -c "SELECT count(*) FROM \\"FellowshipApplication\\";"').toString().trim());
  const dbBefore = getDbCount();

  await fillFormProperly(page, testEmail, 'valid');
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 3000));
  let html = await page.content();
  
  if (html.includes('APPLICATION SUBMITTED')) console.log('SUBMISSION: SUCCESS (201)');
  else {
    console.log('SUBMISSION: FAILED (No success UI)');
    const errs = await page.evaluate(() => Array.from(document.querySelectorAll('.text-red-500')).map(e => e.textContent));
    console.log('Validation Errors:', errs);
  }

  const dbAfter = getDbCount();
  console.log(`DB Rows: Before ${dbBefore}, After ${dbAfter}`);

  console.log('--- TEST D: duplicate ---');
  await page.goto('http://localhost:3000/state-of-kashmir-crafts/become-a-fellow', { waitUntil: 'networkidle0' });
  await page.waitForSelector('form');
  await fillFormProperly(page, testEmail, 'valid');
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 3000));
  html = await page.content();

  if (html.includes('APPLICATION ALREADY RECEIVED')) console.log('DUPLICATE HANDLING: SUCCESS (409 handled as success UI)');
  else console.log('DUPLICATE HANDLING: FAILED');
  
  const dbDuplicate = getDbCount();
  console.log(`DB Rows: After Duplicate Attempt ${dbDuplicate} (Should be same as ${dbAfter})`);

  await browser.close();
})();
