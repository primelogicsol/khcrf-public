const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const viewports = [
    { width: 1440, height: 900, name: '1440x900_desktop' },
    { width: 1024, height: 1366, name: '1024x1366_tablet' },
    { width: 390, height: 844, name: '390x844_mobile' }
];

const routes = [
    { path: '/', name: 'home' },
    { path: '/research/policy', name: 'research' },
    { path: '/master-artisans/artisans', name: 'master-artisans' }
];

const outDir = path.join(__dirname, '..', '..', 'audit', 'background-simulation');

(async () => {
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }
    const browser = await chromium.launch();
    
    for (const vp of viewports) {
        console.log(`Setting viewport ${vp.name}...`);
        const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
        
        for (const route of routes) {
            const page = await context.newPage();
            try {
                // CAPTURE BASELINE
                console.log(`Capturing ${route.name} at ${vp.name} (baseline)...`);
                await page.goto(`http://localhost:3000${route.path}`, { waitUntil: 'networkidle', timeout: 15000 });
                await page.waitForTimeout(1000);
                await page.screenshot({ path: path.join(outDir, `${route.name}_${vp.name}_baseline.png`), fullPage: true });
                
                // INJECT SIMULATION CSS
                console.log(`Capturing ${route.name} at ${vp.name} (simulation)...`);
                await page.addStyleTag({ content: ':root { --background: #F6F1E8 !important; } body { background-color: #F6F1E8 !important; }' });
                await page.waitForTimeout(1000);
                await page.screenshot({ path: path.join(outDir, `${route.name}_${vp.name}_simulated.png`), fullPage: true });
                
            } catch (e) {
                console.log(`Failed to capture ${route.name} at ${vp.name}: ${e.message}`);
            } finally {
                await page.close();
            }
        }
        await context.close();
    }
    
    await browser.close();
    console.log('Capture complete!');
})();
