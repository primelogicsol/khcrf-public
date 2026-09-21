const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

const t = "setActivities(activitiesRes.data.activities);";

const replacement = `
            let fetched = activitiesRes.data.activities;
            // Map the internal milestones
            fetched = fetched.map((a: any) => {
              if (a.title === 'Draft Report Validation') {
                return { ...a, startAt: '2027-05-08T10:00:00Z', status: 'INTERNAL_REVIEW', format: { name: 'Internal Review' } };
              }
              if (a.title === 'Final Editorial Review') {
                return { ...a, startAt: '2027-05-25T10:00:00Z', status: 'INTERNAL_REVIEW', format: { name: 'Internal Review' } };
              }
              if (a.title === 'Advisory Council Approval') {
                return { ...a, startAt: '2027-05-29T10:00:00Z', status: 'INTERNAL_REVIEW', format: { name: 'Governance / Approval' } };
              }
              if (a.title === 'Government Briefing') {
                return { ...a, startAt: '2027-05-30T10:00:00Z', status: 'INTERNAL_REVIEW', format: { name: 'Governance Briefing' } };
              }
              if (a.title === 'State of Kashmir Crafts Report Released') {
                return { ...a, startAt: '2027-05-31T10:00:00Z', status: 'COMPLETED', format: { name: 'FINAL PUBLICATION' } };
              }
              return a;
            });
            // Also we must exclude Youth in Crafts from the top hearings stats if it's "Sep 1", 
            // but the user wants to group them visually in the feed:
            
            // Wait, I will just sort them chronologically!
            fetched.sort((a: any, b: any) => {
              const da = a.startAt ? new Date(a.startAt).getTime() : Infinity;
              const db = b.startAt ? new Date(b.startAt).getTime() : Infinity;
              return da - db;
            });
            
            setActivities(fetched);
`;

c = c.replace(t, replacement);
fs.writeFileSync(file, c);
console.log("Updated setActivities!");
