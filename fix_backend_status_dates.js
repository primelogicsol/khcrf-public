const fs = require('fs');
const file = 'backend/src/controllers/skcHearingController.ts';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/if \(h\.date\) {/g, `const evtDate = h.date || h.startAt || h.scheduledDate;
                  if (evtDate) {`);
c = c.replace(/const ed = new Date\(h\.date\);/g, `const ed = new Date(evtDate);`);

fs.writeFileSync(file, c);
console.log("Improved date fallback!");
