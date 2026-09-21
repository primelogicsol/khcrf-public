const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const regex = /<div>\s*<span className="font-bold text-gray-400 uppercase text-\[9px\] block">Progress<\/span>[\s\S]*?<\/div>/m;

const replacement = `{(() => {
                                    const s = (selectedCalendarEvent.status || '').toUpperCase();
                                    const eventType = (selectedCalendarEvent.eventType || '').toUpperCase();
                                    const category = (selectedCalendarEvent.category || '').toUpperCase();
                                    const isMilestone = eventType === 'PROGRAMME_MILESTONE' || category === 'PROGRAMME_MILESTONE';
                                    
                                    let displayProgress = selectedCalendarEvent.progress || 0;
                                    
                                    if (s === 'COMPLETED' || s === 'CLOSED') {
                                      displayProgress = 100;
                                    } else if (s === 'UPCOMING' || s === 'SCHEDULED' || s === 'PLANNING') {
                                      displayProgress = 0;
                                    } else if (s === 'CANCELLED' || s === 'POSTPONED') {
                                      displayProgress = null;
                                    }
                                    
                                    if (isMilestone && (s === 'COMPLETED' || s === 'CLOSED')) {
                                      displayProgress = null;
                                    }
                                    
                                    if (displayProgress === null) return null;
                                    
                                    return (
                                      <div>
                                        <span className="font-bold text-gray-400 uppercase text-[9px] block">Progress</span>
                                        <span className="font-bold text-gray-700 flex items-center gap-1.5">
                                          <span className="inline-block w-12 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <span className="block h-full bg-brand-primary" style={{ width: \`\${displayProgress}%\` }}></span>
                                          </span>
                                          <span>{displayProgress}%</span>
                                        </span>
                                      </div>
                                    );
                                  })()}`;

c = c.replace(regex, replacement);
fs.writeFileSync(file, c);
console.log("Fixed progress bar logic!");
