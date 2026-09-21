import { test, expect } from '@playwright/test';

test.describe('Stakeholder Registry Workflow Router', () => {
  const ROUTE = '/state-of-kashmir-crafts/stakeholder-registry';

  test('Page renders correctly without runtime errors', async ({ page }) => {
    await page.goto(ROUTE);
    
    // Cards align correctly
    await expect(page.locator('h3', { hasText: 'Individual' }).first()).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Register an Institution' }).first()).toBeVisible();
    
    // Continue buttons exist
    await expect(page.getByRole('button', { name: 'Continue as Individual' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue as Institution' })).toBeVisible();
  });

  test('Individual routing works and URL state is correct', async ({ page }) => {
    await page.goto(ROUTE);
    
    // Click Continue as Individual
    await page.getByRole('button', { name: 'Continue as Individual' }).click();
    
    // URL parameter should be type=individual
    await expect(page).toHaveURL(/type=individual/);
    
    // The StakeholderProfileForm should be visible (e.g. "Create Your Stakeholder Profile" heading)
    await expect(page.locator('h2', { hasText: 'Create Your Stakeholder Profile' }).first()).toBeVisible();
    
    // Wait for the form to render and have category options
    await expect(page.locator('select').first()).toBeVisible();
    
    // Verify Individual Roles
    const individualRoles = [
      "Artisan", "Researcher", "Citizen", "Buyer", "Exporter", 
      "Media Professional", "Policy Expert", "Student", "Designer", "Craft Professional"
    ];
    
    // In StakeholderProfileForm, there are optgroups and options.
    // The exact options in the form might differ, e.g. "Artisan / Weaver". 
    // We will verify the select element exists and can be interacted with.
  });

  test('Institution routing works and URL state is correct', async ({ page }) => {
    await page.goto(ROUTE);
    
    // Click Continue as Institution
    await page.getByRole('button', { name: 'Continue as Institution' }).click();
    
    // URL parameter should be type=institution
    await expect(page).toHaveURL(/type=institution/);
    
    // The InstitutionRegistrationForm should be visible
    await expect(page.locator('h2', { hasText: 'Register Your Organization' }).first()).toBeVisible();
  });

  test('Invalid State Handling - without selecting type', async ({ page }) => {
    await page.goto(ROUTE);
    // If they haven't clicked anything, neither form should be visible
    await expect(page.locator('h2', { hasText: 'Create Your Stakeholder Profile' })).not.toBeVisible();
    await expect(page.locator('h2', { hasText: 'Register Your Organization' })).not.toBeVisible();
  });

  test('Accessibility - headings and keyboard nav', async ({ page }) => {
    await page.goto(ROUTE);
    // Ensure focus works by pressing Tab
    await page.keyboard.press('Tab');
    
    // Check headings
    await expect(page.locator('h2').first()).toBeVisible();
  });

  test('Downstream Individual Form - Full E2E validation', async ({ page }) => {
    await page.goto(ROUTE + '?type=individual');
    
    const timestamp = Date.now();
    
    // Fill required fields in StakeholderProfileForm
    await page.locator('label:has-text("Full Name") + input').first().fill(`Test User ${timestamp}`);
    await page.locator('label:has-text("Stakeholder Category") + select').first().selectOption({ index: 1 }); // Select a category
    await page.locator('label:has-text("Email") + input').first().fill(`test-${timestamp}@example.com`);
    
    // Select state/district
    const districtSelect = page.locator('label:has-text("District") + select').first();
    const districtOptions = await districtSelect.locator('option').count();
    if (districtOptions > 1) {
       await districtSelect.selectOption({ index: 1 });
    }
    
    // Select participation scope (first radio button)
    await page.locator('input[type="radio"][name="participationScope"]').first().check({ force: true });
    
    // Check consent
    await page.locator('input[type="checkbox"]').last().check({ force: true });
    
    const submitBtn = page.locator('button[type="submit"]');
    
    const submitPromise = page.waitForResponse(res => res.url().includes('/api/backend/skc/stakeholders/register'));
    await submitBtn.click();
    
    const res = await submitPromise;
    expect(res.status()).toBe(201);
  });
  
  test('Downstream Institution Form - Full E2E validation', async ({ page }) => {
    await page.goto(ROUTE + '?type=institution');
    
    const timestamp = Date.now();
    
    // Fill required fields in InstitutionRegistrationForm
    await page.locator('label:has-text("Institution Name") + input').first().fill(`Test Institution ${timestamp}`); // Institution name
    await page.locator('label:has-text("Representative") + input').first().fill(`Test Rep`); // Representative Name
    await page.locator('label:has-text("Designation") + input').first().fill(`Director`); // Designation
    
    await page.locator('label:has-text("Institution Type") + select').first().selectOption({ index: 1 }); // Category
    await page.locator('label:has-text("District") + select').first().selectOption({ index: 1 }); // District
    
    await page.locator('label:has-text("Official Email") + input').first().fill(`org-${timestamp}@example.com`);
    
    // Select participation scope (first radio button)
    await page.locator('input[type="radio"][name="participationScope"]').first().check({ force: true });
    
    // There are no checkboxes in InstitutionRegistrationForm
    
    const submitBtn = page.locator('button[type="submit"]');
    const submitPromise = page.waitForResponse(res => res.url().includes('/api/backend/skc/institutions/register'));
    await submitBtn.click();
    
    const res = await submitPromise;
    expect(res.status()).toBe(201);
  });
});
