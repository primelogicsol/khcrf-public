const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/const showCTA = \(\!isProgrammeSetup\) &&[\s\S]*?\n\s*const locationString/g, `const showCTA = (!isProgrammeSetup) && 
                         (!(feed.startAt && new Date(feed.startAt).getFullYear() === 2027)) &&
                         (feed.status !== 'INTERNAL_REVIEW') &&
                         (feed.status !== 'Governance_Approval') &&
                         (feed.status !== 'Governance_Briefing');
                         
                       const locationString`);

fs.writeFileSync(file, c);
console.log("Regex replace block done!");
