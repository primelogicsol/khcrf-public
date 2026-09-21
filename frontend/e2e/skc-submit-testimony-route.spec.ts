import { test, expect } from '@playwright/test';

test.describe('Dedicated Submit Testimony Route Suite', () => {

  test('1. Submit Testimony CTA in Timeline routes to /submit-testimony with hearingSlug parameter', async ({ page }) => {
    await page.goto('http://localhost:3000/state-of-kashmir-crafts/public-hearings');
    await page.waitForSelector('h2:has-text("Hearings & Testimonies")');

    // Click Submit Testimony on the first timeline card
    const firstTestimonyBtn = page.locator('a[href*="/submit-testimony?hearingSlug="]').first();
    const targetHref = await firstTestimonyBtn.getAttribute('href');

    expect(targetHref).not.toContain('/participate');
    expect(targetHref).toContain('/state-of-kashmir-crafts/public-hearings/submit-testimony?hearingSlug=');

    // Navigate to testimony form via CTA
    await firstTestimonyBtn.click();
    await page.waitForSelector('h1:has-text("Submit Written Testimony")');

    // Verify page URL contains hearingSlug parameter
    expect(page.url()).toContain('/state-of-kashmir-crafts/public-hearings/submit-testimony?hearingSlug=');

    // Verify selected hearing pre-selection box is visible
    await expect(page.locator('select').first()).toBeVisible();
    const selectedOptionVal = await page.locator('select').first().inputValue();
    expect(selectedOptionVal).not.toBe('general');
  });

  test('2. Calendar Popover Modal Submit Testimony CTA routes to /submit-testimony with hearingSlug parameter', async ({ page }) => {
    await page.goto('http://localhost:3000/state-of-kashmir-crafts/public-hearings');
    await page.click('button:has-text("Calendar")');

    // Click an event on the calendar
    const eventCell = page.locator('div:has-text("Future of Pashmina")').last();
    if (await eventCell.isVisible()) {
      await eventCell.click();
      const modalTestimonyBtn = page.locator('.fixed a:has-text("Submit Testimony")');
      await expect(modalTestimonyBtn).toBeVisible();

      const modalHref = await modalTestimonyBtn.getAttribute('href');
      expect(modalHref).not.toContain('/participate');
      expect(modalHref).toContain('/state-of-kashmir-crafts/public-hearings/submit-testimony?hearingSlug=');
    }
  });

  test('3. Testimony Form direct URL with hearingSlug parameter displays pre-filled hearing metadata box', async ({ page }) => {
    await page.goto('http://localhost:3000/state-of-kashmir-crafts/public-hearings/submit-testimony?hearingSlug=future-of-pashmina-05-sept-2026');
    await page.waitForSelector('h1:has-text("Submit Written Testimony")');

    // Verify hearing metadata card renders
    await expect(page.locator('p:has-text("Future of Pashmina")')).toBeVisible();
    await expect(page.locator('select').first()).toHaveValue(/^[a-z0-9-]+$/);
  });
});
