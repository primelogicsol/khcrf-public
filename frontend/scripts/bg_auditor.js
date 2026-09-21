const fs = require('fs');
const path = require('path');

const results = {
  white: 0,
  gray50: 0,
  gray100: 0,
  transparent: 0,
  brandDark: 0,
  brandPrimary: 0,
  url: 0
};

const routeResults = {};

function walk(dir, routeFamily = 'unknown') {
  if (!fs.existsSync(dir)) return;
  const list = fs.readdirSync(dir, {withFileTypes: true});
  for (const dirent of list) {
    const fullPath = path.join(dir, dirent.name);
    
    // Determine route family based on path
    let currentRouteFamily = routeFamily;
    if (fullPath.includes('(main)')) currentRouteFamily = 'public';
    if (fullPath.includes('(dashboard)')) currentRouteFamily = 'dashboard';
    if (fullPath.includes('(auth)')) currentRouteFamily = 'auth';
    
    if (dirent.isDirectory()) {
      walk(fullPath, currentRouteFamily);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      const counts = {
        white: (content.match(/\bbg-white\b/g) || []).length,
        gray50: (content.match(/\bbg-gray-50\b/g) || []).length,
        gray100: (content.match(/\bbg-gray-100\b/g) || []).length,
        transparent: (content.match(/\bbg-transparent\b/g) || []).length,
        brandDark: (content.match(/\bbg-brand-dark\b/g) || []).length,
        brandPrimary: (content.match(/\bbg-brand-primary\b/g) || []).length,
        url: (content.match(/bg-\[url/g) || []).length,
      };
      
      for (const [key, count] of Object.entries(counts)) {
        results[key] += count;
      }
      
      if (!routeResults[currentRouteFamily]) {
        routeResults[currentRouteFamily] = { white:0, gray50:0, gray100:0, transparent:0, brandDark:0, brandPrimary:0, url:0 };
      }
      for (const [key, count] of Object.entries(counts)) {
        routeResults[currentRouteFamily][key] += count;
      }
    }
  }
}

walk(path.join(__dirname, '..', 'src', 'app'));
walk(path.join(__dirname, '..', 'src', 'components'));

console.log('Global Totals:', results);
console.log('Route Breakdown:', routeResults);
