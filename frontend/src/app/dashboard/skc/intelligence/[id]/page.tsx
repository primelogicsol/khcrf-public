"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaArrowLeft, FaDownload, FaFileDownload, FaSpinner, FaExclamationTriangle, FaCheckCircle, FaTags, FaProjectDiagram, FaHistory, FaSave, FaUserTie, FaChartLine, FaFileAlt } from 'react-icons/fa';

import { normalizeConsultation, NormalizedConsultation } from '@/lib/skc/normalizeConsultation';

export default function IntelligenceDetail() {
  const { id } = useParams();
  const [data, setData] = useState<NormalizedConsultation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState("RECEIVED");
  const [internalNotes, setInternalNotes] = useState("");
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => {
    if (id) {
      fetchData(id as string);
    }
  }, [id]);

  const fetchData = async (consultationId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`/api/backend/consultation/${consultationId}`, { credentials: 'include' });
      if (!res.ok) throw new Error(res.status === 404 ? 'Consultation not found.' : 'Failed to fetch data');
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Expected JSON but received ${contentType}. Response preview: ${text.slice(0, 200)}`);
      }
            const rawResult = await res.json();
      const result = (rawResult.status === 'success' && rawResult.data && typeof rawResult.data.success !== 'undefined') ? rawResult.data : rawResult;
      
      if ((result.success || result.status === 'success') && result.data) {
        setData(normalizeConsultation(result.data));
        setStatus(result.data.status || 'RECEIVED');
        setInternalNotes(result.data.internalNotes || '');
        fetchAuditLogs(consultationId);
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (err: any) {
      console.error("Failed to fetch intelligence detail", err);
      setError(err.message || 'Failed to load details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async (consultationId: string) => {
    try {
      
      const res = await fetch(`/api/backend/consultation/${consultationId}/audit-log`, { credentials: 'include' });
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Expected JSON but received ${contentType}. Response preview: ${text.slice(0, 200)}`);
      }
            const rawResult = await res.json();
      const result = (rawResult.status === 'success' && rawResult.data && typeof rawResult.data.success !== 'undefined') ? rawResult.data : rawResult;
      if (result.success || result.status === 'success') {
        setAuditLogs(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch audit logs", err);
    }
  };

  const saveChanges = async () => {
    if (!data) return;
    try {
      setSavingStatus(true);
      
      const res = await fetch(`/api/backend/consultation/${data.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status, internalNote: internalNotes })
      });
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Expected JSON but received ${contentType}. Response preview: ${text.slice(0, 200)}`);
      }
            const rawResult = await res.json();
      const result = (rawResult.status === 'success' && rawResult.data && typeof rawResult.data.success !== 'undefined') ? rawResult.data : rawResult;
      if (result.success || result.status === 'success') {
        fetchAuditLogs(data.id);
      } else {
        alert("Failed to save changes: " + result.error);
      }
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Error saving changes");
    } finally {
      setSavingStatus(false);
    }
  };

  const exportJSON = () => {
    if (!data) return;
    const jsonStr = JSON.stringify(data, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(jsonStr)}`;
    const exportFileDefaultName = `consultation-${data.consultationId || data.id}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <FaSpinner data-ui-icon  className="animate-spin text-4xl " />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <Link href="/dashboard/skc/intelligence" className="text-sm font-bold text-gray-500 hover:text-brand-primary flex items-center gap-2">
          <FaArrowLeft /> Back to Intelligence Graph
        </Link>
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-md flex flex-col items-start gap-3 text-red-700">
          <div className="flex items-center gap-2 text-xl font-bold">
            <FaExclamationTriangle /> Error Loading Detail
          </div>
          <p>{error || 'Data not found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Navigation & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Link href="/dashboard/skc/intelligence" className="text-sm font-bold text-gray-500 hover:text-brand-primary flex items-center gap-2 transition">
          <FaArrowLeft /> Back to Intelligence Graph
        </Link>
        <div className="flex gap-3">
          <button onClick={exportJSON} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-50 transition shadow-sm text-sm">
            <FaFileDownload /> Export JSON
          </button>
        </div>
      </div>

      {/* Header Profile */}
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col lg:flex-row justify-between gap-6">
        <div>
          <div data-editorial-accent-text className="text-xs font-black  uppercase tracking-widest mb-2">ID: {data.consultationId}</div>
          <h1 className="text-3xl font-black text-brand-dark mb-2">{data.displayName}</h1>
          <p className="text-gray-500 font-medium flex items-center gap-2">
            📍 {data.displayDistrict}
            {data.displayCraft !== 'Unknown Craft' && <span>• 🔨 {data.displayCraft}</span>}
            <span>• 📅 {data.submittedDateFormatted}</span>
          </p>
        </div>
        <div className="flex items-center gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div className="text-center">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Score</div>
            <div className="text-3xl font-black text-brand-primary">{data.intelligenceScore}</div>
          </div>
          <div className="text-center border-l border-gray-200 pl-6">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Confidence</div>
            <div className={`text-xl font-black ${data.displayConfidenceLevel === 'High' ? 'text-green-600' : 'text-orange-500'}`}>{data.displayConfidenceLevel}</div>
          </div>
        </div>
      </div>

      {/* Admin Controls */}
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Workflow Status</label>
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm font-bold"
          >
            <option value="RECEIVED">RECEIVED</option>
            <option value="UNDER_REVIEW">UNDER REVIEW</option>
            <option value="NEEDS_CLARIFICATION">NEEDS CLARIFICATION</option>
            <option value="VERIFIED">VERIFIED</option>
            <option value="USED_IN_DRAFT">USED IN DRAFT</option>
            <option value="VALIDATED">VALIDATED</option>
            <option value="USED_IN_FINAL_REPORT">USED IN FINAL REPORT</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Reason / Internal Notes</label>
          <textarea 
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm h-24 resize-none"
            placeholder="Add reason for status change or internal notes here..."
          />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <button 
            onClick={saveChanges} 
            disabled={savingStatus}
            className="px-6 py-2 bg-brand-primary text-white rounded-lg font-bold shadow flex items-center gap-2 hover:bg-brand-primary/90 transition disabled:opacity-50"
          >
            {savingStatus ? <FaSpinner className="animate-spin" /> : <FaSave />} Save Changes
          </button>
        </div>
      </div>

      {/* Visual Status Pipeline */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <h2 className="text-sm font-black text-gray-900 mb-6 uppercase tracking-wider">Assessment Pipeline</h2>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 -translate-y-1/2" />
          {[
            { key: 'RECEIVED', label: 'Received' },
            { key: 'UNDER_REVIEW', label: 'Under Review' },
            { key: 'VERIFIED', label: 'Verified' },
            { key: 'USED_IN_DRAFT', label: 'Used in Draft' },
            { key: 'VALIDATED', label: 'Validated' },
            { key: 'USED_IN_FINAL_REPORT', label: 'Final Report' },
          ].map((step, idx) => {
            const workflowOrder = ['RECEIVED', 'UNDER_REVIEW', 'VERIFIED', 'USED_IN_DRAFT', 'VALIDATED', 'USED_IN_FINAL_REPORT'];
            const currentIndex = workflowOrder.indexOf(data.original?.status || 'RECEIVED');
            const stepIndex = workflowOrder.indexOf(step.key);
            
            const isCompleted = stepIndex < currentIndex;
            const isCurrent = step.key === data.original?.status;
            
            return (
              <div key={step.key} className="flex flex-col items-center gap-2 bg-white px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 
                  ${isCurrent ? 'border-brand-primary bg-brand-primary text-white shadow-lg shadow-brand-primary/30 scale-110 transition-transform' : 
                    isCompleted ? 'border-brand-primary bg-white text-icon-on-light' : 
                    'border-gray-200 bg-gray-50 text-gray-400'}`}>
                  {isCompleted ? <FaCheckCircle /> : idx + 1}
                </div>
                <div className={`text-xs font-bold ${isCurrent ? 'text-brand-primary' : isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
        {['ARCHIVED', 'NEEDS_CLARIFICATION'].includes(data.original?.status) && (
          <div className="mt-6 text-center">
            <span className="inline-block px-4 py-1.5 bg-red-50 text-red-600 font-bold text-xs rounded-full border border-red-100">
              Current Exception State: {data.original.status.replace(/_/g, ' ')}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Semantic Data */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-black text-gray-900 mb-4 border-b border-gray-100 pb-2">AI Narrative Synthesis</h2>
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
              {data.aiNarrative || 'No narrative generated.'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2"><FaTags data-ui-icon  className="" /> Inferred Themes</h2>
              <div className="flex flex-wrap gap-2">
                {data.inferredThemes.length > 0 ? (
                  data.inferredThemes.map((t: string) => (
                    <span key={t} className="text-xs font-bold px-3 py-1.5 bg-brand-primary/10 text-brand-secondary rounded-lg">{t}</span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">None detected.</span>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2"><FaExclamationTriangle className="text-red-500" /> Key Challenges</h2>
              <div className="flex flex-wrap gap-2">
                {data.inferredTags.length > 0 ? (
                  data.inferredTags.map((t: string) => (
                    <span key={t} className="text-xs font-bold px-3 py-1.5 bg-red-50 text-red-700 rounded-lg border border-red-100">{t}</span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">None tagged.</span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
             <h2 className="text-lg font-black text-gray-900 mb-4 border-b border-gray-100 pb-2">Extracted Recommendations</h2>
             <div className="space-y-4">
                <div>
                   <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Government Policy</h3>
                   <p className="text-sm font-medium text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100">{data.governmentRecommendation || 'Not provided.'}</p>
                </div>
                <div>
                   <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Industry Action</h3>
                   <p className="text-sm font-medium text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100">{data.industryRecommendation || 'Not provided.'}</p>
                </div>
              </div>
           </div>

           {/* Submitted Profile */}
           {data.rawConsultationData?.profile && Object.keys(data.rawConsultationData.profile).length > 0 && (
           <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
             <h2 className="text-lg font-black text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2"><FaUserTie data-ui-icon  className="" /> Submitted Profile</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               {Object.entries(data.rawConsultationData.profile).map(([key, val]) => (
                 <div key={key} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                   <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                   <div className="text-sm font-bold text-gray-800 break-words">{String(val || '—')}</div>
                 </div>
               ))}
             </div>
           </div>
           )}

           {/* Situation */}
           {data.rawConsultationData?.situation && Object.keys(data.rawConsultationData.situation).length > 0 && (
           <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
             <h2 className="text-lg font-black text-gray-900 mb-4 border-b border-gray-100 pb-2">Current Situation</h2>
             <div className="space-y-3">
               {Object.entries(data.rawConsultationData.situation).map(([key, val]) => (
                 <div key={key} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                   <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                   <div className="text-sm font-bold text-gray-800">{Array.isArray(val) ? val.join(', ') : String(val || '—')}</div>
                 </div>
               ))}
             </div>
           </div>
           )}

           {/* Challenges */}
           {data.rawConsultationData?.challenges && Object.keys(data.rawConsultationData.challenges).length > 0 && (
           <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
             <h2 className="text-lg font-black text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2"><FaExclamationTriangle className="text-red-500" /> Challenges</h2>
             <div className="space-y-3">
               {Object.entries(data.rawConsultationData.challenges).map(([key, val]) => (
                 <div key={key} className="bg-red-50 p-3 rounded-lg border border-red-100">
                   <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                   <div className="text-sm font-bold text-gray-800">{Array.isArray(val) ? val.join(', ') : String(val || '—')}</div>
                 </div>
               ))}
             </div>
           </div>
           )}

           {/* Opportunities */}
           {data.rawConsultationData?.opportunities && Object.keys(data.rawConsultationData.opportunities).length > 0 && (
           <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
             <h2 className="text-lg font-black text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2"><FaChartLine className="text-green-600" /> Opportunities</h2>
             <div className="space-y-3">
               {Object.entries(data.rawConsultationData.opportunities).map(([key, val]) => (
                 <div key={key} className="bg-green-50 p-3 rounded-lg border border-green-100">
                   <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                   <div className="text-sm font-bold text-gray-800">{typeof val === 'object' && val !== null ? JSON.stringify(val) : Array.isArray(val) ? val.join(', ') : String(val || '—')}</div>
                 </div>
               ))}
             </div>
           </div>
           )}

           {/* Recommendations Detail */}
           {data.rawConsultationData?.recommendations && Object.keys(data.rawConsultationData.recommendations).length > 0 && (
           <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
             <h2 className="text-lg font-black text-gray-900 mb-4 border-b border-gray-100 pb-2">Recommendations Detail</h2>
             <div className="space-y-3">
               {Object.entries(data.rawConsultationData.recommendations).map(([key, val]) => (
                 <div key={key} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                   <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                   <div className="text-sm font-bold text-gray-800 whitespace-pre-wrap">{String(val || '—')}</div>
                 </div>
               ))}
             </div>
           </div>
           )}

         </div>

         {/* Right Column: Meta & Raw */}
         <div className="space-y-8">
           
           <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
             <h2 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2"><FaCheckCircle className="text-green-500" /> Assessment Readiness</h2>
            <div className="space-y-3 text-xs font-bold">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-600">Ready for Draft</span>
                {data.readyForDraft ? <span className="text-green-600">YES</span> : <span className="text-gray-400">NO</span>}
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-600">Ready for Validation</span>
                {data.readyForValidation ? <span className="text-green-600">YES</span> : <span className="text-gray-400">NO</span>}
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-600">Ready for Final Report</span>
                {data.readyForFinalReport ? <span className="text-green-600">YES</span> : <span className="text-gray-400">NO</span>}
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-600">Missing Evidence</span>
                {data.missingEvidence ? <span className="text-red-500 font-black">YES</span> : <span className="text-green-600">NO</span>}
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-600">Needs Clarification</span>
                {data.needsClarification ? <span className="text-orange-500 font-black">YES</span> : <span className="text-green-600">NO</span>}
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">High Policy Value</span>
                {data.highPolicyValue ? <span className="text-brand-primary font-black">YES</span> : <span className="text-gray-400">NO</span>}
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2"><FaProjectDiagram className="text-blue-500" /> Graph Readiness</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="font-bold text-gray-600">Extracted Nodes</span>
                <span className="font-black text-gray-900 px-2 py-0.5 bg-gray-100 rounded">{data.graphNodes.length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="font-bold text-gray-600">Extracted Edges</span>
                <span className="font-black text-gray-900 px-2 py-0.5 bg-gray-100 rounded">{data.graphEdges.length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="font-bold text-gray-600">Evidence Files</span>
                <span className="font-black text-gray-900 px-2 py-0.5 bg-gray-100 rounded">{data.evidenceCount}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2"><FaFileAlt className="text-blue-500" /> Uploaded Evidence</h2>
            {data.evidenceMetadata.length > 0 ? (
              <div className="space-y-3">
                {data.evidenceMetadata.map((file: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3 overflow-hidden min-w-0">
                      <FaFileAlt data-ui-icon  className=" shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">{file.originalName || file.filename}</p>
                        <p className="text-[10px] text-gray-400">
                          {file.fileType} • {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    {file.url ? (
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 px-3 py-1.5 bg-brand-primary text-white text-xs font-bold rounded-lg hover:bg-brand-secondary transition flex items-center gap-1"
                      >
                        <FaDownload /> Open
                      </a>
                    ) : (
                      <span className="shrink-0 text-[10px] text-gray-400 italic">No URL</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No evidence files uploaded.</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-sm font-black text-gray-900 mb-4">Quality Indicators</h2>
            <ul className="space-y-2">
              {data.qualityIndicators?.insights ? (
                Object.entries(data.qualityIndicators.insights).map(([k, v]: [string, any]) => (
                  <li key={k} className="flex justify-between text-xs">
                    <span className="font-bold text-gray-500 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className={`font-black ${v === 'HIGH' ? 'text-brand-primary' : 'text-gray-700'}`}>{v}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-gray-400">No specific indicators generated.</li>
              )}
            </ul>
          </div>

          <div className="bg-brand-dark p-6 rounded-2xl border border-gray-800 shadow-sm text-white">
            <h2 className="text-sm font-black mb-4">Raw Consultation Payload</h2>
            <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 overflow-x-auto max-h-[300px] overflow-y-auto">
              <pre className="text-[10px] text-green-400 font-mono">
                {JSON.stringify(data.rawConsultationData || {}, null, 2)}
              </pre>
            </div>
          </div>

          {/* Audit Timeline */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2"><FaHistory className="text-gray-500" /> Audit Timeline</h2>
            {auditLogs.length > 0 ? (
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="pl-4 border-l-2 border-[var(--card-left-accent)]/30 relative">
                    <div className="absolute w-2 h-2 bg-brand-primary rounded-full -left-[5px] top-1.5" />
                    <div className="text-xs font-bold text-gray-800">{log.action.replace(/_/g, ' ')}</div>
                    <div className="text-[10px] text-gray-500">
                      {new Date(log.createdAt).toLocaleString()} by {log.performedByEmail || 'System'}
                    </div>
                    {(log.previousValue || log.newValue) && (
                      <div className="text-xs text-gray-600 mt-1 bg-gray-50 p-2 rounded">
                        <span className="line-through opacity-50 mr-2">{log.previousValue}</span> 
                        <span className="font-bold text-brand-primary">{log.newValue}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-400 italic">No audit events recorded yet.</div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
