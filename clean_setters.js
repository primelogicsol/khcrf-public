const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/if \(Array\.isArray\(actualData\.districts\)\) setDistricts\(actualData\.districts\);/g, '');
c = c.replace(/if \(Array\.isArray\(actualData\.crafts\)\) setCrafts\(actualData\.crafts\);/g, '');
c = c.replace(/if \(Array\.isArray\(actualData\.hearingTypes\)\) setTopics\(actualData\.hearingTypes\);/g, '');
c = c.replace(/if \(Array\.isArray\(actualData\.stakeholders\)\) setStakeholders\(actualData\.stakeholders\);/g, '');
c = c.replace(/if \(Array\.isArray\(actualData\.participationTypes\)\) setParticipationTypes\(actualData\.participationTypes\.map\(\(p: any\) => p\.name\)\);/g, '');

fs.writeFileSync(file, c);
console.log("Cleaned up unused setters!");
