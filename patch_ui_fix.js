const fs = require('fs');

let f = fs.readFileSync('frontend/src/app/dashboard/business/evaluations/[id]/page.tsx', 'utf8');

f = f.replace(/api\.post\(`\/integration\/khcrf\/transmit\/\$\{id\}`\);/, "api.post(`/evaluation/${id}/transmit-craftlore`);");

fs.writeFileSync('frontend/src/app/dashboard/business/evaluations/[id]/page.tsx', f);
