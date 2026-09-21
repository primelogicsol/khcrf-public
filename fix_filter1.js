const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const regex = /actualEvents = actualEvents\.map\(evt => \{/;
c = c.replace(regex, `actualEvents = actualEvents.filter(evt => evt.isFormalHearing || evt.eventType === 'PUBLIC_HEARING' || evt.category === 'PUBLIC_HEARING').map(evt => {`);

fs.writeFileSync(file, c);
console.log("Filtered actualEvents!");
