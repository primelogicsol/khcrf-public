const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

const tStart = c.indexOf('<div className="text-[9px] text-[#8E7868] font-bold mt-1.5 flex flex-wrap items-center gap-1.5">');
const tEnd = c.indexOf('</div>', tStart) + 6;

console.log(c.substring(tStart, tEnd));
