const fs = require('fs');
let c = fs.readFileSync('src/components/business/EvaluateFarmLink.tsx', 'utf8');
c = c.replace(/\\n\}/g, '');
c = c + '\n}';
fs.writeFileSync('src/components/business/EvaluateFarmLink.tsx', c, 'utf8');
