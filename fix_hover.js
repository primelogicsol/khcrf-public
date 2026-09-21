const fs = require('fs');
const targetFile = 'frontend/src/app/(main)/about/shared-principle/page.tsx';
let content = fs.readFileSync(targetFile, 'utf8');

const regex = /hover:border-brand-(primary|secondary|dark)/g;
content = content.replace(regex, 'hover:border-[var(--card-left-accent)]');

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Fixed hover borders in shared-principle!');
