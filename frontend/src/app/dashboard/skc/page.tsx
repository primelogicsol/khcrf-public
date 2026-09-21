"use client";
import { getBaseUrlNoApi } from "@/lib/api";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FaTachometerAlt, FaCalendarAlt, FaMicrophone, FaFilePdf,
  FaCheckCircle, FaSearch, FaUsers, FaCog, FaPlus, FaArchive,
  FaCopy, FaGlobe, FaArrowRight, FaTasks, FaFolderOpen, FaChartBar, FaExclamationTriangle, FaEye, FaSpinner,
  FaMapMarkerAlt, FaHammer, FaDownload, FaTrash
} from "react-icons/fa";

import { normalizeConsultationList, NormalizedConsultation } from '@/lib/skc/normalizeConsultation';
import { exportToJson, logExportAudit } from '@/lib/skc/exportUtils';

export default function AssessmentManagementCenter() {
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
      if (result.success) {
        setData(normalizeConsultationList(result.data));
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (err: any) {
      console.error("Failed to fetch SKC overview data", err);
      setError(err.message || 'Failed to connect to the backend.');
    } finally {
      setLoading(false);
    }
  };

  // Safe metric aggregations
  const totalSubmissions = data.length;
  const uniqueDistricts = Array.from(new Set(data.map(d => d.displayDistrict)));
  const uniqueCrafts = Array.from(new Set(data.map(d => d.displayCraft)));
  const uniqueStakeholders = Array.from(new Set(data.map(d => d.displayStakeholderType)));
  const totalEvidence = data.reduce((acc, curr) => acc + curr.evidenceCount, 0);
  const avgScore = totalSubmissions > 0 ? Math.round(data.reduce((acc, curr) => acc + curr.intelligenceScore, 0) / totalSubmissions) : 0;
  
  const highConfidence = data.filter(d => d.displayConfidenceLevel === 'High').length;
  const highPolicyPriority = data.filter(d => d.qualityIndicators?.insights?.policyPriority === 'HIGH').length;

  // Sorting utilities for top lists
  const countOccurrences = (arr: string[]) => {
    const counts: Record<string, number> = {};
    for (const item of arr) {
      counts[item] = (counts[item] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  };

  const topDistricts = countOccurrences(data.map(d => d.displayDistrict)).slice(0, 5);
  const topCrafts = countOccurrences(data.map(d => d.displayCraft)).slice(0, 5);
  const topStakeholders = countOccurrences(data.map(d => d.displayStakeholderType)).slice(0, 5);
  const allThemes = data.flatMap(d => d.inferredThemes);
  const topThemes = countOccurrences(allThemes).slice(0, 5);

  const recentActivity = [...data].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()).slice(0, 5);

  const [deleteTarget, setDeleteTarget] = useState<NormalizedConsultation | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
const API_BASE_URL = getBaseUrlNoApi();
      const res = await fetch(`${API_BASE_URL}/api/consultation/${deleteTarget.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Delete failed');
      setData(prev => prev.filter(d => d.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      console.error("Failed to delete submission", err);
      alert('Failed to delete submission.');
    } finally {
      setDeleting(false);
    }
  };

  const handleExportJson = () => {
    if (data.length === 0) return;
    
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `skc-overview-export-${dateStr}.json`;
    
    exportToJson(filename, data);
    logExportAudit('Overview', 'JSON', data.length);
  };

  return (
    <>
    <div className="space-y-8">
       <header className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm gap-4">
          <h1 className="text-2xl font-black text-brand-dark flex items-center gap-3">
             <FaTachometerAlt data-ui-icon  className="" /> Assessment Overview Center
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-4 sm:mt-0">
             <button 
                onClick={handleExportJson}
                disabled={data.length === 0}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-200 font-bold rounded-lg hover:bg-gray-50 transition text-sm flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                <FaDownload /> Export JSON
             </button>
             <Link href="/state-of-kashmir-crafts/participate">
                <button className="px-4 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-dark transition text-sm flex items-center gap-2 shadow-sm">
                   <FaPlus /> Start Field Assessment
                </button>
             </Link>
          </div>
       </header>

       {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center gap-3 text-red-700">
          <FaExclamationTriangle />
          <div>
            <p className="font-bold">Error loading overview</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
       )}

       {/* Core Metric Cards */}
       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
             <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-2">Total Submissions</div>
             <div className="text-xl font-black text-brand-primary">{loading ? '-' : totalSubmissions}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
             <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-2">Stakeholders</div>
             <div className="text-xl font-black text-gray-900">{loading ? '-' : totalSubmissions}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
             <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-2">Districts (Coverage)</div>
             <div className="text-xl font-black text-gray-900">{loading ? '-' : uniqueDistricts.length}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
             <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-2">Crafts Evaluated</div>
             <div className="text-xl font-black text-gray-900">{loading ? '-' : uniqueCrafts.length}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
             <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-2">Evidence Files</div>
             <div className="text-xl font-black text-blue-600">{loading ? '-' : totalEvidence}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
             <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-2">Avg Intelligence</div>
             <div className="text-xl font-black text-green-600">{loading ? '-' : `${avgScore}`}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
             <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-2">High Confidence</div>
             <div className="text-xl font-black text-gray-900">{loading ? '-' : highConfidence}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
             <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-2">High Priority</div>
             <div className="text-xl font-black text-red-500">{loading ? '-' : highPolicyPriority}</div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
             {/* Recent Activity Table */}
             <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                   <h2 className="text-lg font-black text-gray-900 flex items-center gap-2"><FaTasks data-ui-icon  className="" /> Recent Submissions</h2>
                   <Link href="/dashboard/skc/intelligence" className="text-xs font-bold text-brand-primary hover:underline">View All</Link>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-white border-b border-gray-100">
                         <tr className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
                            <th className="p-4">ID & Date</th>
                            <th className="p-4">Stakeholder & Location</th>
                            <th className="p-4">Craft</th>
                            <th className="p-4">Quality</th>
                            <th className="p-4 text-right">Action</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                         {loading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500 font-bold"><FaSpinner className="animate-spin inline-block mr-2" /> Loading recent activity...</td></tr>
                         ) : recentActivity.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500 font-bold">No submissions available.</td></tr>
                         ) : (
                            recentActivity.map(item => (
                               <tr key={item.id} className="hover:bg-gray-50 transition">
                                  <td className="p-4">
                                     <div className="font-mono text-xs font-bold text-gray-800">{item.shortId}</div>
                                     <div className="text-[10px] text-gray-400 font-bold">{item.submittedDateFormatted}</div>
                                  </td>
                                  <td className="p-4">
                                     <div className="text-xs font-black text-brand-dark">{item.displayStakeholderType}</div>
                                     <div className="text-[10px] text-gray-500 font-medium">{item.displayDistrict}</div>
                                  </td>
                                  <td className="p-4">
                                     <div className="text-xs font-bold text-gray-700">{item.displayCraft}</div>
                                  </td>
                                  <td className="p-4">
                                     <div className="flex flex-col gap-1">
                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded w-max ${item.displayConfidenceLevel === 'High' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{item.displayConfidenceLevel} Confidence</span>
                                        <span className="text-[9px] font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded border border-brand-primary/20 w-max">Score: {item.intelligenceScore}</span>
                                     </div>
                                  </td>
                                   <td className="p-4 text-right">
                                      <div className="flex items-center justify-end gap-2">
                                        <Link href={`/dashboard/skc/intelligence/${item.id}`}>
                                           <button className="p-2 text-icon-on-light hover:text-white transition bg-white border border-brand-primary/20 rounded-lg shadow-sm hover:shadow hover:bg-brand-primary inline-block">
                                             <FaEye />
                                           </button>
                                        </Link>
                                        <button
                                          onClick={() => setDeleteTarget(item)}
                                          className="p-2 text-red-500 hover:text-white transition bg-white border border-red-200 rounded-lg shadow-sm hover:shadow hover:bg-red-500 inline-block"
                                        >
                                          <FaTrash />
                                        </button>
                                      </div>
                                   </td>
                               </tr>
                            ))
                         )}
                      </tbody>
                   </table>
                </div>
             </div>

             {/* Analytics Blocks */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                   <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2"><FaMapMarkerAlt data-ui-icon  className="" /> Top Districts</h3>
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
                   <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2"><FaHammer data-ui-icon  className="" /> Top Crafts</h3>
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
             </div>

          </div>

          {/* Right Column: Health & Meta */}
          <div className="space-y-8">
             
             {/* Assessment Health Indicators */}
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2"><FaChartBar data-ui-icon  className="" /> Assessment Health</h2>
                <div className="space-y-5">
                   
                   <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                         <span className="font-bold text-gray-600">District Coverage</span>
                         <span className="font-black text-gray-900">{uniqueDistricts.length} / 10</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                         <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min((uniqueDistricts.length / 10) * 100, 100)}%` }}></div>
                      </div>
                   </div>

                   <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                         <span className="font-bold text-gray-600">Stakeholder Diversity</span>
                         <span className="font-black text-gray-900">{uniqueStakeholders.length} Types</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                         <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${Math.min((uniqueStakeholders.length / 8) * 100, 100)}%` }}></div>
                      </div>
                   </div>

                   <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                         <span className="font-bold text-gray-600">Evidence Strength</span>
                         <span className="font-black text-gray-900">{totalEvidence > 0 ? (totalEvidence / totalSubmissions).toFixed(1) : 0} per sub</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                         <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${Math.min(((totalEvidence / totalSubmissions) || 0) * 50, 100)}%` }}></div>
                      </div>
                   </div>

                   <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                         <span className="font-bold text-gray-600">Data Confidence</span>
                         <span className="font-black text-gray-900">{totalSubmissions > 0 ? Math.round((highConfidence / totalSubmissions) * 100) : 0}% High</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                         <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${totalSubmissions > 0 ? (highConfidence / totalSubmissions) * 100 : 0}%` }}></div>
                      </div>
                   </div>
                   
                </div>
             </div>

             <div className="bg-brand-dark p-6 rounded-xl border border-gray-800 shadow-sm text-white">
                <h3 className="text-sm font-black mb-4 flex items-center gap-2 border-b border-gray-700 pb-2"><FaFolderOpen data-ui-icon  className="" /> Top Inferred Themes</h3>
                {loading ? <div className="text-xs text-gray-400">Loading...</div> : topThemes.length === 0 ? <div className="text-xs text-gray-400">No themes detected.</div> : (
                  <div className="flex flex-wrap gap-2">
                    {topThemes.map(([theme, count]) => (
                      <span key={theme} className="text-[10px] font-bold px-2 py-1 bg-white/10 rounded border border-white/20">
                        {theme} <span className="text-brand-secondary ml-1">({count})</span>
                      </span>
                    ))}
                  </div>
                )}
             </div>

          </div>
        </div>
     </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
            <h3 className="text-xl font-black text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete submission <span className="font-mono font-bold text-brand-primary">{deleteTarget.shortId}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-6 py-2.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
