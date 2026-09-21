import { test, expect } from '@playwright/test';

test.describe('Institutional Registration E2E Flow', () => {
  test('submits institution registration via browser UI and receives confirmed SKC reference number', async ({ page }) => {
    // Navigate to public form
    await page.goto('http://localhost:3000/state-of-kashmir-crafts/participating-institutions');

    // Select Scope: BOTH (HCRF & State of Kashmir Crafts)
    await page.check('input[value="BOTH"]');

    // Fill Institution Details
    const uniqueInstName = `Kashmir Craft Trust ${Date.now()}`;
    await page.fill('input[placeholder="Full legal name of the institution or organization"]', uniqueInstName);
    await page.selectOption('select >> nth=0', 'Non-Governmental Organization (NGO)');
    await page.fill('input[placeholder="https://"]', 'https://kashmircraft.org');

    // Fill Representative Details
    await page.fill('input[placeholder="Your full name"]', 'Dr. Playwright Representative');
    await page.fill('input[placeholder="e.g. Director, Dean, Secretary"]', 'Executive Director');

    // Fill Contact & Location Details
    const uniqueEmail = `inst_${Date.now()}@kashmircraft.org`;
    await page.fill('input[type="email"]', uniqueEmail);
    await page.fill('input[type="tel"]', '+919906008899');
    await page.selectOption('select >> nth=1', 'India');

    // District/City
    await page.fill('input[placeholder="District / City"]', 'Srinagar');

    // Select Participation Types
    await page.click('text=Institutional Registration');

    // Fill Profile & Proposed Contribution
    await page.fill('textarea >> nth=0', 'Leading non-profit cultural organization dedicated to preserving traditional Kashmiri craftsmanship.');
    await page.fill('textarea >> nth=1', 'Providing field access to craft clusters in Srinagar and archival documentation of carpet weaving.');

    // Check mandatory consents via ID
    await page.check('#authConsent');
    await page.check('#privacyConsent');
    await page.check('#publicDirectoryConsent');

    // Monitor Network Response
    const responsePromise = page.waitForResponse(
      response =>
        response.url().includes('/api/backend/skc/institutions/register') &&
        response.request().method() === 'POST'
    );

    // Submit Form Button
    await page.click('button[type="submit"]');

    const response = await responsePromise;
    expect(response.status()).toBe(201);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    // responseFormatter wraps status 201 res.json in { status: 'success', data: { success: true, message: ..., data: { referenceNumber: ... } } }
    const referenceNumber =
      body?.data?.data?.referenceNumber ??
      body?.data?.referenceNumber ??
      body?.referenceNumber;

    expect(referenceNumber).toMatch(/^SKC-INS-\d{6}$/);
    console.log('[INSTITUTION_E2E_SUCCESS] Reference Number:', referenceNumber);

    // Confirm UI Rendered Success State & Reference Number
    await expect(page.getByText('Registration Submitted')).toBeVisible();
    await expect(page.getByText(referenceNumber)).toBeVisible();
  });
});
