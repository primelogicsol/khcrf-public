const fs = require('fs');
let c = fs.readFileSync('frontend/src/data/evaluationRegistry.ts', 'utf8');

c = c.replace(
  /const FACTOR_LISTS: Record<EntityType, string\[\]> = \{[\s\S]*?\};\s*export const FACTOR_LABELS: Record<string, string> = \{[\s\S]*?\};/,
  `import factorsData from './factors.json';\n\nconst FACTOR_LISTS: Record<EntityType, string[]> = factorsData.FACTOR_LISTS;\nexport const FACTOR_LABELS: Record<string, string> = factorsData.FACTOR_LABELS;`
);

fs.writeFileSync('frontend/src/data/evaluationRegistry.ts', c);
console.log('Frontend registry patched successfully.');
