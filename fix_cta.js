const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/const showCTA = \(\!isProgrammeSetup\) && \n                         \(\!\(feed\.startAt && new Date\(feed\.startAt\)\.getFullYear\(\) === 2027\)\);/g, `const showCTA = (!isProgrammeSetup) && 
                         (!(feed.startAt && new Date(feed.startAt).getFullYear() === 2027)) &&
                         (feed.status !== 'INTERNAL_REVIEW') &&
                         (feed.status !== 'Governance_Approval') &&
                         (feed.status !== 'Governance_Briefing');`);

fs.writeFileSync(file, c);
console.log("Updated CTA logic to hide for internal reviews!");
