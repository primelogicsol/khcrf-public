const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/<span className="text-\[9px\] uppercase font-black tracking-wider text-\[#8E7868\] block">Planned Hearings<\/span>/, `<span className="text-[9px] uppercase font-black tracking-wider text-[#8E7868] block">Scheduled / Upcoming Hearings</span>`);

c = c.replace(/<span data-editorial-accent-text className="text-\[9px\] uppercase font-black tracking-wider block">Completed<\/span>/, `<span data-editorial-accent-text className="text-[9px] uppercase font-black tracking-wider block">Completed Hearings</span>`);

c = c.replace(/\{overview\?\.status \|\| 'Pre-Launch'\}/g, "'Public Hearings Active'");

fs.writeFileSync(file, c);
console.log("Updated bottom stats!");
