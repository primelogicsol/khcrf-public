const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/return Array\.from\(new Set\(all\)\)\.filter\(Boolean\);/, "return Array.from(new Set(all)).filter(Boolean).filter(c => c !== 'ALL_CRAFTS');");

fs.writeFileSync(file, c);
console.log("Filtered out ALL_CRAFTS from dropdown!");
