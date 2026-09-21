const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].includes('className="hover:text-red-500 font-bold">&times;</button>')) {
    if (lines[i-1].includes(')}')) {
      console.log("Found it at line " + i);
      lines.splice(i, 3);
      break;
    }
  }
}

fs.writeFileSync(file, lines.join('\n'));
console.log("Deleted the exact line!");
