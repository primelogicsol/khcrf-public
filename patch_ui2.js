const fs = require('fs');
let c = fs.readFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/become-a-fellow/page.tsx', 'utf8');

const regex = /\{formMessage && \(\s*<div className=\{\`p-4 rounded-xl mb-4 \$\{formStatus === 'error' \? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'\}\`\}>\s*\{formMessage\}\s*<\/div>\s*\)\}/g;

const newUI = `{formStatus === 'error' && (
  <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-bold mb-6">
    {formMessage}
  </div>
)}
{formStatus === 'success' && (
  <div className="bg-green-50 p-8 rounded-2xl border border-green-200 mb-6">
    <div className="flex items-center text-green-800 mb-4">
      <FaCheckCircle className="text-3xl mr-3" />
      <h3 className="text-2xl font-bold">
        {formMessage && formMessage.includes('{') ? (JSON.parse(formMessage).duplicate ? 'APPLICATION ALREADY RECEIVED' : 'APPLICATION SUBMITTED') : 'APPLICATION SUBMITTED'}
      </h3>
    </div>
    <div className="bg-white p-6 rounded-xl border border-green-100 mb-6">
      <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Application Reference</p>
      <p className="text-2xl font-mono text-gray-900 mb-4">{formMessage && formMessage.includes('{') ? JSON.parse(formMessage).ref : formMessage}</p>
    </div>
    <p className="text-green-800 font-medium">Please retain this reference for future correspondence.</p>
  </div>
)}`;

c = c.replace(regex, newUI);
fs.writeFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/become-a-fellow/page.tsx', c);
