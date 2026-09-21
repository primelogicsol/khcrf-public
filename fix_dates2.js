const fs = require('fs');
const targetFile = 'frontend/src/app/(main)/state-of-kashmir-crafts/current-assessment-2026/CurrentAssessmentClient.tsx';
let content = fs.readFileSync(targetFile, 'utf8');

content = content.replace(/new Date\(m\.date \|\| m\.startAt\)/g, 'getHearingDate(m)!');
content = content.replace(/new Date\(h\.date \|\| h\.startAt\)/g, 'getHearingDate(h)!');
content = content.replace(/new Date\(nextScheduledHearing\.date \|\| nextScheduledHearing\.startAt\)/g, 'getHearingDate(nextScheduledHearing)!');

// Also fix the weird characters A
content = content.replace(/A/g, '·');
content = content.replace(//g, '·');

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Done');
