const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const regex = /return result;\s*\}, \[hearings, searchQuery, selectedDistrict, selectedTopic, selectedCraft, selectedStatus, selectedStakeholder, selectedParticipation, selectedDateRange, activeTab\]\);/m;

const replacement = `return result;
  }, [hearings, searchQuery, selectedDistrict, selectedTopic, selectedCraft, selectedStakeholder, selectedParticipation, selectedDateRange, activeTab]);

  const filteredHearings = useMemo(() => {
    let result = [...baseHearingsForStatusFacets];
    
    if (selectedRegistrationOpen) {
      result = result.filter(h => h.registrationStatus === 'OPEN');
    }
    
    if (selectedStatus !== 'ALL') {
      result = result.filter(h => {
        const s = selectedStatus.toUpperCase();
        if (s === 'LIVE / ONGOING') {
          return h.status === 'LIVE' || h.status === 'ONGOING';
        }
        if (s === 'UPCOMING') {
          return h.status === 'UPCOMING' || h.status === 'SCHEDULED' || h.status === 'REGISTRATION_OPEN';
        }
        if (s === 'SCHEDULED' || s === 'REGISTRATION OPEN') {
          return h.registrationStatus === 'OPEN';
        }
        return h.status === s;
      });
    }
    return result;
  }, [baseHearingsForStatusFacets, selectedStatus, selectedRegistrationOpen]);`;

c = c.replace(regex, replacement);
fs.writeFileSync(file, c);
console.log("Restored filteredHearings logic!");
