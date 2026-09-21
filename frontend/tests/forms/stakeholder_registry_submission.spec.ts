import { test, expect } from '@playwright/test';

test.describe('Stakeholder Registry Form - Submission Lifecycle', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/state-of-kashmir-crafts/stakeholder-registry?type=individual');
    
    // Fill required fields
    await page.locator('input[type="text"]').first().fill('Test User'); // Name
    
    const categorySelect = page.locator('select').first();
    await categorySelect.selectOption({ label: 'Artisan / Weaver' });
    
    const districtSelect = page.locator('select').nth(1);
    await districtSelect.selectOption({ index: 1 }); // Just select first valid option
    
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="checkbox"]').last().check(); // Consent checkbox
  });

  test('1. Successful submission - 201', async ({ page }) => {
    // Mock the successful API response
    await page.route('**/api/backend/skc/stakeholders/register', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          data: {
            success: true,
            message: "Profile created successfully.",
            data: {
              referenceNumber: "SKC-STK-001234",
              status: "SUBMITTED"
            }
          }
        })
      });
    });

    const submitBtn = page.getByRole('button', { name: /Submit Stakeholder Profile/i });
    
    // Check initial state
    await expect(submitBtn).toBeEnabled();
    
    // Trigger submit without awaiting immediately to check loading state
    const submitPromise = submitBtn.click();
    
    // Spinner should appear and button should be disabled
    await expect(page.locator('.animate-spin')).toBeVisible();
    await expect(submitBtn).toBeDisabled();
    
    await submitPromise;
    
    // After resolution, spinner should disappear and confirmation appears
    await expect(page.locator('.animate-spin')).toBeHidden();
    
    // Reference number renders
    await expect(page.getByText('SKC-STK-001234')).toBeVisible();
    await expect(page.getByText('Profile Submitted Successfully')).toBeVisible();
  });

  test('2. Server validation failure - 422', async ({ page }) => {
    await page.route('**/api/backend/skc/stakeholders/register', async (route) => {
      await route.fulfill({
        status: 422,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: "Validation failed.",
          fieldErrors: { email: ["Invalid email domain."] }
        })
      });
    });

    const submitBtn = page.getByRole('button', { name: /Submit Stakeholder Profile/i });
    
    await submitBtn.click();
    
    // Spinner stops
    await expect(page.locator('.animate-spin')).toBeHidden();
    
    // Error is shown
    await expect(page.getByText('Validation failed.')).toBeVisible();
    
    // Form remains populated (email input should still have our test email)
    await expect(page.locator('input[type="email"]')).toHaveValue('test@example.com');
    
    // Submit button re-enables
    await expect(submitBtn).toBeEnabled();
  });

  test('3. Server error - 500', async ({ page }) => {
    await page.route('**/api/backend/skc/stakeholders/register', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: "Internal Server Error"
        })
      });
    });

    const submitBtn = page.getByRole('button', { name: /Submit Stakeholder Profile/i });
    
    await submitBtn.click();
    
    // Spinner stops
    await expect(page.locator('.animate-spin')).toBeHidden();
    
    // Retry is possible (button re-enabled)
    await expect(submitBtn).toBeEnabled();
    
    // Generic error shown
    await expect(page.getByText(/Internal Server Error/i)).toBeVisible();
  });

  test('4. Timeout/network failure - Aborted', async ({ page }) => {
    await page.route('**/api/backend/skc/stakeholders/register', async (route) => {
      await route.abort('timedout');
    });

    const submitBtn = page.getByRole('button', { name: /Submit Stakeholder Profile/i });
    
    await submitBtn.click();
    
    // Spinner stops
    await expect(page.locator('.animate-spin')).toBeHidden();
    
    // Timeout or network message appears
    await expect(page.getByText(/unexpected error occurred|Registration could not be completed/i)).toBeVisible();
    
    // Submit button re-enables
    await expect(submitBtn).toBeEnabled();
  });

});
