const fs = require('fs');
const targetFile = 'frontend/src/app/(main)/state-of-kashmir-crafts/current-assessment-2026/CurrentAssessmentClient.tsx';
let content = fs.readFileSync(targetFile, 'utf8');

content = content.replace(/  const formalHearings = hearings\.filter\(h => h\.eventType === 'PUBLIC_HEARING'\);\n/, '');
content = content.replace(/  const sortedHearings = \[\.\.\.formalHearings\]\.sort\(\(a, b\) => new Date\(a\.date \|\| a\.startAt\)\.getTime\(\) - new Date\(b\.date \|\| b\.startAt\)\.getTime\(\)\);\n/, '');
content = content.replace(/  const nextScheduledHearing = sortedHearings\.find\(h => \{\n    const hDate = new Date\(h\.date \|\| h\.startAt\);\n    const hDay = new Date\(hDate\.toISOString\(\)\.split\('T'\)\[0\] \+ 'T00:00:00Z'\);\n    return hDay >= today;\n  \}\);\n/, '');

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Duplicates removed.');
