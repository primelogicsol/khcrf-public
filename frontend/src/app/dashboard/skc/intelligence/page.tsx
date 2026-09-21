"use client";
import { getBaseUrlNoApi } from "@/lib/api";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaChartLine, FaFilter, FaSearch, FaProjectDiagram, FaDownload, FaEye, FaTags, FaGlobe, FaExclamationTriangle, FaTrash } from 'react-icons/fa';

import { normalizeConsultationList, NormalizedConsultation } from '@/lib/skc/normalizeConsultation';
import { exportToCsv, logExportAudit } from '@/lib/skc/exportUtils';

export default function IntelligenceDashboard() {
  const [data, setData] = useState<NormalizedConsultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filters, setFilters] = useState({
    district: '',
    stakeholderType: '',
    theme: '',
    challenge: '',
    craft: '',
    policyPriority: '',
    exportPotential: '',
    economicVulnerability: '',
    evidenceStrength: ''
  });

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
      console.error("Failed to fetch intelligence data", err);
      setError(err.message || 'Failed to connect to the backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Safe data filtering
  const filteredData = data.filter(item => {
    if (filters.district && item.displayDistrict !== filters.district) return false;
    if (filters.stakeholderType && item.displayStakeholderType !== filters.stakeholderType) return false;
    if (filters.craft && item.displayCraft !== filters.craft) return false;
    if (filters.theme && !item.inferredThemes.includes(filters.theme)) return false;
    if (filters.challenge && !item.inferredTags.includes(filters.challenge)) return false;
    
    // Insights derived from qualityIndicators
    const insights = item.qualityIndicators?.insights || {};
    if (filters.policyPriority && insights.policyPriority !== filters.policyPriority) return false;
    if (filters.exportPotential && insights.export !== filters.exportPotential) return false;
    if (filters.economicVulnerability && insights.vulnerability !== filters.economicVulnerability) return false;
    
    if (filters.evidenceStrength) {
      const count = item.evidenceCount;
      if (filters.evidenceStrength === 'High' && count < 2) return false;
      if (filters.evidenceStrength === 'Medium' && count !== 1) return false;
      if (filters.evidenceStrength === 'Low' && count > 0) return false;
    }
    
    return true;
  });

  // Extract unique filter options safely
  const uniqueDistricts = Array.from(new Set(data.map(d => d.displayDistrict)));
  const uniqueStakeholders = Array.from(new Set(data.map(d => d.displayStakeholderType)));
  const uniqueCrafts = Array.from(new Set(data.map(d => d.displayCraft)));
  const uniqueThemes = Array.from(new Set(data.flatMap(d => d.inferredThemes)));
  const uniqueChallenges = Array.from(new Set(data.flatMap(d => d.inferredTags)));

  // Calculate high-level metrics safely
  const avgScore = data.length > 0 ? Math.round(data.reduce((acc, curr) => acc + curr.intelligenceScore, 0) / data.length) : 0;
  const highPriorityCount = data.filter(d => d.qualityIndicators?.insights?.policyPriority === 'HIGH').length;

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

  const handleExportCsv = () => {
    if (filteredData.length === 0) return;
    
    const headers = ['Consultation ID', 'Participant Name', 'Participant Type', 'District', 'Craft', 'Created At', 'Confidence Level', 'Intelligence Score', 'Evidence Count', 'Inferred Themes', 'Inferred Tags'];
    const rows = filteredData.map(item => [
      item.consultationId,
      item.displayName,
      item.displayStakeholderType,
      item.displayDistrict,
      item.displayCraft,
      item.submittedAt,
      item.displayConfidenceLevel,
      item.intelligenceScore,
      item.evidenceCount,
      item.inferredThemes.join('; '),
      item.inferredTags.join('; ')
    ]);
    
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `skc-intelligence-export-${dateStr}.csv`;
    
    exportToCsv(filename, [headers, ...rows]);
    logExportAudit('Intelligence', 'CSV', filteredData.length);
  };

  return (
    <>
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-dark flex items-center gap-3">
            <FaProjectDiagram data-ui-icon  className="" /> Intelligence Dashboard
          </h1>
          <p className="text-gray-600 font-medium mt-1">State of Kashmir Crafts Assessment 2026–2027 - Central Knowledge Graph View</p>
          <div className="flex flex-wrap gap-3 w-full md:w-auto mt-4">
             <button 
                onClick={handleExportCsv}
                disabled={filteredData.length === 0}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-200 font-bold rounded-lg hover:bg-gray-50 transition text-sm flex items-center gap-2 shadow-sm flex-1 md:flex-none justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                <FaDownload /> Export CSV
             </button>
             <button className="px-4 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-dark transition text-sm flex items-center gap-2 shadow-sm flex-1 md:flex-none justify-center opacity-50 cursor-not-allowed">
                <FaProjectDiagram /> Generate Full Report
             </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center gap-3 text-red-700">
          <FaExclamationTriangle />
          <div>
            <p className="font-bold">Error loading intelligence graph</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Submissions</div>
          <div className="text-3xl font-black text-brand-primary">{loading ? '-' : data.length}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Avg Intelligence Score</div>
          <div className="text-3xl font-black text-green-600">{loading ? '-' : `${avgScore}%`}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">High Policy Priority</div>
          <div className="text-3xl font-black text-red-500">{loading ? '-' : highPriorityCount}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Identified Themes</div>
          <div className="text-3xl font-black text-brand-secondary">{loading ? '-' : uniqueThemes.length}</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider flex items-center gap-2 mb-4">
          <FaFilter className="text-gray-400" /> Global Filters
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-3">
          <select name="district" onChange={handleFilterChange} className="w-full text-xs font-bold text-gray-700 bg-gray-50 border border-gray-300 p-2.5 rounded-lg outline-none focus:border-brand-primary">
            <option value="">All Districts</option>
            {uniqueDistricts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select name="craft" onChange={handleFilterChange} className="w-full text-xs font-bold text-gray-700 bg-gray-50 border border-gray-300 p-2.5 rounded-lg outline-none focus:border-brand-primary">
            <option value="">All Crafts</option>
            {uniqueCrafts.map(c => <option key={c as string} value={c as string}>{c}</option>)}
          </select>
          <select name="stakeholderType" onChange={handleFilterChange} className="w-full text-xs font-bold text-gray-700 bg-gray-50 border border-gray-300 p-2.5 rounded-lg outline-none focus:border-brand-primary">
            <option value="">All Stakeholders</option>
            {uniqueStakeholders.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select name="theme" onChange={handleFilterChange} className="w-full text-xs font-bold text-gray-700 bg-gray-50 border border-gray-300 p-2.5 rounded-lg outline-none focus:border-brand-primary">
            <option value="">All Themes</option>
            {uniqueThemes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select name="challenge" onChange={handleFilterChange} className="w-full text-xs font-bold text-gray-700 bg-gray-50 border border-gray-300 p-2.5 rounded-lg outline-none focus:border-brand-primary">
            <option value="">All Challenges</option>
            {uniqueChallenges.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          
          <select name="policyPriority" onChange={handleFilterChange} className="w-full text-xs font-bold text-gray-700 bg-gray-50 border border-gray-300 p-2.5 rounded-lg outline-none focus:border-brand-primary">
            <option value="">Policy Priority</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
          <select name="economicVulnerability" onChange={handleFilterChange} className="w-full text-xs font-bold text-gray-700 bg-gray-50 border border-gray-300 p-2.5 rounded-lg outline-none focus:border-brand-primary">
            <option value="">Vulnerability</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
          <select name="exportPotential" onChange={handleFilterChange} className="w-full text-xs font-bold text-gray-700 bg-gray-50 border border-gray-300 p-2.5 rounded-lg outline-none focus:border-brand-primary">
            <option value="">Export Potential</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
          <select name="evidenceStrength" onChange={handleFilterChange} className="w-full text-xs font-bold text-gray-700 bg-gray-50 border border-gray-300 p-2.5 rounded-lg outline-none focus:border-brand-primary">
            <option value="">Evidence</option>
            <option value="High">Strong (2+)</option>
            <option value="Medium">Medium (1)</option>
            <option value="Low">Weak (0)</option>
          </select>
        </div>
      </div>

      {/* Data Grid */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-black text-gray-500 uppercase tracking-wider">
                <th className="p-4">ID / Date</th>
                <th className="p-4">Stakeholder</th>
                <th className="p-4">Intelligence Themes</th>
                <th className="p-4">Key Insights</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Score</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500 font-bold">Loading Intelligence Graph...</td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500 font-bold">No submissions match current filters.</td></tr>
              ) : (
                filteredData.map(item => {
                  const insights = item.qualityIndicators?.insights || {};
                  const themes = item.inferredThemes;
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="p-4">
                        <div className="text-xs font-mono font-bold text-gray-800">{item.shortId}</div>
                        <div className="text-[10px] text-gray-400 font-bold">{item.submittedDateFormatted}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-black text-brand-dark">{item.displayStakeholderType}</div>
                        <div className="text-xs text-gray-500 font-medium">{item.displayDistrict}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1 max-w-[250px]">
                          {themes.slice(0, 3).map(t => (
                            <span key={t} className="text-[9px] font-bold px-2 py-1 bg-brand-primary/10 text-brand-secondary rounded border border-brand-primary/20">{t}</span>
                          ))}
                          {themes.length > 3 && <span className="text-[9px] font-bold px-1.5 py-1 bg-gray-100 text-gray-500 rounded">+{themes.length - 3}</span>}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {insights.vulnerability === 'HIGH' && <span title="High Economic Vulnerability" className="w-2.5 h-2.5 rounded-full bg-red-500"></span>}
                          {insights.policyPriority === 'HIGH' && <span title="High Policy Priority" className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>}
                          {insights.export === 'HIGH' && <span title="High Export Potential" className="w-2.5 h-2.5 rounded-full bg-green-500"></span>}
                          {item.evidenceCount > 0 && <FaGlobe className="text-blue-500 text-xs" title="Evidence Attached" />}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                          item.status === 'VERIFIED' ? 'bg-green-50 text-green-700 border-green-200' :
                          item.status === 'FLAGGED' ? 'bg-red-50 text-red-700 border-red-200' :
                          item.status === 'ARCHIVED' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {item.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div data-ui-icon className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 border border-gray-200 text-sm font-black ">
                          {item.intelligenceScore}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`/dashboard/skc/intelligence/${item.id}`}>
                            <button className="p-2 text-icon-on-light hover:text-white transition bg-white border border-brand-primary/20 rounded-lg shadow-sm hover:shadow hover:bg-brand-primary">
                              <FaEye />
                            </button>
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="p-2 text-red-500 hover:text-white transition bg-white border border-red-200 rounded-lg shadow-sm hover:shadow hover:bg-red-500"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
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
