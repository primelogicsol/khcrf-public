const fs = require('fs');
const targetFile = 'frontend/src/app/(main)/state-of-kashmir-crafts/current-assessment-2026/CurrentAssessmentClient.tsx';
let content = fs.readFileSync(targetFile, 'utf8');

// Add year: 'numeric' to all dynamic dates that lack it
content = content.replace(/\{ day: 'numeric', month: 'short', timeZone: 'Asia\/Kolkata' \}/g, "{ day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }");
content = content.replace(/\{ day: '2-digit', month: 'short', timeZone: 'Asia\/Kolkata' \}/g, "{ day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }");

// Timeline was only { day: '2-digit', timeZone: 'Asia/Kolkata' }, change to include month and year
content = content.replace(/\{ day: '2-digit', timeZone: 'Asia\/Kolkata' \}/g, "{ day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }");

// Stage 07 static text
content = content.replace(/5 Sep \{"\\u2013"\} 28 Nov 2026/g, '5 Sep 2026 {"\\u2013"} 28 Nov 2026');

// Formal 2027 stages
content = content.replace(/18 Mar \{"\\u2013"\} 14 Apr/g, '18 Mar 2027 {"\\u2013"} 14 Apr 2027');
content = content.replace(/15 Apr \{"\\u2013"\} 5 May/g, '15 Apr 2027 {"\\u2013"} 5 May 2027');
content = content.replace(/8 \{"\\u2013"\} 12 May/g, '8 May 2027 {"\\u2013"} 12 May 2027');
content = content.replace(/15 \{"\\u2013"\} 24 May/g, '15 May 2027 {"\\u2013"} 24 May 2027');

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Fixed all dates to explicitly show year!');
