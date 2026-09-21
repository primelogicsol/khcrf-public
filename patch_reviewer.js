const fs = require('fs');
const path = require('path');

const targetPath = path.resolve('frontend/src/app/dashboard/business/evaluations/[id]/page.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Add interfaces
content = content.replace(
  'interface EvaluationDetail {',
  `interface EvaluationEvidenceFactor {
  factorCode: string;
}

interface EvaluationEvidence {
  id: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  uploadedAt: string;
  factors: EvaluationEvidenceFactor[];
}

interface EvaluationDetail {
  trackingId?: string;
  caseStatus?: string;
  evidence?: EvaluationEvidence[];
`
);

// 2. Add factor mapping near top of component
content = content.replace(
  'const [evaluation, setEvaluation] = useState<EvaluationDetail | null>(null);',
  `const factorLabels: Record<string, string> = {
  AUTHENTICITY_PROVENANCE: "Authenticity & Provenance",
  CHILD_LABOUR_SAFEGUARDS: "Child-Labour Safeguards",
  FAIR_WAGE_PRACTICE: "Fair Wage Practice",
  ENVIRONMENTAL_SUSTAINABILITY: "Environmental Sustainability"
};
const formatFactor = (code: string) => factorLabels[code] || code.replace(/_/g, ' ').replace(/\\w\\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

  const [evaluation, setEvaluation] = useState<EvaluationDetail | null>(null);`
);

// 3. Update header for KHCRF
content = content.replace(
  '<h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">',
  `{evaluation.evaluationType === "KHCRF_16_STEP" && (
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase">
                KHCRF ENTITY EVALUATION & VERIFICATION
              </h1>
            )}
            {evaluation.evaluationType !== "KHCRF_16_STEP" && (
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">`
);
content = content.replace(
  'Business Evaluation Details\\n            </h1>',
  'Business Evaluation Details\\n            </h1>\\n            )}'
);

content = content.replace(
  '<p className="text-gray-500">',
  `{evaluation.evaluationType === "KHCRF_16_STEP" ? (
              <p className="text-gray-500 font-medium">
                Tracking ID: <span className="font-bold text-gray-900">{evaluation.trackingId || "N/A"}</span>
                <span className="mx-2">•</span>
                Case Status: <span className="font-bold text-brand-primary">{evaluation.caseStatus || "N/A"}</span>
              </p>
            ) : (
              <p className="text-gray-500">`
);

content = content.replace(
  '{new Date(evaluation.createdAt).toLocaleDateString()}\\n            </p>',
  '{new Date(evaluation.createdAt).toLocaleDateString()}\\n            </p>\\n            )}'
);

// 4. Update the Submitted Documents section
content = content.replace(
  '{/* Submitted Documents */}\n      {evaluation.listing && (',
  `{/* EVIDENCE & SUPPORTING DOCUMENTS - KHCRF 16 STEP */}
      {evaluation.evaluationType === 'KHCRF_16_STEP' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 animate-fade-in-up">
          <h3 className="text-xl font-bold mb-6 text-gray-900 border-b pb-2 flex items-center gap-2">
            <FaClipboardCheck data-ui-icon className="text-sm" />{" "}
            EVIDENCE & SUPPORTING DOCUMENTS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {evaluation.evidence && evaluation.evidence.map(ev => (
              <div key={ev.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="pr-2">
                    <div className="font-bold text-gray-900 truncate max-w-[200px]" title={ev.originalFilename}>{ev.originalFilename}</div>
                    <div className="text-xs text-gray-500 mt-1">{ev.mimeType} • {(ev.fileSize / 1024).toFixed(1)} KB</div>
                    <div className="text-xs text-gray-400 mt-1">Uploaded: {new Date(ev.uploadedAt).toLocaleDateString()}</div>
                  </div>
                  <a
                    href={\`/api/evaluation/\${evaluation.id}/evidence/\${ev.id}/file\`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-brand-primary text-white text-xs font-bold rounded-lg hover:bg-brand-secondary transition-colors shrink-0 flex items-center gap-1"
                  >
                    View Evidence
                  </a>
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase mb-2 mt-4">Supported Factors:</div>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                  {ev.factors && ev.factors.map((f: any) => (
                    <li key={f.factorCode}>{formatFactor(f.factorCode)}</li>
                  ))}
                </ul>
              </div>
            ))}
            {(!evaluation.evidence || evaluation.evidence.length === 0) && (
              <div className="col-span-2 text-gray-500 italic p-4 text-center border border-dashed border-gray-200 rounded-xl">
                No evidence documents uploaded.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Submitted Documents (Legacy) */}
      {evaluation.evaluationType !== 'KHCRF_16_STEP' && evaluation.listing && (`
);

// 5. Wrap the Answers section map with KHCRF check to avoid rendering EVALUATION_QUESTIONS mismatch for KHCRF answers
content = content.replace(
  'const qIndex = parseInt(questionId, 10);',
  `// In KHCRF_16_STEP, answers are plain keys, not indices to EVALUATION_QUESTIONS array
                if (evaluation.evaluationType === "KHCRF_16_STEP") {
                  return (
                    <div
                      key={questionId}
                      className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                    >
                      <h4 className="font-bold text-gray-800 mb-2 leading-relaxed">
                        <span className="space-y-1 block">
                          <span data-editorial-accent-text className="text-xs uppercase tracking-wider block font-bold mb-1">
                            {formatFactor(questionId)}
                          </span>
                        </span>
                      </h4>
                      <div className="text-gray-600 flex flex-col gap-2 mt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700 bg-white border border-gray-200 px-3 py-1 rounded-lg shadow-sm">
                            {String(answer)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }

                const qIndex = parseInt(questionId, 10);`
);

fs.writeFileSync(targetPath, content);
console.log("Done patching page.tsx");
