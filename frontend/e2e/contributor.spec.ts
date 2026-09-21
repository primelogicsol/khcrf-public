import { test, expect } from '@playwright/test';

test.describe('Become a Contributor Form', () => {
  test('Complete submission lifecycle', async ({ page }) => {
    await page.goto('http://localhost:3000/master-artisans/contributor');
    await expect(page.locator('h2').filter({ hasText: 'Become a Master Artisans Contributor' })).toBeVisible();

    // Fill Section 1
    await page.fill('input[name="fullName"]', 'TEST CONTRIBUTOR — DO NOT APPROVE');
    await page.fill('input[name="email"]', 'test-contributor@example.com');
    await page.fill('input[name="phone"]', '9876543210');
    await page.fill('input[name="country"]', 'India');
    await page.fill('input[name="stateRegion"]', 'Jammu & Kashmir');
    await page.fill('input[name="districtCity"]', 'Srinagar');
    await page.selectOption('select[name="contributorCategory"]', 'Photographer');
    await page.fill('input[name="currentProfession"]', 'Freelance Photographer');
    await page.fill('textarea[name="shortBio"]', 'A passionate photographer documenting craft traditions in the valley.');

    // Fill Section 2
    await page.getByLabel('Photography').check();
    await page.fill('input[name="yearsOfExperience"]', '5');
    await page.selectOption('select[name="preferredEngagementType"]', 'Short-term Field Assignment');
    await page.selectOption('select[name="availability"]', 'Immediate');
    await page.selectOption('select[name="timeCommitment"]', 'Occasional');
    await page.getByLabel('Kashmir Valley').check();

    // Fill Section 3
    await page.fill('input[name="portfolioUrl"]', 'https://example.com/portfolio');

    // Fill Section 4
    const motivationText = Array(150).fill('word').join(' ') + ' test motivation text.';
    await page.fill('textarea[name="motivation"]', motivationText);

    // Fill Section 5 Declarations
    await page.check('input[name="declarationAccuracy"]');
    await page.check('input[name="declarationRights"]');
    await page.check('input[name="declarationEthical"]');
    await page.check('input[name="declarationConfidentiality"]');
    await page.check('input[name="declarationRepresentation"]');
    await page.check('input[name="declarationSelection"]');
    await page.check('input[name="declarationPrivacy"]');

    // Submit
    await page.click('button[type="submit"]');

    // Check for validation errors quickly
    const errorAlert = page.locator('.bg-red-50');
    if (await errorAlert.isVisible({ timeout: 3000 }).catch(() => false)) {
      const errorText = await errorAlert.textContent();
      console.log('VALIDATION ERROR FOUND:', errorText);
    }

    // Check success
    await expect(page.locator('text=Application Received')).toBeVisible({ timeout: 15000 });
  });
});
