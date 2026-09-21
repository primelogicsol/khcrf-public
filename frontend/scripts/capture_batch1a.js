const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const routes = [
  '/',
  '/research',
  '/state-of-crafts',
  '/master-artisans',
  '/publications',
  '/craft-business-support',
  '/about',
  '/login',
  '/register',
  '/dashboard/analytics'
];

const viewports = [
  { width: 1440, height: 900, name: 'desktop' },
  { width: 1024, height: 1366, name: 'tablet' },
  { width: 390, height: 844, name: 'mobile' }
];

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const outDir = path.join(__dirname, '..', '..', 'audit', 'batch1a-regression');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    for (const route of routes) {
      console.log('Capturing ' + route + ' at ' + vp.name + '...');
      const url = 'http://localhost:3000' + route;
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
        const name = route === '/' ? 'home' : route.replace(/\//g, '-').replace(/^-/, '');
        await page.screenshot({ path: path.join(outDir, name + '_' + vp.name + '.png'), fullPage: true });
      } catch (e) {
        console.error('Failed to capture ' + route + ': ' + e.message);
      }
    }
  }

  await browser.close();
  console.log('Capture complete!');
}

capture();
