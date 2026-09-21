const fs = require('fs');
let lines = fs.readFileSync('backend/prisma/schema.prisma', 'utf8').split('\n');

let start = -1;
let end = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('model FellowshipApplication {')) start = i;
  if (start !== -1 && lines[i].includes('}')) {
    end = i;
    break;
  }
}

if (start !== -1 && end !== -1) {
  lines.splice(end, 0, 
    '  cohortId        String   @default("2026")',
    '  normalizedEmail String?',
    '',
    '  @@unique([cohortId, normalizedEmail, position])'
  );
}

fs.writeFileSync('backend/prisma/schema.prisma', lines.join('\n'));
