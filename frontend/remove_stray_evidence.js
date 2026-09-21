const fs = require('fs');
let code = fs.readFileSync('src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', 'utf8');

const straySection = /<div>\s*<h4 className="font-bold text-stone-900 mb-4">Uploaded Evidence & Factor Support<\/h4>[\s\S]*?\}\)\(\)\}\s*<\/div>/g;

code = code.replace(straySection, '');

fs.writeFileSync('src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', code);
console.log("Stray evidence section removed.");
