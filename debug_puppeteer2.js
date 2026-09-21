const puppeteer = require('puppeteer');
const path = require('path');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/state-of-kashmir-crafts/become-a-fellow', { waitUntil: 'networkidle0' });
  await page.waitForSelector('form');

  await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]'));
    inputs[0].value = 'Puppeteer UI Test';
    inputs[1].value = 'test-c-failed@example.com';
    inputs[2].value = '1234567890';
    inputs[3].value = 'Srinagar';
    inputs[4].value = 'PhD';
    inputs[5].value = 'Institution';
    
    for(let i=0; i<6; i++) {
        inputs[i].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[i].dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  
  await page.select('select', 'research-fellow-supply-chain');
  await page.evaluate(() => {
      const ta = document.querySelector('textarea');
      ta.value = 'My statement';
      ta.dispatchEvent(new Event('input', { bubbles: true }));
  });
  
  const fileInput = await page.$('input[type="file"]');
  await fileInput.uploadFile(path.resolve(__dirname, 'test-cv.pdf'));
  await new Promise(r => setTimeout(r, 500));
  
  await page.evaluate(() => {
      const cb = document.querySelector('input[type="checkbox"]');
      cb.checked = true;
      cb.dispatchEvent(new Event('change', { bubbles: true }));
  });

  await page.evaluate(() => document.querySelector('button[type="submit"]').click());
  await new Promise(r => setTimeout(r, 500));
  
  const errs = await page.evaluate(() => Array.from(document.querySelectorAll('.text-red-500')).map(e => e.textContent));
  console.log('Validation Errors:', errs);
  
  await browser.close();
})();
