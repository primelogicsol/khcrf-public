const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

const oldMap = `fetched = fetched.map((a: any) => {
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
              });`;

const newMap = `fetched = fetched.map((a: any) => {
                if (a.title === 'Draft Report Validation') {
                  return { ...a, startAt: '2027-05-08T10:00:00Z', _displayDate: 'May 8–12, 2027', status: 'INTERNAL_REVIEW', format: { name: 'Internal Review' } };
                }
                if (a.title === 'Final Editorial Review') {
                  return { ...a, startAt: '2027-05-25T10:00:00Z', _displayDate: 'DATE TO BE CONFIRMED', status: 'INTERNAL_REVIEW', format: { name: 'Internal Review' } };
                }
                if (a.title === 'Advisory Council Approval') {
                  return { ...a, startAt: '2027-05-29T10:00:00Z', _displayDate: 'DATE TO BE CONFIRMED', status: 'Governance_Approval', format: { name: 'Governance / Approval' } };
                }
                if (a.title === 'Government Briefing') {
                  return { ...a, startAt: '2027-05-30T10:00:00Z', _displayDate: 'DATE TO BE CONFIRMED', status: 'Governance_Briefing', format: { name: 'Governance Briefing' } };
                }
                if (a.title === 'State of Kashmir Crafts Report Released') {
                  return { ...a, startAt: '2027-05-31T10:00:00Z', _displayDate: 'May 31, 2027', status: 'FINAL_PUBLICATION', format: { name: 'FINAL PUBLICATION' } };
                }
                return a;
              });`;

c = c.replace(oldMap, newMap);

c = c.replace(/const activityDate = \(rawDate && !isNaN\(new Date\(rawDate\)\.getTime\(\)\)\)[\s\S]*?: 'Date Pending';/, `const activityDate = feed._displayDate || ((rawDate && !isNaN(new Date(rawDate).getTime()))
                         ? new Date(rawDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                         : 'DATE TO BE CONFIRMED');`);

fs.writeFileSync(file, c);
console.log("Fixed 2027 dates logic!");
