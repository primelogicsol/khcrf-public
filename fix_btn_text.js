const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/Upcoming Hearings \(\{filteredHearings\.filter\(h => h\.status === 'SCHEDULED' \|\| h\.status === 'UPCOMING' \|\| h\.registrationStatus === 'OPEN'\)\.length\}\)/, `Upcoming {filteredHearings.filter(h => h.status === 'SCHEDULED' || h.status === 'UPCOMING').length}`);
c = c.replace(/Registration Open \{/, `Registration Open {`); // Already replaced
c = c.replace(/Live Now \(\{filteredHearings\.filter\(h => h\.status === 'LIVE' \|\| h\.status === 'ONGOING'\)\.length\}\)/, `Live {filteredHearings.filter(h => h.status === 'LIVE' || h.status === 'ONGOING').length}`);
c = c.replace(/Completed \(\{filteredHearings\.filter\(h => h\.status === 'COMPLETED'\)\.length\}\)/, `Completed {filteredHearings.filter(h => h.status === 'COMPLETED').length}`);

fs.writeFileSync(file, c);
console.log("Updated counts format!");
