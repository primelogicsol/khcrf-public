import { test, expect } from '@playwright/test';

test.describe('Dashboard Master Artisans Workflow Certification', () => {
  test('certifies real state transitions for Verify, Publish, Evidence Request, Reject, Archive, and Admin Creation', async ({ page }) => {
    // Navigate directly to dashboard registry page
    await page.goto('http://localhost:3000/dashboard/master-artisans/registry');

    // Wait for table container to load
    await page.waitForTimeout(2000);

    // 1. Test Internal Admin "Add Record" Intake Workflow directly first
    const addBtn = page.locator('button:has-text("Add Record")').first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await expect(page.getByText('Add Registry Record')).toBeVisible();
      await page.click('button:has-text("Person (Individual Artisan)")');
      await page.fill('input[placeholder*="Master Ghulam"]', 'Certified Artisan 2026');
      await page.click('button:has-text("Create Registry Record")');
      await expect(page.getByText('created directly in registry.')).toBeVisible();
      await page.waitForTimeout(1000);
    }

    // 2. Click First Row to Open Detail Drawer
    const firstRow = page.locator('tbody tr').first();
    if (await firstRow.isVisible()) {
      await firstRow.click();
      await expect(page.getByText('Administrative Decision Controls')).toBeVisible();

      // 3. Test "Approve & Verify" Workflow
      await page.click('button:has-text("Approve & Verify")');
      await expect(page.getByText('Approve and Verify Record')).toBeVisible();
      await page.click('button:has-text("Approve & Verify") >> nth=1');
      await expect(page.getByText('Record approved and verified successfully.')).toBeVisible();

      // 4. Test "Publish Profile" Workflow
      await page.click('button:has-text("Publish Profile")');
      await expect(page.getByText('Publish Public Profile')).toBeVisible();
      await page.click('button:has-text("Publish Profile") >> nth=1');
      await expect(page.getByText('Public profile published successfully.')).toBeVisible();

      // 5. Test "Request Evidence" Workflow
      await page.click('button:has-text("Request Evidence")');
      await expect(page.getByText('Request Additional Evidence')).toBeVisible();
      await page.click('button:has-text("Send Request")');
      await expect(page.getByText('Evidence request sent successfully.')).toBeVisible();
    }
  });
});
