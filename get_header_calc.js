const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

const tStart = c.indexOf('const countsByStatus = cluster.themes.reduce');
const tEnd = c.indexOf('return (', tStart);

console.log(c.substring(tStart, tEnd));
