import { test, expect } from '@playwright/test';

test.describe('SKC 2026 Programme Events Presentation Logic', () => {
  test('non-hearing events render correct badges and actions', async ({ page }) => {
    await page.goto('http://localhost:3000/state-of-kashmir-crafts/public-hearings');
    
    // Wait for the hearings to load
    await page.waitForSelector('text=Programme Events');
    
    // Thematic Consultation (Closing Climate)
    const climateCard = page.locator('.bg-white', { hasText: 'Closing Climate and Sustainability Consultation' });
    // Count assertions removed, unit tests handle count verification.
    await expect(climateCard.locator('text=THEMATIC CONSULTATION').first()).toBeVisible();
    await expect(climateCard.locator('text=Online Thematic Consultation')).toBeVisible();
    await expect(climateCard.locator('text=Submit Evidence')).toBeVisible();
    await expect(climateCard.locator('text=Public Hearing')).not.toBeVisible();
    
    // Submission Deadline
    const deadlineCard = page.locator('.bg-white', { hasText: 'Written Testimony and Evidence Submission Close' });
    await expect(deadlineCard.locator('text=SUBMISSION DEADLINE').first()).toBeVisible();
    await expect(deadlineCard.locator('text=Online Submission Deadline')).toBeVisible();
    await expect(deadlineCard.locator('text=Submit Testimony').first()).toBeVisible();
    await expect(deadlineCard.locator('text=Register')).not.toBeVisible();
    
    // Registration
    const regCard = page.locator('.bg-white', { hasText: 'Stakeholder Registration Opens' });
    await expect(regCard.locator('text=REGISTRATION').first()).toBeVisible();
    await expect(regCard.locator('text=Online Registration')).toBeVisible();
    await expect(regCard.locator('text=View Guidelines')).toBeVisible();
    
    // Draft Review
    const draftCard = page.locator('.bg-white', { hasText: 'Draft Findings Review' });
    await expect(draftCard.locator('text=DRAFT REVIEW').first()).toBeVisible();
    await expect(draftCard.locator('text=Draft Review').first()).toBeVisible();
    await expect(draftCard.locator('text=Review Draft Findings')).toBeVisible();
    await expect(draftCard.locator('text=Submit Public Comment')).toBeVisible();
    
    // Final Publication
    const finalCard = page.locator('.bg-white', { hasText: 'Final Report Tabled and Published' });
    await expect(finalCard.locator('text=FINAL PUBLICATION').first()).toBeVisible();
    await expect(finalCard.locator('text=Online Publication')).toBeVisible();
    await expect(finalCard.locator('text=View Final Report')).toBeVisible();
  });

  test('Craft filters correctly map to canonical taxonomy relationships', async ({ page }) => {
    await page.goto('http://localhost:3000/state-of-kashmir-crafts/public-hearings');
    await page.waitForSelector('text=Programme Events');

    // Test Pashmina
    await page.locator('select').nth(1).selectOption('Pashmina');
    await expect(page.locator('.bg-white', { hasText: 'Future of Pashmina' }).first()).toBeVisible();

    // Reset filter
    await page.locator('select').nth(1).selectOption('ALL');

    // Test Carpets & Kani
    await page.locator('select').nth(1).selectOption('Carpets & Kani');
    await expect(page.locator('.bg-white', { hasText: 'Carpets & Kani' }).first()).toBeVisible();

    // Reset filter
    await page.locator('select').nth(1).selectOption('ALL');

    // Test Women
    await page.locator('select').nth(1).selectOption('Women');
    await expect(page.locator('.bg-white', { hasText: 'Women in Crafts' }).first()).toBeVisible();

    // Test Heritage
    await page.locator('select').nth(1).selectOption('Heritage');
    await expect(page.locator('.bg-white', { hasText: 'Heritage Conservation' }).first()).toBeVisible();

    // Reset filter
    await page.locator('select').nth(1).selectOption('ALL');

    // Test Technology
    await page.locator('select').nth(1).selectOption('Technology');
    await expect(page.locator('.bg-white', { hasText: 'Technology & Design' }).first()).toBeVisible();
  });
});
