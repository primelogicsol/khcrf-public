import { test, expect } from '@playwright/test';

test('Frontend is operational', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/HCRF/);
});

test('Backend Health Check is operational', async ({ request }) => {
  const response = await request.get('http://localhost:4000/api/health');
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.status).toBe('success');
});
