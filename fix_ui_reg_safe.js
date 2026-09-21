const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

// The active filters wrapper condition
c = c.replace(/selectedDateRange !== 'ALL'\) && \(/, "selectedDateRange !== 'ALL' || selectedRegistrationOpen) && (");

// The explicit text to match:
const searchStr = `{selectedStatus !== 'ALL' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 text-stone-750 rounded-full text-xs font-semibold shadow-2xs">
                          Status: {selectedStatus}
                          <button onClick={() => setSelectedStatus('ALL')} className="hover:text-red-500 font-bold">&times;</button>
                        </span>
                      )}`;

const replacementStr = `{selectedStatus !== 'ALL' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 text-stone-750 rounded-full text-xs font-semibold shadow-2xs">
                          Status: {selectedStatus}
                          <button onClick={() => setSelectedStatus('ALL')} className="hover:text-red-500 font-bold">&times;</button>
                        </span>
                      )}
                      {selectedRegistrationOpen && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 text-stone-750 rounded-full text-xs font-semibold shadow-2xs">
                          Status: Registration Open
                          <button onClick={() => setSelectedRegistrationOpen(false)} className="hover:text-red-500 font-bold">&times;</button>
                        </span>
                      )}`;

c = c.replace(searchStr, replacementStr);
fs.writeFileSync(file, c);
console.log("Safely applied active filters for Registration Open!");
