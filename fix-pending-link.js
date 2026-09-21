const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(main)/about/memberships/join/MembershipFormClient.tsx', 'utf8');

const searchString = `              <Link href="/dashboard/membership" className="inline-flex items-center justify-center px-8 py-4 bg-brand-primary text-white rounded-xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all">
                View Application Status
              </Link>`;

const replaceString = `              <Link href={returnTo ? \`/dashboard/membership?returnTo=\${encodeURIComponent(returnTo)}\` : "/dashboard/membership"} className="inline-flex items-center justify-center px-8 py-4 bg-brand-primary text-white rounded-xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all">
                View Application Status
              </Link>`;

content = content.replace(searchString, replaceString);

fs.writeFileSync('frontend/src/app/(main)/about/memberships/join/MembershipFormClient.tsx', content);
console.log('Fixed View Application Status link in MembershipFormClient.tsx');
