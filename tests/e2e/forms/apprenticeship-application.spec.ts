import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Apprenticeship Application Functional Audit', () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    // Setup CSP bypass (redundant if set in config, but good for local overrides)
    // Setup Cloudinary Mock
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

    await page.route('https://api.cloudinary.com/**', async route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          secure_url: 'https://example.com/mock-upload.pdf'
        })
      });
    });
  });

  test('Apprenticeship form submission and success UI works end-to-end', async ({ page }) => {
    page.on('pageerror', error => console.log('Page Error:', error));
    page.on('console', msg => console.log('Browser Console:', msg.text()));

    // Mock Cloudinary Signature API
    await page.route('**/api/upload/signature', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          signature: 'dummy_signature',
          timestamp: 1234567890,
          apiKey: 'dummy_api_key',
          cloudName: 'dummy_cloud'
        })
      });
    });

    // Mock Cloudinary Upload API
    await page.route('https://api.cloudinary.com/v1_1/**/upload', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          secure_url: 'https://res.cloudinary.com/demo/image/upload/v1570979139/sample.pdf',
          public_id: 'sample',
          format: 'pdf',
          resource_type: 'raw'
        })
      });
    });

    // 1. Ensure page is loaded
    await page.goto('/about/apprenticeship/apply');
    await page.waitForLoadState('networkidle');

    // 2. Intercept the backend API to ensure it doesn't timeout if it hits a snag, but we want a REAL e2e test, so we won't mock the backend!
    const reqPromise = page.waitForResponse(res => res.url().includes('/apprenticeship') && res.request().method() === 'POST', { timeout: 60000 });


    await page.waitForLoadState('networkidle');
    
    // Step 1: Personal Information
    await page.locator('input[name="fullName"]').fill('John Doe');
    await page.locator('input[name="dob"]').fill('1995-05-15');
    await page.locator('select[name="gender"]').selectOption('Male');
    await page.locator('input[name="contactNumber"]').fill('+919876543210');
    await page.locator('input[name="email"]').fill('john.doe@example.com');
    await page.locator('input[name="city"]').fill('Srinagar');
    await page.locator('input[name="state"]').fill('Jammu and Kashmir');
    await page.locator('input[name="country"]').fill('India');
    await page.locator('input[name="postalCode"]').fill('190001');
    
    await page.locator('button', { hasText: /Next Step/i }).click();

    // Step 2: Educational Background
    await page.locator('input[value="Undergraduate"]').check();
    await page.locator('input[name="fieldOfStudy"]').fill('Design');
    await page.locator('input[name="institution"]').fill('National Institute of Design');
    await page.locator('input[name="completionYear"]').fill('2018');

    await page.locator('button', { hasText: /Next Step/i }).click();

    // Step 3: Preferences
    await page.locator('text=Design Apprentice').click();
    await page.locator('text=Srinagar, Kashmir').click();
    await page.locator('text=3 Months').click();

    await page.locator('button', { hasText: /Next Step/i }).click();

    // Step 4: Skills & Experience
    await page.locator('text=Research & Writing').click();
    await page.locator('textarea[name="experience"]').fill('Worked on various design projects.');

    await page.locator('button', { hasText: /Next Step/i }).click();

    // Step 5: Motivation
    await page.locator('textarea[name="motivation"]').fill('I am very passionate about preserving the rich cultural heritage of Kashmir through structured documentation and design interventions. I want to dedicate my skills to this cause.');
    await page.locator('textarea[name="contribution"]').fill('I can contribute with my research and design skills to create compelling narratives.');

    await page.locator('button', { hasText: /Next Step/i }).click();

    // Step 6: Uploads
    // Create dummy files
    fs.writeFileSync('dummy_cv.pdf', 'dummy content');
    fs.writeFileSync('dummy_portfolio.pdf', 'dummy content');

    const fileInputs = await page.locator('input[type="file"]').all();
    // Assuming first is CV, second is Portfolio
    if (fileInputs.length >= 1) {
      await fileInputs[0].setInputFiles('dummy_cv.pdf');
    }
    if (fileInputs.length >= 2) {
      await fileInputs[1].setInputFiles('dummy_portfolio.pdf');
    }

    // Wait for uploads to complete
    await expect(page.locator('text=CV Uploaded').first()).toBeVisible({ timeout: 15000 });

    await page.locator('button', { hasText: /Next Step/i }).click();

    // Step 7: Declaration
    const checkboxes = await page.locator('input[type="checkbox"]').all();
    for (const checkbox of checkboxes) {
      await checkbox.check({ force: true });
    }
    
    await page.locator('input[name="signature"]').fill('John Doe');
    await page.locator('input[name="date"]').fill('2026-07-21');

    // Submit
    await page.locator('button', { hasText: /Apply for Apprenticeship/i }).click();

    // Wait for real backend response
    const response = await reqPromise;
    expect(response.status()).toBe(201); // Assuming 201 Created

    // Verify Success UI
    await expect(page.locator('text=Application Submitted')).toBeVisible({ timeout: 10000 });
  });
});
