const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const t = "const regOpen = hearing.registrationStatus === 'OPEN';";
const rep = `const hearingDate = hearing.date || hearing.scheduledDate || hearing.startAt;
                                  const isPast = hearingDate ? new Date(hearingDate) < new Date() : false;
                                  const regOpen = hearing.registrationStatus === 'OPEN' && !isPast;`;
c = c.replace(t, rep);
fs.writeFileSync(file, c);
console.log("Updated regOpen logic!");
