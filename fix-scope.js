const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(main)/master-artisans/issues/MagazineIssuesClient.tsx', 'utf8');

// The file currently has a stray itemVariants at line 42, followed by handleCardClick at line 48.
// We need to inject fetcher, getAccessState, and the component declaration right before handleCardClick.

const lines = content.split('\n');

// We will find `const handleCardClick = ` and replace everything before it with the correct top-level logic up to `const handleCardClick`

let handleIndex = lines.findIndex(line => line.includes('const handleCardClick'));

const topLevel = `
const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(\`API Error \${res.status}: \${text || res.statusText}\`);
  }
  const data = await res.json();
  const arr = Array.isArray(data) ? data : (data && Array.isArray(data.data) ? data.data : []);
  
  const validIssues = arr.filter((issue: RawIssue) => issue.status === 'PUBLISHED');

  return validIssues.map((item: RawIssue) => {
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

const getAccessState = (accessData: any) => {
  if (!accessData) return null;
  if (accessData.reason === 'ADMIN_AUTHORIZED') return 'ADMIN_AUTHORIZED';
  if (accessData.authorized) return 'APPROVED';
  if (accessData.reason === 'UNAUTHENTICATED') return 'UNAUTHENTICATED';
  if (accessData.reason === 'NO_MEMBERSHIP_RECORD') return 'REGISTERED_NO_APPLICATION';
  if (accessData.reason === 'MEMBERSHIP_APPROVAL_REQUIRED') return 'UNDER_REVIEW';
  if (accessData.reason === 'MEMBERSHIP_REJECTED') return 'REJECTED';
  if (accessData.reason === 'MEMBERSHIP_WITHDRAWN') return 'WITHDRAWN';
  if (accessData.reason === 'MEMBERSHIP_EXPIRED') return 'EXPIRED';
  if (accessData.reason === 'MEMBERSHIP_SUSPENDED') return 'SUSPENDED';
  if (accessData.reason === 'MEMBERSHIP_REVOKED') return 'REVOKED';
  if (accessData.reason === 'MEMBERSHIP_INACTIVE') return 'DENIED';
  return 'DENIED';
};

export default function MagazineIssuesClient({ initialIssues }: { initialIssues: IssueItem[] }) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIssueForAccess, setSelectedIssueForAccess] = useState<any>(null);
  const [isCheckingAccess, setIsCheckingAccess] = useState(false);
  const [modalAccessState, setModalAccessState] = useState<string | null>(null);

`;

// find `const itemVariants: Variants = {` at the top and replace from there
const cutStart = lines.findIndex(line => line.includes('const itemVariants: Variants = {'));

const before = lines.slice(0, cutStart).join('\n');
const after = lines.slice(handleIndex).join('\n');

fs.writeFileSync('frontend/src/app/(main)/master-artisans/issues/MagazineIssuesClient.tsx', before + '\n' + topLevel + after);
console.log('Restored component scope');
