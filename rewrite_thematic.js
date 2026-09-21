const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

const startTag = '{thematicClusters.map((cluster) => {';
const endTag = '                                 })}';
const tStart = c.indexOf(startTag);
const tEnd = c.indexOf(endTag, tStart) + endTag.length;

const replacement = `{thematicClusters.map((cluster) => {
                       const linkedActivities = cluster.themes.map((t: any) => {
                         const match = activities.find((a: any) => a.title.toLowerCase().trim() === t.name.toLowerCase().trim() || a.title.includes(t.name) || t.name.includes(a.title));
                         return match ? { ...t, ...match } : t;
                       });
                       
                       const totalThemes = linkedActivities.length;
                       const completedCount = linkedActivities.filter((a: any) => a.status === 'COMPLETED' || a.status === 'CLOSED').length;
                       const upcomingCount = linkedActivities.filter((a: any) => a.status !== 'COMPLETED' && a.status !== 'CLOSED').length;
                       const regOpenCount = linkedActivities.filter((a: any) => a.registrationStatus === 'OPEN').length;
                       
                       let statsParts = [\`\${totalThemes} Themes\`];
                       if (completedCount > 0) statsParts.push(\`\${completedCount} Completed\`);
                       if (upcomingCount > 0) statsParts.push(\`\${upcomingCount} Upcoming\`);
                       if (regOpenCount > 0) statsParts.push(\`Registration Open\`);
                       
                       const statusSummary = statsParts.join(' • ');
                       
                       const now = new Date('2026-09-19T00:00:00Z');
                       const futureActivities = linkedActivities.filter((a: any) => {
                          const actDate = a.startAt ? new Date(a.startAt) : new Date(a.milestoneDate);
                          return actDate >= now && a.status !== 'COMPLETED';
                       }).sort((a: any, b: any) => {
                          const dA = a.startAt ? new Date(a.startAt) : new Date(a.milestoneDate);
                          const dB = b.startAt ? new Date(b.startAt) : new Date(b.milestoneDate);
                          return dA.getTime() - dB.getTime();
                       });
                       
                       let nextEventText = '';
                       if (futureActivities.length > 0) {
                          const nextAct = futureActivities[0];
                          const nextDate = nextAct.startAt ? new Date(nextAct.startAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : nextAct.milestoneDate;
                          const nextLoc = nextAct.district || nextAct.milestoneLocation || 'Srinagar';
                          nextEventText = \`Next Event: \${nextDate} — \${nextLoc}\`;
                       }
                       
                       const groupKey = cluster.group.toLowerCase().replace(/[^a-z0-9]/g, '-');
                       
                       return (
                          <div key={cluster.group} className="bg-[#F7F4EF] border border-[#E4D8CA] rounded-2xl p-5 shadow-[0_12px_40px_rgba(0,0,0,0.06)] flex flex-col justify-between">
                             <button
                                id={\`\${groupKey}-header\`}
                                aria-expanded={expandedGroups[cluster.group] ? "true" : "false"}
                                aria-controls={\`\${groupKey}-panel\`}
                                onClick={() => toggleGroup(cluster.group)}
                                className="w-full text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/50 rounded-xl p-2 -m-2 transition cursor-pointer"
                             >
                                <div className="flex-1">
                                   <div className="flex items-center gap-2 mb-1">
                                      <span data-editorial-accent-bg className="w-1.5 h-1.5 rounded-full"></span>
                                      <h4 className="font-black text-sm uppercase tracking-wider text-[#4A2D1B] inline-block">{cluster.group}</h4>
                                   </div>
                                   {cluster.summary && (
                                      <p className="text-[10px] text-[#6B5A4E] font-medium leading-relaxed">{cluster.summary}</p>
                                   )}
                                   <div className="text-[9px] text-[#8E7868] font-bold mt-1.5 flex flex-wrap items-center gap-1.5">
                                      <span>{statusSummary}</span>
                                      {nextEventText && (
                                         <>
                                            <span className="text-[#8E7868]">•</span>
                                            <span className="text-brand-primary">{nextEventText}</span>
                                         </>
                                      )}
                                   </div>
                                </div>
                                <div className="flex items-center gap-2 self-stretch md:self-auto justify-end mt-2 md:mt-0">
                                   <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B5A4E]">
                                      {expandedGroups[cluster.group] ? "Collapse" : "Expand"}
                                   </span>
                                   <FaChevronDown className={\`text-[#8E7868] transition-transform \${expandedGroups[cluster.group] ? "rotate-180" : ""}\`} />
                                </div>
                             </button>
                             <div 
                                id={\`\${groupKey}-panel\`}
                                role="region"
                                aria-labelledby={\`\${groupKey}-header\`}
                                className={\`overflow-hidden transition-all duration-300 ease-in-out \${
                                   expandedGroups[cluster.group] ? "max-h-[3000px] mt-5 opacity-100" : "max-h-0 opacity-0"
                                }\`}
                             >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                   {linkedActivities.map((act: any) => {
                                      const statusUpper = act.status?.toUpperCase() || 'UPCOMING';
                                      let statusBadge = 'bg-stone-100 text-stone-600 border-stone-200';
                                      let statusLabel = statusUpper;
                                      if (statusUpper === 'COMPLETED') {
                                        statusBadge = 'bg-gray-100 text-gray-700 border-gray-200';
                                      } else if (statusUpper === 'REGISTRATION_OPEN') {
                                        statusBadge = 'bg-green-100 text-green-800 border-green-200';
                                      } else if (statusUpper === 'LIVE' || statusUpper === 'ONGOING') {
                                        statusBadge = 'bg-red-50 text-red-700 border-red-200 animate-pulse';
                                        statusLabel = 'LIVE NOW';
                                      } else if (statusUpper === 'UPCOMING' || statusUpper === 'SCHEDULED') {
                                        statusBadge = 'bg-blue-50 text-blue-700 border-blue-200';
                                        statusLabel = 'UPCOMING';
                                      }

                                      const displayDate = act.startAt ? new Date(act.startAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : act.milestoneDate;
                                      const displayTime = act.startAt ? new Date(act.startAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }) + ' – 3:00 PM IST' : '11:00 AM – 3:00 PM IST';
                                      const crafts = act.craftFocus && Array.isArray(act.craftFocus) ? act.craftFocus.map((c: string) => c === 'ALL_CRAFTS' ? 'Cross-Craft' : c).join(' · ') : (act.craft || 'Cross-Craft');
                                      const loc = act.district || act.milestoneLocation || 'Srinagar';
                                      const mode = act.venueName || act.venue || act.milestoneMode || 'Online Thematic Consultation';

                                      const isCompleted = statusUpper === 'COMPLETED';

                                      return (
                                         <div 
                                            key={act.name || act.title} 
                                            className="bg-white border border-gray-200 p-4 rounded-xl flex flex-col justify-between min-h-[220px] transition text-left shadow-sm"
                                         >
                                            <div className="flex flex-col gap-1.5">
                                               <span className="text-sm font-black text-gray-900 leading-tight line-clamp-1">{act.title || act.name}</span>
                                               <span className="text-[10px] text-gray-500 font-semibold leading-tight line-clamp-2">
                                                  {act.objective || act.summary || act.shortSummary}
                                               </span>
                                               <div className="text-[10px] font-bold text-brand-secondary mt-0.5 truncate">{crafts}</div>
                                               <div className="mt-1">
                                                  <span className={\`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 border rounded inline-block \${statusBadge}\`}>
                                                     {statusLabel.replace('_', ' ')}
                                                  </span>
                                               </div>
                                               
                                               <div className="flex flex-col gap-0.5 mt-2 text-[10px] text-gray-500 font-bold">
                                                  <div className="text-gray-700">{displayDate}</div>
                                                  <div>{displayTime}</div>
                                                  <div>{loc} · {mode}</div>
                                               </div>
                                            </div>

                                            <div className="mt-4 pt-3 flex flex-wrap gap-2 border-t border-gray-100">
                                               <Link 
                                                  href={\`/state-of-kashmir-crafts/public-hearings/\${act.slug || 'hearing'}\`} 
                                                  className="flex-1 text-center py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded text-[9px] font-black transition"
                                               >
                                                  View Details
                                               </Link>
                                               {!isCompleted && (
                                                  <Link 
                                                     href={\`/state-of-kashmir-crafts/participate?hearingId=\${act.id || ''}\`} 
                                                     className="flex-1 text-center py-1.5 bg-brand-primary text-white hover:bg-brand-secondary rounded text-[9px] font-black transition"
                                                  >
                                                     Participate ▾
                                                  </Link>
                                               )}
                                            </div>
                                         </div>
                                      );
                                   })}`;

c = c.substring(0, tStart) + replacement + c.substring(tEnd);

fs.writeFileSync(file, c);
console.log("Replaced thematic map!");
