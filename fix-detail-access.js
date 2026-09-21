const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(main)/master-artisans/issues/[slug]/MagazineIssueDetailClient.tsx', 'utf8');

// replace the useSWR for access
content = content.replace(
  /const \{ data: accessData \} = useSWR\(\`\/api\/backend\/magazine-issues\/\$\{slug\}\/access\`\, fetcher\);/,
  'const { data: accessData, error: accessError } = useSWR(`/api/backend/magazine-issues/${slug}/access`, fetcher);'
);

// fix getAccessState
content = content.replace(
  /const getAccessState = \(\) => \{[\s\S]*?if \(\!accessData\) return null;/m,
  `const getAccessState = () => {
    if (accessError) {
      if (accessError.reason) return accessError.reason;
      if (accessError.status === 401 || accessError.error === 'UNAUTHENTICATED') return 'UNAUTHENTICATED';
      return 'UNAUTHENTICATED';
    }
    if (!accessData) return null;`
);

fs.writeFileSync('frontend/src/app/(main)/master-artisans/issues/[slug]/MagazineIssueDetailClient.tsx', content);
console.log('Fixed access state handling');
