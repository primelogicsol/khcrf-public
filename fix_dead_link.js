const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const regex = /<a\s+href="\/state-of-kashmir-crafts\/assessment-timeline"[\s\S]*?Download Schedule\s*<\/a>/m;

c = c.replace(regex, '');
fs.writeFileSync(file, c);
console.log("Removed the Download Schedule button as well to prevent dead links!");
