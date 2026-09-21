const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const viewports = [
    { width: 405, height: 900, name: '405x900_mobile' },
    { width: 390, height: 844, name: '390x844_mobile' },
    { width: 375, height: 812, name: '375x812_mobile' },
    { width: 360, height: 800, name: '360x800_mobile' },
    { width: 344, height: 760, name: '344x760_mobile' },
    { width: 320, height: 700, name: '320x700_mobile' }
];

const outDir = path.join(__dirname, '..', '..', 'audit', 'header-small-mobile');

(async () => {
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }
    const browser = await chromium.launch();
    
    for (const vp of viewports) {
        console.log(`Capturing ${vp.name}...`);
        const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
        const page = await context.newPage();
        
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
        
        // Initial header at top of page
        await page.screenshot({ path: path.join(outDir, `${vp.name}_initial.png`), fullPage: false });
        
        await context.close();
    }
    
    await browser.close();
    console.log('Capture complete!');
})();
