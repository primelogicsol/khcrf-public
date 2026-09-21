const fs = require('fs');
const file = 'prisma/schema.prisma';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/datasource db \{\s*provider = "postgresql"\s*\}/, 'datasource db {\n  provider = "postgresql"\n  url = env("DATABASE_URL")\n}');
fs.writeFileSync(file, c);
