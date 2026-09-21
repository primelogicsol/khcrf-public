const fs = require('fs');
let c = fs.readFileSync('backend/prisma/schema.prisma', 'utf8');

// 1. Remove preview features
c = c.replace(/, "partialIndexes"/g, '');

// 2. Fix the 2 partial indexes to standard indexes for now so migration works
c = c.replace(/@@unique\(\[paymentMethod, instrumentNumber\], map: "offline_payment_submissions_active_instrument_unique".*?\)\)\)"\)/g, 
  '@@unique([paymentMethod, instrumentNumber], map: "offline_payment_submissions_active_instrument_unique")');

c = c.replace(/@@unique\(\[cycleYear, milestoneCode\], map: "skc_override_active_unique".*?\)\)"\)/g,
  '@@unique([cycleYear, milestoneCode], map: "skc_override_active_unique")');

// 3. Add url to datasource db
c = c.replace(/datasource db\s*\{\s*provider\s*=\s*"postgresql"\s*\}/g, 'datasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}');

// 4. Update FellowshipApplication model
let start = -1;
let end = -1;
let lines = c.split('\n');
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
