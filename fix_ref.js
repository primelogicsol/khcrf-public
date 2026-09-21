const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/return districts\.reduce/g, 'return derivedDistricts.reduce');
c = c.replace(/\[filteredHearings, districts\]/g, '[filteredHearings, derivedDistricts]');

fs.writeFileSync(file, c);
console.log("Fixed derivedDistricts reference!");
