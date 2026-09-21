const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(main)/master-artisans/issues/[slug]/read/MagazineIssueReadClient.tsx', 'utf8');

// Strip ${API_BASE_URL} from SWR calls to ensure they hit Next.js proxy
content = content.replace(/\$\{API_BASE_URL\}\/api\/backend/g, '/api/backend');

fs.writeFileSync('frontend/src/app/(main)/master-artisans/issues/[slug]/read/MagazineIssueReadClient.tsx', content);
console.log('Fixed proxy paths in Read Client');
