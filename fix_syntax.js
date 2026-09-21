const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

const regex = /const displayFeed = \[[\s\S]*?\];\s*let actionLabel = 'View Details';/;
c = c.replace(regex, `const displayFeed = [
                        ...(currentNext.length > 0 ? [{ _isDivider: true, title: 'CURRENT / NEXT' }, ...currentNext] : []),
                        ...(upcoming.length > 0 ? [{ _isDivider: true, title: 'UPCOMING' }, ...upcoming] : []),
                        ...(completed.length > 0 ? [{ _isDivider: true, title: 'RECENTLY COMPLETED' }, ...completed] : []),
                        ...(later.length > 0 ? [{ _isDivider: true, title: 'LATER PROGRAMME ACTIVITIES' }, ...later] : [])
                      ];
                      
                      return displayFeed.map((feed: any, idx: number) => {
                        if (feed._isDivider) {
                          return (
                            <div key={'divider-'+feed.title} className="relative pt-6 pb-2 -ml-2">
                               <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 bg-white py-1 px-2 inline-block rounded border border-stone-200">{feed.title}</h3>
                            </div>
                          );
                        }
                        
                       let actionLabel = 'View Details';`);

fs.writeFileSync(file, c);
console.log("Restored displayFeed.map!");
