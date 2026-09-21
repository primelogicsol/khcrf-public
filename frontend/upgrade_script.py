import os

path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts\participate\ParticipateClient.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. State addition
content = content.replace(
'''  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const searchParams = useSearchParams();''',
'''  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [consultationData, setConsultationData] = useState<Record<string, any>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    profile: true,
    situation: true,
    challenges: true,
    opportunities: true,
    recommendations: true,
    evidence: true
  });
  
  const handleChange = (section: string, id: string, value: any) => {
    setConsultationData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [id]: value
      }
    }));
  };

  const searchParams = useSearchParams();'''
)

# 2. renderQuestionField replacement
old_render_start = "  const renderQuestionField = (q: Question) => {"
new_render = '''  const renderQuestionField = (q: Question, section: string) => {
    const value = consultationData[section]?.[q.id];
    switch (q.type) {
      case 'text':
      case 'number':
        return (
          <div key={q.id}>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">{q.label}</label>
            <input type={q.type} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-primary" placeholder={q.placeholder || ""} value={value || ""} onChange={e => handleChange(section, q.id, e.target.value)} />
          </div>
        );
      case 'select':
        return (
          <div key={q.id}>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">{q.label}</label>
            <select value={value || ""} onChange={e => handleChange(section, q.id, e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-primary">
              <option value="" disabled>Select Option</option>
              {q.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        );
      case 'rating':
        return (
          <div key={q.id} className="bg-gray-50 border border-gray-200 p-6 rounded-2xl">
            <label className="block font-bold text-gray-900 mb-4">{q.label}</label>
            <div className="flex flex-wrap gap-3">
              {q.options?.map(opt => (
                <label key={opt} className="cursor-pointer">
                  <input type="radio" name={q.id} value={opt} checked={value === opt} onChange={() => handleChange(section, q.id, opt)} className="peer sr-only" />
                  <div className="px-5 py-2 rounded-[14px] border border-gray-300 text-sm font-bold text-gray-600 peer-checked:bg-brand-primary peer-checked:text-white peer-checked:border-brand-primary transition shadow-sm">
                    {opt}
                  </div>
                </label>
              ))}
            </div>
          </div>
        );
      case 'radio':
        return (
          <div key={q.id} className="bg-gray-50 border border-gray-200 p-6 rounded-2xl">
            <label className="block font-bold text-gray-900 mb-4">{q.label}</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {q.options?.map(opt => (
                <label key={opt} className="flex items-center gap-3 p-3 border border-gray-300 rounded-xl cursor-pointer bg-white hover:border-brand-primary transition">
                  <input type="radio" name={q.id} value={opt} checked={value === opt} onChange={() => handleChange(section, q.id, opt)} className="accent-brand-primary w-4 h-4" />
                  <span className="text-sm font-bold text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        );
      case 'multiselect':
        return (
          <div key={q.id} className="bg-gray-50 border border-gray-200 p-6 rounded-2xl">
            <label className="block font-bold text-gray-900 mb-1">{q.label}</label>
            {q.description && <p className="text-xs text-gray-500 mb-4 font-bold">{q.description}</p>}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {q.options?.map(opt => {
                const isChecked = Array.isArray(value) && value.includes(opt);
                return (
                  <label key={opt} className="flex items-start gap-3 p-3 border border-gray-300 rounded-xl cursor-pointer bg-white hover:border-brand-primary transition">
                    <input type="checkbox" checked={isChecked} onChange={(e) => {
                      const curr = Array.isArray(value) ? value : [];
                      if (e.target.checked) handleChange(section, q.id, [...curr, opt]);
                      else handleChange(section, q.id, curr.filter((x: string) => x !== opt));
                    }} className="accent-brand-primary mt-1 w-4 h-4" />
                    <span className="text-sm font-bold text-gray-700 leading-tight">{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      case 'textarea':
        return (
          <div key={q.id} className="bg-gray-50 border border-gray-200 p-6 rounded-2xl">
            <label className="block font-bold text-gray-900 mb-2">{q.label}</label>
            <textarea rows={4} value={value || ""} onChange={e => handleChange(section, q.id, e.target.value)} className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:border-brand-primary bg-white resize-none" placeholder={q.placeholder || ""}></textarea>
          </div>
        );
      case 'rank':
        return (
          <div key={q.id} className="bg-gray-50 border border-gray-200 p-6 rounded-2xl">
            <label className="block font-bold text-gray-900 mb-1">{q.label}</label>
            {q.description && <p className="text-xs text-gray-500 mb-4 font-bold">{q.description}</p>}
            <div className="space-y-2">
              {q.options?.map((opt) => {
                const rankObj = value || {};
                return (
                  <div key={opt} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-300 shadow-sm hover:border-brand-primary transition">
                    <select 
                      className="w-12 h-10 shrink-0 bg-gray-50 rounded-lg flex items-center justify-center font-black text-gray-700 border border-gray-300 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-center appearance-none cursor-pointer"
                      value={rankObj[opt] || ""}
                      onChange={e => handleChange(section, q.id, { ...rankObj, [opt]: e.target.value })}
                    >
                      <option value="" disabled>-</option>
                      {q.options?.map((_, num) => <option key={num+1} value={num+1}>{num+1}</option>)}
                    </select>
                    <span className="font-bold text-gray-800 flex-1">{opt}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      default:
        return null;
    }
  };'''

start_idx = content.find(old_render_start)
end_idx = content.find("  const catPrefix = category", start_idx)
content = content[:start_idx] + new_render + "\n\n" + content[end_idx:]

# 3. Profile replacements
content = content.replace(
'''                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Full Name</label>
                  <input type="text" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-primary" placeholder="Required" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">District</label>
                  <select defaultValue="" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-primary">
                    <option value="" disabled>Select District</option>
                    {KASHMIR_DISTRICT_NAMES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                {currentSchema?.profile.map((q) => (
                  <div key={q.id} className={q.type === 'textarea' ? "md:col-span-2" : ""}>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">{q.label}</label>
                    {q.type === 'textarea' ? (
                      <textarea rows={2} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-primary" placeholder={q.placeholder || ""}></textarea>
                    ) : q.type === 'select' ? (
                      <select defaultValue="" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-primary">
                        <option value="" disabled>Select Option</option>
                        {q.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : (
                      <input type={q.type} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-primary" placeholder={q.placeholder || ""} />
                    )}
                  </div>
                ))}''',
'''                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Full Name</label>
                  <input type="text" value={consultationData['profile']?.fullName || ""} onChange={e => handleChange('profile', 'fullName', e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-primary" placeholder="Required" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">District</label>
                  <select value={consultationData['profile']?.district || ""} onChange={e => handleChange('profile', 'district', e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-primary">
                    <option value="" disabled>Select District</option>
                    {KASHMIR_DISTRICT_NAMES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                {currentSchema?.profile.map((q) => (
                  <div key={q.id} className={q.type === 'textarea' ? "md:col-span-2" : ""}>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">{q.label}</label>
                    {q.type === 'textarea' ? (
                      <textarea rows={2} value={consultationData['profile']?.[q.id] || ""} onChange={e => handleChange('profile', q.id, e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-primary" placeholder={q.placeholder || ""}></textarea>
                    ) : q.type === 'select' ? (
                      <select value={consultationData['profile']?.[q.id] || ""} onChange={e => handleChange('profile', q.id, e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-primary">
                        <option value="" disabled>Select Option</option>
                        {q.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : (
                      <input type={q.type} value={consultationData['profile']?.[q.id] || ""} onChange={e => handleChange('profile', q.id, e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-primary" placeholder={q.placeholder || ""} />
                    )}
                  </div>
                ))}'''
)

# 4. situation, challenges, opportunities
content = content.replace("{currentSchema?.situation.map(renderQuestionField)}", "{currentSchema?.situation.map(q => renderQuestionField(q, 'situation'))}")
content = content.replace("{currentSchema?.challenges.map(renderQuestionField)}", "{currentSchema?.challenges.map(q => renderQuestionField(q, 'challenges'))}")
content = content.replace("{currentSchema?.opportunities.map(renderQuestionField)}", "{currentSchema?.opportunities.map(q => renderQuestionField(q, 'opportunities'))}")

# 5. recommendations
content = content.replace(
'''                {currentSchema?.recommendations.map(q => (
                  <div key={q.id}>
                    <label className="block text-sm font-bold text-gray-800 mb-2">{q.label}</label>
                    <textarea rows={3} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-primary resize-none" placeholder={q.placeholder || ""}></textarea>
                  </div>
                ))}''',
'''                {currentSchema?.recommendations.map(q => (
                  <div key={q.id}>
                    <label className="block text-sm font-bold text-gray-800 mb-2">{q.label}</label>
                    <textarea rows={3} value={consultationData['recommendations']?.[q.id] || ""} onChange={e => handleChange('recommendations', q.id, e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-primary resize-none" placeholder={q.placeholder || ""}></textarea>
                  </div>
                ))}'''
)

# 6. Step 8 Review page replacement
step_8_start = "{/* STEP 8: Contribution Summary */}"
step_9_start = "{/* STEP 9: Contribution Submitted / Dashboard */}"

s8_idx = content.find(step_8_start)
s9_idx = content.find(step_9_start)

# Define the new Review Page content
new_step_8 = '''{/* STEP 8: Contribution Summary */}
          {step === 8 && (
            <div className="animate-fade-in py-4">
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="text-4xl text-green-500" />
                </div>
                <h2 className="text-3xl font-black text-brand-dark mb-2">Review Your Contribution</h2>
                <p className="text-gray-600 font-medium">Please verify your structured submission. This data powers the State of Kashmir Crafts intelligence platform.</p>
              </div>

              {/* AI GENERATED SUBMISSION SUMMARY */}
              <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-2xl p-6 mb-8 text-sm text-gray-800 font-medium leading-relaxed">
                <strong>Executive Summary:</strong> This submission represents a {category} from {consultationData['profile']?.district || 'Kashmir'} 
                {consultationData['profile']?.yearsExperience ? ` with ${consultationData['profile'].yearsExperience} years of experience` : ''}. 
                {consultationData['challenges'] && Object.values(consultationData['challenges']).some(v => Array.isArray(v) && v.length > 0) ? ` Major reported barriers include ${Object.values(consultationData['challenges']).find(v => Array.isArray(v))?.join(', ') || 'various challenges'}. ` : ''}
                {consultationData['opportunities'] && Object.values(consultationData['opportunities']).some(v => typeof v === 'object' && v !== null) ? ` Growth opportunities are highlighted in emerging areas.` : ''}
                {uploadedFiles.length > 0 ? ` Supporting evidence has been attached.` : ''}
              </div>

              {/* INTELLIGENCE TAGS & QUALITY INDICATORS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-brand-dark rounded-2xl p-6 relative">
                  <FaTags className="absolute top-6 right-6 text-2xl text-white/10" />
                  <h3 className="text-sm font-black text-brand-secondary uppercase tracking-wider mb-4">Semantic Profile Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-bold px-3 py-1 bg-white/10 text-white rounded-[10px] border border-white/20">Stakeholder: {category}</span>
                    <span className="text-xs font-bold px-3 py-1 bg-white/10 text-white rounded-[10px] border border-white/20">District: {consultationData['profile']?.district || 'Pending'}</span>
                    <span className="text-xs font-bold px-3 py-1 bg-white/10 text-white rounded-[10px] border border-white/20">Theme: Economy</span>
                    {Object.values(consultationData['challenges'] || {}).map(v => Array.isArray(v) ? v.map((tag,i) => <span key={'c'+i} className="text-xs font-bold px-3 py-1 bg-white/10 text-white rounded-[10px] border border-white/20">Challenge: {tag}</span>) : null)}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
                  <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider mb-4">Quality Indicators</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1"><span className="text-gray-500">Profile Completion</span><span className="text-brand-primary">100%</span></div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-brand-primary h-1.5 rounded-full" style={{width:'100%'}}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1"><span className="text-gray-500">Response Quality</span><span className="text-brand-primary">High</span></div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full" style={{width:'85%'}}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1"><span className="text-gray-500">Evidence Quality</span><span className="text-brand-primary">{uploadedFiles.length > 0 ? 'Verified' : 'Pending'}</span></div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5"><div className={`${uploadedFiles.length>0?'bg-green-500':'bg-yellow-400'} h-1.5 rounded-full`} style={{width: uploadedFiles.length>0?'100%':'30%'}}></div></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CONTENT-AWARE REVIEW ACCORDIONS */}
              <div className="space-y-4 mb-10">
                {['profile', 'situation', 'challenges', 'opportunities', 'recommendations'].map((secKey, idx) => {
                  const sectionData = consultationData[secKey] || {};
                  const isExpanded = expandedSections[secKey];
                  const schemaFields = secKey === 'profile' ? currentSchema?.profile : currentSchema?.[secKey as keyof typeof currentSchema] as Question[];
                  if (!schemaFields) return null;
                  
                  return (
                    <div key={secKey} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                      <div 
                        className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition"
                        onClick={() => setExpandedSections(p => ({...p, [secKey]: !p[secKey]}))}
                      >
                        <h3 className="font-black text-gray-800 uppercase tracking-wide text-sm">{secKey}</h3>
                        <div className="flex gap-4">
                          <button onClick={(e) => { e.stopPropagation(); setStep(idx + 2); }} className="text-xs text-brand-secondary font-bold hover:underline">Edit</button>
                          <span className="text-gray-400 font-bold">{isExpanded ? '-' : '+'}</span>
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="p-6 space-y-4 bg-white">
                          {secKey === 'profile' && (
                            <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4 mb-4">
                              <div><div className="text-xs text-gray-500 font-bold uppercase mb-1">Full Name</div><div className="text-sm font-bold text-gray-800">{sectionData.fullName || '-'}</div></div>
                              <div><div className="text-xs text-gray-500 font-bold uppercase mb-1">District</div><div className="text-sm font-bold text-gray-800">{sectionData.district || '-'}</div></div>
                            </div>
                          )}
                          {schemaFields.map(q => {
                            const val = sectionData[q.id];
                            if (!val || (Array.isArray(val) && val.length===0)) return null;
                            return (
                              <div key={q.id}>
                                <div className="text-xs text-gray-500 font-bold uppercase mb-1">{q.label}</div>
                                {Array.isArray(val) ? (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {val.map(v => <span key={v} className="bg-gray-100 px-2 py-1 rounded text-xs font-bold text-gray-700">{v}</span>)}
                                  </div>
                                ) : typeof val === 'object' ? (
                                  <div className="mt-2 space-y-1">
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
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition" onClick={() => setExpandedSections(p => ({...p, evidence: !p.evidence}))}>
                    <h3 className="font-black text-gray-800 uppercase tracking-wide text-sm">EVIDENCE</h3>
                    <div className="flex gap-4">
                      <button onClick={(e) => { e.stopPropagation(); setStep(7); }} className="text-xs text-brand-secondary font-bold hover:underline">Edit</button>
                      <span className="text-gray-400 font-bold">{expandedSections.evidence ? '-' : '+'}</span>
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
                   Edit Responses
                 </button>
                 <button onClick={() => { 
                   // KNOWLEDGE GRAPH READY OUTPUT & ANALYTICS PREPARATION (Simulated API call)
                   const finalPayload = {
                     participantType: category,
                     district: consultationData['profile']?.district,
                     experience: consultationData['profile']?.yearsExperience,
                     challengeTags: Object.values(consultationData['challenges'] || {}).flat(),
                     uploadedEvidence: uploadedFiles.map(f => f.name),
                     generatedIndicators: { profileCompletion: 100, responseQuality: "High", evidenceQuality: uploadedFiles.length > 0 ? "Verified" : "Pending" },
                     analytics: { topChallenge: "Raw Materials", primaryOpportunity: "Digital Marketing" },
                     rawConsultationData: consultationData
                   };
                   console.log("Submitting Knowledge Graph Ready JSON:", JSON.stringify(finalPayload, null, 2));
                   setStep(9); 
                   window.scrollTo({ top: 0, behavior: 'smooth' }); 
                 }} className="px-8 py-4 bg-brand-primary text-white rounded-[14px] font-black hover:bg-brand-secondary transition shadow-lg text-lg">
                   Submit Contribution
                 </button>
              </div>

            </div>
          )}
'''

content = content[:s8_idx] + new_step_8 + "\n" + content[s9_idx:]

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Migration successful.")
