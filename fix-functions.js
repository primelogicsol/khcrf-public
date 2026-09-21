const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(main)/master-artisans/issues/MagazineIssuesClient.tsx', 'utf8');

// Find getAccessState
const getAccessStateStart = content.indexOf('const getAccessState = (accessData: any) => {');

// Find closeModal
const closeModalStart = content.indexOf('const closeModal = () => {');

const before = content.substring(0, getAccessStateStart);
const after = content.substring(closeModalStart);

const newLogic = `const getAccessState = (accessData: any) => {
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
      router.push(\`/master-artisans/issues/\${issue.slug}\`);
      return;
    }
    setIsCheckingAccess(true);
    setSelectedIssueForAccess(issue);
    try {
      const { data: accessData } = await api.get(\`/magazine-issues/\${issue.slug}/access\`);
      const state = getAccessState(accessData);
      if (state === 'APPROVED' || state === 'ADMIN_AUTHORIZED') {
        router.push(\`/master-artisans/issues/\${issue.slug}\`);
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

  `;

fs.writeFileSync('frontend/src/app/(main)/master-artisans/issues/MagazineIssuesClient.tsx', before + newLogic + after);
console.log('Fixed MagazineIssuesClient.tsx');
