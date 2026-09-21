const fs = require('fs');

let content = fs.readFileSync('frontend/src/app/(main)/master-artisans/issues/MagazineIssuesClient.tsx', 'utf8');

content = content.replace(
  "import { motion, AnimatePresence, Variants } from 'framer-motion';",
  "import { motion, AnimatePresence, Variants } from 'framer-motion';\nimport { useRouter } from 'next/navigation';\nimport { IssueMembershipAccess } from '@/components/master-artisans/issues/MagazineIssueComponents';"
);

content = content.replace(
  "const fetcher = async (url: string) => {",
  "const authFetcher = async (url: string) => {\n  const res = await fetch(url, { credentials: 'include', cache: 'no-store' });\n  const json = await res.json().catch(() => ({}));\n  if (!res.ok) throw Object.assign(new Error(json?.data?.error ?? json?.error ?? 'HTTP ' + res.status), { status: res.status });\n  return json.data || json;\n};\n\nconst fetcher = async (url: string) => {"
);

const componentStart = "export default function MagazineIssuesClient({ initialIssues }: { initialIssues: any[] }) {";
const statesToAdd = 
  const router = useRouter();
  const [selectedIssueForAccess, setSelectedIssueForAccess] = useState<any>(null);
  const [isCheckingAccess, setIsCheckingAccess] = useState(false);
  const [modalAccessState, setModalAccessState] = useState<string | null>(null);

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

  const handleCardClick = async (e: React.MouseEvent, issue: any) => {
    e.preventDefault();
    if (issue.visibility === 'PUBLIC') {
      router.push('/master-artisans/issues/' + issue.slug);
      return;
    }
    setIsCheckingAccess(true);
    setSelectedIssueForAccess(issue);
    try {
      const accessData = await authFetcher('/api/backend/magazine-issues/' + issue.slug + '/access');
      const state = getAccessState(accessData);
      if (state === 'APPROVED' || state === 'ADMIN_AUTHORIZED') {
        router.push('/master-artisans/issues/' + issue.slug);
      } else {
        setModalAccessState(state);
      }
    } catch (err) {
      console.error('Access check failed:', err);
      setModalAccessState('UNAUTHENTICATED');
    } finally {
      setIsCheckingAccess(false);
    }
  };

  const closeModal = () => {
    setSelectedIssueForAccess(null);
    setModalAccessState(null);
  };
;
content = content.replace(componentStart, componentStart + statesToAdd);

content = content.replace(
  /<Link href=\{\\/master-artisans\/issues\/\$\{issue\.slug \|\| ''\}\\} className="block w-full h-full">/g,
  '<a href={/master-artisans/issues/} onClick={(e) => handleCardClick(e, issue)} className="block w-full h-full cursor-pointer">'
);
content = content.replace(
  /<\/Link>/g,
  "</a>"
);

const modalRender = 
      {/* Access Gate Modal */}
      <AnimatePresence>
        {selectedIssueForAccess && modalAccessState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#050505] rounded-xl shadow-2xl border border-[#B8860B]/20 overflow-x-hidden"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-[#B8860B]/20 text-white rounded-full transition-colors border border-white/10 hover:border-[#B8860B]/50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <IssueMembershipAccess issue={selectedIssueForAccess} accessState={modalAccessState} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
;
content = content.replace(/<\/main>\s*\);\s*}/, modalRender + '\n    </main>\n  );\n}');

fs.writeFileSync('frontend/src/app/(main)/master-artisans/issues/MagazineIssuesClient.tsx', content);
console.log('Successfully updated MagazineIssuesClient.tsx');
