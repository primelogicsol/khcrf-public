const fs = require('fs');
let c = fs.readFileSync('frontend/src/app/(dashboard)/profile/evaluations/page.tsx', 'utf8');

c = c.replace(
    'setEvaluations(response.data);',
    'const evals = Array.isArray(response.data?.data) ? response.data.data : [];\n    setEvaluations(evals);'
);

fs.writeFileSync('frontend/src/app/(dashboard)/profile/evaluations/page.tsx', c);
