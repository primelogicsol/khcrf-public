const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/actualEvents = actualEvents\.filter\(evt => evt\.isFormalHearing \|\| evt\.eventType === 'PUBLIC_HEARING' \|\| evt\.category === 'PUBLIC_HEARING'\)/, "actualEvents = actualEvents.filter(evt => evt.isFormalHearing || evt.eventType === 'PUBLIC_HEARING' || evt.category === 'PUBLIC_HEARING').filter(evt => !evt.title?.includes('Youth in Crafts'))");

fs.writeFileSync(file, c);
console.log("Excluded Youth in Crafts from Public Hearings list!");
