const fs = require('fs');
const filePath = 'frontend/src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx';
let c = fs.readFileSync(filePath, 'utf8');

c = c.replace(/<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-roboto">\s*<div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row min-h-\[600px\]">/, 
`<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 md:p-8 font-roboto">
      <div className="w-full max-w-4xl mb-8 text-center mt-12 md:mt-4">
        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-stone-900 mb-3">
          Entity Evaluation &amp; Verification
        </h1>
        <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto font-medium">
          KHCRF 16-Step Assessment Application
        </p>
      </div>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">`);

fs.writeFileSync(filePath, c);
console.log('Fixed header regex');
