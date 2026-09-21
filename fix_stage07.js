const fs = require('fs');
const targetFile = 'frontend/src/app/(main)/state-of-kashmir-crafts/current-assessment-2026/CurrentAssessmentClient.tsx';
let content = fs.readFileSync(targetFile, 'utf8');

const regex = /Stage 07 [^P]+ Public Hearings/;
const newStr = `Stage 07 {"\\u00B7"} Public Hearings`;

content = content.replace(regex, newStr);

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Fixed Stage 07 dot!');
