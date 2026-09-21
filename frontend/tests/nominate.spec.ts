import { test, expect } from '@playwright/test';

test.describe('Master Artisan Nomination Form', () => {
  test('Complete submission lifecycle', async ({ page }) => {
    // 1. Open nomination page
    await page.goto('http://localhost:3000/master-artisans/nominate');

    // 2. Confirm page heading
    await expect(page.locator('h1').first()).toBeVisible();

    // 3. Complete artisan details
    await page.fill('input[name="nomineeName"]', 'TEST RECORD — DO NOT PUBLISH');
    await page.selectOption('select[name="primaryCraft"]', { label: 'Wood Carving' });
    
    // Fill years of practice
    await page.fill('input[name="yearsOfPractice"]', '25');
    
    // Complete structured location
    await page.fill('input[name="district"]', 'Srinagar');
    await page.fill('input[name="tehsil"]', 'Central');
    await page.fill('input[name="village"]', 'Downtown');
    await page.fill('input[name="pinCode"]', '190001');

    // 4. Select government-registration status
    await page.selectOption('select[name="hasGovtArtisanId"]', 'Yes');
    
    // Complete conditional identification fields
    await page.fill('input[name="govtArtisanId"]', 'GOVT-12345');
    await page.selectOption('select[name="artisanRegistrationType"]', 'J&K Handicrafts Artisan Registration');
    await page.fill('input[name="artisanIssuingAuthority"]', 'Directorate of Handicrafts');
    await page.fill('input[name="artisanYearOfRegistration"]', '2020');

    // 5. Complete workshop fields
    await page.selectOption('select[name="hasWorkshop"]', 'Yes');
    await page.fill('input[name="workshopName"]', 'Test Workshop');
    await page.selectOption('select[name="workshopType"]', 'Family workshop');
    await page.selectOption('select[name="isWorkshopRegistered"]', 'Yes');
    await page.fill('input[name="workshopId"]', 'WS-98765');
    await page.selectOption('select[name="workshopRegistrationType"]', 'Udyam / MSME Registration');
    await page.fill('input[name="workshopIssuingAuthority"]', 'Ministry of MSME');
    await page.fill('input[name="workshopYearOfRegistration"]', '2021');

    // 6. Complete nominator details
    await page.fill('input[name="nominatorInfo"]', 'Test Nominator');
    await page.fill('input[name="nominatorEmail"]', 'test@example.com');
    await page.fill('input[name="nominatorPhone"]', '9876543210');
    await page.fill('input[name="relationship"]', 'Colleague');
    
    // Nomination reason
    await page.fill('textarea[name="notes"]', 'This is a test submission for the Master Artisan nomination form with adequate description length for validation.');

    // 7. Accept consent
    await page.check('input[name="consentGiven"]');

    // 8. Submit
    await page.click('button[type="submit"]');

    // 9. Confirm success response
    await expect(page.locator('text=Thank you for your submission')).toBeVisible({ timeout: 10000 });
  });
});
