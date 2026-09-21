const fs = require('fs');
const file = 'backend/src/controllers/skcHearingController.ts';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/let mode = 'In Person';\s*if \(venueLower\.includes\('hybrid'\) \|\| venueLower\.includes\('secretariat'\) \|\| venueLower\.includes\('srinagar \/ online'\)\) mode = 'Hybrid';\s*else if \(venueLower\.includes\('online'\) \|\| venueLower\.includes\('portal'\) \|\| venueLower\.includes\('website'\) \|\| h\.meetingLink \|\| h\.publicMeetingUrl\) mode = 'Online';/g, `let mode = 'Online'; // Hardcoded per user request: all hearings are 100% online`);

fs.writeFileSync(file, c);
console.log("Fixed mode logic!");
