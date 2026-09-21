const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/business/evaluations/[id]/page.tsx', 'utf8');

// 1. Add imports
if (!code.includes('getFactorsForEntity')) {
  code = code.replace(
    'import { CERTIFICATION_QUESTIONS } from "@/data/certificationQuestions";',
    `import { CERTIFICATION_QUESTIONS } from "@/data/certificationQuestions";\nimport { getFactorsForEntity, FACTOR_LABELS, EntityType } from "@/data/evaluationRegistry";\nimport { toast } from "react-hot-toast";`
  );
}

// 2. Add properties to interface
if (!code.includes('VerificationFinding')) {
  code = code.replace(
    'interface EvaluationSubmission {',
    `interface EvaluationSubmission {\n  caseStatus?: string;\n  entityType?: string;\n  trackingId?: string;\n  VerificationFinding?: any[];\n  evidence?: any[];`
  );
}

// 3. Add component state and functions
const componentStart = 'export default function EvaluationDetail() {';
const statesAndFunctions = `
  const [isStartingReview, setIsStartingReview] = useState(false);
  const [isCompletingReview, setIsCompletingReview] = useState(false);
  const [findings, setFindings] = useState<Record<string, any>>({});
  const [evidenceSelections, setEvidenceSelections] = useState<Record<string, string[]>>({});
  const [reviewerNotes, setReviewerNotes] = useState<Record<string, string>>({});
  const [savingFactor, setSavingFactor] = useState<string | null>(null);

  useEffect(() => {
    if (evaluation?.VerificationFinding) {
      const f: any = {};
      const es: any = {};
      const rn: any = {};
      evaluation.VerificationFinding.forEach((finding: any) => {
        f[finding.factorKey] = finding.status;
        rn[finding.factorKey] = finding.reviewerNotes || '';
        es[finding.factorKey] = finding.evidence?.map((e: any) => e.evidenceId) || [];
      });
      setFindings(f);
      setEvidenceSelections(es);
      setReviewerNotes(rn);
    }
  }, [evaluation]);

  const handleStartReview = async () => {
    try {
      setIsStartingReview(true);
      await api.post(\`/evaluation/\${id}/start-review\`);
      toast.success("Review started");
      setEvaluation(prev => prev ? { ...prev, caseStatus: 'UNDER_REVIEW' } : null);
    } catch (e: any) {
      toast.error(e.response?.data?.error || "Failed to start review");
    } finally {
      setIsStartingReview(false);
    }
  };

  const handleCompleteReview = async () => {
    try {
      setIsCompletingReview(true);
      const res = await api.post(\`/evaluation/\${id}/complete-review\`, { requireGroundVerification: false });
      toast.success("Review completed: " + res.data.status);
      setEvaluation(prev => prev ? { ...prev, caseStatus: res.data.status } : null);
    } catch (e: any) {
      toast.error(e.response?.data?.error || "Failed to complete review");
    } finally {
      setIsCompletingReview(false);
    }
  };

  const saveFinding = async (factorCode: string) => {
    try {
      setSavingFactor(factorCode);
      await api.put(\`/evaluation/\${id}/findings/\${factorCode}\`, {
        findingStatus: findings[factorCode],
        reviewerNote: reviewerNotes[factorCode],
        evidenceIds: evidenceSelections[factorCode] || []
      });
      toast.success("Finding saved");
    } catch (e: any) {
      toast.error(e.response?.data?.error || "Failed to save finding");
    } finally {
      setSavingFactor(null);
    }
  };

  const toggleEvidence = (factorCode: string, evidenceId: string) => {
    setEvidenceSelections(prev => {
      const current = prev[factorCode] || [];
      if (current.includes(evidenceId)) return { ...prev, [factorCode]: current.filter(id => id !== evidenceId) };
      return { ...prev, [factorCode]: [...current, evidenceId] };
    });
  };

  const requiredFactors = evaluation?.entityType ? getFactorsForEntity(evaluation.entityType as any) : getFactorsForEntity('BUSINESS');
  const resolvedCount = requiredFactors.filter(f => findings[f]).length;
  const isEditable = evaluation?.caseStatus === 'UNDER_REVIEW' || evaluation?.caseStatus === 'GROUND_VERIFICATION_REQUIRED';

`;

if (!code.includes('handleStartReview')) {
  code = code.replace(
    'export default function EvaluationDetail() {',
    componentStart + statesAndFunctions
  );
}

// 4. Inject UI
const reviewerUI = `

        {/* Phase 2 Reviewer UI */}
        {evaluation.evaluationType === 'KHCRF_16_STEP' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8">
            <div className="bg-blue-900 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-white text-lg">VERIFICATION FINDINGS</h3>
                <p className="text-blue-100 text-sm">Tracking ID: {evaluation.trackingId} | Status: {evaluation.caseStatus}</p>
                <p className="text-blue-200 text-xs mt-1">Applicable Factors: {requiredFactors.length} | Resolved: {resolvedCount}</p>
              </div>
              {evaluation.caseStatus === 'SUBMITTED' && (
                <button 
                  onClick={handleStartReview}
                  disabled={isStartingReview}
                  className="bg-white text-blue-900 px-4 py-2 rounded font-bold shadow-sm"
                >
                  {isStartingReview ? 'Starting...' : 'Start Verification Review'}
                </button>
              )}
              {evaluation.caseStatus === 'UNDER_REVIEW' && (
                <button 
                  onClick={handleCompleteReview}
                  disabled={isCompletingReview}
                  className="bg-green-500 text-white px-4 py-2 rounded font-bold shadow-sm"
                >
                  {isCompletingReview ? 'Completing...' : 'Complete Verification'}
                </button>
              )}
            </div>

            {(evaluation.caseStatus !== 'SUBMITTED' && evaluation.caseStatus !== 'DRAFT') && (
              <div className="p-6 space-y-8 bg-gray-50">
                {evaluation.caseStatus === 'GROUND_VERIFICATION_REQUIRED' && (
                  <div className="bg-orange-100 text-orange-800 p-4 rounded-lg font-bold">
                    GROUND VERIFICATION REQUIRED
                  </div>
                )}
                {requiredFactors.map(factor => (
                  <div key={factor} className="bg-white border p-4 rounded-lg shadow-sm">
                    <h4 className="font-bold text-lg mb-2">{FACTOR_LABELS[factor] || factor}</h4>
                    <div className="text-sm text-gray-600 mb-4 bg-gray-50 p-2 rounded">
                      <strong>Applicant Response: </strong> {evaluation.answers[factor] || 'Not answered'}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-sm block mb-1">Reviewer Finding</label>
                        <select 
                          className="w-full border p-2 rounded"
                          value={findings[factor] || ''}
                          onChange={e => setFindings(prev => ({...prev, [factor]: e.target.value}))}
                          disabled={!isEditable}
                        >
                          <option value="">Select...</option>
                          <option value="VERIFIED">VERIFIED</option>
                          <option value="PARTIALLY_VERIFIED">PARTIALLY_VERIFIED</option>
                          <option value="NOT_VERIFIED">NOT_VERIFIED</option>
                          <option value="INSUFFICIENT_EVIDENCE">INSUFFICIENT_EVIDENCE</option>
                          <option value="NOT_APPLICABLE">NOT_APPLICABLE</option>
                          <option value="GROUND_VERIFIED">GROUND_VERIFIED</option>
                          <option value="MORE_EVIDENCE_REQUIRED">MORE_EVIDENCE_REQUIRED</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-sm block mb-1">Evidence Relied Upon</label>
                        <div className="space-y-1 max-h-32 overflow-y-auto border p-2 rounded text-sm">
                          {evaluation.evidence?.filter((e: any) => e.factors.some((f: any) => f.factorCode === factor)).map((e: any) => (
                            <label key={e.id} className="flex items-center gap-2">
                              <input 
                                type="checkbox" 
                                checked={(evidenceSelections[factor] || []).includes(e.id)}
                                onChange={() => toggleEvidence(factor, e.id)}
                                disabled={!isEditable}
                              />
                              {e.originalFilename}
                            </label>
                          )) || <span className="text-gray-400">No evidence mapped</span>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="font-bold text-sm block mb-1">Reviewer Notes</label>
                      <textarea 
                        className="w-full border p-2 rounded text-sm"
                        value={reviewerNotes[factor] || ''}
                        onChange={e => setReviewerNotes(prev => ({...prev, [factor]: e.target.value}))}
                        disabled={!isEditable}
                      />
                    </div>

                    {isEditable && (
                      <button 
                        onClick={() => saveFinding(factor)}
                        disabled={savingFactor === factor || !findings[factor]}
                        className="mt-4 bg-brand-primary text-white px-4 py-2 rounded text-sm font-bold disabled:opacity-50"
                      >
                        {savingFactor === factor ? 'Saving...' : 'Save Finding'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

`;

if (!code.includes('Phase 2 Reviewer UI')) {
  code = code.replace(
    /<\/div>\s*<\/div>\s*<\/div>\s*\);\s*}\s*$/g,
    reviewerUI + '\n      </div>\n    </div>\n  </div>\n  );\n}'
  );
}

fs.writeFileSync('src/app/dashboard/business/evaluations/[id]/page.tsx', code);
console.log('UI Patch Applied!');
