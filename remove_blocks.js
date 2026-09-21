const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/if \(selectedParticipation !== 'ALL'\) \{[\s\S]*?return true;\s*\};\s*\}/, "");
c = c.replace(/\{selectedParticipation !== 'ALL' && \([\s\S]*?\}\)/, "");
c = c.replace(/\{\/\* Participation Type \*\/\}\s*<select[\s\S]*?<\/select>/, "");

// Just to be sure about the filter block
c = c.replace(/if \(selectedParticipation !== 'ALL'\) \{[\s\S]*?return true;\s*\}\);\s*\}/, "");

fs.writeFileSync(file, c);
console.log("Removed participation blocks using regex!");
