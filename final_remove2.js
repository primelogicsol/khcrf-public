const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/if \(selectedParticipation !== 'ALL'\) \{[\s\S]*?return true;\r?\n\s*\}\);\r?\n\s*\}/, "");

fs.writeFileSync(file, c);
console.log("Successfully removed the block!");
