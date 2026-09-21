const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/if \(a\.title === 'Draft Report Validation'\) \{[\s\S]*?if \(a\.title === 'State of Kashmir Crafts Report Released'\) \{[\s\S]*?return \{ \.\.\.a, startAt: '2027-05-31T10:00:00Z', status: 'COMPLETED', format: \{ name: 'FINAL PUBLICATION' \} \};\s*\}/, `if (a.title === 'Draft Report Validation') {
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
              }`);

fs.writeFileSync(file, c);
console.log("Updated status labels!");
