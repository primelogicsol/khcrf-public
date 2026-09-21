const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(main)/page.tsx', 'utf8');
content = content.replace(/fetch\(\$\{API_BASE\}\/publications/g, 'fetch(`${API_BASE}/publications`');
fs.writeFileSync('frontend/src/app/(main)/page.tsx', content, 'utf8');
