const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const t = "filteredHearings.map(hearing => {\r\n                        let statusBadge = 'bg-blue-50 text-blue-700 border-blue-200';";
const t2 = "filteredHearings.map(hearing => {\n                        let statusBadge = 'bg-blue-50 text-blue-700 border-blue-200';";

const rep = `(selectedStatus === 'ALL' && !selectedRegistrationOpen ? [
                        ...filteredHearings.filter(h => h.status !== 'COMPLETED' && h.status !== 'CLOSED'),
                        ...(filteredHearings.some(h => h.status === 'COMPLETED' || h.status === 'CLOSED') ? [{
                          _isDivider: true,
                          id: 'completed-divider',
                          count: filteredHearings.filter(h => h.status === 'COMPLETED' || h.status === 'CLOSED').length
                        }] : []),
                        ...(showCompletedSection ? filteredHearings.filter(h => h.status === 'COMPLETED' || h.status === 'CLOSED') : [])
                      ] : filteredHearings).map(hearing => {
                        if (hearing._isDivider) {
                          return (
                            <div key={hearing.id} className="mt-8 mb-2 border-t border-gray-200 pt-8 w-full">
                              <button 
                                onClick={() => setShowCompletedSection(!showCompletedSection)}
                                className="flex items-center gap-2 text-stone-500 font-black uppercase tracking-wider text-xs hover:text-stone-700 transition w-full text-left"
                              >
                                Completed Hearings ({hearing.count}) <span className="ml-auto text-[10px]">{showCompletedSection ? '▲' : '▼'}</span>
                              </button>
                            </div>
                          );
                        }
                        
                        let statusBadge = 'bg-blue-50 text-blue-700 border-blue-200';`;

if (c.includes(t)) {
  c = c.replace(t, rep);
} else if (c.includes(t2)) {
  c = c.replace(t2, rep.replace(/\r\n/g, '\n'));
} else {
  console.log("Could not find map block!");
}

fs.writeFileSync(file, c);
console.log("Replaced!");
