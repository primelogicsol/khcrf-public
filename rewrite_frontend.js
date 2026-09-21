const fs = require('fs');

const pageTsxPath = 'frontend/src/app/(main)/state-of-kashmir-crafts/become-a-fellow/page.tsx';
let c = fs.readFileSync(pageTsxPath, 'utf8');

// Remove import of FELLOWSHIP_PROGRAMME
c = c.replace(/import { FELLOWSHIP_PROGRAMME } from '@\/config\/fellowshipConfig';\n/, '');

// Add state for programConfig
const stateSearch = 'const [faqs, setFaqs] = useState<any[]>([]);';
c = c.replace(stateSearch, stateSearch + '\n  const [programConfig, setProgramConfig] = useState<any>(null);');

// Add useEffect to fetch config
const effectToAdd = `
  useEffect(() => {
    fetch('/api/backend/skc/fellowships/config')
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success') setProgramConfig(json.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);
`;
c = c.replace('// Form State', effectToAdd + '\n  // Form State');

// Replace FELLOWSHIP_PROGRAMME references with programConfig
c = c.replace(/FELLOWSHIP_PROGRAMME/g, 'programConfig');

// Add a loading state guard around the whole return if needed, but we can just use programConfig?.state
c = c.replace(/programConfig\.state/g, '(programConfig?.state)');
c = c.replace(/programConfig\.positions/g, '(programConfig?.positions || [])');

// Fix API success parsing block
const oldSubmitHandlerBody = c.substring(c.indexOf('const res = await fetch'), c.indexOf('} catch (error) {'));
const newSubmitHandlerBody = `
        const res = await fetch('/api/backend/skc/fellowships/register', {
          method: 'POST',
          body: submitData
        });
        const data = await res.json();
        
        if (res.status === 201 && data.status === 'success') {
          setFormStatus('success');
          setFormMessage(data.data.referenceNumber);
        } else if (res.status === 409 || data.status === 'already_submitted') {
          setFormStatus('success'); // Show it as an already submitted success/warning
          setFormMessage(data.data?.referenceNumber || 'Unknown');
        } else {
          setFormStatus('error');
          setFormMessage(data.error?.message || 'We could not confirm your submission. Please do not resubmit yet. Check your application status or try again after verification.');
        }
`;
c = c.replace(/const res = await fetch\(`\/api\/backend\/skc\/fellowships\/register`[\s\S]*?setFormMessage.*?;\n\s*\}/m, newSubmitHandlerBody);

// Change Success UI block
const oldSuccessUI = `<div className="bg-green-50 p-8 rounded-2xl border border-green-200 text-center"><FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" /><h3 className="text-2xl font-black text-green-900 mb-2\">APPLICATION SUBMITTED</h3><p className="text-green-800 font-bold mb-4\">Reference: {formMessage}</p><p className="text-green-700 text-sm\">Your application has been received. Please retain your application reference for future correspondence.</p></div>`;
const newSuccessUI = `
<div className="bg-green-50 p-8 rounded-2xl border border-green-200 text-center">
  <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
  <h3 className="text-2xl font-black text-green-900 mb-2">APPLICATION SUBMITTED</h3>
  <p className="text-green-800 font-bold mb-2">Reference: {formMessage}</p>
  <p className="text-green-800 mb-4">Position: {programConfig?.positions?.find(p => p.id === formData.position)?.title || formData.position}</p>
  <p className="text-green-700 text-sm">Your application has been received. Please retain your application reference for future correspondence.</p>
</div>`;
c = c.replace(oldSuccessUI, newSuccessUI);

// Fix loading conditionally hiding the main blocks
c = c.replace(/return \(\s*<main>/, 'return (<main>{loading ? <div className="p-20 text-center">Loading...</div> : <>');
c = c.replace(/<\/main>\s*\);\s*\}/, '</>}</main>);}');

fs.writeFileSync(pageTsxPath, c);
