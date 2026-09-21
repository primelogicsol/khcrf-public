const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/validation-round/ValidationRoundClient.tsx', 'utf8');

content = content.replace(
    /const url = path\.startsWith\('http'\) \? path : `\$\{API_BASE_URL\}\$\{path\}`;/g,
    "const url = path.startsWith('http') ? path : `/api/backend${path.replace(/^\\/api/, '')}`;"
);

fs.writeFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/validation-round/ValidationRoundClient.tsx', content);
console.log('Fixed safeFetch to use Next.js proxy');
