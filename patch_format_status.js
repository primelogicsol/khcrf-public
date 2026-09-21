const fs = require('fs');
let c = fs.readFileSync('frontend/src/app/(dashboard)/profile/evaluations/page.tsx', 'utf8');

c = c.replace(
    /const formatStatus = \(status: string\) => \{/g,
    'const formatStatus = (status: string | null | undefined) => {\n    if (!status) return "Legacy";'
);

fs.writeFileSync('frontend/src/app/(dashboard)/profile/evaluations/page.tsx', c);
