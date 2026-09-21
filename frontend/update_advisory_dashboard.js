const fs = require('fs');

const tsxContent = \"use client";

import React, { useEffect, useState } from "react";
import { FaDownload, FaSearch, FaUserTie, FaEye, FaRegEdit } from "react-icons/fa";
import { normalizeArray } from "@/lib/normalize";

export default function AdvisoryApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterScope, setFilterScope] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchApplications = async () => {
    try {
      const res = await fetch(\/api/backend/skc/advisory/applications\, { credentials: 'include' });
      if (!res.ok) throw new Error("Failed to fetch applications");
      const rawData = await res.json();
      const data = (rawData.status === 'success' && rawData.data && typeof rawData.data.success !== 'undefined') ? rawData.data : rawData.data || rawData;
      setApplications(normalizeArray(data, ["applications", "items", "results", "data"]));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateApplication = async (id: string, updates: any) => {
    try {
      await fetch(\/api/backend/skc/advisory/applications/\\, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredApps = applications.filter(app => {
    if (filterStatus && app.status !== filterStatus) return false;
    if (filterCategory && app.category !== filterCategory) return false;
    if (filterScope && app.advisoryScope !== filterScope) return false;
    if (filterDistrict && app.district !== filterDistrict) return false;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      const matchName = (app.fullName || "").toLowerCase().includes(lower);
      const matchEmail = (app.email || "").toLowerCase().includes(lower);
      const matchOrg = (app.organization || "").toLowerCase().includes(lower);
      const matchDist = (app.district || "").toLowerCase().includes(lower);
      const matchRef = (app.referenceNumber || "").toLowerCase().includes(lower);
      if (!matchName && !matchEmail && !matchOrg && !matchDist && !matchRef) return false;
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED_HCRF':
      case 'APPROVED_SKC':
      case 'APPROVED_BOTH':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'NOT_SELECTED':
      case 'WITHDRAWN':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
       <header className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm gap-4">
          <h1 className="text-2xl font-black text-brand-dark flex items-center gap-3">
             <FaUserTie className="text-brand-secondary" /> Advisory Council Applications
          </h1>
       </header>

       {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md text-red-700">
          <p className="font-bold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end">
        <div className="relative flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Search</label>
          <div className="relative">
             <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <input 
                type="text" 
                placeholder="Search name, email, org, district..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm" 
             />
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Scope</label>
          <select value={filterScope} onChange={e => setFilterScope(e.target.value)} className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm min-w-[120px]">
            <option value="">All Scopes</option>
            <option value="HCRF">HCRF</option>
            <option value="SKC">SKC</option>
            <option value="BOTH">BOTH</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Status</label>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm min-w-[150px]">
            <option value="">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="MORE_INFORMATION_REQUIRED">More Info Req</option>
            <option value="APPROVED_HCRF">Approved HCRF</option>
            <option value="APPROVED_SKC">Approved SKC</option>
            <option value="APPROVED_BOTH">Approved BOTH</option>
            <option value="NOT_SELECTED">Not Selected</option>
            <option value="WITHDRAWN">Withdrawn</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Applicant</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Profile</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">CV</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase w-1/4">Notes & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 font-bold">Loading applications...</td>
                </tr>
              ) : filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 font-bold">No applications match the filters.</td>
                </tr>
              ) : (
                filteredApps.map(app => (
                  <tr key={app.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4">
                      <div className="font-bold text-brand-primary text-xs mb-1">{app.referenceNumber}</div>
                      <div className="font-bold text-gray-900">{app.fullName}</div>
                      <div className="text-xs text-gray-500">{app.email}</div>
                      <div className="text-xs text-gray-500">{app.phone}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-bold text-gray-800">Scope: {app.advisoryScope}</div>
                      <div className="text-sm font-medium text-gray-800">{app.category}</div>
                      <div className="text-xs text-gray-500">{app.district || '-'}</div>
                      {app.organization && <div className="text-xs text-gray-400 mt-1">{app.organization}</div>}
                    </td>
                    <td className="p-4">
                      <select 
                        value={app.status}
                        onChange={(e) => updateApplication(app.id, { status: e.target.value })}
                        className={\	ext-xs font-bold px-3 py-1.5 rounded-full border \ focus:outline-none\}
                      >
                        <option value="SUBMITTED">Submitted</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="SHORTLISTED">Shortlisted</option>
                        <option value="MORE_INFORMATION_REQUIRED">More Info Req</option>
                        <option value="APPROVED_HCRF">Approve HCRF</option>
                        <option value="APPROVED_SKC">Approve SKC</option>
                        <option value="APPROVED_BOTH">Approve BOTH</option>
                        <option value="NOT_SELECTED">Not Selected / Decline</option>
                        <option value="WITHDRAWN">Withdrawn</option>
                      </select>
                    </td>
                    <td className="p-4">
                      {app.cvFileUrl ? (
                        <a href={\/api/backend\\} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-brand-secondary hover:text-brand-primary text-sm font-bold transition">
                          <FaDownload /> Download
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No CV</span>
                      )}
                    </td>
                    <td className="p-4 space-y-2">
                      <textarea 
                        className="w-full text-xs p-2 bg-white border border-gray-200 rounded resize-none focus:outline-none focus:ring-1 focus:ring-brand-primary/50"
                        rows={2}
                        placeholder="Internal notes..."
                        defaultValue={app.internalNotes || ""}
                        onBlur={(e) => {
                          if (e.target.value !== app.internalNotes) {
                            updateApplication(app.id, { internalNotes: e.target.value });
                          }
                        }}
                      />
                      <div className="flex gap-2">
                        <input 
                           type="text" 
                           placeholder="Reviewer ID"
                           className="text-xs p-1 border rounded w-full"
                           defaultValue={app.assignedReviewerId || ""}
                           onBlur={(e) => {
                             if (e.target.value !== app.assignedReviewerId) {
                               updateApplication(app.id, { assignedReviewerId: e.target.value });
                             }
                           }}
                        />
                      </div>
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
\;

fs.writeFileSync('src/app/dashboard/skc/advisory-applications/page.tsx', tsxContent);