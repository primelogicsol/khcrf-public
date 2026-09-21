const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(main)/master-artisans/issues/MagazineIssuesClient.tsx', 'utf8');

if (!content.includes('import api from')) {
  content = content.replace(
    'import Link from',
    'import api from "@/lib/api";\nimport Link from'
  );
}

// Remove authFetcher
content = content.replace(
/const authFetcher = async \([\s\S]*?\n  \};\n/m,
''
);

// Update handleCardClick
content = content.replace(
  /const accessData = await authFetcher\([^]+\$\{API_BASE_URL\}\/api\/backend\/magazine-issues\/\$\{issue\.slug\}\/access\);/,
  'const { data: accessData } = await api.get(/magazine-issues//access);'
);

fs.writeFileSync('frontend/src/app/(main)/master-artisans/issues/MagazineIssuesClient.tsx', content);
console.log('Updated MagazineIssuesClient.tsx');
