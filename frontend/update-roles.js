import fs from 'fs';

let content = fs.readFileSync('src/config/dashboard.ts', 'utf8');

content = content.replace(/EDITOR_REVIEWER/g, 'MAGAZINE_EDITOR');
content = content.replace(/MODERATOR_MEMBERSHIP/g, 'MEMBERSHIP_MODERATOR');
content = content.replace(/MODERATOR_DONATION/g, 'DONATIONS_MODERATOR');
// Add EVIDENCE_REVIEWER to SKC modules
// Add missing roles to ROLES object

fs.writeFileSync('src/config/dashboard.ts', content);
console.log('Done replacing roles in dashboard.ts');
