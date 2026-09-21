import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import path from 'path';

test.describe('Auth Login Functional Audit', () => {
  test.setTimeout(60000);
  const ROUTE = '/login';
  const timestamp = Date.now();
  const testEmail = `login.user.${timestamp}@example.com`;
  const testPassword = 'Password123!';

  test.beforeAll(async () => {
    // Create the test user using the backend script
    const createScript = path.join(process.cwd(), 'backend', 'create_test_user.ts');
    try {
      execSync(`npx tsx "${createScript}" "${testEmail}" "${testPassword}"`, { stdio: 'ignore', cwd: path.join(process.cwd(), 'backend') });
    } catch (e) {
      console.error('User creation failed', e);
    }
  });

  test.afterAll(async () => {
    // Cleanup the test user
    const cleanupScript = path.join(process.cwd(), 'backend', 'delete_user.ts');
    try {
      execSync(`npx tsx "${cleanupScript}" "${testEmail}"`, { stdio: 'ignore', cwd: path.join(process.cwd(), 'backend') });
    } catch (e) {
      console.error('Cleanup failed', e);
    }
  });

  test('Form submission and success UI works', async ({ page }) => {
    await page.goto(ROUTE);
    
    // Check page loaded
    await expect(page.locator('h3', { hasText: 'Sign In' })).toBeVisible();

    // Fill login form
    await page.locator('input[type="email"]').fill(testEmail);
    await page.locator('input[type="password"]').fill(testPassword);
    
    // Submit
    const loginPromise = page.waitForResponse(res => res.url().includes('/auth/login') && res.request().method() === 'POST');
    await page.locator('button[type="submit"]', { hasText: 'Sign In' }).click();
    
    const loginRes = await loginPromise;
    expect(loginRes.status()).toBe(200);
    
    // Check navigation to dashboard or home after successful login
    await expect(page).toHaveURL(/.*\/dashboard|.*\//);
  });
});
