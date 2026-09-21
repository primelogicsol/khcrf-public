import { chromium, FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function globalSetup(config: FullConfig) {
  const authDir = path.join(__dirname, '.auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const baseURL = config.projects[0]?.use.baseURL || 'http://localhost:3000';

  // Public state (empty)
  await page.context().storageState({ path: path.join(authDir, 'public.json') });

  // Admin login
  try {
    await page.goto(`${baseURL}/login`);
    await page.fill('input[type="email"]', 'fk.envcal@gmail.com');
    await page.fill('input[type="password"]', 'Khcrf12345678987654321%');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard**', { timeout: 10000 });
    await page.context().storageState({ path: path.join(authDir, 'admin.json') });
    console.log('Admin auth state saved.');
  } catch (error) {
    console.error('Failed to log in as admin:', error);
  }

  // Basic User login (we will register one)
  try {
    const userEmail = `testuser_${Date.now()}@example.com`;
    const userPass = `TestPass123!`;
    await page.goto(`${baseURL}/register`);
    // Assuming standard registration fields
    await page.fill('input[name="name"], input[placeholder*="Name"]', 'Test User').catch(() => {});
    await page.fill('input[type="email"]', userEmail);
    await page.fill('input[type="password"]', userPass);
    // If there's a confirm password
    await page.fill('input[name="confirmPassword"]', userPass).catch(() => {});
    await page.click('button[type="submit"]');
    // Wait a bit and grab state
    await page.waitForTimeout(3000);
    await page.context().storageState({ path: path.join(authDir, 'user.json') });
    console.log('User auth state saved.');
  } catch (error) {
    console.error('Failed to register/log in as user:', error);
  }

  await browser.close();
}

export default globalSetup;
