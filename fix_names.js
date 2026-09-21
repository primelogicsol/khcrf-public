const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/name: "Carpets & Kani"/g, 'name: "Future of Carpets"');
c = c.replace(/name: "Heritage Conservation"/g, 'name: "Cultural Heritage"');
c = c.replace(/name: "Digital Craft Markets"/g, 'name: "Digital Commerce"');
c = c.replace(/name: "Craft Finance"/g, 'name: "Finance & Investment"');
c = c.replace(/name: "Global Craft Markets"/g, 'name: "Global Markets"');
c = c.replace(/name: "Closing Climate and Sustainability Consultation"/g, 'name: "Climate & Sustainability"');

// The user also listed "Exports" but it's not in the previous list. Wait, is Exports missing from Markets & Economy?
// Let's check MARKETS & ECONOMY cluster.
