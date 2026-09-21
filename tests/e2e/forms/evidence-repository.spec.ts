import { test, expect } from '@playwright/test';

test.describe('Evidence Repository Functional Audit', () => {
  const ROUTE = '/state-of-kashmir-crafts/evidence-repository';
  const timestamp = Date.now();

  test('Page loads correctly and fetches metrics/search', async ({ page }) => {
    const metricsPromise = page.waitForResponse(res => res.url().includes('/api/skc/evidence/public/metrics') && res.status() === 200);
    const searchPromise = page.waitForResponse(res => res.url().includes('/api/skc/evidence/public/search') && res.status() === 200);

    await page.goto(ROUTE);

    await metricsPromise;
    await searchPromise;

    await expect(page.locator('h2', { hasText: 'Live Repository Statistics' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Advanced Repository Search' })).toBeVisible();
  });

  test('Empty state behavior works when no results match', async ({ page }) => {
    await page.goto(ROUTE);
    
    const searchInput = page.locator('input[placeholder*="Search by keyword"]');
    await searchInput.fill('NON_EXISTENT_QUERY_123456');
    
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    
    await expect(page.locator('h3', { hasText: 'No Matching Records Found' })).toBeVisible();
  });

  test('Form submission, validation, and success UI works', async ({ page }) => {
    await page.goto(ROUTE);
    
    // First, trigger an empty state so the submit button appears
    const searchInput = page.locator('input[placeholder*="Search by keyword"]');
    await searchInput.fill('QUERY_TO_FORCE_EMPTY_STATE_777');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await expect(page.locator('h3', { hasText: 'No Matching Records Found' })).toBeVisible();
    
    // Open submission modal
    await page.locator('button', { hasText: 'Submit New Evidence' }).click();
    
    const submitBtn = page.locator('button[type="submit"]', { hasText: 'Submit Evidence' });
    await expect(submitBtn).toBeVisible();
    
    // Fill out the form using robust selectors
    // Since we don't have explicit <label htmlFor="..."> we can use locator matching text, or just nth input
    // The inputs in the modal are:
    // 0: Title
    // 1: Contributor Name
    // 2: Email Address
    // 3: Organization
    // 4: Publication Date
    
    const modal = page.locator('.fixed.inset-0');
    await modal.locator('input[type="text"]').nth(0).fill(`Test Evidence Title ${timestamp}`);
    await modal.locator('select').nth(0).selectOption('Document');
    await modal.locator('input[type="email"]').fill(`test-${timestamp}@example.com`);
    
    // Upload file
    const fileChooserPromise = page.waitForEvent('filechooser');
    await modal.locator('input[type="file"]').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: 'test-evidence.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('mock evidence content')
    });
    
    // Check consent checkbox (it's the last checkbox)
    await modal.locator('input[type="checkbox"]').last().check({ force: true });
    
    // Click submit and wait for network
    const submitPromise = page.waitForResponse(res => res.url().includes('/api/skc/evidence/public/submit'));
    await submitBtn.click();
    
    const res = await submitPromise;
    expect(res.status()).toBe(200);
    
    // Check success UI
    await expect(page.locator('h4', { hasText: 'Evidence Submission Received' })).toBeVisible();
  });
});
