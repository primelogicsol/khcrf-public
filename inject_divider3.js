const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const regex = /filteredHearings\.map\(hearing => \{\s*let statusBadge = 'bg-blue-50 text-blue-700 border-blue-200';/;

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
                            <div key={hearing.id} className="mt-8 mb-2 border-t border-gray-200 pt-8 w-full flex items-center col-span-full">
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

c = c.replace(regex, rep);

fs.writeFileSync(file, c);
console.log("Injected using regex spaces!");
