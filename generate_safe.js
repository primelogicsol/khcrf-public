const fs = require('fs');
let c = fs.readFileSync('backend/prisma/schema.prisma', 'utf8');

c = c.replace(/, "partialIndexes"/g, '');
c = c.replace(/url\s*=\s*env\(\"DATABASE_URL\"\)/, '');

c = c.replace(/@@unique\(\[paymentMethod, instrumentNumber\], map: "offline_payment_submissions_active_instrument_unique", where: raw\([^)]*\)\)\)"\)/g, 
  '@@unique([paymentMethod, instrumentNumber], map: "offline_payment_submissions_active_instrument_unique")');

c = c.replace(/@@unique\(\[cycleYear, milestoneCode\], map: "skc_override_active_unique", where: raw\([^)]*\)\)\)"\)/g,
  '@@unique([cycleYear, milestoneCode], map: "skc_override_active_unique")');

// Handle where: raw more robustly
c = c.replace(/, where: raw\([^]*?\)\)\)\)/g, '');
c = c.replace(/, where: raw\([^]*?\)\)\)/g, '');
c = c.replace(/, where: raw\([^]*?\)\)/g, '');

let lines = c.split('\n');
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
  lines.splice(endIdx, 0,
    '  cohortId        String   @default("2026")',
    '  normalizedEmail String?',
    '',
    '  @@unique([cohortId, normalizedEmail, position])'
  );
}

fs.writeFileSync('backend/prisma/schema.prisma', lines.join('\n'));
