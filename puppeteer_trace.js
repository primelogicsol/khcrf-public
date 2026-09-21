const puppeteer = require('puppeteer');
const path = require('path');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  const testEmail = 'ui-canary-test-' + Date.now() + '@example.com';
  
  await page.goto('http://localhost:3000/state-of-kashmir-crafts/become-a-fellow', { waitUntil: 'networkidle0' });
  await page.waitForSelector('form');

  const inputs = await page.$$('input[type="text"], input[type="email"], input[type="tel"]');
  await inputs[0].type('Puppeteer UI Test');
  await inputs[1].type(testEmail);
  await inputs[2].type('1234567890');
  await inputs[3].type('Srinagar');
  await inputs[4].type('PhD');
  await inputs[5].type('Institution');
  
  await page.select('select', 'research-fellow-supply-chain');
  
  const textarea = await page.$('textarea');
  await textarea.type('My statement');
  
  const fileInput = await page.$('input[type="file"]');
  await fileInput.uploadFile(path.resolve(__dirname, 'test-cv.pdf'));
  await new Promise(r => setTimeout(r, 500));
  
  const cb = await page.$('input[type="checkbox"]');
  await cb.click();

  let reqDetails = null;
  page.on('request', request => {
    if (request.url().includes('/register')) {
      reqDetails = {
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
      };
      console.log('--- INTERCEPTED REQUEST ---');
      console.log('URL:', request.url());
      console.log('Method:', request.method());
      console.log('Content-Type:', request.headers()['content-type']);
    }
  });

  page.on('response', async response => {
    if (response.url().includes('/register')) {
      console.log('--- INTERCEPTED RESPONSE ---');
      console.log('Status:', response.status());
      console.log('Content-Type:', response.headers()['content-type']);
      try {
        console.log('Body:', await response.text());
      } catch (e) {
        console.log('Failed to get body:', e);
      }
    }
  });

  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 4000));
  
  const html = await page.content();
  if (html.includes('We could not confirm your submission')) {
      console.log('FRONTEND FALLBACK DISPLAYED.');
  }
  
  await browser.close();
})();
