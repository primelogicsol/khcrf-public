const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to http://localhost:3000/master-artisans/artisans ...');
    await page.goto('http://localhost:3000/master-artisans/artisans');
    
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // give some extra time for React to render
    
    const screenshotPath = 'C:\\Users\\Fayaz\\.gemini\\antigravity-cli\\brain\\fd6c12b4-2a27-4e7e-a57c-12a832539287\\registry_screenshot.png';
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot successfully saved to: ${screenshotPath}`);
  } catch (error) {
    console.error('Error during navigation or screenshot:', error);
  } finally {
    await browser.close();
  }
})();
