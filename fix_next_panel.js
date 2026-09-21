const fs = require('fs');
const targetFile = 'frontend/src/app/(main)/state-of-kashmir-crafts/current-assessment-2026/CurrentAssessmentClient.tsx';
let content = fs.readFileSync(targetFile, 'utf8');

const regex = /<span className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-4 md:mb-0">Next Public Hearing<\/span>/m;

const newStr = `<span className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-4 md:mb-0">{getEventStatus(nextScheduledHearing) === 'Live / Ongoing' ? "Today's Public Hearing" : "Next Public Hearing"}</span>`;

content = content.replace(regex, newStr);

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Fixed Next Public Hearing panel label!');
