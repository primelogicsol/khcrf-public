const fs = require('fs');
let c = fs.readFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/become-a-fellow/page.tsx', 'utf8');

const newSubmit = `  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setFieldErrors({});
    
    // Explicit client-side file size and type validation
    if (!cvFile) {
        setFormStatus('idle');
        setFieldErrors({ cv: 'CV file is required (PDF only).' });
        return;
    }
    if (cvFile.type !== 'application/pdf') {
        setFormStatus('idle');
        setFieldErrors({ cv: 'Invalid file type. Only PDFs are allowed.' });
        return;
    }
    if (cvFile.size > 5 * 1024 * 1024) {
        setFormStatus('idle');
        setFieldErrors({ cv: 'CV exceeds the 5 MB limit. Please upload a smaller PDF.' });
        return;
    }

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, typeof value === 'boolean' ? String(value) : value);
      });
      submitData.append('cvFile', cvFile);
      if (portfolioFile) submitData.append('portfolioFile', portfolioFile);

      const res = await fetch('/api/backend/skc/fellowships/register', {
        method: 'POST',
        body: submitData
      });
      const data = await res.json();
      
      if (res.status === 201 && data.status === 'success') {
        setFormStatus('success');
        setFormMessage(JSON.stringify({ ref: data.data?.referenceNumber, pos: data.data?.position, time: data.data?.submittedAt, duplicate: false }));
      } else if (res.status === 409 || data.status === 'already_submitted') {
        setFormStatus('success');
        setFormMessage(JSON.stringify({ ref: data.data?.referenceNumber || 'ALREADY_RECEIVED', duplicate: true }));
      } else if (res.status === 413 || data.error?.code === 'CV_FILE_TOO_LARGE') {
        setFormStatus('idle');
        setFieldErrors({ cv: 'CV exceeds the 5 MB limit. Please upload a smaller PDF.' });
      } else if (res.status === 415 || data.error?.code === 'CV_INVALID_TYPE') {
        setFormStatus('idle');
        setFieldErrors({ cv: 'Invalid file type. Only PDFs are allowed.' });
      } else if (res.status === 400 && data.error?.code === 'CV_REQUIRED') {
        setFormStatus('idle');
        setFieldErrors({ cv: 'CV file is required (PDF only).' });
      } else if (res.status === 400 && data.error?.code === 'POSITION_INVALID') {
        setFormStatus('idle');
        setFieldErrors({ position: data.error.message });
      } else if (res.status === 403 || data.error?.code === 'APPLICATIONS_CLOSED') {
        setFormStatus('error');
        setFormMessage(data.error?.message || 'Applications are currently closed.');
      } else {
        setFormStatus('error');
        setFormMessage('We could not confirm your submission. Please check your application status before trying again.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setFormStatus('error');
      setFormMessage('We could not confirm your submission. Please check your application status before trying again.');
    }
  };`;

// We replace the handleSubmit function block.
c = c.replace(/const handleSubmit = async \(e: React\.FormEvent\) => \{[\s\S]*?catch \(err: any\) \{[\s\S]*?\}\n  \};/, newSubmit);

// We need to add fieldErrors state if it's missing
if (!c.includes('const [fieldErrors')) {
    c = c.replace(/const \[formMessage, setFormMessage\] = useState\(''\);/, `const [formMessage, setFormMessage] = useState('');\n  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});`);
}

// Ensure the CV error message renders
if (!c.includes('{fieldErrors.cv && <p className="text-red-500 text-xs mt-2 font-medium">{fieldErrors.cv}</p>}')) {
    c = c.replace(/<input\s+type="file"\s+accept="\.pdf"\s+required\s+onChange=\{\(e\) => setCvFile\(e\.target\.files\?\.\[0\] \|\| null\)\}\s+className="w-full text-sm"\s+\/>/, 
`<input type="file" accept=".pdf" required onChange={(e) => setCvFile(e.target.files?.[0] || null)} className={\`w-full text-sm \${fieldErrors.cv ? 'border-red-500 text-red-500' : ''}\`} />
{fieldErrors.cv && <p className="text-red-500 text-xs mt-2 font-medium">{fieldErrors.cv}</p>}`);
}

// Re-map the success UI to the specified values
if (!c.includes('APPLICATION SUBMITTED')) {
    c = c.replace(/<h3 className=\"text-2xl font-bold\">.*?<\/h3>/, `<h3 className="text-2xl font-bold">{JSON.parse(formMessage).duplicate ? 'APPLICATION ALREADY RECEIVED' : 'APPLICATION SUBMITTED'}</h3>`);
}

fs.writeFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/become-a-fellow/page.tsx', c);
