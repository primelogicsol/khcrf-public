const fs = require('fs');
let c = fs.readFileSync('frontend/src/app/dashboard/business/evaluations/[id]/page.tsx', 'utf8');

c = c.replace(
    'const [isCompletingReview, setIsCompletingReview] = useState(false);',
    'const [isCompletingReview, setIsCompletingReview] = useState(false);\n  const [isTransmitting, setIsTransmitting] = useState(false);\n  const [transmissionStatus, setTransmissionStatus] = useState<any>(null);'
);

const transmitFunc = `
  const handleTransmit = async () => {
    try {
      setIsTransmitting(true);
      const res = await api.post(\`/evaluation/\${id}/transmit-craftlore\`);
      toast.success("Transmitted successfully");
      setTransmissionStatus(res.data);
    } catch (e: any) {
      toast.error(e.response?.data?.error || "Transmission failed");
    } finally {
      setIsTransmitting(false);
    }
  };
`;

c = c.replace(
    'const handleCompleteReview = async () => {',
    transmitFunc + '\n  const handleCompleteReview = async () => {'
);

const transmitButton = `
              {evaluation.caseStatus === 'VERIFICATION_COMPLETED' && (
                <div className="flex gap-2">
                  <button 
                    onClick={handleTransmit}
                    disabled={isTransmitting}
                    className="bg-purple-600 text-white px-4 py-2 rounded font-bold shadow-sm"
                  >
                    {isTransmitting ? 'Sending...' : 'Send Verified Result to Craftlore CKTRE'}
                  </button>
                  {transmissionStatus && (
                    <div className="text-white text-xs mt-1">
                      Status: {transmissionStatus.success ? 'ACKNOWLEDGED' : 'FAILED'} <br/>
                      Import ID: {transmissionStatus.importId}
                    </div>
                  )}
                </div>
              )}
`;

c = c.replace(
    '{evaluation.caseStatus === \'UNDER_REVIEW\' && (',
    transmitButton + '\n              {evaluation.caseStatus === \'UNDER_REVIEW\' && ('
);

fs.writeFileSync('frontend/src/app/dashboard/business/evaluations/[id]/page.tsx', c);
console.log('Appended UI transmit button');
