const fs = require('fs');
let c1 = fs.readFileSync('src/controllers/evaluationController.ts', 'utf8');
c1 = c1.replace("import { validateFactors } from '../domain/performanceFactors.js';", "");
c1 = c1.replace("import crypto from 'crypto';", "");
c1 = "import { validateFactors } from '../domain/performanceFactors.js';\nimport crypto from 'crypto';\n" + c1;
fs.writeFileSync('src/controllers/evaluationController.ts', c1, 'utf8');
