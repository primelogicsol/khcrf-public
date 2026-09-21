const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

// Fix "Registration Open" button onClick
c = c.replace(/setSelectedStatus\(selectedStatus === 'Scheduled' \? 'ALL' : 'Scheduled'\)/g, "setSelectedStatus(selectedStatus === 'Registration Open' ? 'ALL' : 'Registration Open')");

// Fix "Upcoming" button highlight active state
// wait, the active state check for Registration Open also needs to be fixed!
c = c.replace(/selectedStatus === 'Scheduled' \? 'bg-stone-850/g, "selectedStatus === 'Registration Open' ? 'bg-stone-850");

// Fix filteredHearings logic to match the chips exactly
c = c.replace(/if \(s === 'UPCOMING'\) return h\.status === 'SCHEDULED' \|\| h\.status === 'UPCOMING';/g, "if (s === 'UPCOMING') return h.status === 'SCHEDULED' || h.status === 'UPCOMING' || h.registrationStatus === 'OPEN';");
c = c.replace(/if \(s === 'REGISTRATION OPEN'\) return h\.status === 'REGISTRATION_OPEN';/g, "if (s === 'REGISTRATION OPEN') return h.registrationStatus === 'OPEN' || h.status === 'REGISTRATION_OPEN';");

fs.writeFileSync(file, c);
console.log("Replaced status chip logic successfully!");
