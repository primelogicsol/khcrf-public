const fs = require('fs');
const targetFile = 'frontend/src/app/(main)/state-of-kashmir-crafts/current-assessment-2026/CurrentAssessmentClient.tsx';
let content = fs.readFileSync(targetFile, 'utf8');

const oldStr = `                {/* Stage 07 {"\\u00B7"} Public Hearings</div>`;
const newStr = `                {/* Stage 07 Context */}
                <div className="mt-16 bg-white rounded-xl p-6 border border-gray-200">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-2">Stage 07 {"\\u00B7"} Public Hearings</div>`;

content = content.replace(oldStr, newStr);

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Restored broken JSX comment and div!');
