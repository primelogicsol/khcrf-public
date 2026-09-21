const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(main)/about/memberships/page.tsx', 'utf8');

if (!content.includes('import api from "@/lib/api";')) {
  content = content.replace(
    'import {',
    'import api from "@/lib/api";\nimport { useEffect, useState } from "react";\nimport { useRouter } from "next/navigation";\nimport { useAuth } from "@/context/AuthContext";\nimport {'
  );
}

const checkLogic = `
  const { user } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (user) {
      api.get("/membership/my-membership").then(res => {
        if (res.data) {
          const searchParams = new URLSearchParams(window.location.search);
          const returnTo = searchParams.get("returnTo");
          if (returnTo) {
            router.replace("/about/memberships/join?returnTo=" + encodeURIComponent(returnTo));
          } else {
            router.replace("/about/memberships/join");
          }
        } else {
          setChecking(false);
        }
      }).catch(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, [user, router]);

  if (checking) {
    return (
      <main className="w-full bg-white min-h-screen text-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }
`;

content = content.replace(
  'export default function MembershipsPage() {',
  'export default function MembershipsPage() {\n' + checkLogic
);

fs.writeFileSync('frontend/src/app/(main)/about/memberships/page.tsx', content);
console.log('MembershipsPage.tsx updated.');
