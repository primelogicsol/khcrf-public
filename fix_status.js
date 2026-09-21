const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const statusRegex = /<option value="Event Types">--- Event Types ---<\/option>[\s\S]*?<option value="Postponed">Postponed<\/option>/m;
const replacement = `<option value="Upcoming">Upcoming</option>
                  <option value="Live / Ongoing">Live Now</option>
                  <option value="Completed">Completed</option>
                  <option value="Postponed">Postponed</option>
                  <option value="Cancelled">Cancelled</option>`;

c = c.replace(statusRegex, replacement);
fs.writeFileSync(file, c);
console.log("Updated Status Dropdown!");
