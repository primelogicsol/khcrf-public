const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const regex = /\{renderActions\(hearing, primaryRoute\)\}/;

const replacement = `{(() => {
                                const isExpanded = expandedCardId === hearing.id;
                                const isCompleted = hearing.status === 'COMPLETED' || hearing.status === 'CLOSED';
                                const regOpen = hearing.registrationStatus === 'OPEN';
                                const testimonyOpen = hearing.status !== 'CANCELLED' && hearing.status !== 'POSTPONED';
                                
                                return (
                                  <div className="w-full flex flex-col gap-2 mt-2">
                                    <div className="flex gap-2 w-full">
                                      <Link href={\`/state-of-kashmir-crafts/public-hearings/\${hearing.slug || hearing.id}\`} className="flex-1 py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-50 transition text-xs font-bold text-center">
                                        View Details
                                      </Link>
                                      <button 
                                        onClick={() => setExpandedCardId(isExpanded ? null : hearing.id)}
                                        className={\`flex-1 py-2 text-white text-xs font-bold rounded-xl transition text-center flex items-center justify-center gap-1 \${isCompleted ? 'bg-gray-600 hover:bg-gray-700' : 'bg-brand-primary hover:bg-brand-secondary'}\`}
                                      >
                                        {isCompleted ? 'Archival' : 'Participate'} <FaChevronDown className={\`transition-transform \${isExpanded ? 'rotate-180' : ''}\`} />
                                      </button>
                                    </div>
                                    
                                    {isExpanded && (
                                      <div className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 flex flex-col gap-3 text-xs text-left animate-fadeIn mt-1">
                                        {isCompleted ? (
                                          <>
                                            <Link href={\`/state-of-kashmir-crafts/public-hearings/\${hearing.slug || hearing.id}#record\`} className="flex items-center gap-2 hover:text-brand-primary font-semibold text-gray-700">✓ View Record</Link>
                                            <Link href={\`/state-of-kashmir-crafts/public-hearings/\${hearing.slug || hearing.id}#testimony\`} className="flex items-center gap-2 hover:text-brand-primary font-semibold text-gray-700">✓ View Published Testimony</Link>
                                            <Link href={\`/state-of-kashmir-crafts/public-hearings/\${hearing.slug || hearing.id}#summary\`} className="flex items-center gap-2 hover:text-brand-primary font-semibold text-gray-700">✓ View Findings / Summary</Link>
                                          </>
                                        ) : (
                                          <>
                                            <div className="flex flex-col gap-0.5">
                                              <Link href="/state-of-kashmir-crafts/participate" className={\`flex items-center gap-2 font-semibold \${regOpen ? 'text-gray-700 hover:text-brand-primary' : 'text-gray-400 cursor-not-allowed pointer-events-none'}\`}>
                                                <span className={\`\${regOpen ? 'text-emerald-600' : 'text-gray-400'}\`}>✓</span> Attend / Register
                                              </Link>
                                              {!regOpen && <span className="text-[10px] text-red-500 font-bold ml-5">Registration Closed</span>}
                                            </div>
                                            
                                            <div className="flex flex-col gap-0.5">
                                              <Link href="/state-of-kashmir-crafts/public-hearings/submit-testimony" className={\`flex items-center gap-2 font-semibold \${testimonyOpen ? 'text-gray-700 hover:text-brand-primary' : 'text-gray-400 cursor-not-allowed pointer-events-none'}\`}>
                                                <span className={\`\${testimonyOpen ? 'text-emerald-600' : 'text-gray-400'}\`}>✓</span> Submit Written Testimony
                                              </Link>
                                              {!testimonyOpen && <span className="text-[10px] text-red-500 font-bold ml-5">Submissions Closed</span>}
                                            </div>

                                            <div className="flex flex-col gap-0.5">
                                              <Link href="/state-of-kashmir-crafts/evidence-repository" className="flex items-center gap-2 hover:text-brand-primary font-semibold text-gray-700">
                                                <span className="text-emerald-600">✓</span> Submit Evidence
                                              </Link>
                                            </div>
                                            
                                            {hearing.speakers && hearing.speakers.length > 0 && (
                                              <Link href={\`/state-of-kashmir-crafts/public-hearings/\${hearing.slug || hearing.id}#speaker\`} className="flex items-center gap-2 hover:text-brand-primary font-semibold text-gray-700">
                                                <span className="text-gray-400">○</span> Panel Speaker
                                              </Link>
                                            )}

                                            {(hearing.format?.name === 'Hybrid' || hearing.format?.name === 'Virtual' || (hearing.venue && hearing.venue.toLowerCase().includes('online'))) && (
                                              <Link href={\`/state-of-kashmir-crafts/public-hearings/\${hearing.slug || hearing.id}#observer\`} className="flex items-center gap-2 hover:text-brand-primary font-semibold text-gray-700">
                                                <span className="text-gray-400">○</span> Observer
                                              </Link>
                                            )}

                                            {hearing.stakeholderCategories?.some((c: string) => ['Government Official', 'Exporter / Trader', 'Financial Institution'].includes(c)) && (
                                              <Link href={\`/state-of-kashmir-crafts/public-hearings/\${hearing.slug || hearing.id}#institutional\`} className="flex items-center gap-2 hover:text-brand-primary font-semibold text-gray-700">
                                                <span className="text-gray-400">○</span> Institutional Submission
                                              </Link>
                                            )}
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}`;

c = c.replace(regex, replacement);
fs.writeFileSync(file, c);
console.log("Replaced renderActions with new expandable participate panel!");
