const fs = require('fs'); const content = fs.readFileSync('frontend/src/data/evaluationRegistry.ts', 'utf8'); console.log(content.match(/case 'FAIR_WAGES':[\s\S]*?evidenceRequirement: '([^']+)'/g));
