const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/const \[selectedParticipation, setSelectedParticipation\] = useState\('ALL'\);\s*/g, "");

const filterRegex = /if \(selectedParticipation !== 'ALL'\) \{[\s\S]*?return true;\s*\}\);\s*\}/;
c = c.replace(filterRegex, "");

c = c.replace(/selectedParticipation, /g, "");
c = c.replace(/ \|\| selectedParticipation !== 'ALL'/g, "");

const activeChipRegex = /\{selectedParticipation !== 'ALL' && \([\s\S]*?\}\)/;
c = c.replace(activeChipRegex, "");

c = c.replace(/setSelectedParticipation\('ALL'\);\s*/g, "");

const dropdownRegex = /\{\/\* Participation Type \*\/\}\s*<select[\s\S]*?<\/select>/;
c = c.replace(dropdownRegex, "");

fs.writeFileSync(file, c);
console.log("Removed selectedParticipation filter!");
