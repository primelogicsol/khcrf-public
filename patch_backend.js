const fs = require('fs');
let c = fs.readFileSync('backend/src/controllers/evaluationController.ts', 'utf8');

c = c.replace(
  /const FACTOR_LISTS: Record<string, string\[\]> = \{[\s\S]*?\};/,
  `const factorsData = require('../../../frontend/src/data/factors.json');\n        const FACTOR_LISTS: Record<string, string[]> = factorsData.FACTOR_LISTS;`
);

fs.writeFileSync('backend/src/controllers/evaluationController.ts', c);
console.log('Backend controller patched successfully.');
