const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/bg-stone-850/g, 'bg-stone-800');

fs.writeFileSync(file, c);
console.log("Fixed missing bg-stone-850 class!");
