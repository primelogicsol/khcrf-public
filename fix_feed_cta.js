const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/const activityDate = feed\.startAt[\s\S]*?: 'Date Pending';/, `const rawDate = feed.startAt || feed.date;
                     const activityDate = (rawDate && !isNaN(new Date(rawDate).getTime()))
                       ? new Date(rawDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                       : 'Date Pending';
                       
                     const isProgrammeSetup = feed.title.includes('Launch') || 
                                              feed.title.includes('Setup') || 
                                              feed.title.includes('Approvals') || 
                                              feed.title.includes('Finalization') || 
                                              feed.title.includes('Briefing') || 
                                              feed.title.includes('Readiness') || 
                                              feed.title.includes('Campaign');
                                              
                     const showCTA = (!isProgrammeSetup) && (!(feed.startAt && new Date(feed.startAt).getFullYear() === 2027));
                     `);

c = c.replace(/\{\(!\(feed\.startAt && new Date\(feed\.startAt\)\.getFullYear\(\) === 2027\)\)\) && \(/g, '{showCTA && (');

fs.writeFileSync(file, c);
console.log("Fixed feed date parsing and CTA visibility!");
