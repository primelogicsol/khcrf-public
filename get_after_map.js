const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

const tStart = c.indexOf('                                 })}');
console.log(c.substring(tStart, tStart + 500));
