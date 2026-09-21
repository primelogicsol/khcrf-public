const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const target = `        actualEvents.sort((a, b) => {
          const dateA = typeof a.startAt === 'string' ? a.startAt : (a.date || a.scheduledDate);
          const dateB = typeof b.startAt === 'string' ? b.startAt : (b.date || b.scheduledDate);
          const tA = new Date(dateA).getTime();
          const tB = new Date(dateB).getTime();
          if (!isNaN(tA) && !isNaN(tB) && tA !== tB) return tA - tB;
          return (a.programmeSequence || 0) - (b.programmeSequence || 0);
        });`;

const replacement = `        actualEvents.sort((a, b) => {
          const statusOrder = { 'ONGOING': 0, 'LIVE': 0, 'REGISTRATION_OPEN': 1, 'UPCOMING': 1, 'SCHEDULED': 1, 'COMPLETED': 2, 'CLOSED': 2 };
          const sA = statusOrder[a.status] !== undefined ? statusOrder[a.status] : 1;
          const sB = statusOrder[b.status] !== undefined ? statusOrder[b.status] : 1;
          
          if (sA !== sB) return sA - sB;
          
          const dateA = typeof a.startAt === 'string' ? a.startAt : (a.date || a.scheduledDate);
          const dateB = typeof b.startAt === 'string' ? b.startAt : (b.date || b.scheduledDate);
          const tA = new Date(dateA).getTime();
          const tB = new Date(dateB).getTime();
          
          if (!isNaN(tA) && !isNaN(tB) && tA !== tB) {
            // If both are completed, show most recently completed first (reverse chronological)
            if (sA === 2) return tB - tA;
            // Otherwise, show earliest upcoming first (chronological)
            return tA - tB;
          }
          return (a.programmeSequence || 0) - (b.programmeSequence || 0);
        });`;

c = c.replace(target, replacement);

fs.writeFileSync(file, c);
console.log("Fixed sort order!");
