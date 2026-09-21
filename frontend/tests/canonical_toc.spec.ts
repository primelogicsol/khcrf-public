import { test, expect } from '@playwright/test';

test('Canonical TOC Policy: Hierarchical table of contents must render 17 chapters under deterministic parts', async ({ page }) => {
  await page.goto('/publications/premium-pricing-trends-in-authentic-kashmiri-luxury-crafts');
  await page.waitForLoadState('networkidle');

  // Verify the parts are rendered
  const tocSection = page.locator('text="Table of Contents"').locator('..');
  
  await expect(tocSection.locator('text="Front Matter"')).toBeVisible();
  await expect(tocSection.locator('text="Part I — Market Context"')).toBeVisible();
  await expect(tocSection.locator('text="Part II — Pricing Intelligence"')).toBeVisible();
  await expect(tocSection.locator('text="Part V — Strategic and Policy Implications"')).toBeVisible();

  // The parts are expandable. Ensure that by expanding them we can see the chapters.
  // Actually, they might be rendered and just hidden or visible.
  // The first two parts are defaultExpanded, let's just check the DOM contains the text
  const contentText = await tocSection.innerText();

  // Verify all 17 chapters exist in the TOC
  const expectedChapters = [
    'The Global Luxury Craft Economy',
    'Kashmir Crafts in the Global Value Chain',
    'Understanding Premium Pricing',
    'Pricing Methodology and Data Framework',
    'Pashmina Pricing Trends',
    'Carpet Pricing Trends',
    'Papier-Mâché Pricing Trends',
    'Walnut Woodwork Pricing Trends',
    'Consumer Willingness to Pay',
    'Buyer Segments',
    'Regional Market Comparison',
    'Counterfeiting and Misrepresentation',
    'Value Leakage in the Supply Chain',
    'Building a Fair Premium Market',
    'Recommendations for Exporters and Enterprises',
    'Policy Recommendations',
    'Future Outlook for Kashmiri Luxury Crafts'
  ];

  for (const chapter of expectedChapters) {
    // We just check if the element exists in the DOM. 
    // innerText might not include it if it's display:none, but our React component unmounts it when collapsed.
    // So we'll click all headers to expand them first.
  }

  const buttons = await tocSection.locator('button').all();
  for (const button of buttons) {
    // If it is closed, click it. We just click them all to make sure they're open.
    // Or we can just evaluate the DOM tree
    await button.click();
  }

  const fullyExpandedText = await tocSection.innerText();

  for (const chapter of expectedChapters) {
    expect(fullyExpandedText).toContain(chapter);
  }

  console.log('✅ Canonical TOC Policy Verified: 17 Chapters present in hierarchical structure');
});
