const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(main)/about/memberships/join/MembershipFormClient.tsx', 'utf8');

content = content.replace(
  'const router = useRouter();',
  'const router = useRouter();\n  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;\n  const returnTo = searchParams?.get("returnTo");'
);

content = content.replace(
  /<Link href="\/master-artisans\/issues" className="px-8 py-4 bg-brand-primary text-white rounded-xl font-bold shadow-lg shadow-brand-primary\/20 hover:bg-brand-dark transition-all">\s*Read Magazine\s*<\/Link>/g,
  '{returnTo ? <Link href={returnTo} className="px-8 py-4 bg-brand-primary text-white rounded-xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all">Continue to Issue</Link> : <Link href="/master-artisans/issues" className="px-8 py-4 bg-brand-primary text-white rounded-xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all">Read Magazine</Link>}'
);

fs.writeFileSync('frontend/src/app/(main)/about/memberships/join/MembershipFormClient.tsx', content);
console.log('MembershipFormClient.tsx updated.');
