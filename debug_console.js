const puppeteer = require('puppeteer');
const path = require('path');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER:', msg.text()));

  await page.goto('http://localhost:3000/state-of-kashmir-crafts/become-a-fellow', { waitUntil: 'networkidle0' });
  
  await page.evaluate(() => {
    const setNativeValue = (element, value) => {
      const valueSetter = Object.getOwnPropertyDescriptor(element, 'value')?.set;
      const prototype = Object.getPrototypeOf(element);
      const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
      if (valueSetter && valueSetter !== prototypeValueSetter) prototypeValueSetter.call(element, value);
      else if (valueSetter) valueSetter.call(element, value);
      else element.value = value;
    };

    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
    setNativeValue(inputs[0], 'Test Name');
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    setNativeValue(inputs[1], 'test@example.com');
    inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
    
    const cb = document.querySelector('input[type="checkbox"]');
    cb.checked = true;
    cb.dispatchEvent(new Event('change', { bubbles: true }));
    
    const sel = document.querySelector('select');
    sel.value = 'research-fellow-supply-chain';
    sel.dispatchEvent(new Event('change', { bubbles: true }));
  });
  
  const fileInput = await page.$('input[type="file"]');
  await fileInput.uploadFile(path.resolve(__dirname, 'test-cv.pdf'));
  await new Promise(r => setTimeout(r, 1000));
  
  console.log('Clicking submit...');
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 3000));
  
  const errs = await page.evaluate(() => Array.from(document.querySelectorAll('.text-red-500, .bg-red-50')).map(e => e.textContent));
  console.log('Errors:', errs);
  
  await browser.close();
})();
