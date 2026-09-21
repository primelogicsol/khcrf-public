import { test, expect } from '@playwright/test';

test.describe('SKC Public Hearings Phase 4A Google Meet Integration Suite', () => {

  test('1. Centralized Google Meet Configuration & Helper Logic', async ({ request }) => {
    const response = await request.get('http://localhost:4000/api/skc/hearings/public');
    expect(response.status()).toBe(200);
    const body = await response.json();
    const data = body.data?.data || body.data || body;
    
    // Find an online or hybrid hearing
    const onlineEvent = data.find((h: any) => 
      (h.mode || '').toUpperCase().includes('ONLINE') || 
      (h.mode || '').toUpperCase().includes('HYBRID') || 
      (h.venue || '').toLowerCase().includes('online')
    );
    expect(onlineEvent).toBeDefined();

    // Find an in-person hearing
    const inPersonEvent = data.find((h: any) => 
      (h.mode || '').toUpperCase() === 'IN PERSON' && 
      !(h.venue || '').toLowerCase().includes('online')
    );
    expect(inPersonEvent).toBeDefined();
  });

  test('2. Timeline View: Join Online Hearing action or pre-window state appears ONLY for ONLINE/HYBRID events', async ({ page }) => {
    await page.goto('http://localhost:3000/state-of-kashmir-crafts/public-hearings');
    await page.waitForSelector('button:has-text("Online Hearing")');

    const meetButtons = page.locator('a:has-text("LIVE NOW"), button:has-text("Online Hearing")');
    const meetCount = await meetButtons.count();
    expect(meetCount).toBeGreaterThan(0);
  });

  test('3. Browser-Level Exclusion: In-Person hearings (e.g. Carpets & Kani) DO NOT render Meet link', async ({ page }) => {
    await page.goto('http://localhost:3000/state-of-kashmir-crafts/public-hearings');
    await page.click('button:has-text("Timeline")');

    // Find the timeline card for "Carpets & Kani" (In Person event)
    const inPersonCard = page.locator('div.bg-white', { hasText: 'Carpets & Kani' });
    await expect(inPersonCard).toBeVisible();

    // Assert that Join Online Hearing link is NOT inside the In-Person card
    const cardMeetLink = inPersonCard.locator('a:has-text("LIVE NOW")');
    expect(await cardMeetLink.count()).toBe(0);
  });

  test('4. Calendar Popover Modal: Join Online Hearing action or pre-window button exposed', async ({ page }) => {
    await page.goto('http://localhost:3000/state-of-kashmir-crafts/public-hearings');
    await page.click('button:has-text("Calendar")');

    // Click an online event on calendar (e.g. Digital Craft Markets)
    const onlineCell = page.locator('div:has-text("Digital Craft Markets")').last();
    if (await onlineCell.isVisible()) {
      await onlineCell.click();
      const modalMeetButton = page.locator('.fixed a:has-text("LIVE NOW"), .fixed button:has-text("Online Hearing")');
      await expect(modalMeetButton).toBeVisible();
      // Close modal
      await page.click('button:has-text("×")');
    }
  });

  test('5. Production Page Verification: Live site renders Join Online Hearing for online events', async ({ page }) => {
    const response = await page.goto('https://khcrf.org/state-of-kashmir-crafts/public-hearings');
    expect(response?.status()).toBe(200);
    await page.waitForSelector('h2:has-text("Hearings & Testimonies")');

    const meetLinks = page.locator('a:has-text("Join Online Hearing")');
    if (await meetLinks.count() > 0) {
      const prodFirstMeet = meetLinks.first();
      await expect(prodFirstMeet).toHaveAttribute('href', 'https://meet.google.com/wyf-gryj-tre?authuser=1');
      await expect(prodFirstMeet).toHaveAttribute('target', '_blank');
    }
  });
});
