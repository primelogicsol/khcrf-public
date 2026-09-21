const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const regex = /<Link\s+href="\/state-of-kashmir-crafts\/public-hearings\/submit-testimony"[\s\S]*?Written Testimonies \(Not yet published\)[\s\S]*?<\/Link>\s*<a\s+href="\/state-of-kashmir-crafts\/assessment-timeline"[\s\S]*?Download Schedule\s*<\/a>\s*<button\s+onClick=\{\(\) => setActiveTab\('calendar'\)\}[\s\S]*?Calendar View\s*<\/button>\s*<button\s+onClick=\{\(\) => setActiveTab\('map'\)\}[\s\S]*?District Map\s*<\/button>/m;

const replacement = `<a 
                  href="/state-of-kashmir-crafts/assessment-timeline"
                  className="px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold flex items-center gap-1.5 transition"
                >
                  <span>📥</span>
                  Download Schedule
                </a>`;

c = c.replace(regex, replacement);
fs.writeFileSync(file, c);
console.log("Removed the 3 buttons!");
