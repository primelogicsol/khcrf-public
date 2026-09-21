const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const filterRegex = /\{\/\* Hearing Theme \/ Topic \*\/\}\s*<select[\s\S]*?value=\{selectedDateRange\}[\s\S]*?<\/select>\s*<\/div>/m;

const replacement = `{/* Status */}
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Event Types">--- Event Types ---</option>
                  <option value="Registration">Registration</option>
                  <option value="Public Participation">Public Participation</option>
                  <option value="Orientation">Orientation</option>
                  <option value="Public Hearing">Public Hearings</option>
                  <option value="Thematic Consultation">Thematic Consultations</option>
                  <option value="Submission Deadline">Submission Deadlines</option>
                  <option value="Draft Review">Draft Review</option>
                  <option value="Stakeholder Validation">Validation</option>
                  <option value="Expert Review">Expert Review</option>
                  <option value="Final Publication">Final Publication</option>
                  <option value="Statuses">--- Statuses ---</option>
                  <option value="Scheduled">Registration Open</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Live / Ongoing">Live / Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Postponed">Postponed</option>
                </select>

                {/* Date Range */}
                <select
                  value={selectedDateRange}
                  onChange={e => setSelectedDateRange(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                >
                  <option value="ALL">All Dates</option>
                  {dateRanges.map(dr => <option key={dr} value={dr}>{dr}</option>)}
                </select>

                <button 
                  onClick={() => setShowMoreFilters(!showMoreFilters)} 
                  className="w-full text-xs px-3 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-between transition"
                >
                  <span>More Filters</span>
                  <span className="text-[9px]">{showMoreFilters ? '▲' : '▼'}</span>
                </button>

                {showMoreFilters && (
                  <>
                    {/* Hearing Theme / Topic */}
                    <select
                      value={selectedTopic}
                      onChange={e => setSelectedTopic(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                    >
                      <option value="ALL">All Themes</option>
                      {topics.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>

                    {/* Stakeholder */}
                    <select
                      value={selectedStakeholder}
                      onChange={e => setSelectedStakeholder(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                    >
                      <option value="ALL">All Stakeholders</option>
                      {stakeholders.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>

                    {/* Participation Type */}
                    <select
                      value={selectedParticipation}
                      onChange={e => setSelectedParticipation(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                    >
                      <option value="ALL">All Participation Types</option>
                      {participationTypes.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </>
                )}
              </div>`;

c = c.replace(filterRegex, replacement);

// Clean up the original Status dropdown which was left above Hearing Theme
c = c.replace(/\{\/\* Status \*\/\}\s*<select[\s\S]*?value=\{selectedStatus\}[\s\S]*?<\/select>/, '');

fs.writeFileSync(file, c);
console.log("Applied filter collapser!");
