const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/a\.startAt && new Date\(a\.startAt\) < now && a\.startAt\.includes\('2026'\)/g, "a.startAt && new Date(a.startAt) < now && new Date(a.startAt).getFullYear() === 2026");
c = c.replace(/a\.startAt && new Date\(a\.startAt\) >= now && a\.startAt\.includes\('2026'\)/g, "a.startAt && new Date(a.startAt) >= now && new Date(a.startAt).getFullYear() === 2026");
c = c.replace(/a\.startAt && a\.startAt\.includes\('2027'\)/g, "a.startAt && new Date(a.startAt).getFullYear() === 2027");

fs.writeFileSync(file, c);
console.log("Fixed startAt type error!");
