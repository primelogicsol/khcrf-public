const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/Upcoming \{filteredHearings\.filter\(h =>/g, "Upcoming {baseHearingsForStatusFacets.filter(h =>");
c = c.replace(/const hasRegFields = filteredHearings\.some/g, "const hasRegFields = baseHearingsForStatusFacets.some");
c = c.replace(/return filteredHearings\.filter\(h => h\.registrationStatus/g, "return baseHearingsForStatusFacets.filter(h => h.registrationStatus");
c = c.replace(/Live \{filteredHearings\.filter\(h =>/g, "Live {baseHearingsForStatusFacets.filter(h =>");
c = c.replace(/Completed \{filteredHearings\.filter\(h =>/g, "Completed {baseHearingsForStatusFacets.filter(h =>");

fs.writeFileSync(file, c);
console.log("Updated button logic to use baseHearingsForStatusFacets!");
