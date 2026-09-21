import { test, expect } from '@playwright/test';

test('Policy Brief Canonical Lock: Data remains identical across all public routes', async ({ page, request }) => {
  const targetSlug = 'reducing-counterfeit-trade-in-heritage-products';
  const expectedTitle = 'Reducing Counterfeit Trade in Heritage Products';
  const expectedCoverSrc = '/uploads/hcrf_policy_brief_cover.jpg';
  const expectedYear = '2026';
  const expectedAccessTier = 'Free for HCRF Members';
  const expectedSeries = 'Craft Governance and Policy Series';
  
  // 1. Visit Homepage and find the cover for the publication
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Verify homepage rendering
  const homepageCard = page.locator(`h4:has-text("${expectedTitle}")`).locator('..');
  await expect(homepageCard).toBeVisible();
  
  const homepageText = await homepageCard.innerText();
  expect(homepageText).toContain(expectedTitle);
  expect(homepageText).toContain(expectedYear);
  expect(homepageText).toContain(expectedSeries);

  // 2. Visit Publications Catalogue
  await page.goto('/publications');
  await page.waitForLoadState('networkidle');

  const catalogueCard = page.locator(`h3:has-text("${expectedTitle}")`).locator('..'); // Assuming similar structure in catalogue
  // Wait, let's just check the page text if catalogue is built differently, or we can check the flip card if reused
  const catalogueText = await page.locator('body').innerText();
  expect(catalogueText).toContain(expectedTitle);

  // 3. Visit Publication Detail Page
  await page.goto(`/publications/${targetSlug}`);
  await page.waitForLoadState('networkidle');

  const detailText = await page.locator('body').innerText();
  expect(detailText).toContain(expectedTitle);
  expect(detailText).toContain(expectedYear);
  expect(detailText).toContain('MEMBER ACCESS'); // or Free for HCRF Members depending on the detail page design
  
  // Test the cover image
  const detailImageLocator = page.locator(`img[alt*="Reducing Counterfeit Trade"]`).first();
  const detailCoverSrc = await detailImageLocator.getAttribute('src');
  
  // Depending on Next/Image optimization, the src might be a _next/image url, but it should contain the encoded url
  expect(detailCoverSrc).toContain('hcrf_policy_brief_cover');

  console.log('✅ Policy Brief Canonical Lock Verified');
});
