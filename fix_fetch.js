const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/safeFetch\('\/api\/public\/skc\/activities'\)/, "safeFetch('/api/public/skc/activities?all=true')");

fs.writeFileSync(file, c);
console.log("Added ?all=true to activities fetch!");
