const fs = require('fs');

let f1 = fs.readFileSync('frontend/src/data/evaluationRegistry.ts', 'utf8');
f1 = f1.replace(/'\.\/factors\.json'/, "'../../../../shared/factors.json'");
fs.writeFileSync('frontend/src/data/evaluationRegistry.ts', f1);

let f2 = fs.readFileSync('backend/src/controllers/evaluationController.ts', 'utf8');
f2 = f2.replace(/'\.\.\/\.\.\/\.\.\/frontend\/src\/data\/factors\.json'/, "'../../../shared/factors.json'");
fs.writeFileSync('backend/src/controllers/evaluationController.ts', f2);
