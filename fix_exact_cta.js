const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

const t = "{(!feed.startAt?.includes('2027')) && (";
const rep = "{(!(feed.startAt && new Date(feed.startAt).getFullYear() === 2027)) && (";

c = c.replace(t, rep);
fs.writeFileSync(file, c);
console.log("Fixed exact CTA string!");
