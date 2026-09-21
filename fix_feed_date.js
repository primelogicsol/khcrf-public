const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

const target = "const activityDate = feed.startAt";
const rep = `const rawDate = feed.startAt || feed.date;
                     const activityDate = (rawDate && !isNaN(new Date(rawDate).getTime()))
                       ? new Date(rawDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                       : 'Date Pending';
                     
                     // Hide CTA if it's an internal programme setup milestone or if explicitly disabled
                     const hideCTA = (!(feed.startAt && new Date(feed.startAt).getFullYear() === 2027)) && 
                                     !feed.title.includes('Launch') && 
                                     !feed.title.includes('Setup') && 
                                     !feed.title.includes('Approvals') && 
                                     !feed.title.includes('Finalization') && 
                                     !feed.title.includes('Briefing') && 
                                     !feed.title.includes('Readiness') && 
                                     !feed.title.includes('Campaign');`;

c = c.replace(target + " \n                         ? new Date(feed.startAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })\n                         : 'Date Pending';", rep);
fs.writeFileSync(file, c);
console.log("Updated date logic and CTA flag!");
