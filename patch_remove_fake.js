const fs = require('fs');

let r = fs.readFileSync('backend/src/routes/integrationRoutes.ts', 'utf8');
r = r.replace(/import \{ handleCraftloreWebhook, ingestKhcrfVerifiedResult \} from '\.\.\/controllers\/integrationController\.js';/, "import { handleCraftloreWebhook } from '../controllers/integrationController.js';");
r = r.replace(/\/\/ Phase 3 Ingest Endpoint[\s\S]*?router\.post\('\/khcrf\/verified-results', express\.json\(\), ingestKhcrfVerifiedResult\);/, '');
fs.writeFileSync('backend/src/routes/integrationRoutes.ts', r);

let c = fs.readFileSync('backend/src/controllers/integrationController.ts', 'utf8');
const regex = /export const ingestKhcrfVerifiedResult = async \([\s\S]*?res\.status\(500\)\.json\(\{ error: 'Internal ingestion error' \}\);\s*\}\s*};/
c = c.replace(regex, '');
fs.writeFileSync('backend/src/controllers/integrationController.ts', c);
