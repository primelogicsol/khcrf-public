const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

const t = "                  {activities.map((feed: any, idx: number) => {";

const rep = `                  {(() => {
                    const now = new Date('2026-09-19T00:00:00Z');
                    
                    const completed = activities.filter(a => a.status === 'COMPLETED' || (a.startAt && new Date(a.startAt) < now && a.startAt.includes('2026')));
                    
                    const future2026 = activities.filter(a => a.startAt && new Date(a.startAt) >= now && a.startAt.includes('2026') && a.status !== 'COMPLETED');
                    // Future of carpets is Sep 20, we can sort future2026
                    future2026.sort((a,b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
                    
                    const currentNext = future2026.slice(0, 1);
                    const upcoming = future2026.slice(1);
                    
                    const later = activities.filter(a => a.startAt && a.startAt.includes('2027'));
                    later.sort((a,b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
                    
                    completed.sort((a,b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime());
                    
                    const displayFeed = [
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
`;

c = c.replace(t, rep + "/* END INJECT */\n                    // original code starts here\n");
c = c.replace(/                     return \(/g, "                     return (");
// Wait, I need to close the `(() => {` block at the end of the `activities.map` call.
const endT = "                  })}";
const endRep = "                  });\n                  })()}";
c = c.replace(endT, endRep);

fs.writeFileSync(file, c);
console.log("Injected grouping logic!");
