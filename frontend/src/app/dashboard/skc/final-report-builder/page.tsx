"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaBook, FaSpinner, FaExclamationTriangle, FaCheckCircle, 
  FaTags, FaMapMarkerAlt, FaHammer, FaChartBar, FaEye, FaUsers, FaCheckDouble
} from 'react-icons/fa';
import { normalizeConsultationList, NormalizedConsultation } from '@/lib/skc/normalizeConsultation';

export default function FinalReportBuilder() {
  const [data, setData] = useState<NormalizedConsultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`/api/backend/consultation`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch data');
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Expected JSON but received ${contentType}. Response preview: ${text.slice(0, 200)}`);
      }
            const rawResult = await res.json();
      const result = (rawResult.status === 'success' && rawResult.data && typeof rawResult.data.success !== 'undefined') ? rawResult.data : rawResult;
      if (result.success || result.status === 'success') {
        setData(normalizeConsultationList(result.data));
      } else {
        throw new Error(result.error || result.message || 'Unknown error');
      }
    } catch (err: any) {
      console.error("Failed to fetch final report data", err);
      setError(err.message || 'Failed to connect to the backend.');
    } finally {
      setLoading(false);
    }
  };

  // Computations based on Phase 6G Request Logic
  const candidateStatuses = ['VALIDATED', 'USED_IN_FINAL_REPORT'];
  
  // Base relevant data based on requested logic
  const reportCandidates = data.filter(d => candidateStatuses.includes(d.original?.status || ''));

  const readyForReport = reportCandidates.filter(d => d.original?.status === 'VALIDATED');
  const usedInFinalReport = reportCandidates.filter(d => d.original?.status === 'USED_IN_FINAL_REPORT');
  
  const highPolicyValue = data.filter(d => d.highPolicyValue);
  const missingEvidence = data.filter(d => d.missingEvidence);

  // Sorting utilities for top lists
  const countOccurrences = (arr: string[]) => {
    const counts: Record<string, number> = {};
    for (const item of arr) {
      counts[item] = (counts[item] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  };

  const topThemes = countOccurrences(reportCandidates.flatMap(d => d.inferredThemes)).slice(0, 5);
  const topDistricts = countOccurrences(reportCandidates.map(d => d.displayDistrict)).slice(0, 5);
  const topCrafts = countOccurrences(reportCandidates.map(d => d.displayCraft).filter(c => c !== 'Unknown Craft')).slice(0, 5);
  const topStakeholders = countOccurrences(reportCandidates.map(d => d.displayStakeholderType)).slice(0, 5);

  // Display List: sort by policy priority first, then evidence count, then confidence level, then date
  const displayList = [...reportCandidates].sort((a, b) => {
    if (a.highPolicyValue && !b.highPolicyValue) return -1;
    if (!a.highPolicyValue && b.highPolicyValue) return 1;
    
    const aEv = a.original?.evidenceCount || 0;
    const bEv = b.original?.evidenceCount || 0;
    if (aEv !== bEv) return bEv - aEv;
    
    if (a.displayConfidenceLevel === 'High' && b.displayConfidenceLevel !== 'High') return -1;
    if (a.displayConfidenceLevel !== 'High' && b.displayConfidenceLevel === 'High') return 1;
    
    return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
  });

  return (
    <div className="space-y-8">
       {/* Header */}
       <header className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm gap-4">
          <div>
            <h1 className="text-2xl font-black text-brand-dark flex items-center gap-3">
               <FaBook data-ui-icon  className="" /> Final Report Builder
            </h1>
            <p className="text-gray-500 font-medium text-sm mt-1">Read-only final assessment and synthesis platform.</p>
          </div>
       </header>

       {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center gap-3 text-red-700">
          <FaExclamationTriangle />
          <div>
            <p className="font-bold">Error loading workspace</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
       )}

       {/* Readiness Metric Cards */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2"><FaCheckCircle className="text-green-500" /> Ready for Report</div>
             <div className="text-3xl font-black text-green-600">{loading ? '-' : readyForReport.length}</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2"><FaCheckDouble className="text-purple-600" /> Used in Report</div>
             <div className="text-3xl font-black text-purple-600">{loading ? '-' : usedInFinalReport.length}</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2"><FaChartBar data-ui-icon  className="" /> High Policy Value</div>
             <div className="text-3xl font-black text-brand-primary">{loading ? '-' : highPolicyValue.length}</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2"><FaExclamationTriangle className="text-red-500" /> Missing Evidence</div>
             <div className="text-3xl font-black text-red-500">{loading ? '-' : missingEvidence.length}</div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
             {/* Submissions Table */}
             <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                   <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">Final Report Candidates</h2>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-white border-b border-gray-100">
                         <tr className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
                            <th className="p-4">Submission ID</th>
                            <th className="p-4">Context</th>
                            <th className="p-4">Synthesis Data</th>
                            <th className="p-4 text-right">Action</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                         {loading ? (
                            <tr><td colSpan={4} className="p-8 text-center text-gray-500 font-bold"><FaSpinner className="animate-spin inline-block mr-2" /> Loading report candidates...</td></tr>
                         ) : displayList.length === 0 ? (
                            <tr><td colSpan={4} className="p-8 text-center text-gray-500 font-bold">No candidates found for the final report.</td></tr>
                         ) : (
                            displayList.map(item => (
                               <tr key={item.id} className="hover:bg-gray-50 transition">
                                  <td className="p-4">
                                     <div className="font-mono text-xs font-bold text-gray-800">{item.shortId}</div>
                                     <div className="text-[10px] font-bold mt-1">
                                        <span className={`px-2 py-0.5 rounded uppercase ${
                                           item.original?.status === 'USED_IN_FINAL_REPORT' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                           {item.original?.status || 'UNKNOWN'}
                                        </span>
                                     </div>
                                  </td>
                                  <td className="p-4">
                                     <div className="text-xs font-black text-brand-dark">{item.displayStakeholderType}</div>
                                     <div className="text-[10px] text-gray-500 font-medium">{item.displayDistrict} • {item.displayCraft}</div>
                                  </td>
                                  <td className="p-4">
                                     <div className="flex flex-col gap-1 max-w-[200px]">
                                        {item.highPolicyValue && <span className="text-[9px] font-bold bg-brand-primary/10 text-brand-primary px-1.5 py-0.5 rounded w-max">High Policy Value</span>}
                                        {item.original?.evidenceCount > 0 ? 
                                           <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded w-max">{item.original.evidenceCount} Evidence Items</span> :
                                           <span className="text-[9px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded w-max">Missing Evidence</span>
                                        }
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded w-max ${item.displayConfidenceLevel === 'High' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                           {item.displayConfidenceLevel} Confidence
                                        </span>
                                     </div>
                                  </td>
                                  <td className="p-4 text-right">
                                     <Link href={`/dashboard/skc/intelligence/${item.id}`}>
                                        <button className="px-3 py-1.5 text-xs font-bold text-icon-on-light hover:text-white transition bg-white border border-brand-primary/20 rounded-lg shadow-sm hover:shadow hover:bg-brand-primary inline-flex items-center gap-2">
                                          <FaEye /> Synthesize
                                        </button>
                                     </Link>
                                  </td>
                               </tr>
                            ))
                         )}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>

          {/* Right Column: Aggregations */}
          <div className="space-y-6">
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2"><FaTags data-ui-icon  className="" /> Top Report Themes</h3>
                {loading ? <div className="text-xs text-gray-400">Loading...</div> : topThemes.length === 0 ? <div className="text-xs text-gray-400">No themes detected.</div> : (
                  <div className="flex flex-wrap gap-2">
                    {topThemes.map(([theme, count]) => (
                      <span key={theme} className="text-[10px] font-bold px-2 py-1 bg-gray-50 rounded border border-gray-200 text-gray-700">
                        {theme} <span className="text-brand-primary ml-1">{count}</span>
                      </span>
                    ))}
                  </div>
                )}
             </div>

             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2"><FaMapMarkerAlt data-ui-icon  className="" /> Key Districts</h3>
                {loading ? <div className="text-xs text-gray-400">Loading...</div> : topDistricts.length === 0 ? <div className="text-xs text-gray-400">No data.</div> : (
                  <div className="space-y-3">
                    {topDistricts.map(([dist, count]) => (
                      <div key={dist} className="flex justify-between items-center text-xs">
                        <span className="font-bold text-gray-700">{dist}</span>
                        <span className="font-black bg-gray-100 px-2 py-1 rounded">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
             </div>

             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2"><FaHammer data-ui-icon  className="" /> Key Crafts</h3>
                {loading ? <div className="text-xs text-gray-400">Loading...</div> : topCrafts.length === 0 ? <div className="text-xs text-gray-400">No data.</div> : (
                  <div className="space-y-3">
                    {topCrafts.map(([craft, count]) => (
                      <div key={craft} className="flex justify-between items-center text-xs">
                        <span className="font-bold text-gray-700">{craft}</span>
                        <span className="font-black bg-gray-100 px-2 py-1 rounded">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
             </div>
             
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2"><FaUsers data-ui-icon  className="" /> Representative Sources</h3>
                {loading ? <div className="text-xs text-gray-400">Loading...</div> : topStakeholders.length === 0 ? <div className="text-xs text-gray-400">No data.</div> : (
                  <div className="space-y-3">
                    {topStakeholders.map(([sh, count]) => (
                      <div key={sh} className="flex justify-between items-center text-xs">
                        <span className="font-bold text-gray-700">{sh}</span>
                        <span className="font-black bg-gray-100 px-2 py-1 rounded">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
             </div>
          </div>
       </div>
    </div>
  );
}
