const fs = require('fs');
const p = 'backend/prisma/schema.prisma';
let lines = fs.readFileSync(p, 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('datasource db {')) {
    lines[i+1] = '  provider = "postgresql"';
    lines[i+2] = '  url = env("DATABASE_URL")';
  }
}

let startIdx = -1;
let endIdx = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('model FellowshipApplication {')) startIdx = i;
  if (startIdx !== -1 && lines[i].includes('}')) {
    endIdx = i;
    break;
  }
}

if (startIdx !== -1 && endIdx !== -1) {
  // Insert fields before closing brace
  lines.splice(endIdx, 0,
    '  cohortId        String   @default("2026")',
    '  normalizedEmail String?',
    '',
    '  @@unique([cohortId, normalizedEmail, position])'
  );
}

fs.writeFileSync(p, lines.join('\n'));
