const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/const \[selectedParticipation, setSelectedParticipation\] = useState\('ALL'\);\s*/, "");
c = c.replace(/selectedParticipation, /g, "");
c = c.replace(/ \|\| selectedParticipation !== 'ALL'/g, "");
c = c.replace(/setSelectedParticipation\('ALL'\);\s*/g, "");

// Remove Participation state block in the filters using exact string fallback safely
const blockStart = "if (selectedParticipation !== 'ALL') {";
const startIdx = c.indexOf(blockStart);
if (startIdx !== -1) {
  // Find the end of the block which is 'return true;\n      });\n    }'
  const blockEnd = "return true;\n      });\n    }";
  const endIdx = c.indexOf(blockEnd, startIdx);
  if (endIdx !== -1) {
    c = c.slice(0, startIdx) + c.slice(endIdx + blockEnd.length);
  } else {
    console.log("Could not find end of participation state block!");
  }
}

// Remove Participation dropdown
const dropdownStart = "{/* Participation Type */}";
const dStartIdx = c.indexOf(dropdownStart);
if (dStartIdx !== -1) {
  const dropdownEnd = "</select>";
  const dEndIdx = c.indexOf(dropdownEnd, dStartIdx);
  if (dEndIdx !== -1) {
    c = c.slice(0, dStartIdx) + c.slice(dEndIdx + dropdownEnd.length);
  }
}

// Remove Participation active chip safely!
const chipStartStr = "{selectedParticipation !== 'ALL' && (";
const chipStartIdx = c.indexOf(chipStartStr);
if (chipStartIdx !== -1) {
  const chipEndStr = ")}";
  const chipEndIdx = c.indexOf(chipEndStr, chipStartIdx);
  if (chipEndIdx !== -1) {
    c = c.slice(0, chipStartIdx) + c.slice(chipEndIdx + chipEndStr.length);
  }
}

fs.writeFileSync(file, c);
console.log("Safely removed participation filters the right way!");
