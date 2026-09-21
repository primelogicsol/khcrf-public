const fs = require('fs');
const filePath = 'frontend/src/app/(main)/master-artisans/page.tsx';
let c = fs.readFileSync(filePath, 'utf8');

c = c.replace(/return val === 0 \? '—' : val\.toLocaleString\(\);/g, "return val.toLocaleString();");

fs.writeFileSync(filePath, c);
console.log('Fixed zero stat formatting');
