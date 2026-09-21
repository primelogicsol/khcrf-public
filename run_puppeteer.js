const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  page.on('request', request => {
    if (request.url().includes('/register')) {
      console.log('--- INTERCEPTED REQUEST ---');
      console.log('URL:', request.url());
      console.log('Method:', request.method());
      console.log('Headers:', request.headers());
      console.log('Post Data Length:', request.postData()?.length || 0);
    }
  });

  page.on('response', async response => {
    if (response.url().includes('/register')) {
      console.log('--- INTERCEPTED RESPONSE ---');
      console.log('Status:', response.status());
      try {
        console.log('Body:', await response.text());
      } catch(e) {}
    }
  });

  await page.goto('http://localhost:3000/state-of-kashmir-crafts/become-a-fellow', { waitUntil: 'networkidle0' });
  
  // Wait for the form to load
  await page.waitForSelector('form');

  // Fill form using evaluate since label association might be tricky
  await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]'));
    inputs[0].value = 'Puppeteer UI Test'; // Full Name
    inputs[1].value = 'puppeteer.ui@example.com'; // Email
    inputs[2].value = '1234567890'; // Phone
    inputs[3].value = 'Srinagar'; // District
    inputs[4].value = 'PhD'; // Education
    inputs[5].value = 'Institution'; // Institution
    
    // Trigger React onChange events for controlled components
    for(let i=0; i<6; i++) {
        inputs[i].dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  
  await page.select('select', 'research-fellow-supply-chain');
  
  await page.evaluate(() => {
      const ta = document.querySelector('textarea');
      ta.value = 'My statement';
      ta.dispatchEvent(new Event('input', { bubbles: true }));
  });
  
  // File upload
  const fileInput = await page.$('input[type="file"]');
  await fileInput.uploadFile(path.resolve(__dirname, 'test-cv.pdf'));
  
  // Consent checkbox
  await page.evaluate(() => {
      const cb = document.querySelector('input[type="checkbox"]');
      cb.checked = true;
      cb.dispatchEvent(new Event('change', { bubbles: true }));
  });

  console.log('Submitting...');
  // Submit
  await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Submit Application'));
      btn.click();
  });

  // Wait for network
  await new Promise(r => setTimeout(r, 4000));
  
  // Capture UI state
  const html = await page.content();
  if (html.includes('APPLICATION SUBMITTED')) console.log('UI: SUCCESS');
  else if (html.includes('Failed to submit application')) console.log('UI: FAILED TO SUBMIT');
  else console.log('UI: UNKNOWN RESULT IN HTML. Snippet: ' + html.substring(html.indexOf('formStatus'), html.indexOf('formStatus') + 200));

  await browser.close();
})();
