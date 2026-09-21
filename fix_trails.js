const fs = require('fs');
let c = fs.readFileSync('backend/prisma/schema.prisma', 'utf8');
c = c.replace('@@unique([paymentMethod, instrumentNumber], map: "offline_payment_submissions_active_instrument_unique""))', '@@unique([paymentMethod, instrumentNumber], map: "offline_payment_submissions_active_instrument_unique")');
c = c.replace('@@unique([cycleYear, milestoneCode], map: "skc_override_active_unique""))', '@@unique([cycleYear, milestoneCode], map: "skc_override_active_unique")');
fs.writeFileSync('backend/prisma/schema.prisma', c);
