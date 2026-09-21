import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import path from 'path';

test.describe('Legislative Registration Functional Audit', () => {
  test.setTimeout(60000);

  const ROUTE = '/research/lobbying/register';

  test.beforeAll(async () => {
    // We clean up before the test to ensure a clean slate, in case a previous run failed and left an office.
    const cleanupScript = `
      const { prisma } = require('./src/config/db.js');
      async function cleanup() {
        const user = await prisma.user.findUnique({ where: { email: 'editor@example.com' } });
        if (user) {
          await prisma.legislativeOffice.deleteMany({ where: { userId: user.id } });
        }
      }
      cleanup().then(() => process.exit(0));
    `;
    const fs = require('fs');
    const scriptPath = path.join(process.cwd(), 'backend', 'cleanup_office.js');
    fs.writeFileSync(scriptPath, cleanupScript);
    try {
      execSync('node cleanup_office.js', { cwd: path.join(process.cwd(), 'backend') });
    } catch (e) {
      console.error(e);
    }
  });

  test('Legislative registration form submission and success UI works', async ({ page }) => {
    // 1. Log in explicitly
    await page.goto('/login');
    await page.locator('input[type="email"]').first().fill('editor@example.com');
    await page.locator('input[type="password"]').first().fill('Password123!');
    
    const loginPromise = page.waitForResponse(res => res.url().includes('/auth/login') && res.request().method() === 'POST');
    await page.locator('button[type="submit"]', { hasText: 'Sign In' }).first().click();
    await loginPromise;
    
    await expect(page).toHaveURL(/.*\/dashboard|.*\//);

    // 2. Go to registration route
    await page.goto(ROUTE);
    await page.waitForLoadState('networkidle'); // Wait for auth and draft fetch to complete

    // Wait for the form to be ready
    await expect(page.locator('h1', { hasText: 'Jammu and Kashmir Legislative Office Onboarding' })).toBeVisible();

    // Fill form - Step 1
    await page.locator('input[name="representativeName"]').waitFor({ state: 'visible' });
    await page.locator('input[name="representativeName"]').fill('Test Rep');
    await page.locator('select[name="designation"]').selectOption('MLA');
    await page.locator('input[name="constituency"]').fill('Test Constituency');
    await page.locator('input[name="district"]').fill('Test District');
    await page.locator('input[name="termStart"]').fill('2024-01-01');
    await page.locator('input[name="termEnd"]').fill('2029-01-01');
    await page.locator('input[name="officialEmail"]').fill('office@gov.in');
    await page.locator('input[name="contactNumber"]').fill('+919876543210');
    await page.locator('input[name="officeAddress"]').fill('123 Govt Street');
    await page.locator('input[name="username"]').fill('test-constituency');
    
    // Go to Step 2
    await page.locator('button', { hasText: /Continue/i }).click();

    // Step 2
    await page.locator('input[type="radio"][value="Yes"]').check();
    await page.locator('input[name="artisanPopulation"]').fill('500–2,000');
    
    // Add craft
    await page.locator('select').first().selectOption('Other');
    await page.locator('input[placeholder="Type custom craft and press Add"]').fill('Test Craft');
    await page.locator('button', { hasText: 'Add' }).click();
    
    await page.locator('button', { hasText: /Continue/i }).click();

    // Step 3 (Engagement - Optional fields, just click Next)
    await page.locator('button', { hasText: /Continue/i }).click();

    // Step 4 (Verification)
    
    // Log console output to see why upload fails
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('dialog', dialog => console.log('BROWSER DIALOG:', dialog.message()));
    
    // Mock file uploads
    await page.route('**/upload/signature', async route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            signature: 'mock_sig',
            timestamp: 1234,
            cloudName: 'mock_cloud',
            apiKey: 'mock_key'
          }
        })
      });
    });

    await page.route('https://api.cloudinary.com/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          secure_url: 'https://example.com/mock.pdf'
        })
      });
    });

    // Set file directly on the hidden input
    const fs = require('fs');
    fs.writeFileSync('dummy.pdf', 'dummy content');
    await page.locator('input[type="file"]').setInputFiles('dummy.pdf');
    
    // Wait for upload to complete
    await expect(page.locator('text=Document Uploaded')).toBeVisible({ timeout: 10000 });

    // Check declarations (might not have name attributes, use text or type=checkbox)
    const checkboxes = await page.locator('input[type="checkbox"]').all();
    for (const cb of checkboxes) {
      await cb.check();
    }

    const reqPromise = page.waitForResponse(res => res.url().includes('/legislative/register') && res.request().method() === 'POST');
    
    await page.locator('button[type="button"]', { hasText: /Submit For Verification/i }).or(page.locator('button', { hasText: 'Submit' })).click();

    const response = await reqPromise;
    expect(response.status()).toBe(201);

    // Success UI
    await expect(page.locator('text=Submission Received')).toBeVisible();
  });
});
