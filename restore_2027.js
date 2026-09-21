const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

const regex = /let fetched = activitiesRes\.data\.activities;(\r?\n)\s*const nowTime = new Date\('2026-09-19T00:00:00Z'\);/;
const replacement = `let fetched = activitiesRes.data.activities;
              
              fetched = fetched.map((a: any) => {
                if (a.title === 'Draft Report Validation') {
                  return { ...a, startAt: '2027-05-08T10:00:00Z', status: 'INTERNAL_REVIEW', format: { name: 'Internal Review' } };
                }
                if (a.title === 'Final Editorial Review') {
                  return { ...a, startAt: '2027-05-25T10:00:00Z', status: 'INTERNAL_REVIEW', format: { name: 'Internal Review' } };
                }
                if (a.title === 'Advisory Council Approval') {
                  return { ...a, startAt: '2027-05-29T10:00:00Z', status: 'Governance_Approval', format: { name: 'Governance / Approval' } };
                }
                if (a.title === 'Government Briefing') {
                  return { ...a, startAt: '2027-05-30T10:00:00Z', status: 'Governance_Briefing', format: { name: 'Governance Briefing' } };
                }
                if (a.title === 'State of Kashmir Crafts Report Released') {
                  return { ...a, startAt: '2027-05-31T10:00:00Z', status: 'FINAL_PUBLICATION', format: { name: 'FINAL PUBLICATION' } };
                }
                return a;
              });
              
              const nowTime = new Date('2026-09-19T00:00:00Z');`;

c = c.replace(regex, replacement);

fs.writeFileSync(file, c);
console.log("Restored 2027 overrides!");
