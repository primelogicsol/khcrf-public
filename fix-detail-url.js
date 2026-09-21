const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(main)/master-artisans/issues/[slug]/MagazineIssueDetailClient.tsx', 'utf8');

content = content.replace(
  /const \{ data: issue, error, isLoading \} = useSWR\(`\$\{API_BASE_URL\}\/api\/backend\/magazine-issues\/\$\{slug\}`\, fetcher\);/,
  'const { data: issue, error, isLoading } = useSWR(`/api/backend/magazine-issues/${slug}`, fetcher);'
);

content = content.replace(
  /const \{ data: accessData \} = useSWR\(`\$\{API_BASE_URL\}\/api\/backend\/magazine-issues\/\$\{slug\}\/access`\, fetcher\);/,
  'const { data: accessData } = useSWR(`/api/backend/magazine-issues/${slug}/access`, fetcher);'
);

fs.writeFileSync('frontend/src/app/(main)/master-artisans/issues/[slug]/MagazineIssueDetailClient.tsx', content);
console.log('Fixed URLs in Detail Client');
