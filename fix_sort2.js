const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const regex = /actualEvents\.sort\(\(a, b\) => \{[\s\S]*?return \(a\.programmeSequence \|\| 0\) - \(b\.programmeSequence \|\| 0\);\s*\}\);/m;

const replacement = `actualEvents.sort((a, b) => {
          const statusOrder: Record<string, number> = { 'ONGOING': 0, 'LIVE': 0, 'REGISTRATION_OPEN': 1, 'UPCOMING': 1, 'SCHEDULED': 1, 'COMPLETED': 2, 'CLOSED': 2 };
          const sA = statusOrder[a.status] !== undefined ? statusOrder[a.status] : 1;
          const sB = statusOrder[b.status] !== undefined ? statusOrder[b.status] : 1;
          
          if (sA !== sB) return sA - sB;
          
          const dateA = typeof a.startAt === 'string' ? a.startAt : (a.date || a.scheduledDate);
          const dateB = typeof b.startAt === 'string' ? b.startAt : (b.date || b.scheduledDate);
          const tA = new Date(dateA).getTime();
          const tB = new Date(dateB).getTime();
          
          if (!isNaN(tA) && !isNaN(tB) && tA !== tB) {
            if (sA === 2) return tB - tA; // reverse chronological for completed
            return tA - tB; // chronological for upcoming
          }
          return (a.programmeSequence || 0) - (b.programmeSequence || 0);
        });`;

c = c.replace(regex, replacement);

fs.writeFileSync(file, c);
console.log("Fixed sort order regex!");
