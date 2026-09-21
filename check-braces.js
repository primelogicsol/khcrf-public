const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(main)/master-artisans/issues/MagazineIssuesClient.tsx', 'utf8');

let open = 0;
let close = 0;
for(let i=0; i<content.length; i++) {
  if (content[i] === '{') open++;
  if (content[i] === '}') close++;
}
console.log('Open:', open, 'Close:', close);
