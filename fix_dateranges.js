const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/const dateRanges = \["This Week", "This Month", "November 2026", "December 2026", "January 2027", "February 2027", "March 2027", "Past Hearings"\];/, 'const dateRanges = ["This Week", "This Month", "Next 30 Days", "September 2026", "October 2026", "November 2026", "Past Hearings"];');

fs.writeFileSync(file, c);
console.log("Updated dateRanges!");
