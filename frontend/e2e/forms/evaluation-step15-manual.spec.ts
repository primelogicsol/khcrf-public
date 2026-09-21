import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const userAuthPath = path.join('..', 'playwright', '.auth', 'user.json');
if (fs.existsSync(userAuthPath)) {
  // test.use({ storageState: userAuthPath });
} else {
  console.log('No userAuthPath found at', userAuthPath);
}

test('Auto-complete Steps 1-14 and stop at Step 15', async ({ page }) => {
  test.setTimeout(300000); // 5 minutes

  console.log('Navigating to evaluation form...');
  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="email"]', 'fk.envcal@gmail.com');
  await page.fill('input[type="password"]', 'Khcrf12345678987654321%');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/business-support/evaluation/form').catch(async () => { await page.goto('http://localhost:3000/business-support/evaluation/form'); });

  // Wait for it to load
  await page.waitForSelector('button:has-text("Start Application"), button:has-text("Next Step")', { timeout: 15000 });

  let stepCount = 0;
  while (stepCount < 20) {
    stepCount++;
    await page.waitForTimeout(1000);

    // Stop at Step 15
    if (await page.locator('text=Select Factors Supported by this Document').isVisible()) {
      console.log('Reached Step 15 (Evidence & Documents).');
      break;
    }

    // Step 1: Entity Setup
    const isStep1 = await page.locator('label', { hasText: 'Entity Type' }).isVisible();
    
    if (isStep1) {
      console.log('Filling Step 1 (Entity Setup)...');
      // 1. Entity Type -> BUSINESS
      const selects = await page.locator('select').all();
      if (selects.length > 0) {
        await selects[0].selectOption('BUSINESS');
      }
      
      const inputs = await page.locator('input[type="text"]').all();
      if (inputs.length > 0) {
        await inputs[0].fill('KHCRF Evidence Upload Test Entity'); // Applicant name
      }
      if (inputs.length > 1) {
        await inputs[1].fill('Kashmir Pashmina'); // Craft Type
      }
      if (selects.length > 1) {
        await selects[1].selectOption({ index: 2 }); // Role in value chain
      }
      if (inputs.length > 3) {
        await inputs[3].fill('Srinagar'); // District
      }
      const numInputs = await page.locator('input[type="number"]').all();
      if (numInputs.length > 0) {
        await numInputs[0].fill('10');
      }
    } else {
      console.log(`Filling Factor Step...`);
      // Standard Factor Step
      
      // Selects
      const selects = await page.locator('select').all();
      for (const sel of selects) {
        try {
          await sel.selectOption({ index: 1 }, { timeout: 1000 });
        } catch(e) {}
      }

      // Textareas
      const textareas = await page.locator('textarea').all();
      for (const txt of textareas) {
        try {
          await txt.fill('Temporary evidence pipeline acceptance test record.', { timeout: 1000 });
        } catch(e) {}
      }
      
      // Number Inputs
      const numbers = await page.locator('input[type="number"]').all();
      for (const num of numbers) {
        try {
          await num.fill('100', { timeout: 1000 });
        } catch(e) {}
      }
      
      // Yes/No Radios
      const yesLabels = await page.locator('label:has-text("Yes")').all();
      for (const lbl of yesLabels) {
        try {
          await lbl.click({ force: true, timeout: 1000 });
        } catch(e) {}
      }

      // Qualitative
      const fullyLabels = await page.locator('label:has-text("Fully")').all();
      for (const lbl of fullyLabels) {
        try {
          await lbl.click({ force: true, timeout: 1000 });
        } catch(e) {}
      }
      
      // Multi-select Checkboxes
      const checkboxes = await page.locator('input[type="checkbox"]').all();
      for (const chk of checkboxes) {
        try {
          await chk.check({ force: true, timeout: 1000 });
        } catch(e) {}
      }
    }

    console.log('Clicking Next Step/Start Application...');
    try {
      if (await page.locator('button:has-text("Start Application")').isVisible()) {
        await page.locator('button:has-text("Start Application")').click({ timeout: 2000 });
      } else if (await page.locator('button:has-text("Next Step")').isVisible()) {
        await page.locator('button:has-text("Next Step")').click({ timeout: 2000 });
      }
    } catch (e) {
      console.log('Failed to click next:', e);
    }
  }

  // Final assertions before pausing
  await expect(page.locator('text=Evidence & Documents')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('text=Select Factors Supported by this Document')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('text=Supporting evidence required')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('text=Authenticity & Provenance').first()).toBeVisible({ timeout: 10000 });
  await expect(page.locator('text=Child-Labour Safeguards').first()).toBeVisible({ timeout: 10000 });

  console.log('Target reached. Pausing Playwright script...');
  await page.pause();
});



