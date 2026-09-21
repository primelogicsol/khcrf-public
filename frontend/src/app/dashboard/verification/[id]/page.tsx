"use client";

import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { useParams, useRouter } from 'next/navigation';

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('An error occurred while fetching the data.');
  return res.json();
});

export default function VerificationReviewWorkspace() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  
  const { data: verificationData, error, isLoading } = useSWR(id ? `/api/verification/${id}` : null, fetcher);

  const [savingFactor, setSavingFactor] = useState<string | null>(null);

  const startReview = async () => {
    try {
      await fetch(`/api/verification/${id}/start`, { method: 'POST' });
      mutate(`/api/verification/${id}`);
    } catch (e) {
      console.error(e);
      alert('Failed to start review');
    }
  };

  const completeVerification = async () => {
    try {
      await fetch(`/api/verification/${id}/complete`, { method: 'POST' });
      mutate(`/api/verification/${id}`);
    } catch (e) {
      console.error(e);
      alert('Failed to complete verification');
    }
  };

  const verifyFactor = async (factorKey: string, payload: any) => {
    setSavingFactor(factorKey);
    try {
      await fetch(`/api/verification/${id}/factors/${factorKey}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      mutate(`/api/verification/${id}`);
    } catch (e) {
      console.error(e);
      alert('Failed to verify factor');
    } finally {
      setSavingFactor(null);
    }
  };

  if (isLoading) return <div className="p-8">Loading workspace...</div>;
  if (error) return <div className="p-8 text-red-600">Failed to load verification case.</div>;
  if (!verificationData) return <div className="p-8">No data found.</div>;

  const caseInfo = verificationData;
  const factors = caseInfo.factors || [];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Verification Review Workspace</h1>
        <div className="space-x-4">
          <button onClick={() => router.back()} className="px-4 py-2 border rounded">Back</button>
          {caseInfo.caseStatus === 'RECEIVED_FROM_CRAFTLORE' && (
            <button onClick={startReview} className="px-4 py-2 bg-blue-600 text-white rounded">
              Start Review
            </button>
          )}
          {caseInfo.caseStatus === 'UNDER_REVIEW' && (
            <button onClick={completeVerification} className="px-4 py-2 bg-green-600 text-white rounded">
              Complete Verification
            </button>
          )}
        </div>
      </div>

      {/* Case Details */}
      <div className="bg-white border rounded-lg shadow-sm p-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div>
          <p className="text-sm text-gray-500 font-semibold uppercase">Verification ID</p>
          <p className="font-mono text-gray-900">{caseInfo.trackingId || caseInfo.id}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 font-semibold uppercase">Entity</p>
          <p className="font-semibold text-gray-900">{caseInfo.businessName || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 font-semibold uppercase">Entity Type</p>
          <p className="text-gray-900">{caseInfo.entityType || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 font-semibold uppercase">Origin</p>
          <p className="text-gray-900">{caseInfo.origin || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 font-semibold uppercase">Revision</p>
          <p className="text-gray-900">{caseInfo.currentRevision || 1}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 font-semibold uppercase">Craftlore PTS</p>
          <p className="text-gray-900">{caseInfo.selfReportedPts || 0}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 font-semibold uppercase">Status</p>
          <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium mt-1 ${
            caseInfo.caseStatus === 'RECEIVED_FROM_CRAFTLORE' ? 'bg-blue-100 text-blue-800' :
            caseInfo.caseStatus === 'UNDER_REVIEW' ? 'bg-yellow-100 text-yellow-800' :
            caseInfo.caseStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {caseInfo.caseStatus === 'RECEIVED_FROM_CRAFTLORE' ? 'Received from Craftlore' :
             caseInfo.caseStatus === 'UNDER_REVIEW' ? 'Under Review' :
             caseInfo.caseStatus || 'Unknown'}
          </span>
        </div>
      </div>

      {/* Factors */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mt-8">Evaluation Factors</h2>
        {factors.length === 0 ? (
          <p className="text-gray-500 italic">No factors found for this case.</p>
        ) : (
          factors.map((factor: any) => (
            <FactorReviewCard 
              key={factor.factorKey} 
              factor={factor} 
              onVerify={(payload) => verifyFactor(factor.factorKey, payload)}
              isSaving={savingFactor === factor.factorKey}
              readOnly={caseInfo.caseStatus !== 'UNDER_REVIEW'}
            />
          ))
        )}
      </div>
    </div>
  );
}

function FactorReviewCard({ factor, onVerify, isSaving, readOnly }: { factor: any, onVerify: (payload: any) => void, isSaving: boolean, readOnly: boolean }) {
  const [verifiedValue, setVerifiedValue] = useState(factor.verifiedValue || factor.selfReportedValue || '');
  const [status, setStatus] = useState(factor.verificationStatus || 'PENDING');
  const [confidence, setConfidence] = useState(factor.confidence || 'HIGH');
  const [notes, setNotes] = useState(factor.reviewerNotes || '');

  const handleSave = () => {
    onVerify({
      verifiedValue,
      status,
      confidence,
      notes
    });
  };

  const handleRequestMoreEvidence = () => {
    onVerify({
      verifiedValue,
      status: 'NEEDS_EVIDENCE',
      confidence,
      notes
    });
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row">
      {/* Applicant Claim - Read Only */}
      <div className="bg-gray-50 p-6 md:w-1/3 border-b md:border-b-0 md:border-r flex flex-col justify-between">
        <div>
          <div className="text-xs font-bold text-gray-500 uppercase mb-1">Applicant Claim</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{factor.factorKey.replace(/_/g, ' ')}</h3>
          <div className="bg-white p-4 border rounded-md shadow-inner text-gray-800 font-medium">
            {factor.selfReportedValue || 'Not Provided'}
          </div>
        </div>
        {factor.evidenceAttached && (
          <div className="mt-4 text-sm text-blue-600 underline cursor-pointer">
            View Attached Evidence
          </div>
        )}
      </div>

      {/* KHCRF Finding - Editable */}
      <div className="p-6 md:w-2/3 space-y-4">
        <div className="text-xs font-bold text-blue-600 uppercase mb-2">KHCRF Finding</div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Verified Value</label>
            <input 
              type="text" 
              className="w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" 
              value={verifiedValue}
              onChange={e => setVerifiedValue(e.target.value)}
              disabled={readOnly}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
            <select 
              className="w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              value={status}
              onChange={e => setStatus(e.target.value)}
              disabled={readOnly}
            >
              <option value="PENDING">Pending</option>
              <option value="VERIFIED">Verified</option>
              <option value="REJECTED">Rejected</option>
              <option value="NEEDS_EVIDENCE">Needs Evidence</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reviewer Confidence</label>
          <div className="flex gap-4">
            {['HIGH', 'MEDIUM', 'LOW'].map((level) => (
              <label key={level} className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name={`confidence-${factor.factorKey}`}
                  value={level} 
                  checked={confidence === level}
                  onChange={() => setConfidence(level)}
                  disabled={readOnly}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{level}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reviewer Notes</label>
          <textarea 
            className="w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" 
            rows={3}
            placeholder="Add internal notes or reasons for requesting more evidence..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            disabled={readOnly}
          ></textarea>
        </div>

        {!readOnly && (
          <div className="flex justify-end space-x-3 pt-2">
            <button 
              onClick={handleRequestMoreEvidence}
              disabled={isSaving}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              Request More Evidence
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Verify Factor'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
