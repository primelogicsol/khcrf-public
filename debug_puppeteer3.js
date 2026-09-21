const puppeteer = require('puppeteer');
const path = require('path');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/state-of-kashmir-crafts/become-a-fellow', { waitUntil: 'networkidle0' });
  await page.waitForSelector('form');

  const fileInput = await page.$('input[type="file"]');
  await fileInput.uploadFile(path.resolve(__dirname, 'test-cv.pdf'));
  
  await new Promise(r => setTimeout(r, 500));
  
  const errs = await page.evaluate(() => Array.from(document.querySelectorAll('.text-red-500')).map(e => e.textContent));
  console.log('Validation Errors after file upload:', errs);
  
  await browser.close();
})();
