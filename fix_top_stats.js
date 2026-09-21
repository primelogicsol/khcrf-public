const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/Consultation Opens<\/div>/g, "Consultation Opened</div>");
c = c.replace(/<div className="text-\[10px\] font-bold text-gray-400 uppercase tracking-wider">Publication Status<\/div>\s*<div className="text-sm font-bold text-gray-700 mt-1">Awaiting First Activities<\/div>/g, `<div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Programme Status</div>
                <div className="text-sm font-bold text-emerald-600 mt-1">Active</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Next Hearing</div>
                <div className="text-sm font-bold text-gray-700 mt-1">Future of Carpets (20 Sep)</div>`);

c = c.replace(/grid-cols-1 sm:grid-cols-3/, "grid-cols-2 sm:grid-cols-4");

// Change top phase to Public Hearings & Public Consultation
c = c.replace(/\{overview\?\.status \|\| 'Design & Pre-Launch'\}/g, "'Public Hearings & Public Consultation'");


fs.writeFileSync(file, c);
console.log("Replaced top stats!");
