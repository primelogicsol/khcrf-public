const fs = require('fs');
let code = fs.readFileSync('src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', 'utf8');

// 1. Add new state variables
code = code.replace(
  'const [validationErrors, setValidationErrors] = useState<{ missingIds: string[], missingMsg: string } | null>(null);',
  `const [validationErrors, setValidationErrors] = useState<{ missingIds: string[], missingMsg: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const [replacingId, setReplacingId] = useState<string | null>(null);`
);

// 2. Update handleUploadEvidence
const newUploadHandler = `  const handleUploadEvidence = async (file: File, factorCode: string, replaceId?: string) => {
    if (!evaluationId) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast("File exceeds 10MB limit", "error");
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(p => p >= 90 ? 90 : p + 10);
    }, 200);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("factorCode", factorCode);
    
    try {
      const res = await api.post(\`/evaluation/\${evaluationId}/evidence\`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (res.data?.success) {
        // If it's a replacement, delete the old one
        if (replaceId) {
          try {
            await api.delete(\`/evaluation/\${evaluationId}/evidence/\${replaceId}\`);
            setEvidenceList(prev => prev.filter(e => e.evidenceId !== replaceId));
          } catch (delError) {
            console.error("Failed to delete old evidence during replacement", delError);
          }
          setReplacingId(null);
        }
        
        // Ensure safe metadata is what's used
        const newEvidence = {
          ...res.data.evidence,
          originalFilename: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
          status: 'Uploaded',
        };
        
        setEvidenceList(prev => [...prev, newEvidence]);
        setTimeout(() => setIsUploading(false), 500);
      } else {
        throw new Error("Upload failed");
      }
    } catch (e: any) {
      clearInterval(progressInterval);
      setIsUploading(false);
      setUploadProgress(0);
      showToast(e.response?.data?.message || "Failed to upload evidence", "error");
    }
  };`;

code = code.replace(
  /const handleUploadEvidence = async \([\s\S]*?catch \(e: any\) \{[\s\S]*?\}\s*\};/,
  newUploadHandler
);

// 3. Update the UI rendering of Evidence
const oldEvidenceRendering = /<div className="mb-8">[\s\S]*?<h4 className="font-bold text-stone-900 mb-4">Uploaded Evidence & Factor Support<\/h4>[\s\S]*?\}\)\(\)\}/;

const newEvidenceRendering = `<div className="mb-8">
                  <h4 className="font-bold text-stone-900 mb-4">Upload New Evidence</h4>
                  <div className="bg-white p-6 border border-gray-200 rounded-lg">
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-stone-700 mb-2">Select Factors Supported by this Document:</label>
                      <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded bg-gray-50">
                        {factors.map(f => (
                          <label key={f} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={uploadTags.includes(f)}
                              onChange={(e) => {
                                if (e.target.checked) setUploadTags([...uploadTags, f]);
                                else setUploadTags(uploadTags.filter(t => t !== f));
                              }}
                              className="text-brand-primary rounded focus:ring-brand-primary"
                            />
                            <span className="text-sm text-stone-700">{FACTOR_LABELS[f] || f}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {isUploading ? (
                      <div className="border-2 border-gray-200 rounded-lg p-6 text-center bg-gray-50">
                        <div className="font-medium text-stone-700 mb-2">Uploading...</div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                          <div className="bg-brand-primary h-2.5 rounded-full transition-all duration-200" style={{ width: \`\${uploadProgress}%\` }}></div>
                        </div>
                        <div className="text-xs text-stone-500">{uploadProgress}% Complete</div>
                      </div>
                    ) : (
                      <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                        <input 
                          type="file" 
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              if (uploadTags.length === 0) {
                                showToast("Please select at least one factor to tag this evidence", "error");
                                e.target.value = '';
                                return;
                              }
                              handleUploadEvidence(e.target.files[0], uploadTags.join(','));
                              setUploadTags([]);
                              e.target.value = '';
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center gap-2 pointer-events-none">
                          <FaUpload className="text-xl text-stone-400" />
                          <span className="font-medium text-stone-700 text-sm">Click to upload or drag and drop</span>
                          <span className="text-xs text-stone-500">Tag factors above, then select a file to upload. PDF, JPG, PNG up to 10MB</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-stone-900 mb-4">Uploaded Evidence & Factor Support</h4>
                  
                  <div className="space-y-4 mb-8">
                    {evidenceList.length === 0 ? (
                      <p className="text-sm text-stone-500 italic bg-gray-50 p-4 rounded border">No evidence uploaded yet.</p>
                    ) : (
                      evidenceList.map(e => (
                        <div key={e.evidenceId} className="flex flex-col p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 text-green-800">
                              <FaCheck className="mt-1 flex-shrink-0" />
                              <div>
                                <p className="font-bold text-sm text-stone-900 break-all">{e.originalFilename || e.filename}</p>
                                <p className="text-xs text-stone-500 mt-1 uppercase tracking-wide">
                                  {e.mimeType?.split('/')[1] || 'FILE'} &middot; {(e.sizeBytes ? (e.sizeBytes / 1024 / 1024).toFixed(2) : '0.00')} MB
                                </p>
                                <div className="mt-2 text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded inline-block">
                                  Uploaded
                                </div>
                                <div className="mt-3">
                                  <span className="text-xs text-stone-600 font-bold block mb-1">Supports:</span>
                                  <ul className="text-xs text-stone-700 space-y-1">
                                    {e.factorCode?.split(',').map((code: string) => (
                                      <li key={code} className="flex items-center gap-1"><FaCheck className="text-[10px] text-green-500"/> {FACTOR_LABELS[code] || code}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-3 border-t border-green-200 flex items-center justify-end gap-3 text-xs font-bold">
                            {replacingId === e.evidenceId ? (
                              <div className="relative overflow-hidden cursor-pointer text-brand-primary hover:underline">
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf,.jpg,.jpeg,.png" onChange={(evt) => {
                                  if (evt.target.files?.[0]) {
                                    handleUploadEvidence(evt.target.files[0], e.factorCode, e.evidenceId);
                                  }
                                }} />
                                Select New File...
                              </div>
                            ) : (
                              <button onClick={() => setReplacingId(e.evidenceId)} className="text-stone-600 hover:text-stone-900 transition-colors">
                                [Replace]
                              </button>
                            )}

                            {confirmRemoveId === e.evidenceId ? (
                              <div className="flex items-center gap-2 bg-red-50 text-red-700 px-2 py-1 rounded">
                                <span>Are you sure?</span>
                                <button onClick={() => handleDeleteEvidence(e.evidenceId)} className="hover:underline">Yes</button>
                                <span>/</span>
                                <button onClick={() => setConfirmRemoveId(null)} className="hover:underline">No</button>
                              </div>
                            ) : (
                              <button onClick={() => setConfirmRemoveId(e.evidenceId)} className="text-red-500 hover:text-red-700 transition-colors">
                                [Remove]
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {(() => {
                    const supportedFactors = factors.filter(f => evidenceList.some(e => e.factorCode && e.factorCode.includes(f)));
                    const unsupportedFactors = factors.filter(f => !supportedFactors.includes(f));
                    
                    return (
                      <div className="bg-stone-50 p-6 border rounded-lg">
                        <div className="mb-4">
                          <h4 className="font-playfair font-bold text-xl text-stone-900 mb-1">Evidence Package</h4>
                          <p className="text-sm font-medium text-stone-700">{evidenceList.length} file{evidenceList.length !== 1 ? 's' : ''} uploaded</p>
                          <p className="text-sm text-stone-500">Supporting {supportedFactors.length} of {factors.length} verification factors</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-200">
                          <div>
                            <h5 className="text-sm font-bold text-green-700 mb-2">Strongly supported</h5>
                            {supportedFactors.length === 0 ? <p className="text-xs text-stone-500">None</p> : (
                              <ul className="text-xs text-stone-700 space-y-2">
                                {supportedFactors.map(f => <li key={f} className="flex items-start gap-2"><FaCheck className="text-green-500 mt-0.5" />{FACTOR_LABELS[f] || f}</li>)}
                              </ul>
                            )}
                          </div>
                          <div>
                            <h5 className="text-sm font-bold text-amber-600 mb-2">Additional evidence recommended</h5>
                            {unsupportedFactors.length === 0 ? <p className="text-xs text-stone-500">None</p> : (
                              <ul className="text-xs text-stone-700 space-y-2">
                                {unsupportedFactors.map(f => {
                                  const req = getFactorCriteria(entityType as EntityType, roleInValueChain, craftType, f).evidenceRequirement === 'REQUIRED';
                                  return <li key={f} className={\`flex items-start gap-2 \${req ? 'text-red-600 font-bold' : ''}\`}><span className="text-stone-400 mt-0.5">○</span>{FACTOR_LABELS[f] || f}{req ? " (Required)" : ""}</li>
                                })}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}`;

code = code.replace(oldEvidenceRendering, newEvidenceRendering);

fs.writeFileSync('src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', code);
console.log("Upload logic patched.");
