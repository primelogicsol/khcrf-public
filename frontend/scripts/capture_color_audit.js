const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const viewports = [
    { width: 1440, height: 900, name: '1440x900_desktop' },
    { width: 1024, height: 1366, name: '1024x1366_tablet' },
    { width: 768, height: 1024, name: '768x1024_tablet' },
    { width: 390, height: 844, name: '390x844_mobile' },
    { width: 360, height: 800, name: '360x800_mobile' }
];

const routes = [
    { path: '/', name: 'home' },
    { path: '/research/policy', name: 'research' },
    { path: '/state-of-kashmir-crafts/about', name: 'state-of-crafts' },
    { path: '/master-artisans/artisans', name: 'master-artisans' },
    { path: '/publications', name: 'publications' },
    { path: '/business-support/evaluation', name: 'business-support' },
    { path: '/about', name: 'about' },
    { path: '/login', name: 'login' },
    { path: '/register', name: 'register' },
    { path: '/dashboard', name: 'dashboard' } // Might redirect to login, but we'll try
];

const outDir = path.join(__dirname, '..', '..', 'audit', 'color-audit-screenshots');

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
                console.log(`Capturing ${route.name} at ${vp.name}...`);
                await page.goto(`http://localhost:3000${route.path}`, { waitUntil: 'networkidle', timeout: 15000 });
                // Simple wait for animations
                await page.waitForTimeout(2000);
                await page.screenshot({ path: path.join(outDir, `${route.name}_${vp.name}.png`), fullPage: true });
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
