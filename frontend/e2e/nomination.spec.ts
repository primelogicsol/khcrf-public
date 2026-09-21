import { test, expect } from '@playwright/test';

test.describe('Public Master Artisan Nomination E2E Flow', () => {
  test('submits nomination via browser UI and receives confirmed submission number', async ({ page }) => {
    // Navigate to public form
    await page.goto('http://localhost:3000/master-artisans/nominate');

    // Section 1: Artisan Details
    const uniqueName = `Master Artisan Playwright ${Date.now()}`;
    await page.fill('input[name="nomineeName"]', uniqueName);
    await page.selectOption('select[name="primaryCraft"]', { index: 1 });
    await page.fill('input[name="yearsOfPractice"]', '30');

    // Section 2: Location Details
    await page.fill('input[name="district"]', 'Srinagar');
    await page.fill('input[name="tehsil"]', 'Downtown');
    await page.fill('input[name="village"]', 'Zaina Kadal');
    await page.fill('input[name="pinCode"]', '190002');

    // Section 3: Artisan Identification
    await page.selectOption('select[name="hasGovtArtisanId"]', 'No');

    // Section 4: Workshop Identification
    await page.selectOption('select[name="hasWorkshop"]', 'No');

    // Section 5: Nomination Details & Your Information
    await page.fill('textarea[name="notes"]', 'Nominated via automated browser E2E test for 30 years of master craftsmanship.');
    await page.fill('input[name="nominatorInfo"]', 'Playwright Test Suite');
    await page.fill('input[type="email"]', 'e2e@hcrf.org');
    await page.fill('input[type="tel"]', '+919906001122');
    await page.selectOption('select[name="relationship"]', 'Researcher');

    // Consent Checkbox
    await page.check('input[name="consentGiven"]');

    // Monitor Network Response
    const responsePromise = page.waitForResponse(
      response =>
        response.url().includes('/api/backend/participation/nominate') &&
        response.request().method() === 'POST'
    );

    // Submit Form Button
    await page.click('button[type="submit"]');

    const response = await responsePromise;
    expect(response.status()).toBe(201);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    const submissionNumber =
      body?.data?.data?.submissionNumber ??
      body?.data?.submissionNumber;

    expect(submissionNumber).toMatch(/^NOM-\d{6}-\d{3}$/);
    console.log('[PLAYWRIGHT_E2E_SUCCESS] Submission Number:', submissionNumber);

    // Confirm UI Rendered Success State & Ref Number
    await expect(page.getByText('Nomination Confirmed')).toBeVisible();
    await expect(page.getByText(submissionNumber)).toBeVisible();
  });
});
