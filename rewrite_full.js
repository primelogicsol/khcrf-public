const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/become-a-fellow/page.tsx';
let c = fs.readFileSync(file, 'utf8');

// 1. Move "use client" to the top
c = '"use client";\n' + c.replace(/"use client";\n?/g, '');

// 2. Add config state
const stateSearch = 'const [formMessage, setFormMessage] = useState(\'\');';
c = c.replace(stateSearch, stateSearch + '\n  const [programConfig, setProgramConfig] = useState<any>(null);\n  const [configLoading, setConfigLoading] = useState(true);');

// 3. Add useEffect for config fetch
const effectSearch = '// Form State';
c = c.replace(effectSearch, `
  useEffect(() => {
    fetch('/api/backend/skc/fellowships/config')
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success') {
          setProgramConfig(json.data);
        }
        setConfigLoading(false);
      })
      .catch(err => {
        console.error(err);
        setConfigLoading(false);
      });
  }, []);
` + '\n  // Form State');

// 4. Update form submit handler
const oldFetch = `        const res = await fetch(\`/api/backend/skc/fellowships/register\`, {
          method: 'POST',
          body: submitData
        });
        const data = await res.json();

        if (res.ok) {
          setFormStatus('success');
          setFormMessage('Application submitted successfully.');
          setFormData({ fullName: '', email: '', phone: '', district: '', education: '', institution: '', position: '', skills: '', statement: '', consent: false });
          setCvFile(null);
          setPortfolioFile(null);
        } else {
          setFormStatus('error');
          setFormMessage(data.error || 'Failed to submit application.');
        }`;

const newFetch = `        const res = await fetch('/api/backend/skc/fellowships/register', {
          method: 'POST',
          body: submitData
        });
        const data = await res.json();

        if (res.status === 201 && data.status === 'success') {
          setFormStatus('success');
          setFormMessage(data.data?.referenceNumber || 'SUBMITTED');
          setFormData({ fullName: '', email: '', phone: '', district: '', education: '', institution: '', position: '', skills: '', statement: '', consent: false });
          setCvFile(null);
          setPortfolioFile(null);
        } else if (res.status === 409 || data.status === 'already_submitted') {
          setFormStatus('success'); // Show warning UI as success for now
          setFormMessage(data.data?.referenceNumber || 'Unknown');
        } else {
          setFormStatus('error');
          setFormMessage(data.error?.message || 'We could not confirm your submission. Please do not resubmit yet. Check your application status or try again after verification.');
        }`;

c = c.replace(oldFetch, newFetch);

// 5. Update validation
c = c.replace(
  'if (!formData.fullName || !formData.email || !formData.consent || !formData.position) {',
  'if (!formData.fullName || !formData.email || !formData.consent || !formData.position || !formData.statement || !cvFile) {'
);

// 6. Update position options mapping
const oldSelect = `<select value={formData.position}`;
c = c.replace(oldSelect, `<select required value={formData.position}`);
c = c.replace(
  '<option value="">Select a position...</option>',
  '<option value="">Select a position...</option>\n{programConfig?.positions?.map((p: any) => (<option key={p.id} value={p.id}>{p.title}</option>))}'
);

// 7. Make CV/Statement required
c = c.replace('<textarea rows={4} value={formData.statement}', '<textarea rows={4} required value={formData.statement}');
c = c.replace('<label className="block text-xs font-bold text-gray-700 mb-2">Upload CV (PDF)</label>', '<label className="block text-xs font-bold text-gray-700 mb-2">Upload CV (PDF only, max 5MB) *</label>');
c = c.replace('<input type="file" accept=".pdf" onChange={(e)', '<input type="file" required accept=".pdf" onChange={(e)');

// 8. Update consent string
c = c.replace(
  'I understand that submitting this application does not guarantee selection',
  'I consent to KHCRF collecting and processing the information submitted in this application for fellowship recruitment, selection, administration, and related communications in accordance with the Privacy Policy.'
);

// 9. Form wrappers (Success vs Form vs Applications Closed)
const oldForm = '<form onSubmit={handleSubmit} className="space-y-6">';
const newForm = `
{formStatus === 'success' ? (
<div className="bg-green-50 p-8 rounded-2xl border border-green-200 text-center">
  <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
  <h3 className="text-2xl font-black text-green-900 mb-2">APPLICATION SUBMITTED</h3>
  <p className="text-green-800 font-bold mb-2">Reference: {formMessage}</p>
  <p className="text-green-800 mb-4">Position: {programConfig?.positions?.find((p: any) => p.id === formData.position)?.title || formData.position}</p>
  <p className="text-green-700 text-sm">Your application has been received. Please retain your application reference for future correspondence.</p>
</div>
) : programConfig?.state !== 'APPLICATIONS_OPEN' ? (
<div className="bg-yellow-50 p-8 rounded-2xl border border-yellow-200 text-center">
  <h3 className="text-xl font-bold text-yellow-900 mb-2">Applications Closed</h3>
  <p className="text-yellow-800 text-sm">Fellowship applications are not currently open.</p>
</div>
) : (
<form onSubmit={handleSubmit} className="space-y-6">
`;
c = c.replace(oldForm, newForm);
c = c.replace('</form>', '</form>)}');

// 10. Update positions block removal
const oldUnderReview = `<div className="bg-yellow-50 border border-yellow-200 p-8 rounded-2xl mb-12 flex items-start gap-4">
              <FaInfoCircle className="text-yellow-600 text-2xl shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-black text-yellow-900 mb-1">Positions Under Advisory Review</h3>
                <p className="text-yellow-800 font-medium text-sm leading-relaxed mb-3">
                  The final scope, funding allocations, and research mandates for the 2026 Fellowships are currently undergoing assessment by the SKC Advisory Council. Vetted positions will unlock for public applications shortly.
                </p>
              </div>
            </div>`;
const newStatusAlert = `
{programConfig?.state === 'APPLICATIONS_OPEN' ? (
<div className="bg-green-50 border border-green-200 p-8 rounded-2xl mb-12 flex items-start gap-4"><FaInfoCircle className="text-green-600 text-2xl shrink-0 mt-1" /><div><h3 className="text-lg font-black text-green-900 mb-1">Applications Open</h3><p className="text-green-800 font-medium text-sm leading-relaxed mb-3">The 2026 Fellowship positions have been fully vetted and are now open for public applications.</p></div></div>
) : (
<div className="bg-yellow-50 border border-yellow-200 p-8 rounded-2xl mb-12 flex items-start gap-4"><FaInfoCircle className="text-yellow-600 text-2xl shrink-0 mt-1" /><div><h3 className="text-lg font-black text-yellow-900 mb-1">Positions Under Advisory Review</h3><p className="text-yellow-800 font-medium text-sm leading-relaxed mb-3">The final scope, funding allocations, and research mandates for the 2026 Fellowships are currently undergoing assessment by the SKC Advisory Council. Vetted positions will unlock for public applications shortly.</p></div></div>
)}
`;
c = c.replace(oldUnderReview, newStatusAlert);

// 11. Add Loading State for the form area
c = c.replace('return (', 'if (configLoading) return <div className="p-20 text-center">Loading form...</div>;\n\n  return (');

fs.writeFileSync(file, c);
