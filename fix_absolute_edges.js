const fs = require('fs');
const targetFile = 'frontend/src/app/(main)/page.tsx';
let content = fs.readFileSync(targetFile, 'utf8');

const regex = /className="absolute top-0 left-0 w-([1-9]) h-full bg-brand-(primary|secondary|dark)"/g;
content = content.replace(regex, 'className="absolute top-0 left-0 w-$1 h-full bg-[var(--card-left-accent)]"');

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Fixed absolute left edges in page.tsx!');
