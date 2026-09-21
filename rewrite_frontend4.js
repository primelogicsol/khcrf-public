const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/become-a-fellow/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace('import { FELLOWSHIP_PROGRAMME } from \'@/config/fellowshipConfig\';\n', '');

// Insert state
const stateSearch = 'const [faqs, setFaqs] = useState<any[]>([]);';
c = c.replace(stateSearch, stateSearch + '\n  const [programConfig, setProgramConfig] = useState<any>(null);');

const effectToAdd = `
  useEffect(() => {
    fetch('/api/backend/skc/fellowships/config')
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success') setProgramConfig(json.data);
      })
      .catch(err => console.error(err));
  }, []);
`;
c = c.replace('// Form State', effectToAdd + '\n  // Form State');

// Replace constant references
c = c.replace(/FELLOWSHIP_PROGRAMME/g, '(programConfig || {positions:[]})');

// Fix API success parsing block
const oldSubmitHandlerBody = c.substring(c.indexOf('const res = await fetch'), c.indexOf('} catch (error: any) {'));
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
          setFormStatus('success');
          setFormMessage(data.data?.referenceNumber || 'Unknown');
        } else {
          setFormStatus('error');
          setFormMessage(data.error?.message || 'We could not confirm your submission. Please do not resubmit yet. Check your application status or try again after verification.');
        }
`;
c = c.replace(oldSubmitHandlerBody, newSubmitHandlerBody);

fs.writeFileSync(file, c);
