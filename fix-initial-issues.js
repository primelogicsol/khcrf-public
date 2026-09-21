const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(main)/master-artisans/issues/MagazineIssuesClient.tsx', 'utf8');

// We will extract the formatting logic into a standalone function outside the fetcher
const formatIssuesCode = `
export const formatIssues = (arr: any[]): IssueItem[] => {
  const validIssues = arr.filter((issue: any) => issue.status === 'PUBLISHED');

  return validIssues.map((item: any) => {
    let parsedYear = '';
    let parsedSeason = '';
    
    if (item.edition) {
      const parts = item.edition.split(' ');
      if (parts.length > 1) {
        parsedSeason = parts[0];
        parsedYear = parts[1];
      } else {
        parsedYear = parts[0];
      }
    } else if (item.publishedAt) {
      parsedYear = new Date(item.publishedAt).getFullYear().toString();
    }

    return {
      num: item.issueNumber || 0,
      title: item.title || 'Untitled Issue',
      slug: item.slug || '',
      img: item.coverImage || '/images/hero-bg.jpg',
      season: parsedSeason,
      year: parsedYear,
      desc: item.shortDescription || item.subtitle || '',
      status: item.status,
      featuredCraft: item.featuredCraft,
      isPublished: true,
      visibility: item.visibility
    };
  });
};
`;

// Replace fetcher body to use formatIssues
content = content.replace(
/const fetcher = async \(url: string\) => \{[\s\S]*?return validIssues\.map\(\(item: RawIssue\) => \{[\s\S]*?\n  \}\);\n\};/m,
`
${formatIssuesCode}

const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(\`API Error \${res.status}: \${text || res.statusText}\`);
  }
  const data = await res.json();
  const arr = Array.isArray(data) ? data : (data && Array.isArray(data.data) ? data.data : []);
  return formatIssues(arr);
};
`
);

// Now inside the component, apply formatIssues to initialIssues
content = content.replace(
  'export default function MagazineIssuesClient({ initialIssues }: { initialIssues: IssueItem[] }) {',
  'export default function MagazineIssuesClient({ initialIssues }: { initialIssues: any[] }) {'
);

// Find where useSWR is called and format initialIssues first
content = content.replace(
  `const { data: allIssues = initialIssues, isLoading, error } = useSWR('/api/backend/v1/magazine-issues', fetcher, { fallbackData: initialIssues });`,
  `
  const formattedInitialIssues = React.useMemo(() => formatIssues(initialIssues || []), [initialIssues]);
  const { data: allIssues = formattedInitialIssues, isLoading, error } = useSWR('/api/backend/v1/magazine-issues', fetcher, { fallbackData: formattedInitialIssues });
  `
);

fs.writeFileSync('frontend/src/app/(main)/master-artisans/issues/MagazineIssuesClient.tsx', content);
console.log('Fixed formatting of initial issues');
