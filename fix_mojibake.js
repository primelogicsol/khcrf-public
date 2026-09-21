const fs = require('fs');
const targetFile = 'frontend/src/app/(main)/state-of-kashmir-crafts/current-assessment-2026/CurrentAssessmentClient.tsx';
let content = fs.readFileSync(targetFile, 'utf8');

// Replace all \uFFFD with {"\u00B7"}
content = content.replace(/\uFFFD/g, '{"\\u00B7"}');

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Fixed all \uFFFD characters!');
