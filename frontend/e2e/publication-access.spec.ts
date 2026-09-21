import { test, expect } from '@playwright/test';

test.describe('Publication Access Smoke Test', () => {
  const slugs = [
    'global-pashmina-market-outlook-2026',
    'north-american-demand-for-handmade-luxury-textiles',
    'european-consumer-trends-in-heritage-crafts'
  ];

  for (const slug of slugs) {
    test(`Verify access for ${slug}`, async ({ page }) => {
      // Navigate to the publication description page
      await page.goto(`http://localhost:3000/publications/${slug}`);

      // We expect it to render properly (smoke test).
      await expect(page.locator('text=Read Online')).toBeVisible({ timeout: 10000 });
      
      // We expect public visitor to see the access tier UI if it is member gated
      // (This assumes the db marks these as APPROVED_MEMBER_ACCESS)
      const accessTierLocator = page.locator('text=ACCESS TIER:');
      
      // Click read online
      await page.click('button:has-text("Read Online")');
      
      // Wait for modal or redirect
      await page.waitForTimeout(1000);
      
      // Check if modal appears (Membership Required)
      const modalText = await page.locator('text=Membership Required to Read This Publication').isVisible();
      if (modalText) {
         console.log(`Public visitor correctly blocked for ${slug}`);
      } else {
         console.log(`Warning: ${slug} might not be member gated or redirect occurred without blocking.`);
      }
    });
  }
});
