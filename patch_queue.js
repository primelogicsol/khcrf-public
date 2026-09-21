const fs = require('fs');
const path = require('path');

const targetPath = path.resolve('frontend/src/app/dashboard/business/evaluations/page.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// Add evaluationType to EvaluationSubmission interface
content = content.replace(
  'status: string;',
  'status: string;\n  evaluationType: string;\n  caseStatus: string;\n  trackingId: string;\n  _count?: { evidence: number };'
);

// Add state for typeFilter
content = content.replace(
  'const [scoreTierFilter, setScoreTierFilter] = useState("ALL");',
  'const [scoreTierFilter, setScoreTierFilter] = useState("ALL");\n  const [typeFilter, setTypeFilter] = useState("KHCRF_16_STEP");'
);

// Update fetch to use typeFilter
content = content.replace(
  'const response = await api.get("/evaluation");',
  'const response = await api.get(`/evaluation?evaluationType=${typeFilter}`);'
);
content = content.replace(
  'fetchEvaluations();\n  }, []);',
  'fetchEvaluations();\n  }, [typeFilter]);'
);

// Add Type toggle to UI before the search bar
content = content.replace(
  '<input\n        type="text"\n        placeholder="Search business or applicant..."',
  `<div className="flex gap-2">
          <button
            className={\`px-4 py-2 rounded-lg text-sm font-bold \${typeFilter === 'KHCRF_16_STEP' ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}\`}
            onClick={() => setTypeFilter('KHCRF_16_STEP')}
          >
            KHCRF Verification Cases
          </button>
          <button
            className={\`px-4 py-2 rounded-lg text-sm font-bold \${typeFilter === 'SELF_ASSESSMENT' ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}\`}
            onClick={() => setTypeFilter('SELF_ASSESSMENT')}
          >
            Legacy Self-Assessments
          </button>
        </div>
        <input
        type="text"
        placeholder="Search business or applicant..."`
);

// Update table to show KHCRF tracking ID and evidence count
content = content.replace(
  '<div className="font-bold text-gray-900">\n                            {evaluation.businessName}\n                          </div>',
  `<div className="font-bold text-gray-900">
                            {evaluation.businessName}
                          </div>
                          {evaluation.evaluationType === 'KHCRF_16_STEP' && (
                            <div className="text-xs text-brand-primary font-bold mt-1">
                              Tracking ID: {evaluation.trackingId || "N/A"}
                            </div>
                          )}`
);

content = content.replace(
  '<div className="text-sm font-bold text-gray-900">\n                          {evaluation.score} pts\n                        </div>',
  `{evaluation.evaluationType === 'KHCRF_16_STEP' ? (
                          <div className="text-sm font-bold text-gray-900">
                            {evaluation._count?.evidence || 0} files
                          </div>
                        ) : (
                          <div className="text-sm font-bold text-gray-900">
                            {evaluation.score} pts
                          </div>
                        )}`
);

content = content.replace(
  '<th className="text-left font-bold text-gray-500 uppercase tracking-wider py-4 px-6 text-xs">\n                      Score\n                    </th>',
  `<th className="text-left font-bold text-gray-500 uppercase tracking-wider py-4 px-6 text-xs">
                      {typeFilter === 'KHCRF_16_STEP' ? 'Evidence' : 'Score'}
                    </th>`
);

content = content.replace(
  '<span\n                            className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[evaluation.status] || "bg-gray-100 text-gray-800"}`}\n                          >\n                            {evaluation.status}\n                          </span>',
  `<span
                            className={\`px-3 py-1 rounded-full text-xs font-bold \${statusColors[evaluation.evaluationType === 'KHCRF_16_STEP' ? evaluation.caseStatus || 'PENDING' : evaluation.status] || "bg-gray-100 text-gray-800"}\`}
                          >
                            {evaluation.evaluationType === 'KHCRF_16_STEP' ? evaluation.caseStatus : evaluation.status}
                          </span>`
);

fs.writeFileSync(targetPath, content);
console.log("Done patching page.tsx");
