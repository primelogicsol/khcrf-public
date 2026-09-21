const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/!\(\?\:feed\.startAt\?\.includes\('2027'\)\)/g, "!(feed.startAt && new Date(feed.startAt).getFullYear() === 2027)");
c = c.replace(/!\(feed\.startAt\?\.includes\('2027'\)\)/g, "!(feed.startAt && new Date(feed.startAt).getFullYear() === 2027)");
c = c.replace(/!\feed\.startAt\?\.includes\('2027'\)/g, "!(feed.startAt && new Date(feed.startAt).getFullYear() === 2027)");

fs.writeFileSync(file, c);
console.log("Fixed CTA logic type error!");
