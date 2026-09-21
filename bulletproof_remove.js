const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/const \[selectedParticipation, setSelectedParticipation\] = useState\('ALL'\);\s*/, "");
c = c.replace(/selectedParticipation, /g, "");
c = c.replace(/ \|\| selectedParticipation !== 'ALL'/g, "");
c = c.replace(/setSelectedParticipation\('ALL'\);\s*/g, "");

// Use specific index logic for the Participation active chip
const chipStartStr = "{selectedParticipation !== 'ALL' && (";
const chipStartIdx = c.indexOf(chipStartStr);
if (chipStartIdx !== -1) {
  // We want to delete until the closing )} of THIS chip.
  // We know it ends with:
  // </button>
  // </span>
  // )}
  const chipEndStr = ")}";
  const chipEndIdx = c.indexOf(chipEndStr, chipStartIdx + chipStartStr.length);
  if (chipEndIdx !== -1) {
    c = c.slice(0, chipStartIdx) + c.slice(chipEndIdx + chipEndStr.length);
  }
}

// Same for the filter block
const filterStartStr = "if (selectedParticipation !== 'ALL') {";
const filterStartIdx = c.indexOf(filterStartStr);
if (filterStartIdx !== -1) {
  // It ends with:
  //   return true;
  // });
  // }
  const filterEndStr = "});\r\n    }";
  let filterEndIdx = c.indexOf(filterEndStr, filterStartIdx);
  if (filterEndIdx === -1) {
    filterEndIdx = c.indexOf("});\n    }", filterStartIdx);
  }
  if (filterEndIdx !== -1) {
    c = c.slice(0, filterStartIdx) + c.slice(filterEndIdx + filterEndStr.length);
  }
}

// Dropdown
const ddStartStr = "{/* Participation Type */}";
const ddStartIdx = c.indexOf(ddStartStr);
if (ddStartIdx !== -1) {
  const ddEndStr = "</select>";
  const ddEndIdx = c.indexOf(ddEndStr, ddStartIdx);
  if (ddEndIdx !== -1) {
    c = c.slice(0, ddStartIdx) + c.slice(ddEndIdx + ddEndStr.length);
  }
}

fs.writeFileSync(file, c);
console.log("Deleted strictly by exact bounding strings.");
