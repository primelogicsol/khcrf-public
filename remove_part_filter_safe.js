const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/const \[selectedParticipation, setSelectedParticipation\] = useState\('ALL'\);\s*/, "");
c = c.replace(/selectedParticipation, /, "");
c = c.replace(/ \|\| selectedParticipation !== 'ALL'/, "");
c = c.replace(/setSelectedParticipation\('ALL'\);\s*/, "");

// Remove Participation state block in the filters
const partStateBlock = `if (selectedParticipation !== 'ALL') {
      result = result.filter(h => {
        if (selectedParticipation === 'Attend Hearing') {
          return h.status === 'REGISTRATION_OPEN' || h.status === 'SCHEDULED' || h.status === 'UPCOMING';
        }
        if (selectedParticipation === 'Submit Written Testimony') {
          return h.status !== 'CANCELLED' && h.status !== 'POSTPONED';
        }
        if (selectedParticipation === 'Present Evidence') {
          return h.topics?.includes('Heritage & Preservation') || h.topics?.includes('GI & Authenticity') || h.topics?.includes('Raw Materials') || h.topics?.includes('Policy & Governance');
        }
        if (selectedParticipation === 'Observer') {
          return h.format?.name === 'Hybrid' || h.format?.name === 'Virtual' || (h.venue && h.venue.toLowerCase().includes('online')) || h.meetingLink;
        }
        if (selectedParticipation === 'Panel Speaker') {
          return h.speakers && h.speakers.length > 0;
        }
        if (selectedParticipation === 'Institutional Submission') {
          return h.stakeholderCategories?.includes('Government Official') || h.stakeholderCategories?.includes('Exporter / Trader') || h.stakeholderCategories?.includes('Financial Institution');
        }
        return true;
      });
    }`;
c = c.replace(partStateBlock, "");

// Remove Participation dropdown
const dropdownBlock = `{/* Participation Type */}
                      <select
                        value={selectedParticipation}
                        onChange={e => setSelectedParticipation(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                      >
                        <option value="ALL">All Participation Types</option>
                        {participationTypes.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>`;
c = c.replace(dropdownBlock, "");

// Remove Participation active chip
const activeChipBlock = `{selectedParticipation !== 'ALL' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 text-stone-750 rounded-full text-xs font-semibold shadow-2xs">
                          Participation: {selectedParticipation}
                          <button onClick={() => setSelectedParticipation('ALL')} className="hover:text-red-500 font-bold">&times;</button>
                        </span>
                      )}`;
c = c.replace(activeChipBlock, "");

fs.writeFileSync(file, c);
console.log("Safely removed participation filters!");
