const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const searchRegex = /return result;\s*\}, \[baseHearingsForStatusFacets, selectedStatus, selectedRegistrationOpen\]\);/;

const replacement = `const getStatusPriority = (h: any) => {
        if (h.status === 'LIVE' || h.status === 'ONGOING') return 1;
        if (h.registrationStatus === 'OPEN') return 2;
        if (h.status === 'UPCOMING' || h.status === 'SCHEDULED' || h.status === 'REGISTRATION_OPEN') return 3;
        if (h.status === 'POSTPONED') return 4;
        if (h.status === 'CANCELLED') return 5;
        if (h.status === 'COMPLETED' || h.status === 'CLOSED') return 6;
        return 7;
      };
      
      result.sort((a, b) => {
        const pA = getStatusPriority(a);
        const pB = getStatusPriority(b);
        if (pA !== pB) return pA - pB;
        
        if (pA === 6) {
          const dA = a.date || a.scheduledDate ? new Date(a.date || a.scheduledDate).getTime() : 0;
          const dB = b.date || b.scheduledDate ? new Date(b.date || b.scheduledDate).getTime() : 0;
          return dB - dA;
        } else {
          const dA = a.date || a.scheduledDate ? new Date(a.date || a.scheduledDate).getTime() : Infinity;
          const dB = b.date || b.scheduledDate ? new Date(b.date || b.scheduledDate).getTime() : Infinity;
          return dA - dB;
        }
      });
      return result;
    }, [baseHearingsForStatusFacets, selectedStatus, selectedRegistrationOpen]);`;

c = c.replace(searchRegex, replacement);
fs.writeFileSync(file, c);
console.log("Applied sorting logic!");
