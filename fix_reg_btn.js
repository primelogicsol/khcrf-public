const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const regexBtn = /Registration Open \(\{filteredHearings\.filter\(h =>\s*h\.registrationStatus === 'OPEN'\)\.length\}\)/;
c = c.replace(regexBtn, `Registration Open {(() => {
                    const hasRegFields = filteredHearings.some(h => (h.registration_open_at && h.registration_close_at) || (h.registrationOpenAt && h.registrationCloseAt));
                    if (!hasRegFields) return '—';
                    return filteredHearings.filter(h => h.registrationStatus === 'OPEN').length;
                  })()}`);

fs.writeFileSync(file, c);
console.log("Updated Registration Open text!");
