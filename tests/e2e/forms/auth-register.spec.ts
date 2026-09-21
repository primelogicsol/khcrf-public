import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import path from 'path';

test.describe('Auth Registration Functional Audit', () => {
  test.setTimeout(60000); // 60 seconds
  const ROUTE = '/register';
  const timestamp = Date.now();
  const testEmail = `test.user.${timestamp}@example.com`;

  test.afterAll(async () => {
    // Cleanup the test user
    const cleanupScript = path.join(process.cwd(), 'backend', 'delete_user.ts');
    try {
      execSync(`npx tsx "${cleanupScript}" "${testEmail}"`, { stdio: 'ignore', cwd: path.join(process.cwd(), 'backend') });
    } catch (e) {
      console.error('Cleanup failed', e);
    }
  });

  test('Form submission, OTP verification, and success UI works', async ({ page }) => {
    await page.goto(ROUTE);
    
    // Check page loaded
    await expect(page.locator('h3', { hasText: 'Create Your Account' })).toBeVisible();

    // Fill registration form
    await page.locator('input[type="text"]').fill(`Test User ${timestamp}`);
    await page.locator('input[type="email"]').fill(testEmail);
    await page.locator('input[type="password"]').fill('Password123!');
    
    // Submit
    const signupPromise = page.waitForResponse(res => res.url().includes('/auth/signup') && res.request().method() === 'POST');
    await page.locator('button[type="submit"]', { hasText: 'Create Account' }).click();
    
    const signupRes = await signupPromise;
    expect(signupRes.status()).toBe(201);
    
    // Wait for step 2 (OTP form)
    await expect(page.locator('button[type="submit"]', { hasText: 'Verify Email' })).toBeVisible();
    
    // Fetch OTP from database directly since we are simulating email
    const scriptPath = path.join(process.cwd(), 'backend', 'get_otp.ts');
    const otpOutput = execSync(`npx tsx "${scriptPath}" "${testEmail}"`, { cwd: path.join(process.cwd(), 'backend') }).toString().trim();
    const otpMatch = otpOutput.match(/OTP_IS:(\d{6})/);
    const otp = otpMatch ? otpMatch[1] : '';
    
    expect(otp).toBeTruthy();
    expect(otp).toMatch(/^\d{6}$/);
    
    // Fill OTP
    await page.locator('input[placeholder="6-Digit Verification Code"]').fill(otp);
    
    // Submit OTP verification
    const verifyPromise = page.waitForResponse(res => res.url().includes('/auth/verify-email') && res.request().method() === 'POST');
    await page.locator('button[type="submit"]', { hasText: 'Verify Email' }).click();
    
    const verifyRes = await verifyPromise;
    expect(verifyRes.status()).toBe(200);
    
    // Check navigation to dashboard or home after successful login
    await expect(page).toHaveURL(/.*\/dashboard|.*\//);
  });
});
