const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/\(feed\.status \!\=\= 'Governance_Briefing'\);/g, "(feed.status !== 'Governance_Briefing') &&\n                           (actionLabel !== 'View Details');");

fs.writeFileSync(file, c);
console.log("Removed all View Details CTAs!");
