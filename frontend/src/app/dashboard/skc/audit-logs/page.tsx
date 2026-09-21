"use client";

import React, { useState, useEffect } from 'react';
import { FaHistory, FaDownload, FaFilter, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { exportToCsv, logExportAudit } from '@/lib/skc/exportUtils';

export default function SKCAuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filters, setFilters] = useState({
    module: '',
    action: ''
  });

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      
      const queryParams = new URLSearchParams();
      if (filters.module) queryParams.append('module', filters.module);
      if (filters.action) queryParams.append('action', filters.action);
      
      const res = await fetch(`/api/backend/audit?${queryParams.toString()}`, {
        credentials: 'include'
      });
      
      if (!res.ok) throw new Error('Failed to fetch audit logs');
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Expected JSON but received ${contentType}. Response preview: ${text.slice(0, 200)}`);
      }
            const rawResult = await res.json();
      const result = (rawResult.status === 'success' && rawResult.data && typeof rawResult.data.success !== 'undefined') ? rawResult.data : rawResult;
      
      if (result.success || result.status === 'success') {
        setLogs(result.data);
      } else {
        throw new Error(result.error || result.message || 'Unknown error');
      }
    } catch (err: any) {
      console.error("Failed to fetch audit logs", err);
      setError(err.message || 'Failed to connect to the backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleExportCsv = () => {
    if (logs.length === 0) return;
    
    const headers = ['Log ID', 'Module', 'Record Type', 'Record ID', 'Action', 'Previous Value', 'New Value', 'Performed By', 'IP Address', 'Timestamp'];
    const rows = logs.map(item => [
      item.id,
      item.module,
      item.recordType,
      item.recordId,
      item.action,
      item.previousValue || '',
      item.newValue || '',
      item.performedByEmail || 'System',
      item.ipAddress || '',
      new Date(item.createdAt).toISOString()
    ]);
    
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `skc-audit-logs-${dateStr}.csv`;
    
    exportToCsv(filename, [headers, ...rows]);
    logExportAudit('AuditLogs', 'CSV', logs.length);
  };

  const uniqueModules = Array.from(new Set(logs.map(l => l.module).filter(Boolean)));
  const uniqueActions = Array.from(new Set(logs.map(l => l.action).filter(Boolean)));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-dark flex items-center gap-3">
            <FaHistory data-ui-icon  className="" /> Central Audit Logs
          </h1>
          <p className="text-gray-600 font-medium mt-1">State of Kashmir Crafts Assessment 2026–2027 - Security & Compliance</p>
          <div className="flex flex-wrap gap-3 w-full md:w-auto mt-4">
             <button 
                onClick={handleExportCsv}
                disabled={logs.length === 0}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-200 font-bold rounded-lg hover:bg-gray-50 transition text-sm flex items-center gap-2 shadow-sm flex-1 md:flex-none justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                <FaDownload /> Export CSV
             </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center gap-3 text-red-700">
          <FaExclamationTriangle />
          <div>
            <p className="font-bold">Error loading audit logs</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider flex items-center gap-2 mb-4">
          <FaFilter className="text-gray-400" /> Global Filters
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select name="module" onChange={handleFilterChange} className="w-full text-xs font-bold text-gray-700 bg-gray-50 border border-gray-300 p-2.5 rounded-lg outline-none focus:border-brand-primary">
            <option value="">All Modules</option>
            {uniqueModules.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select name="action" onChange={handleFilterChange} className="w-full text-xs font-bold text-gray-700 bg-gray-50 border border-gray-300 p-2.5 rounded-lg outline-none focus:border-brand-primary">
            <option value="">All Actions</option>
            {uniqueActions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      {/* Data Grid */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-black text-gray-500 uppercase tracking-wider">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Action</th>
                <th className="p-4">Module / Record</th>
                <th className="p-4">Changes</th>
                <th className="p-4">Performed By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500 font-bold">Loading Audit Logs...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500 font-bold">No audit logs match the current filters.</td></tr>
              ) : (
                logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 whitespace-nowrap">
                      <div className="text-xs font-bold text-gray-800">{new Date(log.createdAt).toLocaleDateString()}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{new Date(log.createdAt).toLocaleTimeString()}</div>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold px-2 py-1 bg-brand-primary/10 text-brand-secondary rounded border border-brand-primary/20 uppercase">
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-xs font-bold text-gray-800">{log.module}</div>
                      <div className="text-[10px] text-gray-500 font-mono" title={log.recordId}>{log.recordId.substring(0, 8)}...</div>
                    </td>
                    <td className="p-4">
                      {(log.previousValue || log.newValue) ? (
                        <div className="text-xs space-y-1">
                          {log.previousValue && <div className="line-through text-red-500 bg-red-50 px-2 py-0.5 rounded truncate max-w-[200px]">{log.previousValue}</div>}
                          {log.newValue && <div className="text-green-700 bg-green-50 px-2 py-0.5 rounded truncate max-w-[200px]">{log.newValue}</div>}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400 italic">No value change</div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="text-xs font-bold text-gray-800">{log.performedByEmail || 'System'}</div>
                      <div className="text-[10px] text-gray-500">{log.ipAddress || 'Unknown IP'}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
