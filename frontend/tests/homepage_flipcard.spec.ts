import { test, expect } from '@playwright/test';

test('Homepage Flipcard Policy: Back card must function as an institutional editorial panel', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Find the flip card for the flagship publication
  const flipCardTitle = 'Premium Pricing Trends in Authentic Kashmiri Luxury Crafts';
  
  // We locate the card container by the title text that appears on the back side
  const backCard = page.locator(`h4:has-text("${flipCardTitle}")`).locator('..');
  
  // 1. Assert CTA href equals the canonical detail slug
  const ctaButton = backCard.locator('a:has-text("View Publication")');
  await expect(ctaButton).toBeVisible();
  const href = await ctaButton.getAttribute('href');
  expect(href).toBe('/publications/premium-pricing-trends-in-authentic-kashmiri-luxury-crafts');

  // 2. Assert no price is rendered
  const cardText = await backCard.innerText();
  expect(cardText).not.toContain('₹');
  expect(cardText).not.toContain('Member Price');
  expect(cardText).not.toContain('75.00');
  expect(cardText).not.toContain('150.00');

  // 3. Assert access shows "Free for HCRF Members"
  expect(cardText).toContain('Free for HCRF Members');

  // 4. Assert summary matches the canonical publication record (using a snippet to avoid exact whitespace issues)
  expect(cardText).toContain('A global market intelligence report');

  // 5. Assert canonical metadata fields
  expect(cardText).toContain('Market Intelligence');
  expect(cardText).toContain('Pricing Intelligence Series');
  expect(cardText).toContain('2026');
  expect(cardText).toContain('120 Pages');

  console.log('✅ Homepage Flipcard Policy Verified: Editorial Panel successfully replaced e-commerce card');
});
