const fs = require('fs');

const targetFile = 'frontend/src/app/(main)/state-of-kashmir-crafts/current-assessment-2026/CurrentAssessmentClient.tsx';
let content = fs.readFileSync(targetFile, 'utf8');

content = content.replace(/  const renderEventGroup = \([\s\S]*?    \};\n/m, '');

const newComputed = `
    const sortedHearings = [...formalHearings].sort((a, b) => new Date(a.date || a.startAt).getTime() - new Date(b.date || b.startAt).getTime());
    const nextHearing = sortedHearings.find(h => {
      const hDate = new Date(h.date || h.startAt);
      const hDay = new Date(hDate.toISOString().split('T')[0] + 'T00:00:00Z');
      return hDay >= today;
    });

    const groupedHearings = {};
    sortedHearings.forEach(e => {
      const d = e.scheduledDate || e.date || e.startAt;
      if (!d) return;
      const date = new Date(d);
      const month = date.toLocaleDateString('en-US', { month: 'long', timeZone: 'Asia/Kolkata' }).toUpperCase();
      if (!groupedHearings[month]) groupedHearings[month] = [];
      groupedHearings[month].push(e);
    });

    const completedHearingsCount = sortedHearings.filter(h => getEventStatus(h.date || h.startAt) === 'Completed').length;
    const upcomingHearingsCount = sortedHearings.filter(h => getEventStatus(h.date || h.startAt) !== 'Completed').length;
`;

content = content.replace(/  return \(\n/m, newComputed + '\n  return (\n');

const newSection = `      {/* 6. Programme Calendar Dashboard */}
      {hearings.length > 0 && (
        <section className="py-20 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 max-w-5xl">
            {/* Header / Current Position */}
            <div className="mb-12">
              <span className="text-xs font-bold tracking-widest uppercase text-brand-primary mb-2 block">State of Kashmir Crafts 2026</span>
              <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-4">Upcoming Hearings, Consultations & Programme Events</h2>
              <p className="text-gray-600 text-lg leading-relaxed max-w-3xl">
                Follow scheduled public hearings, thematic consultations, stakeholder engagements and key milestones of the State of Kashmir Crafts 2026 assessment.
              </p>
            </div>

            {/* Status Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">Current Phase</span>
                <span className="text-sm font-bold text-brand-dark">Public Hearings</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">Today</span>
                <span className="text-sm font-bold text-brand-dark">{formatter.format(now)}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">Next Hearing</span>
                <span className="text-sm font-bold text-brand-dark">
                  {nextHearing ? \`\${new Date(nextHearing.date || nextHearing.startAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' })} · \${nextHearing.title} · \${nextHearing.district}\` : 'None Scheduled'}
                </span>
              </div>
            </div>

            {/* Next Event Panel */}
            {nextHearing && (
              <div className="mb-16 border border-brand-primary/20 bg-brand-primary/5 rounded-2xl p-8 md:p-10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none"></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 relative">
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-4 md:mb-0">Next Public Hearing</span>
                  <span className="bg-brand-primary text-white text-sm font-bold px-4 py-2 rounded-lg shadow-sm">
                    {new Date(nextHearing.date || nextHearing.startAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }).toUpperCase()}
                  </span>
                </div>
                <h3 className="text-3xl font-black text-brand-dark mb-2 relative">{nextHearing.title}</h3>
                <div className="text-brand-primary font-bold mb-4 flex items-center gap-2 relative">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {nextHearing.district || nextHearing.venue}
                </div>
                <p className="text-gray-700 text-lg leading-relaxed max-w-3xl relative">
                  {nextHearing.description}
                </p>
              </div>
            )}

            {/* Programme Milestones */}
            {programmeMilestones.length > 0 && (
              <div className="mb-20">
                <h3 className="text-xl font-black text-brand-dark mb-8 border-b border-gray-200 pb-4">PROGRAMME MILESTONES</h3>
                <div className="flex flex-wrap items-center gap-2 md:gap-4">
                  {programmeMilestones.map((m, i) => {
                    const isCompleted = getEventStatus(m.date || m.startAt) === 'Completed';
                    return (
                      <React.Fragment key={m.id}>
                        <div className="flex items-center gap-2">
                          {isCompleted ? (
                            <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                              {new Date(m.date || m.startAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', timeZone: 'Asia/Kolkata' }).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        {i < programmeMilestones.length - 1 && (
                          <div className="w-4 h-px bg-gray-300 hidden md:block"></div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Public Consultations & Hearings */}
            <div className="mb-20">
              <h3 className="text-xl font-black text-brand-dark mb-4 border-b border-gray-200 pb-4">PUBLIC CONSULTATIONS & HEARINGS</h3>
              <p className="text-gray-600 mb-8 max-w-3xl leading-relaxed">Youth engagement followed by the official scheduled public-hearing programme across craft, livelihood, market, authenticity, technology and policy themes.</p>
              
              <div className="bg-gray-50 rounded-2xl p-6 md:p-10 border border-gray-200 shadow-sm relative">
                {/* Status Summary */}
                <div className="absolute top-6 right-6 hidden md:flex gap-2 text-[10px] uppercase tracking-wider font-bold">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-sm">Completed: {completedHearingsCount}</span>
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-sm">Upcoming: {upcomingHearingsCount}</span>
                </div>

                {/* Youth in Crafts */}
                {thematicConsultations.filter(h => h.slug === 'youth-in-crafts').map(h => {
                  const status = getEventStatus(h.date || h.startAt);
                  const isCompleted = status === 'Completed';
                  return (
                  <div key={h.id} className="mb-12 border-b border-gray-200 pb-12">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-6">General Public Consultation</div>
                    <div className="flex items-start gap-4 md:gap-8">
                      <div className="w-12 md:w-16 flex-shrink-0 text-center pt-1">
                        {isCompleted ? (
                          <svg className="w-5 h-5 text-green-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 mx-auto mb-1"></div>
                        )}
                        <span className="text-xs font-bold text-gray-900">{new Date(h.date || h.startAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', timeZone: 'Asia/Kolkata' }).toUpperCase()}</span>
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="text-lg font-bold text-gray-900">{h.title}</h4>
                          <span className="text-gray-500 text-sm">· {h.district}</span>
                        </div>
                        <p className="text-gray-600 text-sm max-w-2xl leading-relaxed">{h.description}</p>
                      </div>
                    </div>
                  </div>
                  );
                })}

                {/* Formal Hearings Timeline */}
                <div className="space-y-12">
                  {Object.keys(groupedHearings).map((month) => (
                    <div key={month}>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-6">{month}</div>
                      <div className="space-y-8 relative">
                        <div className="absolute left-6 md:left-8 top-2 bottom-2 w-px bg-gray-200 z-0 hidden md:block"></div>
                        {groupedHearings[month].map(h => {
                          const status = getEventStatus(h.date || h.startAt);
                          const isCompleted = status === 'Completed';
                          const isNext = h.id === nextHearing?.id;
                          return (
                            <div key={h.id} className={`flex items-start gap-4 md:gap-8 relative z-10 ${isNext ? 'bg-white p-4 -ml-4 rounded-xl border border-brand-primary/20 shadow-sm' : ''}`}>
                              <div className="w-12 md:w-16 flex-shrink-0 text-center pt-1 bg-gray-50">
                                {isCompleted ? (
                                  <svg className="w-5 h-5 text-green-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                ) : isNext ? (
                                  <div className="w-5 h-5 rounded-full border-4 border-brand-primary mx-auto mb-1 flex items-center justify-center bg-white"><div className="w-1.5 h-1.5 bg-brand-primary rounded-full"></div></div>
                                ) : (
                                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 mx-auto mb-1 bg-white"></div>
                                )}
                                <span className={`text-xs font-bold ${isNext ? 'text-brand-primary' : 'text-gray-900'}`}>{new Date(h.date || h.startAt).toLocaleDateString('en-GB', { day: '2-digit', timeZone: 'Asia/Kolkata' })}</span>
                              </div>
                              <div>
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <h4 className={`text-lg font-bold ${isNext ? 'text-brand-primary' : 'text-gray-900'}`}>{h.title}</h4>
                                  <span className="text-gray-500 text-sm">· {h.district}</span>
                                  {isNext && <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm ml-2 tracking-wider">NEXT</span>}
                                </div>
                                <p className="text-gray-600 text-sm max-w-2xl leading-relaxed">{h.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stage 07 Context */}
                <div className="mt-16 bg-white rounded-xl p-6 border border-gray-200">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-2">Stage 07 · Public Hearings</div>
                  <div className="text-sm font-bold text-gray-900 mb-2">5 Sep – 28 Nov 2026</div>
                  <p className="text-gray-600 text-sm leading-relaxed max-w-3xl">Scheduled headline hearings conclude 14 Nov. The remaining programme window supports post-hearing testimony, evidence submissions, record completion and hearing follow-up.</p>
                </div>
              </div>
            </div>

            {/* Assessment & Publication Workflow */}
            <div className="mb-20">
              <h3 className="text-xl font-black text-brand-dark mb-8 border-b border-gray-200 pb-4">ASSESSMENT & PUBLICATION WORKFLOW</h3>
              
              {/* Preparatory Analysis */}
              <div className="mb-12">
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Preparatory Analysis</div>
                <p className="text-gray-600 text-sm mb-6 max-w-3xl leading-relaxed">Internal evidence collation, technical review and recommendation development ahead of the formal findings and validation stages.</p>
                <div className="flex flex-col md:flex-row gap-2 md:gap-4 overflow-x-auto pb-4">
                  {workflowEvents.filter(h => h.eventType === 'INTERNAL_PANEL').map((h, i) => (
                    <React.Fragment key={h.id}>
                      <div className="flex-shrink-0 w-full md:w-48 bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col justify-between">
                        <div className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">{new Date(h.date || h.startAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', timeZone: 'Asia/Kolkata' })}</div>
                        <div className="text-sm font-bold text-gray-900 leading-tight">{h.title}</div>
                      </div>
                      {i < workflowEvents.filter(e => e.eventType === 'INTERNAL_PANEL').length - 1 && (
                        <div className="hidden md:flex items-center text-gray-300">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Formal 2027 Stages */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-6">Formal 2027 Assessment Stages</div>
                <div className="flex flex-col md:flex-row items-stretch border border-gray-200 rounded-2xl overflow-hidden bg-gray-50 shadow-sm">
                  {[
                    { stage: '08', title: 'Draft Findings', date: '18 Mar – 14 Apr' },
                    { stage: '09', title: 'Review', date: '15 Apr – 5 May' },
                    { stage: '10', title: 'Validation', date: '8–12 May' },
                    { stage: '11', title: 'Expert Review', date: '15–24 May' }
                  ].map((st) => (
                    <div key={st.stage} className="flex-1 p-4 md:p-5 border-b md:border-b-0 md:border-r border-gray-200 relative">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-1">Stage {st.stage}</div>
                      <div className="font-bold text-gray-900 mb-1 text-sm">{st.title}</div>
                      <div className="text-xs text-gray-600 font-medium">{st.date}</div>
                      <div className="hidden md:block absolute right-[-10px] top-1/2 transform -translate-y-1/2 text-gray-300 z-10 bg-gray-50">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                      </div>
                    </div>
                  ))}
                  <div className="flex-1 p-4 md:p-5 bg-brand-primary text-white relative">
                    <div className="text-[9px] font-bold uppercase tracking-wider text-brand-primary/50 mb-1">Stage 12</div>
                    <div className="font-bold mb-1 text-sm">Final Report</div>
                    <div className="text-xs text-white/90 font-bold">31 May 2027</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Supporting Activities */}
            {hearings.filter(h => h.status === 'TBD' || h.title.includes('Government Briefing') || h.title.includes('Final Editorial') || h.title.includes('Advisory Council Approval')).length > 0 && (
              <div className="mb-20">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Supporting Activities</h3>
                <div className="flex flex-wrap gap-2">
                  {hearings.filter(h => h.status === 'TBD' || h.title.includes('Government Briefing') || h.title.includes('Final Editorial') || h.title.includes('Advisory Council Approval')).map(h => (
                    <div key={h.id} className="text-[10px] font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full uppercase tracking-wider">
                      {h.title} (TBD)
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )`

content = content.replace(/      \{\/\* 6\. Programme Calendar \*\/\}\n[\s\S]*?      \{\/\* 7\. District Participation Dashboard \*\/\}/m, newSection + '\n\n      {/* 7. District Participation Dashboard */}');

fs.writeFileSync(targetFile, content, 'utf8');
console.log('UI Patched!');
