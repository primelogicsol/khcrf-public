const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/const showCTA = \(\!isProgrammeSetup\) &&[\s\S]*?\(actionLabel \!\=\= 'View Details'\);/g, "const showCTA = false;");

fs.writeFileSync(file, c);
console.log("Removed all CTAs!");
