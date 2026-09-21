const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/\[baseHearingsForStatusFacets, selectedStatus\]\);/g, "[baseHearingsForStatusFacets, selectedStatus, selectedRegistrationOpen]);");

fs.writeFileSync(file, c);
console.log("Updated useMemo deps!");
