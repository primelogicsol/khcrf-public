const { test, expect } = require('@playwright/test');
const fs = require('fs');

test('Autofill scenario reaches Step 15', async ({ page }) => {
  // Use a long timeout to allow the automation to click through 15 steps
  test.setTimeout(120000);
  
  await page.goto('http://localhost:3000/auth/login');
  
  // Login as test user
  await page.fill('input[type="email"]', 'test-artisan@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  await page.waitForURL('http://localhost:3000/business-support/evaluation');
  
  // Start autofill
  await page.goto('http://localhost:3000/business-support/evaluation/form?autofill=evaluation-step15-evidence-test');
  
  // Wait for it to stop at Step 15
  await page.waitForSelector('text=AUTOFILL COMPLETE', { timeout: 60000 });
  
  // Assert Step 15 Evidence & Documents
  const stepText = await page.textContent('body');
  
  if (stepText.includes('Consolidated Evidence Package') || stepText.includes('Upload documents supporting your claims')) {
     console.log('Successfully reached Step 15!');
  } else {
     console.error('Did not reach Step 15.');
  }

  // Assert Missing Requirements
  const isAuthenticityMissing = stepText.includes('Authenticity & Provenance');
  const isChildLabourMissing = stepText.includes('Child-Labour Safeguards');
  
  console.log('Authenticity & Provenance required:', isAuthenticityMissing);
  console.log('Child-Labour Safeguards required:', isChildLabourMissing);
  
  // Write result to file for me to read
  fs.writeFileSync('autofill_result.txt', `Success: ${isAuthenticityMissing && isChildLabourMissing}`);
});
