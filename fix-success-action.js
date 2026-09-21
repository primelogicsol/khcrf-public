const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(main)/about/memberships/join/MembershipFormClient.tsx', 'utf8');

// Replace the primaryAction prop in SubmissionSuccess
const searchString = `primaryAction={{ label: "Go to Dashboard", href: "/profile" }}`;
const replaceString = `primaryAction={{ 
            label: returnTo ? "View Membership Status" : "Go to Dashboard", 
            href: returnTo ? \`/dashboard/membership?returnTo=\${encodeURIComponent(returnTo)}\` : "/profile" 
          }}`;

content = content.replace(searchString, replaceString);

fs.writeFileSync('frontend/src/app/(main)/about/memberships/join/MembershipFormClient.tsx', content);
console.log('Fixed SubmissionSuccess primaryAction in MembershipFormClient.tsx');
