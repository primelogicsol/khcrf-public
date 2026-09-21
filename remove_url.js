const fs = require('fs');
let c = fs.readFileSync('backend/prisma/schema.prisma', 'utf8');
c = c.replace(/url\s*=\s*env\("DATABASE_URL"\)/, '');
fs.writeFileSync('backend/prisma/schema.prisma', c);
