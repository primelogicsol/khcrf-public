const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/layout/GlobalHeader.tsx', 'utf8');

content = content.replace(/\\\$\{\(link as any\)/g, "${(link as any)");

fs.writeFileSync('frontend/src/components/layout/GlobalHeader.tsx', content);
console.log('Fixed interpolation');
