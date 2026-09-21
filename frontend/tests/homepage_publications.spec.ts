import { test, expect } from '@playwright/test';

test('Homepage Publications Section Policy: 6-category grid with deterministic routing', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Verify section heading
  await expect(page.locator('text="Latest Kashmir Craft Publications"')).toBeVisible();

  // Find all publication cards on the homepage.
  const flipCards = page.locator('.group').filter({ hasText: 'View Publication' }).or(page.locator('.group').filter({ hasText: 'Coming Soon' }));
  const count = await flipCards.count();

  // The test database might not have all 6 categories seeded, but it should not have MORE than 6
  expect(count).toBeLessThanOrEqual(6);

  // We should extract the categories rendered to ensure uniqueness
  const renderedCategories = new Set<string>();
  
  for (let i = 0; i < count; i++) {
    const card = flipCards.nth(i);
    const textContent = await card.innerText();
    
    // Attempt to extract the category from the back card (it's the first small header)
    // Actually, easier to just check if any duplicates exist by looking at the small h5
    const categoryHeader = card.locator('h5');
    if (await categoryHeader.count() > 0) {
      const category = await categoryHeader.innerText();
      // Ensure no more than one latest record is shown per publication type
      expect(renderedCategories.has(category)).toBeFalsy();
      renderedCategories.add(category);
    }
    
    // Verify every card links to its own canonical detail route
    const link = card.locator('a:has-text("View Publication")');
    if (await link.count() > 0) {
      const href = await link.getAttribute('href');
      expect(href).toMatch(/^\/publications\/.+$/);
    }
  }

  // Verify the View All Publications CTA links to /publications
  const viewAllCta = page.locator('a:has-text("View All Publications")');
  await expect(viewAllCta).toBeVisible();
  expect(await viewAllCta.getAttribute('href')).toBe('/publications');

  console.log(`✅ Homepage Publications Policy Verified: Rendered ${count} unique categories.`);
});
