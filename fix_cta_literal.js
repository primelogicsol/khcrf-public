const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

const target = "const showCTA = (!isProgrammeSetup) && \n                         (!(feed.startAt && new Date(feed.startAt).getFullYear() === 2027));";
const replacement = `const showCTA = (!isProgrammeSetup) && 
                         (!(feed.startAt && new Date(feed.startAt).getFullYear() === 2027)) &&
                         (feed.status !== 'INTERNAL_REVIEW') &&
                         (feed.status !== 'Governance_Approval') &&
                         (feed.status !== 'Governance_Briefing');`;

c = c.replace(target, replacement);

fs.writeFileSync(file, c);
console.log("Literal replace done!");
