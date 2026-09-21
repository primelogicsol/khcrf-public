const fs = require('fs');
const targetFile = 'frontend/src/app/(main)/state-of-kashmir-crafts/current-assessment-2026/CurrentAssessmentClient.tsx';
let content = fs.readFileSync(targetFile, 'utf8');

// 1. Revert formal timeline day markers (line ~891) back to just day
const oldDayMarker = /<span className=\{\`text-xs font-bold \$\{isNext \? 'text-brand-primary' : 'text-gray-900'\}\`\}>\{getHearingDate\(h\)\?\.toLocaleDateString\('en-GB', \{ day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia\/Kolkata' \}\) \|\| 'TBD'\}<\/span>/;
const newDayMarker = `<span className={\`text-xs font-bold \${isNext ? 'text-brand-primary' : 'text-gray-900'}\`}>{getHearingDate(h)?.toLocaleDateString('en-GB', { day: '2-digit', timeZone: 'Asia/Kolkata' }) || 'TBD'}</span>`;
content = content.replace(oldDayMarker, newDayMarker);

// 2. Add year to the month grouping logic (line ~503)
const oldMonthLogic = /const month = date\.toLocaleDateString\('en-US', \{ month: 'long', timeZone: 'Asia\/Kolkata' \}\)\.toUpperCase\(\);/;
const newMonthLogic = `const month = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' }).toUpperCase();`;
content = content.replace(oldMonthLogic, newMonthLogic);

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Fixed day markers and month headers!');
