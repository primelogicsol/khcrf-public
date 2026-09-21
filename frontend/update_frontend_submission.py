import os

path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts\participate\ParticipateClient.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix imports
if "useEffect" not in content[:200]:
    content = content.replace("useState,", "useState, useEffect,")
    content = content.replace("import React, { useState }", "import React, { useState, useEffect }")
    if "import { useState, useRef" in content:
        content = content.replace("import { useState, useRef", "import { useState, useRef, useEffect")

# Update state
old_state = "const [consultationData, setConsultationData] = useState<Record<string, any>>({});"
new_state = '''  const [consultationData, setConsultationData] = useState<Record<string, any>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hcrf_consultationData');
      if (saved) return JSON.parse(saved);
    }
    return {};
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(consultationData).length > 0) {
      localStorage.setItem('hcrf_consultationData', JSON.stringify(consultationData));
    }
  }, [consultationData]);'''
if old_state in content:
    content = content.replace(old_state, new_state)

# Replace the submission button block
old_submit_start = "                 <button onClick={() => { \n                   // KNOWLEDGE GRAPH READY OUTPUT"
old_submit_end = "                 </button>\n              </div>"

start_idx = content.find("                 <button onClick={() => { \n                   // KNOWLEDGE GRAPH READY OUTPUT")
if start_idx == -1:
    start_idx = content.find("                 <button onClick={() => { \n                   // KNOWLEDGE GRAPH READY OUTPUT")
    if start_idx == -1:
        print("Could not find button start")

end_idx = content.find("                 </button>\n              </div>", start_idx)

if start_idx != -1 and end_idx != -1:
    new_button = '''                 <button disabled={isSubmitting} onClick={async () => { 
                   if (!consultationData['profile']?.district) {
                     setSubmitError('Missing required field: District is required.');
                     return;
                   }
                   if (profComplete < 20) {
                     setSubmitError('Profile is incomplete. Please provide basic details.');
                     return;
                   }
                   setSubmitError(null);
                   setIsSubmitting(true);
                   try {
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
                       evidenceCount: uploadedFiles.length,
                       knowledgeGraphOutput: {
                         nodes: graphNodes,
                         relationships: graphEdges
                       },
                       rawConsultationData: consultationData
                     };

                     const formData = new FormData();
                     formData.append('payload', JSON.stringify(finalPayload));
                     uploadedFiles.forEach(file => formData.append('evidenceFiles', file));

                     const response = await fetch('http://localhost:4000/api/consultation/submit', {
                       method: 'POST',
                       body: formData
                     });
                     
                     const result = await response.json();
                     if (!response.ok) throw new Error(result.error || 'Submission failed');
                     
                     if (typeof window !== 'undefined') localStorage.removeItem('hcrf_consultationData');
                     setStep(9); 
                     window.scrollTo({ top: 0, behavior: 'smooth' }); 
                   } catch (err: any) {
                     setSubmitError(err.message || 'An unexpected error occurred.');
                   } finally {
                     setIsSubmitting(false);
                   }
                 }} className={`px-8 py-4 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-primary'} text-white rounded-[14px] font-black hover:bg-brand-secondary transition shadow-lg text-lg flex items-center justify-center gap-3`}>
                   {isSubmitting ? 'Persisting to Knowledge Graph...' : 'Inject into Intelligence System'} {isSubmitting ? null : <FaArrowRight />}
                 </button>
              </div>
              <div className="w-full text-center mt-4">
                {submitError && <span className="text-red-500 font-bold bg-red-50 px-4 py-2 rounded-lg border border-red-200">{submitError}</span>}
              </div>'''

    content = content[:start_idx] + new_button + content[end_idx + len("                 </button>\n              </div>"):]

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Frontend updated.")
