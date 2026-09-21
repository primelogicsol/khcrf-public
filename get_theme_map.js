const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

const tStart = c.indexOf('{cluster.themes.map((theme: any) => {');
const tEnd = c.indexOf('})}', tStart);

console.log(c.substring(tStart, tEnd + 3));
