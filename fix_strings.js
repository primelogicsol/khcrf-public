const fs = require('fs');
const targetFile = 'frontend/src/app/(main)/state-of-kashmir-crafts/current-assessment-2026/CurrentAssessmentClient.tsx';
let content = fs.readFileSync(targetFile, 'utf8');

// Fix Formal 2027 Assessment Stages
const oldStages = `                  {[
                    { stage: '08', title: 'Draft Findings', date: '18 Mar ? 14 Apr' },
                    { stage: '09', title: 'Review', date: '15 Apr ? 5 May' },
                    { stage: '10', title: 'Validation', date: '8?12 May' },
                    { stage: '11', title: 'Expert Review', date: '15?24 May' }
                  ].map((st) => (`;

const newStages = `                  {[
                    { stage: '08', title: 'Draft Findings', date: <>18 Mar {"\\u2013"} 14 Apr</> },
                    { stage: '09', title: 'Review', date: <>15 Apr {"\\u2013"} 5 May</> },
                    { stage: '10', title: 'Validation', date: <>8 {"\\u2013"} 12 May</> },
                    { stage: '11', title: 'Expert Review', date: <>15 {"\\u2013"} 24 May</> }
                  ].map((st) => (`;

content = content.replace(oldStages, newStages);

// Also use regex to catch variations in case it was differently corrupted
content = content.replace(/\{ stage: '08', title: 'Draft Findings', date: '18 Mar [^']+ 14 Apr' \}/, `{ stage: '08', title: 'Draft Findings', date: <>18 Mar {"\\u2013"} 14 Apr</> }`);
content = content.replace(/\{ stage: '09', title: 'Review', date: '15 Apr [^']+ 5 May' \}/, `{ stage: '09', title: 'Review', date: <>15 Apr {"\\u2013"} 5 May</> }`);
content = content.replace(/\{ stage: '10', title: 'Validation', date: '8[^']+12 May' \}/, `{ stage: '10', title: 'Validation', date: <>8 {"\\u2013"} 12 May</> }`);
content = content.replace(/\{ stage: '11', title: 'Expert Review', date: '15[^']+24 May' \}/, `{ stage: '11', title: 'Expert Review', date: <>15 {"\\u2013"} 24 May</> }`);

// Fix "5 Sep ? 28 Nov 2026"
content = content.replace(/5 Sep [^<]+ 28 Nov 2026/, `5 Sep {"\\u2013"} 28 Nov 2026`);

// Fix "Publish What We Heard before final recommendations"
content = content.replace(/desc: "Publish [^"]+What We Heard[^"]+ before final recommendations\.",/, `desc: 'Publish "What We Heard" before final recommendations.',`);

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Fixed dates and quotes!');
