import os

path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts\participate\ParticipateClient.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

step_8_start = "{/* STEP 8: Contribution Summary */}"
step_9_start = "{/* STEP 9: Contribution Submitted / Dashboard */}"

s8_idx = content.find(step_8_start)
s9_idx = content.find(step_9_start)

if s8_idx == -1 or s9_idx == -1:
    print("Could not find step 8 or 9 markers")
    exit(1)

new_step_8 = '''{/* STEP 8: Contribution Summary */}
          {step === 8 && (() => {
            // --- INTELLIGENCE ENGINE LOGIC ---
            
            // 1. Generate Narrative Summary
            const prof = consultationData['profile'] || {};
            const chal = consultationData['challenges'] || {};
            const opp = consultationData['opportunities'] || {};
            
            let narrative = `This consultation represents a ${category ? category.toLowerCase() : 'stakeholder'} `;
            if (prof.district) narrative += `operating in ${prof.district} `;
            if (prof.yearsExperience) narrative += `with ${prof.yearsExperience} years of experience. `;
            else narrative += `. `;
            
            const chalValues = Object.values(chal).flat().filter(Boolean) as string[];
            const oppValues = Object.values(opp).flat().filter(Boolean) as string[];
            
            if (chalValues.length > 0) {
                narrative += `The participant reports friction primarily in ${chalValues.slice(0,2).join(' and ').toLowerCase()}, identifying them as major barriers to growth. `;
            }
            if (oppValues.length > 0) {
                narrative += `Conversely, ${oppValues.slice(0,2).join(' and ').toLowerCase()} are viewed as the strongest future opportunities. `;
            }
            if (uploadedFiles.length > 0) {
                narrative += `Supporting evidence has been submitted to substantiate these claims.`;
            } else {
                narrative += `No supplementary evidence was attached to this submission.`;
            }

            // 2. Infer Semantic Tags & Themes
            const allText = JSON.stringify(consultationData).toLowerCase();
            const tags = new Set<string>();
            const themes = new Set<string>();
            
            if (allText.includes('raw material') || allText.includes('supply')) { tags.add('Supply Chain'); themes.add('Economic Risk'); themes.add('Livelihood'); }
            if (allText.includes('market') || allText.includes('sell')) { tags.add('Market Access'); themes.add('Economic Risk'); }
            if (allText.includes('online') || allText.includes('digital')) { tags.add('Digital Commerce'); themes.add('Digital Adoption'); }
            if (allText.includes('export') || allText.includes('international')) { tags.add('Export Readiness'); themes.add('Export Potential'); }
            if (allText.includes('train') || allText.includes('skill')) { tags.add('Skill Development'); themes.add('Youth Employment'); }
            if (allText.includes('women') || allText.includes('female')) { tags.add('Women Entrepreneurship'); themes.add('Gender Inclusion'); }
            if (allText.includes('finance') || allText.includes('loan')) { tags.add('Financial Inclusion'); themes.add('Economic Vulnerability'); }
            
            if (tags.size === 0) { tags.add('MSME'); tags.add('Traditional Craft'); }
            if (themes.size === 0) { themes.add('Livelihood'); themes.add('Traditional Knowledge'); }

            const inferredTags = Array.from(tags);
            const inferredThemes = Array.from(themes);

            // 3. Compute Quality Scores
            const profKeys = Object.keys(consultationData['profile'] || {}).length;
            const recKeys = Object.keys(consultationData['recommendations'] || {}).length;
            const profComplete = Math.min(100, Math.round((profKeys / (currentSchema?.profile?.length || 1)) * 100));
            const recComplete = Math.min(100, Math.round((recKeys / (currentSchema?.recommendations?.length || 1)) * 100));
            const evidenceScore = uploadedFiles.length >= 2 ? 100 : uploadedFiles.length === 1 ? 80 : 0;
            const overallScore = Math.round((profComplete + 100 + recComplete + evidenceScore) / 4);

            const insights = {
                vulnerability: inferredThemes.includes('Economic Vulnerability') ? 'HIGH' : 'MEDIUM',
                digital: inferredThemes.includes('Digital Adoption') ? 'HIGH' : 'LOW',
                export: inferredThemes.includes('Export Potential') ? 'HIGH' : 'LOW',
                rawMaterial: inferredTags.includes('Supply Chain') ? 'LOW' : 'MEDIUM',
                policyPriority: recComplete > 50 ? 'HIGH' : 'MEDIUM'
            };

            const confidence = overallScore > 85 && uploadedFiles.length > 0 
                ? { level: 'High', reason: 'Participant answered all sections comprehensively and provided supporting evidence. Internal consistency is high.' }
                : overallScore > 60 
                ? { level: 'Medium', reason: 'Participant answered most sections but is missing evidence or detailed recommendations.' }
                : { level: 'Low', reason: 'Minimal data provided. Evidence lacking. Manual review required.' };

            // 4. Section Summaries
            const getSectionSummary = (sectionKey: string) => {
                const data = consultationData[sectionKey] || {};
                const keys = Object.keys(data).length;
                if (keys === 0) return "No data provided for this section.";
                
                if (sectionKey === 'profile') return `${category} from ${data.district || 'Kashmir'} with ${profComplete}% profile completion.`;
                if (sectionKey === 'situation') return `Participant reported baseline operational metrics.`;
                if (sectionKey === 'challenges') return `Identified critical friction points: ${Object.values(data).flat().filter(Boolean)[0] || 'Structural barriers'}.`;
                if (sectionKey === 'opportunities') return `Projected growth areas defined across future opportunity vectors.`;
                if (sectionKey === 'recommendations') return `Provided ${keys} direct policy and institutional action recommendations.`;
                return `${keys} data points recorded.`;
            };

            return (
            <div className="animate-fade-in py-4">
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-primary/20">
                  <FaChartLine className="text-4xl text-brand-primary" />
                </div>
                <h2 className="text-3xl font-black text-brand-dark mb-2">Consultation Intelligence</h2>
                <p className="text-gray-600 font-medium">Your submission has been automatically processed, scored, and semantically tagged for the Knowledge Graph.</p>
              </div>

              {/* AI GENERATED SUBMISSION SUMMARY */}
              <div className="bg-white border-l-4 border-brand-primary rounded-r-2xl p-6 mb-8 shadow-sm">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <FaRobot className="text-brand-primary" /> Auto-Generated Executive Summary
                </h3>
                <p className="text-sm text-gray-800 font-medium leading-relaxed">
                  {narrative}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* AI CONSULTATION INSIGHTS */}
                <div className="bg-brand-dark rounded-3xl p-8 relative shadow-lg overflow-hidden">
                  <div className="absolute -right-10 -bottom-10 opacity-10">
                    <FaProjectDiagram className="text-[150px] text-white" />
                  </div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2 relative z-10">
                    <FaBrain className="text-brand-secondary" /> AI Consultation Insights
                  </h3>
                  <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-xs text-gray-400 font-bold uppercase">Economic Vulnerability</span>
                      <span className={`text-xs font-black px-2 py-1 rounded ${insights.vulnerability==='HIGH'?'bg-red-500/20 text-red-400':'bg-yellow-500/20 text-yellow-400'}`}>{insights.vulnerability}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-xs text-gray-400 font-bold uppercase">Digital Readiness</span>
                      <span className={`text-xs font-black px-2 py-1 rounded ${insights.digital==='HIGH'?'bg-green-500/20 text-green-400':'bg-red-500/20 text-red-400'}`}>{insights.digital}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-xs text-gray-400 font-bold uppercase">Export Potential</span>
                      <span className={`text-xs font-black px-2 py-1 rounded ${insights.export==='HIGH'?'bg-green-500/20 text-green-400':'bg-red-500/20 text-red-400'}`}>{insights.export}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-xs text-gray-400 font-bold uppercase">Raw Material Stability</span>
                      <span className={`text-xs font-black px-2 py-1 rounded ${insights.rawMaterial==='LOW'?'bg-red-500/20 text-red-400':'bg-yellow-500/20 text-yellow-400'}`}>{insights.rawMaterial}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400 font-bold uppercase">Policy Priority</span>
                      <span className={`text-xs font-black px-2 py-1 rounded ${insights.policyPriority==='HIGH'?'bg-green-500/20 text-green-400':'bg-yellow-500/20 text-yellow-400'}`}>{insights.policyPriority}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 relative z-10">
                    <span className="text-[10px] text-gray-500 font-bold uppercase mb-2 block">AI Detected Themes</span>
                    <div className="flex flex-wrap gap-1.5">
                      {inferredThemes.map(t => <span key={t} className="text-[10px] font-bold px-2 py-1 bg-white/10 text-white rounded border border-white/20">{t}</span>)}
                      {inferredTags.map(t => <span key={t} className="text-[10px] font-bold px-2 py-1 bg-brand-primary/30 text-brand-secondary rounded border border-brand-primary/40">{t}</span>)}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                    {/* CONSULTATION QUALITY */}
                    <div className="bg-white border border-gray-200 shadow-sm rounded-3xl p-8">
                      <div className="flex justify-between items-start mb-6">
                        <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider flex items-center gap-2">
                          <FaRegCheckCircle className="text-green-500" /> Consultation Quality
                        </h3>
                        <div className="text-right">
                          <div className="text-3xl font-black text-brand-primary leading-none">{overallScore}%</div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase">Intelligence Score</div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-xs font-bold mb-1"><span className="text-gray-500">Profile Completeness</span><span className="text-gray-800">{profComplete}%</span></div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-brand-primary h-1.5 rounded-full transition-all" style={{width:`${profComplete}%`}}></div></div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs font-bold mb-1"><span className="text-gray-500">Assessment Detail</span><span className="text-gray-800">100%</span></div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-brand-primary h-1.5 rounded-full transition-all" style={{width:'100%'}}></div></div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs font-bold mb-1"><span className="text-gray-500">Recommendations</span><span className="text-gray-800">{recComplete}%</span></div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-brand-primary h-1.5 rounded-full transition-all" style={{width:`${recComplete}%`}}></div></div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs font-bold mb-1"><span className="text-gray-500">Evidence Strength</span><span className="text-gray-800">{evidenceScore}%</span></div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-brand-primary h-1.5 rounded-full transition-all" style={{width:`${evidenceScore}%`}}></div></div>
                        </div>
                      </div>
                    </div>

                    {/* SUBMISSION CONFIDENCE */}
                    <div className={`border rounded-2xl p-5 shadow-sm ${confidence.level==='High'?'bg-green-50 border-green-200':'bg-yellow-50 border-yellow-200'}`}>
                       <h4 className={`text-xs font-black uppercase mb-1 ${confidence.level==='High'?'text-green-700':'text-yellow-700'}`}>Submission Confidence: {confidence.level}</h4>
                       <p className={`text-xs font-medium ${confidence.level==='High'?'text-green-800':'text-yellow-800'}`}>{confidence.reason}</p>
                    </div>
                </div>
              </div>

              {/* CONTRIBUTION IMPACT */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                   <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                     <FaGlobe className="text-brand-secondary" /> Contribution Impact
                   </h3>
                   <p className="text-xs text-gray-600 font-medium max-w-xl">
                     Your verified intelligence will be routed directly to key infrastructure components. By submitting, you are actively participating in:
                   </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-end w-full md:w-auto">
                   {['District Planning', 'Policy Formation', 'Export Strategy', 'Training Programs'].map(i => (
                     <span key={i} className="text-xs font-bold px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm">{i}</span>
                   ))}
                </div>
              </div>

              {/* CONTENT-AWARE REVIEW ACCORDIONS */}
              <div className="space-y-4 mb-10">
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Raw Data Verification</h3>
                {['profile', 'situation', 'challenges', 'opportunities', 'recommendations'].map((secKey, idx) => {
                  const sectionData = consultationData[secKey] || {};
                  const isExpanded = expandedSections[secKey];
                  const schemaFields = secKey === 'profile' ? currentSchema?.profile : currentSchema?.[secKey as keyof typeof currentSchema] as Question[];
                  if (!schemaFields) return null;
                  
                  return (
                    <div key={secKey} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                      <div 
                        className="px-6 py-4 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                        onClick={() => setExpandedSections(p => ({...p, [secKey]: !p[secKey]}))}
                      >
                        <div>
                          <h3 className="font-black text-gray-800 uppercase tracking-wide text-sm mb-1">{secKey}</h3>
                          <p className="text-xs text-gray-500 font-medium italic">{getSectionSummary(secKey)}</p>
                        </div>
                        <div className="flex gap-4 items-center shrink-0">
                          <button onClick={(e) => { e.stopPropagation(); setStep(idx + 2); }} className="text-xs px-3 py-1 bg-white border border-gray-300 rounded text-brand-secondary font-bold hover:border-brand-secondary transition shadow-sm">Edit Section</button>
                          <span className="text-gray-400 font-bold bg-white w-6 h-6 flex items-center justify-center rounded-full border border-gray-200 shadow-sm">{isExpanded ? '-' : '+'}</span>
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="p-6 space-y-4 bg-white">
                          {secKey === 'profile' && (
                            <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4 mb-4">
                              <div><div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Full Name</div><div className="text-sm font-bold text-gray-800">{sectionData.fullName || '-'}</div></div>
                              <div><div className="text-[10px] text-gray-400 font-bold uppercase mb-1">District</div><div className="text-sm font-bold text-gray-800">{sectionData.district || '-'}</div></div>
                            </div>
                          )}
                          {schemaFields.map(q => {
                            const val = sectionData[q.id];
                            if (!val || (Array.isArray(val) && val.length===0)) return null;
                            return (
                              <div key={q.id}>
                                <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">{q.label}</div>
                                {Array.isArray(val) ? (
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {val.map(v => <span key={v} className="bg-gray-50 border border-gray-200 px-2 py-1 rounded text-xs font-bold text-gray-700">{v}</span>)}
                                  </div>
                                ) : typeof val === 'object' ? (
                                  <div className="mt-1 space-y-1">
                                    {Object.entries(val).map(([k, v]) => <div key={k} className="text-sm"><span className="font-bold text-gray-700">{v}.</span> {k}</div>)}
                                  </div>
                                ) : (
                                  <div className="text-sm font-bold text-gray-800 whitespace-pre-wrap">{val}</div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition flex flex-col md:flex-row md:items-center justify-between gap-4" onClick={() => setExpandedSections(p => ({...p, evidence: !p.evidence}))}>
                    <div>
                      <h3 className="font-black text-gray-800 uppercase tracking-wide text-sm mb-1">EVIDENCE</h3>
                      <p className="text-xs text-gray-500 font-medium italic">{uploadedFiles.length > 0 ? `Attached ${uploadedFiles.length} verifiable documents.` : 'No evidence attached.'}</p>
                    </div>
                    <div className="flex gap-4 items-center shrink-0">
                      <button onClick={(e) => { e.stopPropagation(); setStep(7); }} className="text-xs px-3 py-1 bg-white border border-gray-300 rounded text-brand-secondary font-bold hover:border-brand-secondary transition shadow-sm">Edit Section</button>
                      <span className="text-gray-400 font-bold bg-white w-6 h-6 flex items-center justify-center rounded-full border border-gray-200 shadow-sm">{expandedSections.evidence ? '-' : '+'}</span>
                    </div>
                  </div>
                  {expandedSections.evidence && (
                    <div className="p-6 bg-white">
                      {uploadedFiles.length === 0 ? <p className="text-sm text-gray-500 italic">No evidence uploaded.</p> : (
                        <div className="space-y-2">
                          {uploadedFiles.map((f, i) => (
                            <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                              <span className="text-sm font-bold text-gray-800 flex items-center gap-2"><FaFileAlt className="text-brand-secondary"/> {f.name}</span>
                              <span className="text-xs text-gray-500">{(f.size/1024/1024).toFixed(2)} MB</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-center gap-4">
                 <button onClick={() => setStep(2)} className="px-8 py-4 bg-white border border-gray-300 text-gray-700 rounded-[14px] font-bold hover:bg-gray-50 transition shadow-sm">
                   Back to Questionnaire
                 </button>
                 <button onClick={() => { 
                   // KNOWLEDGE GRAPH READY OUTPUT & ANALYTICS PREPARATION (Simulated API call)
                   const graphNodes = [
                     { id: category, type: 'Stakeholder' },
                     { id: prof.district, type: 'District' },
                     ...inferredTags.map(t => ({ id: t, type: 'Challenge' })),
                     ...inferredThemes.map(t => ({ id: t, type: 'Theme' }))
                   ].filter(n => n.id);
                   
                   const graphEdges = [
                     { source: category, rel: 'OPERATES_IN', target: prof.district },
                     ...inferredTags.map(t => ({ source: category, rel: 'REPORTS', target: t })),
                     ...inferredThemes.map(t => ({ source: category, rel: 'ASSOCIATED_WITH', target: t }))
                   ].filter(e => e.source && e.target);

                   if (uploadedFiles.length > 0) {
                     graphNodes.push({ id: 'SubmissionEvidence', type: 'Evidence' });
                     graphEdges.push({ source: category, rel: 'SUPPORTED_BY', target: 'SubmissionEvidence' });
                   }

                   const finalPayload = {
                     participantType: category,
                     district: prof.district,
                     semanticThemes: inferredThemes,
                     challengeTags: inferredTags,
                     generatedSummary: narrative,
                     generatedIndicators: {
                       profileCompleteness: profComplete,
                       overallIntelligenceScore: overallScore,
                       submissionConfidence: confidence.level,
                       insights
                     },
                     knowledgeGraphOutput: {
                       nodes: graphNodes,
                       relationships: graphEdges
                     },
                     rawConsultationData: consultationData
                   };
                   console.log("Submitting Knowledge Graph Ready JSON:", JSON.stringify(finalPayload, null, 2));
                   setStep(9); 
                   window.scrollTo({ top: 0, behavior: 'smooth' }); 
                 }} className="px-8 py-4 bg-brand-primary text-white rounded-[14px] font-black hover:bg-brand-secondary transition shadow-lg text-lg flex items-center justify-center gap-3">
                   Inject into Intelligence System <FaArrowRight />
                 </button>
              </div>

            </div>
          )})();}
'''

content = content[:s8_idx] + new_step_8 + "\n" + content[s9_idx:]

# Ensure FaRobot and FaBrain are imported
if "FaRobot" not in content:
    content = content.replace("FaLock, FaTags", "FaLock, FaTags, FaRobot, FaBrain")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Intelligence Dashboard Migration successful.")
