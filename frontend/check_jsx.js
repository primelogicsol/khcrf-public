const fs = require('fs');
const parser = require('@babel/parser');

const code = fs.readFileSync('src/app/(main)/master-artisans/contributor/page.tsx', 'utf8');

try {
  parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  });
  console.log("No syntax errors found.");
} catch (e) {
  console.log("Error at line", e.loc.line, "column", e.loc.column);
  console.log(e.message);
}
