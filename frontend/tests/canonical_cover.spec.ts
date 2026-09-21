import { test, expect } from '@playwright/test';

test('Canonical Cover Lock Policy: Homepage, Catalogue, and Detail pages must use the exact same master cover image', async ({ page }) => {
  const targetPublicationTitle = 'Premium Pricing Trends in Authentic Kashmiri Luxury Crafts';

  // 1. Visit Homepage and find the cover for the publication
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Find the image specifically within the PublicationsSection that belongs to our target publication
  const homepageImageLocator = page.locator(`img[alt*="Premium Pricing Trends"]`).first();
  const homepageCoverSrc = await homepageImageLocator.getAttribute('src');
  
  expect(homepageCoverSrc).toBeTruthy();

  // 2. Visit Publications Catalogue
  await page.goto('/publications');
  await page.waitForLoadState('networkidle');

  const catalogueImageLocator = page.locator(`img[alt*="Premium Pricing Trends"]`).first();
  const catalogueCoverSrc = await catalogueImageLocator.getAttribute('src');

  expect(catalogueCoverSrc).toBeTruthy();

  // 3. Visit Publication Detail Page
  await page.goto('/publications/premium-pricing-trends-in-authentic-kashmiri-luxury-crafts');
  await page.waitForLoadState('networkidle');

  // On the detail page, DynamicBookCover renders the title as alt text usually, or we can grab the first cover image
  const detailImageLocator = page.locator(`img[alt*="Premium Pricing Trends"]`).first();
  const detailCoverSrc = await detailImageLocator.getAttribute('src');

  expect(detailCoverSrc).toBeTruthy();

  // 4. THE ASSERTION: The Canonical Cover Lock Policy
  // The exact same image path/asset MUST be used across all three surfaces.
  expect(homepageCoverSrc).toEqual(catalogueCoverSrc);
  expect(catalogueCoverSrc).toEqual(detailCoverSrc);

  console.log('✅ Canonical Cover Lock Verified:');
  console.log(`Homepage Cover:  ${homepageCoverSrc}`);
  console.log(`Catalogue Cover: ${catalogueCoverSrc}`);
  console.log(`Detail Cover:    ${detailCoverSrc}`);
});
