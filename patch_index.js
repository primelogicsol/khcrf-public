const fs = require('fs');
let c = fs.readFileSync('backend/src/index.ts', 'utf8');

c = c.replace(
    'import evaluationRoutes from \'./routes/evaluationRoutes.js\';',
    'import evaluationRoutes from \'./routes/evaluationRoutes.js\';\nimport integrationRoutes from \'./routes/integrationRoutes.js\';'
);

c = c.replace(
    'app.use(\'/api/evaluation\', evaluationRoutes);',
    'app.use(\'/api/evaluation\', evaluationRoutes);\napp.use(\'/api/cktre/integrations\', integrationRoutes);'
);

fs.writeFileSync('backend/src/index.ts', c);
console.log('Appended index.ts');
