import { test, expect } from '@playwright/test';

test.describe('Dashboard User Flows', () => {
  test('Should navigate to login page and render form', async ({ page }) => {
    // Navigate to login
    await page.goto('/login');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/HCRF/);

    // Expect the login form to be visible
    const emailInput = page.getByPlaceholder(/Email/i);
    await expect(emailInput).toBeVisible();

    const passwordInput = page.getByPlaceholder(/Password/i);
    await expect(passwordInput).toBeVisible();

    const submitButton = page.getByRole('button', { name: /Sign In/i });
    await expect(submitButton).toBeVisible();
  });

  test('Should navigate to public search and perform search', async ({ page }) => {
    await page.goto('/search');

    const searchInput = page.getByPlaceholder(/Search/i);
    await expect(searchInput).toBeVisible();

    await searchInput.fill('Pashmina');
    await searchInput.press('Enter');

    // Just verifying that search page doesn't crash on submit
    await expect(page.getByRole('main')).toBeVisible();
  });
});
