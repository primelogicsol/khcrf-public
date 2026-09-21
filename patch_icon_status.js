const fs = require('fs');
let c = fs.readFileSync('frontend/src/app/(dashboard)/profile/evaluations/page.tsx', 'utf8');

c = c.replace(
    /const getStatusIcon = \(status: string\) => \{/g,
    'const getStatusIcon = (status: string | null | undefined) => {'
);

fs.writeFileSync('frontend/src/app/(dashboard)/profile/evaluations/page.tsx', c);
