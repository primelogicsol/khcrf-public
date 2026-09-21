import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import path from 'path';

test.describe('Auth Forgot Password Functional Audit', () => {
  test.setTimeout(60000);
  const ROUTE = '/forgot-password';
  const timestamp = Date.now();
  const testEmail = `forgot.user.${timestamp}@example.com`;
  const testPassword = 'OldPassword123!';
  const newPassword = 'NewPassword456!';

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

  test('Forgot password flow works end-to-end', async ({ page }) => {
    await page.goto(ROUTE);
    
    // Check page loaded
    await expect(page.locator('h3', { hasText: 'Reset Password' })).toBeVisible();

    // Fill email form
    await page.locator('input[type="email"]').fill(testEmail);
    
    // Submit forgot password request
    const forgotPromise = page.waitForResponse(res => res.url().includes('/auth/forgot-password') && res.request().method() === 'POST');
    await page.locator('button[type="submit"]', { hasText: 'Send Reset Code' }).click();
    
    const forgotRes = await forgotPromise;
    expect(forgotRes.status()).toBe(200);
    
    // Wait for step 2 (OTP and new password form)
    await expect(page.locator('button[type="submit"]', { hasText: 'Reset Password' })).toBeVisible();
    
    // Fetch OTP from database directly since we are simulating email
    const scriptPath = path.join(process.cwd(), 'backend', 'get_otp.ts');
    const otpOutput = execSync(`npx tsx "${scriptPath}" "${testEmail}"`, { cwd: path.join(process.cwd(), 'backend') }).toString().trim();
    const otpMatch = otpOutput.match(/OTP_IS:(\d{6})/);
    const otp = otpMatch ? otpMatch[1] : '';
    
    expect(otp).toBeTruthy();
    expect(otp).toMatch(/^\d{6}$/);
    
    // Fill OTP and new password
    await page.locator('input[placeholder="6-Digit Verification Code"]').fill(otp);
    await page.locator('input[placeholder="Create a new password"]').fill(newPassword);
    await page.locator('input[placeholder="Confirm your new password"]').fill(newPassword);
    
    // Submit reset password request
    const resetPromise = page.waitForResponse(res => res.url().includes('/auth/reset-password') && res.request().method() === 'POST');
    await page.locator('button[type="submit"]', { hasText: 'Reset Password' }).click();
    
    const resetRes = await resetPromise;
    expect(resetRes.status()).toBe(200);
    
    // Check success message and navigation to login
    await expect(page.locator('text=Password reset successfully')).toBeVisible();
    await expect(page).toHaveURL(/.*\/login/);
  });
});
