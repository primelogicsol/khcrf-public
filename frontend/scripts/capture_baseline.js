const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const viewports = [
    { width: 1920, height: 1080, name: '1920x1080_desktop' },
    { width: 1440, height: 900, name: '1440x900_desktop' },
    { width: 1366, height: 768, name: '1366x768_desktop' },
    { width: 1024, height: 1366, name: '1024x1366_tablet' },
    { width: 820, height: 1180, name: '820x1180_tablet' },
    { width: 768, height: 1024, name: '768x1024_tablet' },
    { width: 430, height: 932, name: '430x932_mobile' },
    { width: 390, height: 844, name: '390x844_mobile' },
    { width: 360, height: 800, name: '360x800_mobile' }
];

const outDir = path.join(__dirname, '..', '..', 'audit', 'header-baseline');

(async () => {
    const browser = await chromium.launch();
    
    for (const vp of viewports) {
        console.log(`Capturing ${vp.name}...`);
        const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
        const page = await context.newPage();
        
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
        
        // Initial header at top of page
        await page.screenshot({ path: path.join(outDir, `${vp.name}_initial.png`), fullPage: false });
        
        // Scroll down to trigger sticky header
        await page.evaluate(() => window.scrollTo(0, 300));
        await page.waitForTimeout(1000); // Wait for sticky transition
        await page.screenshot({ path: path.join(outDir, `${vp.name}_sticky.png`), fullPage: false });
        
        // Scroll back up and test mobile menu
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(500);
        
        if (vp.width < 1280) { // xl breakpoint is 1280px in tailwind
            // Mobile menu closed
            await page.screenshot({ path: path.join(outDir, `${vp.name}_menu_closed.png`), fullPage: false });
            
            // Try to open mobile menu
            try {
                // Click the hamburger icon
                await page.click('button[aria-label="Toggle mobile menu"]', { timeout: 2000 });
                await page.waitForTimeout(1000); // Wait for drawer transition
                await page.screenshot({ path: path.join(outDir, `${vp.name}_menu_open.png`), fullPage: false });
            } catch (e) {
                console.log(`Could not open mobile menu for ${vp.name}`);
            }
        }
        
        await context.close();
    }
    
    await browser.close();
    console.log('Capture complete!');
})();
