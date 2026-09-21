const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/membership/MembershipCTA.tsx', 'utf8');

content = content.replace(
  'import { useRef } from "react";',
  'import { useRef } from "react";\nimport { useSearchParams } from "next/navigation";'
);

content = content.replace(
  'const cardRef = useRef<HTMLDivElement>(null);',
  'const cardRef = useRef<HTMLDivElement>(null);\n    const searchParams = useSearchParams();\n    const returnTo = searchParams?.get("returnTo");\n    const joinHref = returnTo ? /about/memberships/join?returnTo=\ : /about/memberships/join;'
);

content = content.replace(
  /<Link href="\/about\/memberships\/join">/g,
  '<Link href={joinHref}>'
);

fs.writeFileSync('frontend/src/components/membership/MembershipCTA.tsx', content);
console.log('MembershipCTA.tsx updated.');
