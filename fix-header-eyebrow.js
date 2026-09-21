const fs = require('fs');
const filePath = 'frontend/src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx';
let c = fs.readFileSync(filePath, 'utf8');

c = c.replace(
  /<div className="w-full max-w-4xl mb-8 text-center mt-12 md:mt-4">\s*<h1 className="text-3xl md:text-4xl font-playfair font-bold text-stone-900 mb-3">\s*Entity Evaluation &amp; Verification\s*<\/h1>\s*<p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto font-medium">\s*KHCRF 16-Step Assessment Application\s*<\/p>\s*<\/div>/,
  `<div className="w-full max-w-4xl mb-8 text-center mt-12 md:mt-4">
        <div className="flex flex-col items-center justify-center mb-6">
          <span className="text-[10px] md:text-xs tracking-[0.15em] uppercase font-bold text-stone-500 mb-1">
            CRAFTLORE CKTRE TRADE REGISTRY
          </span>
          <span className="text-xs md:text-sm tracking-widest uppercase font-bold text-brand-primary">
            KASHMIR CRAFT GLOBAL TRADE RANKINGS
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-stone-900 mb-3">
          Entity Evaluation &amp; Verification
        </h1>
        <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto font-medium">
          KHCRF 16-Step Assessment Application
        </p>
      </div>`
);

fs.writeFileSync(filePath, c);
console.log('Fixed header eyebrow text');
