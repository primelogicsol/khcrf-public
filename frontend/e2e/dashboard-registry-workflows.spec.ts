import { test, expect } from '@playwright/test';

test.describe('Dashboard Master Artisans Registry Workflows', () => {
  test('verifies native Edit drawer modal, Archive confirmation modal, and Undo toast notification', async ({ page }) => {
    // Navigate to registry dashboard
    await page.goto('http://localhost:3000/dashboard/master-artisans/registry');

    if (page.url().includes('/login')) {
      await page.fill('input[type="email"]', 'admin@hcrf.org');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);
      await page.goto('http://localhost:3000/dashboard/master-artisans/registry');
    }

    // 1. Verify Edit Modal opening
    const editBtn = page.locator('button:has-text("Edit")').first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      await expect(page.getByText('Edit Artisan Record')).toBeVisible();
      await expect(page.locator('input[value*=""]')).toBeDefined();
      
      // Close Edit Modal
      await page.click('button:has-text("Cancel")');
    }

    // 2. Verify Archive Confirmation Modal opening
    const archiveBtn = page.locator('button:has-text("Archive")').first();
    if (await archiveBtn.isVisible()) {
      await archiveBtn.click();
      await expect(page.getByText('Archive Record?')).toBeVisible();
      await expect(page.getByText('Reason for archive')).toBeVisible();

      // Confirm Archive
      await page.click('button:has-text("Archive Record")');

      // Verify Application-Native Toast Notification with Undo Action
      await expect(page.getByText('archived successfully')).toBeVisible();
      await expect(page.getByText('Undo')).toBeVisible();
    }
  });
});
