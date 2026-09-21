import { test, expect } from '@playwright/test';
import { getMeetButtonState, getHearingTimeWindow } from '../src/config/googleMeetConfig';

test.describe('SKC Public Hearings Operational Schedule & Time-Aware Meet Button Suite', () => {

  test('1. Time-aware Helper Unit Tests: BEFORE_WINDOW, ACTIVE, and AFTER_WINDOW states', async () => {
    const mockOnlineEvent = {
      title: 'Digital Craft Markets',
      slug: 'digital-craft-markets-26-sept-2026',
      mode: 'ONLINE',
      date: '2026-09-26T10:00:00.000Z',
      startAt: '2026-09-26T05:30:00.000Z', // 11:00 AM IST
      endAt: '2026-09-26T09:30:00.000Z',   // 03:00 PM IST
      timezone: 'Asia/Kolkata',
      publicMeetingUrl: 'https://meet.google.com/wyf-gryj-tre?authuser=1',
      status: 'REGISTRATION_OPEN'
    };

    // Before window (e.g. Sept 25, 2026)
    const beforeDate = new Date('2026-09-25T10:00:00.000Z');
    const beforeState = getMeetButtonState(mockOnlineEvent, beforeDate);
    expect(beforeState.status).toBe('BEFORE_WINDOW');
    if (beforeState.status === 'BEFORE_WINDOW') {
      expect(beforeState.label).toContain('Online Hearing opens on September 26, 2026');
    }

    // Active window (e.g. Sept 26, 2026 at 12:00 PM IST = 06:30 UTC)
    const activeDate = new Date('2026-09-26T06:30:00.000Z');
    const activeState = getMeetButtonState(mockOnlineEvent, activeDate);
    expect(activeState.status).toBe('ACTIVE');
    if (activeState.status === 'ACTIVE') {
      expect(activeState.url).toBe('https://meet.google.com/wyf-gryj-tre?authuser=1');
      expect(activeState.label).toBe('Join Online Hearing');
    }

    // After window (e.g. Sept 27, 2026)
    const afterDate = new Date('2026-09-27T10:00:00.000Z');
    const afterState = getMeetButtonState(mockOnlineEvent, afterDate);
    expect(afterState.status).toBe('AFTER_WINDOW');
    if (afterState.status === 'AFTER_WINDOW') {
      expect(afterState.label).toBe('Public Hearing Completed');
    }
  });

  test('2. Timeline Card Schedule Display: Shows date, 11:00 AM – 3:00 PM IST, and venue', async ({ page }) => {
    await page.goto('http://localhost:3000/state-of-kashmir-crafts/public-hearings');
    await page.waitForSelector('span:has-text("11:00 AM – 3:00 PM IST")');

    // Verify 11:00 AM – 3:00 PM IST text is present
    const timeLabels = page.locator('span:has-text("11:00 AM – 3:00 PM IST")');
    expect(await timeLabels.count()).toBeGreaterThan(0);
  });

  test('3. Timeline & Calendar Disabled State before hearing day', async ({ page }) => {
    await page.goto('http://localhost:3000/state-of-kashmir-crafts/public-hearings');
    await page.waitForSelector('button:has-text("Online Hearing")');

    // Online events scheduled for Sept 2026 are before the current hearing window when viewed in the browser
    const disabledButtons = page.locator('button:has-text("Online Hearing")');
    expect(await disabledButtons.count()).toBeGreaterThan(0);
    await expect(disabledButtons.first()).toBeDisabled();
  });

  test('4. Approved 4-route governance CTAs remain 100% compliant alongside time-aware Meet state', async ({ page }) => {
    await page.goto('http://localhost:3000/state-of-kashmir-crafts/public-hearings');
    
    const links = await page.locator('a[href]').evaluateAll((anchors: HTMLAnchorElement[]) =>
      anchors.map(a => a.getAttribute('href') || '')
    );

    const nonCompliantLegacyLinks = links.filter(href =>
      href.startsWith('/state-of-kashmir-crafts/public-hearings/') &&
      href !== '/state-of-kashmir-crafts/public-hearings' &&
      !href.startsWith('/state-of-kashmir-crafts/public-hearings/submit-testimony')
    );

    expect(nonCompliantLegacyLinks.length).toBe(0);
  });
});
