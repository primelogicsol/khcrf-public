const fs = require('fs');
let code = fs.readFileSync('src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', 'utf8');

// Strip per-factor evidence upload block
code = code.replace(
  /<div className="mt-8 border-t border-gray-100 pt-8 animate-in slide-in-from-top-4 duration-300">[\s\S]*?className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"\s*\/>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/,
  `{/* Centralized Evidence Upload happens in the Evidence & Documents step */}`
);

fs.writeFileSync('src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', code);
console.log('Removed per-factor upload UI');
