const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

for (let i=0; i<lines.length; i++) {
  if (lines[i].includes('className="hover:text-red-500 font-bold">&times;</button>')) {
    if (lines[i+1].includes('</span>') && lines[i+2].includes(')}')) {
      console.log("Found dangling block at line " + i);
      // It's not part of an actual active filter chip?
      // Wait, let me check if the PREVIOUS line is `)}`
      if (lines[i-1].includes(')}')) {
        console.log("Yup, it's the dangling one! Deleting...");
        lines.splice(i, 3);
        break;
      }
    }
  }
}

fs.writeFileSync(file, lines.join('\n'));
console.log("Done");
