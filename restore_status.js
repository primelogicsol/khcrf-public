const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const regex = /\{\/\* Date Range \*\/\}/;
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

                {/* Date Range */}`;

c = c.replace(regex, replacement);
fs.writeFileSync(file, c);
console.log("Restored Status dropdown!");
