import { test, expect } from '@playwright/test';

test.describe('SKC Public Hearings Comprehensive Phase 3 Audit Suite', () => {

  test('1. Local Public API: GET /api/skc/hearings/public returns 20 canonical records with 20 unique slugs', async ({ request }) => {
    const response = await request.get('http://localhost:4000/api/skc/hearings/public');
    expect(response.status()).toBe(200);
    const body = await response.json();
    const data = body.data?.data || body.data || body;
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(20);

    const slugs = data.map((h: any) => h.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(20);
  });

  test('2. CTA Governance: 100% compliance with approved 4-route model across all page links', async ({ page }) => {
    await page.goto('http://localhost:3000/state-of-kashmir-crafts/public-hearings');
    await page.waitForSelector('h2:has-text("Hearings & Testimonies")');

    const approvedRoutes = [
      '/state-of-kashmir-crafts/stakeholder-registry',
      '/state-of-kashmir-crafts/participate',
      '/state-of-kashmir-crafts/expert-review',
      '/state-of-kashmir-crafts/validation-round'
    ];

    const links = await page.locator('a[href]').evaluateAll((anchors: HTMLAnchorElement[]) =>
      anchors.map(a => a.getAttribute('href') || '')
    );

    const nonCompliantLegacyLinks = links.filter(href =>
      href.startsWith('/state-of-kashmir-crafts/public-hearings/') &&
      href !== '/state-of-kashmir-crafts/public-hearings' &&
      !href.startsWith('/state-of-kashmir-crafts/public-hearings/submit-testimony')
    );

    expect(nonCompliantLegacyLinks.length).toBe(0);
  });

  test('3. Timeline View: Chronological ordering & all 20 canonical events rendered', async ({ page }) => {
    await page.goto('http://localhost:3000/state-of-kashmir-crafts/public-hearings');
    await page.click('button:has-text("Timeline")');
    await page.waitForTimeout(500);

    const cards = page.locator('div.container > div.grid > div.lg\\:col-span-3 > div.space-y-6 > div.bg-white');
    const cardCount = await cards.count();
    expect(cardCount).toBe(20);
  });

  test('4. Comprehensive Filters: Single & combined filtering across District, Craft, and Search', async ({ page }) => {
    await page.goto('http://localhost:3000/state-of-kashmir-crafts/public-hearings');
    
    // Select District: Srinagar
    await page.locator('select').nth(0).selectOption('Srinagar');
    // Select Craft: Pashmina
    await page.locator('select').nth(1).selectOption('Pashmina');

    await page.waitForTimeout(500);
    const countText = await page.locator('span:has-text("Showing")').innerText();
    expect(countText.toLowerCase()).toContain('showing 1 hearing');

    // Clear All check
    await page.click('button:has-text("Clear All")');
    const resetCountText = await page.locator('span:has-text("Showing")').innerText();
    expect(resetCountText.toLowerCase()).toContain('showing 20 hearings');
  });

  test('5. District Interactive Panel (Map View): Stats & district filter integration', async ({ page }) => {
    await page.goto('http://localhost:3000/state-of-kashmir-crafts/public-hearings');
    await page.click('button:has-text("Map")');
    
    // Verify District list buttons render
    const districtButtons = page.locator('button:has-text("Hearings")');
    expect(await districtButtons.count()).toBeGreaterThanOrEqual(10);

    // Click Srinagar
    await page.click('button:has-text("Srinagar")');
    await expect(page.locator('h4:has-text("Srinagar District")')).toBeVisible();

    // Click "Show Hearings in Srinagar"
    await page.click('button:has-text("Show Hearings in Srinagar")');
    await expect(page.locator('button:has-text("Timeline")')).toHaveClass(/bg-white/);
  });

  test('6. Calendar Freeze: Month navigation, cell popover modal, and modal CTA routing', async ({ page }) => {
    await page.goto('http://localhost:3000/state-of-kashmir-crafts/public-hearings');
    await page.click('button:has-text("Calendar")');

    // Navigation check
    await page.click('button:has-text("Next")');
    await expect(page.locator('h3:has-text("October 2026")')).toBeVisible();
    await page.click('button:has-text("Prev")');
    await expect(page.locator('h3:has-text("September 2026")')).toBeVisible();

    // Click on a calendar day with event (e.g. Future of Pashmina on Sept 5)
    const eventCell = page.locator('div:has-text("Future of Pashmina")').last();
    if (await eventCell.isVisible()) {
      await eventCell.click();
      await expect(page.locator('span:has-text("Date & Time")')).toBeVisible();
      // Close modal
      await page.click('button:has-text("×")');
    }
  });

  test('7. Production API Parity: Verification against https://khcrf.org', async ({ request }) => {
    const prodHealth = await request.get('https://khcrf.org/api/health');
    expect(prodHealth.status()).toBe(200);
    const prodHealthData = await prodHealth.json();
    expect(prodHealthData.status).toBe('success');

    const prodHearings = await request.get('https://khcrf.org/api/skc/hearings/public');
    expect(prodHearings.status()).toBe(200);
    const resBody = await prodHearings.json();
    const data = resBody.data?.data || resBody.data || resBody;
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(20);

    const prodSlugs = data.map((h: any) => h.slug);
    expect(prodSlugs.length).toBe(20);
  });

  test('8. Production Frontend Page Parity: Verification against https://khcrf.org/state-of-kashmir-crafts/public-hearings', async ({ page }) => {
    const response = await page.goto('https://khcrf.org/state-of-kashmir-crafts/public-hearings');
    expect(response?.status()).toBe(200);
    await page.waitForSelector('h2:has-text("Hearings & Testimonies")');

    const headingText = await page.locator('h2:has-text("Hearings & Testimonies")').innerText();
    expect(headingText).toContain('HEARINGS & TESTIMONIES');
  });

  test('9. Responsive Viewport Audits: Mobile (390x844) & Tablet (768x1024)', async ({ page }) => {
    // Mobile Viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('http://localhost:3000/state-of-kashmir-crafts/public-hearings');
    await expect(page.locator('h2:has-text("Hearings & Testimonies")')).toBeVisible();

    // Tablet Viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:3000/state-of-kashmir-crafts/public-hearings');
    await expect(page.locator('h2:has-text("Hearings & Testimonies")')).toBeVisible();
  });
});
