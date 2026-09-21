const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/become-a-fellow/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const submitIdx = c.indexOf('const handleSubmit = async (e: React.FormEvent) => {');
const catchIdx = c.indexOf('} catch (err: any) {', submitIdx);

const newSubmit = `const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.consent || !formData.position || !formData.statement || !cvFile) {
      setFormStatus('error');
      setFormMessage('Please fill all required fields and accept the consent.');
      return;
    }
    setFormStatus('submitting');
    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, typeof value === 'boolean' ? String(value) : value);
      });
      if (cvFile) submitData.append('cvFile', cvFile);
      if (portfolioFile) submitData.append('portfolioFile', portfolioFile);

      const res = await fetch('/api/backend/skc/fellowships/register', {
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
      } else if (res.status === 409 || data.status === 'already_submitted' || data.data?.status === 'already_submitted') {
        setFormStatus('success'); // Warning UI handled as success for now
        setFormMessage(data.data?.referenceNumber || data.data?.data?.referenceNumber || 'Unknown');
      } else if (res.status === 413 || (res.status === 500 && data.message === 'File too large')) {
        setFormStatus('error');
        setFormMessage('File too large. Maximum size is 5MB.');
      } else if (res.status === 415 || (res.status === 500 && data.message === 'Only PDF files are allowed')) {
        setFormStatus('error');
        setFormMessage('Invalid file type. Only PDFs are allowed.');
      } else if (res.status === 400 && data.error?.message) {
        setFormStatus('error');
        setFormMessage(data.error.message);
      } else if (res.status === 403 && data.error?.message) {
        setFormStatus('error');
        setFormMessage(data.error.message);
      } else {
        setFormStatus('error');
        setFormMessage('We could not confirm your submission. Please check your application status before submitting again.');
      }
`;

c = c.substring(0, submitIdx) + newSubmit + c.substring(catchIdx);

fs.writeFileSync(file, c);
