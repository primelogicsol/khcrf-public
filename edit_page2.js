const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/become-a-fellow/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = "import { FELLOWSHIP_PROGRAMME } from '@/config/fellowshipConfig';\n" + c;

c = c.replace(/<div className="bg-yellow-50 border border-yellow-200 p-8 rounded-2xl mb-12 flex items-start gap-4">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/m, 
  '{FELLOWSHIP_PROGRAMME.state === \'APPLICATIONS_OPEN\' ? (' +
  '<div className="bg-green-50 border border-green-200 p-8 rounded-2xl mb-12 flex items-start gap-4"><FaInfoCircle className="text-green-600 text-2xl shrink-0 mt-1" /><div><h3 className="text-lg font-black text-green-900 mb-1">Applications Open</h3><p className="text-green-800 font-medium text-sm leading-relaxed mb-3">The 2026 Fellowship positions have been fully vetted and are now open for public applications.</p></div></div>' +
  ') : (' +
  '<div className="bg-yellow-50 border border-yellow-200 p-8 rounded-2xl mb-12 flex items-start gap-4"><FaInfoCircle className="text-yellow-600 text-2xl shrink-0 mt-1" /><div><h3 className="text-lg font-black text-yellow-900 mb-1">Positions Under Advisory Review</h3><p className="text-yellow-800 font-medium text-sm leading-relaxed mb-3">The final scope, funding allocations, and research mandates for the 2026 Fellowships are currently undergoing assessment by the SKC Advisory Council. Vetted positions will unlock for public applications shortly.</p></div></div>' +
  ')}');

c = c.replace('if (!formData.fullName || !formData.email || !formData.consent || !formData.position) {', 
  'if (!formData.fullName || !formData.email || !formData.consent || !formData.position || !formData.statement || !cvFile) {');

c = c.replace(/<select value={formData\.position}[\s\S]*?<\/select>/, 
  '<select value={formData.position} required onChange={(e) => setFormData({...formData, position: e.target.value})} className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50"><option value="">Select a position...</option>{FELLOWSHIP_PROGRAMME.positions.map(p => (<option key={p.id} value={p.id}>{p.title}</option>))}</select>');

c = c.replace('<textarea rows={4} value={formData.statement}', '<textarea rows={4} required value={formData.statement}');

c = c.replace('<label className="block text-xs font-bold text-gray-700 mb-2">Upload CV (PDF)</label>', 
  '<label className="block text-xs font-bold text-gray-700 mb-2">Upload CV (PDF only, max 5MB) *</label>');

c = c.replace('<input type="file" accept=".pdf" onChange={(e) => setCvFile(e.target.files?.[0] || null)}', 
  '<input type="file" required accept=".pdf" onChange={(e) => setCvFile(e.target.files?.[0] || null)}');

c = c.replace('I understand that submitting this application does not guarantee selection', 
  'I consent to KHCRF collecting and processing the information submitted in this application for fellowship recruitment, selection, administration, and related communications in accordance with the Privacy Policy.');

const formStart = '<form onSubmit={handleSubmit} className="space-y-6">';
const newFormWrapper = '{formStatus === \'success\' ? (' +
  '<div className="bg-green-50 p-8 rounded-2xl border border-green-200 text-center"><FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" /><h3 className="text-2xl font-black text-green-900 mb-2">APPLICATION SUBMITTED</h3><p className="text-green-800 font-bold mb-4">Reference: {formMessage}</p><p className="text-green-700 text-sm">Your application has been received. Please retain your application reference for future correspondence.</p></div>' +
  ') : FELLOWSHIP_PROGRAMME.state !== \'APPLICATIONS_OPEN\' ? (' +
  '<div className="bg-yellow-50 p-8 rounded-2xl border border-yellow-200 text-center"><h3 className="text-xl font-bold text-yellow-900 mb-2">Applications Closed</h3><p className="text-yellow-800 text-sm">Fellowship applications are not currently open.</p></div>' +
  ') : (<form onSubmit={handleSubmit} className="space-y-6">';
c = c.replace(formStart, newFormWrapper);

const formEnd = '</form>';
c = c.replace(formEnd, '</form>)}');

const successAPI = `        if (res.ok) {
          setFormStatus('success');
          setFormMessage('Application submitted successfully.');
        } else {
          setFormStatus('error');
          setFormMessage(data.error || 'Failed to submit application.');
        }`;
const newSuccessAPI = `        if (res.ok && data.success) {
          setFormStatus('success');
          setFormMessage(data.data.referenceNumber);
        } else {
          setFormStatus('error');
          setFormMessage(data.error || 'Failed to submit application.');
        }`;
c = c.replace(successAPI, newSuccessAPI);

fs.writeFileSync(file, c);
