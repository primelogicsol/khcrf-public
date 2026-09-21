const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/validation-round/ValidationRoundClient.tsx', 'utf8');

content = content.replace(
    /<option value="SOC-2026-2027">2026[^0-9<]*2027<\/option>/,
    '<option value="SOC-2026-2027">2026{"\\u2013"}2027</option>'
);

fs.writeFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/validation-round/ValidationRoundClient.tsx', content);
console.log('Replaced mojibake with encoded EN DASH');
