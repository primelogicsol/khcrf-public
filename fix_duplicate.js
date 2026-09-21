const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

const regex = /const dynamicActivities = activities\.map\(\(a: any\) => \{[\s\S]*?return feed;\n\s*\}\);\n\s*\/\/\ 2\. Filter into buckets\n\s*const completed = dynamicActivities/g;
c = c.replace(regex, "// 2. Filter into buckets\n                      const completed = activities");

c = c.replace(/const future = dynamicActivities/g, "const future = activities");

fs.writeFileSync(file, c);
console.log("Stripped duplicate derivation!");
