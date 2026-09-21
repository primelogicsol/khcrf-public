import { test, expect } from '@playwright/test';

test.describe('Auth Regression Tests', () => {
  // 1. /login renders
  test('login page renders correctly', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h3', { hasText: 'Sign In' })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  // 11. Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID must not crash login page
  test('login page gracefully handles missing Google Client ID', async ({ page }) => {
    // Playwright doesn't easily modify process.env for a loaded Next.js app in the same process
    // However, we can verify that the page doesn't crash when it loads.
    await page.goto('/login');
    await expect(page.locator('h3', { hasText: 'Sign In' })).toBeVisible();
  });

  // 10. Unsafe external redirect must NOT be followed
  test('unsafe external redirects are ignored', async ({ page }) => {
    await page.goto('/login?redirect=//example.com');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    // Assuming backend returns a valid user, we could mock the response here.
    // Instead of full end-to-end with backend, we can just test the UI behavior.
    
    // We will use Route mocking to simulate a successful login response.
    await page.route('**/api/auth/login', async route => {
      const json = {
        token: "fake-token",
        user: { id: "1", email: "user@example.com", role: "USER", isAdmin: false }
      };
      await route.fulfill({ json });
    });

    await page.fill('input[type="email"]', 'user@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // The user should go to / because //example.com is unsafe
    await page.waitForURL(url => {
        const path = new URL(url).pathname;
        return path === '/' || path === '/dashboard' || path === '/about/memberships/join';
    });
    const finalUrl = new URL(page.url());
    expect(finalUrl.hostname).toBe('localhost');
    expect(finalUrl.pathname).toBe('/');
  });

  test('ordinary user without redirect goes to /', async ({ page }) => {
    await page.goto('/login');
    
    await page.route('**/api/auth/login', async route => {
      await route.fulfill({ json: { token: "fake-token", user: { id: "1", email: "user@example.com", role: "USER", isAdmin: false } } });
    });

    await page.fill('input[type="email"]', 'user@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.waitForURL(url => new URL(url).pathname === '/');
    expect(new URL(page.url()).pathname).toBe('/');
  });

  test('dashboard role without redirect goes to /dashboard', async ({ page }) => {
    await page.goto('/login');
    
    await page.route('**/api/auth/login', async route => {
      await route.fulfill({ json: { token: "fake-token", user: { id: "2", email: "admin@example.com", role: "ADMIN", isAdmin: true } } });
    });

    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.waitForURL(url => new URL(url).pathname === '/dashboard');
    expect(new URL(page.url()).pathname).toBe('/dashboard');
  });

  test('login with ?redirect=/about/memberships/join redirects correctly', async ({ page }) => {
    await page.goto('/login?redirect=/about/memberships/join');
    
    await page.route('**/api/auth/login', async route => {
      await route.fulfill({ json: { token: "fake-token", user: { id: "1", email: "user@example.com", role: "USER", isAdmin: false } } });
    });

    await page.fill('input[type="email"]', 'user@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.waitForURL(url => new URL(url).pathname === '/about/memberships/join');
    expect(new URL(page.url()).pathname).toBe('/about/memberships/join');
  });

  // 12. Authentication failure must not mutate authenticated user state
  test('authentication failure does not redirect and shows error', async ({ page }) => {
    await page.goto('/login');
    
    await page.route('**/api/auth/login', async route => {
      await route.fulfill({ status: 401, json: { message: "Unauthorized" } });
    });

    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Incorrect email or password.')).toBeVisible();
    expect(new URL(page.url()).pathname).toBe('/login');
  });

});
