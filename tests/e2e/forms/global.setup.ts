import { test as setup, expect } from '@playwright/test';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const authFileDir = path.join(process.cwd(), 'playwright', '.auth');

// Create the .auth directory if it doesn't exist
if (!fs.existsSync(authFileDir)) {
  fs.mkdirSync(authFileDir, { recursive: true });
}

setup('seed users and create auth fixtures', async ({ page }) => {
  setup.setTimeout(120000); // 2 minutes

  // 1. Seed the users in the database
  const seedScript = path.join(process.cwd(), 'backend', 'seed_test_users.ts');
  console.log('Seeding test users...');
  execSync(`npx tsx "${seedScript}"`, { stdio: 'inherit', cwd: path.join(process.cwd(), 'backend') });

  const users = [
    { email: 'user@example.com', file: 'user.json' },
    { email: 'member@example.com', file: 'member.json' },
    { email: 'editor@example.com', file: 'editor.json' },
    { email: 'admin@example.com', file: 'admin.json' }
  ];
  
  // Public.json is just an empty state
  fs.writeFileSync(path.join(authFileDir, 'public.json'), JSON.stringify({ cookies: [], origins: [] }));

  for (const u of users) {
    console.log(`Creating auth fixture for ${u.email}...`);
    // Clear cookies for the new session
    await page.context().clearCookies();
    
    await page.goto('/login');
    await page.locator('input[type="email"]').first().fill(u.email);
    await page.locator('input[type="password"]').first().fill('Password123!');
    
    // Submit
    const loginPromise = page.waitForResponse(res => res.url().includes('/auth/login') && res.request().method() === 'POST');
    await page.locator('button[type="submit"]', { hasText: 'Sign In' }).first().click();
    await loginPromise;
    
    // Wait for redirect to dashboard or home
    await expect(page).toHaveURL(/.*\/dashboard|.*\//);
    
    // Save storage state
    await page.context().storageState({ path: path.join(authFileDir, u.file) });
  }
});
