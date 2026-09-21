import { test, expect } from '@playwright/test';

test('Canonical Metadata Policy: The internal code and ISBN must match the canonical API response', async ({ page, request }) => {
  // 1. Fetch the canonical metadata from the API
  const apiResponse = await request.get('/api/publications');
  const allPublications = await apiResponse.json();
  const rawTarget = allPublications.find((p: any) => p.slug === 'premium-pricing-trends-in-authentic-kashmiri-luxury-crafts');
  
  expect(rawTarget).toBeDefined();

  // Replicate the frontend's mapping rule for testing
  const rawIsbn = rawTarget.isbn || rawTarget.features?.isbn;
  let expectedPublishingSeries = null;
  let expectedIsbn = null;
  let expectedIsbnStatus = 'Pending';

  if (rawIsbn === null || (rawIsbn && rawIsbn.includes("|"))) {
    expectedPublishingSeries = rawIsbn;
  } else if (rawIsbn && rawIsbn !== "Pending") {
    expectedIsbn = rawIsbn;
    expectedIsbnStatus = 'REGISTERED';
  } else {
    expectedPublishingSeries = null;
  }

  // 2. Visit Publication Detail Page
  await page.goto('/publications/premium-pricing-trends-in-authentic-kashmiri-luxury-crafts');
  await page.waitForLoadState('networkidle');

  // 3. Assert the displayed data matches the canonical mapping
  const contentText = await page.locator('body').innerText();

  expect(contentText).toContain('PUBLICATION CODE');
  expect(contentText).toContain('HCRF-MI-2026-');

  if (expectedPublishingSeries) {
    expect(contentText).toContain('PUBLISHING SERIES');
    expect(contentText).toContain(expectedPublishingSeries);
  }

  if (expectedIsbn) {
    expect(contentText).toContain('ISBN CODE');
    expect(contentText).toContain(expectedIsbn);
  } else {
    expect(contentText).toContain('ISBN CODE');
    expect(contentText).toContain(expectedIsbnStatus);
  }

  console.log('✅ Canonical Metadata Policy Verified');
  console.log(`Publishing Series: ${expectedPublishingSeries}`);
  console.log(`ISBN Status: ${expectedIsbnStatus}`);
});
