const fs = require('fs');
const file = 'backend/src/controllers/skcHearingController.ts';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/status: h\.status,/g, `status: (() => {
                  let s = h.status;
                  if (h.date) {
                      const now = new Date();
                      const ed = new Date(h.date);
                      ed.setHours(23, 59, 59, 999);
                      if (ed < now) return 'COMPLETED';
                      if (ed.toDateString() === now.toDateString()) return 'ONGOING';
                  }
                  return s;
              })(),`);

fs.writeFileSync(file, c);
console.log("Replaced backend status logic!");
