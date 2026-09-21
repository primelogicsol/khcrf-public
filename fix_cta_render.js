const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

const target = "{(!(feed.startAt && new Date(feed.startAt).getFullYear() === 2027)) && (";
c = c.replace(target, "{showCTA && (");

fs.writeFileSync(file, c);
console.log("Fixed CTA render condition literally!");
