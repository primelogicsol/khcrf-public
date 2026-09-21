"use client";

import React, { useState, useEffect } from 'react';
import {
  FaUsers, FaSearch, FaFilter, FaMapMarkerAlt, FaHammer,
  FaCheckCircle, FaExclamationTriangle,
  FaSpinner, FaDownload, FaBuilding, FaUser, FaEnvelope, FaPhone, FaTimesCircle, FaClock
} from "react-icons/fa";
import api from '@/lib/api';
import { exportToCsv, logExportAudit } from '@/lib/skc/exportUtils';
import { normalizeArray } from '@/lib/normalize';

type StakeholderRegistration = {
  country?: string | null;
  locationType?: string | null;
  id: string;
  type: 'INDIVIDUAL' | 'INSTITUTION';
  referenceNumber: string;
  name: string;
  organization: string | null;
  category: string;
  district: string;
  craftSector: string;
  email: string;
  phone: string;
  status: string;
  submittedAt: string;
};

export default function StakeholdersCRMPage() {
  const [data, setData] = useState<StakeholderRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    district: "",
    category: "",
    status: "",
    type: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: responseData } = await api.get(`/skc/stakeholders`);
      const isSuccess = responseData.success || responseData.status === 'success';
      const actualData = responseData.data?.success !== undefined ? responseData.data.data : responseData.data;
      if (isSuccess) {
        setData(normalizeArray(actualData));
      } else {
        throw new Error(responseData.error || responseData.message || 'Unknown error');
      }
    } catch (err: any) {
      console.error("Failed to fetch stakeholder data", err);
      setError(err.response?.data?.error || err.message || 'Failed to connect to the backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, type: string, newStatus: string) => {
      try {
          setUpdating(id);
          await api.put(`/skc/stakeholders/${id}`, { status: newStatus, type });
          setData(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      } catch (err: any) {
          console.error("Failed to update status", err);
          alert(err.response?.data?.error || "Failed to update status.");
      } finally {
          setUpdating(null);
      }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredData = data.filter(item => {
    // Search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      const matchName = item.name?.toLowerCase().includes(lowerSearch);
      const matchOrg = item.organization?.toLowerCase().includes(lowerSearch);
      const matchRef = item.referenceNumber?.toLowerCase().includes(lowerSearch);
      const matchEmail = item.email?.toLowerCase().includes(lowerSearch);
      
      if (!matchName && !matchOrg && !matchRef && !matchEmail) return false;
    }

    // Filters
    if (filters.district && item.district !== filters.district) return false;
    if (filters.category && item.category !== filters.category) return false;
    if (filters.status && item.status !== filters.status) return false;
    if (filters.type && item.type !== filters.type) return false;

    return true;
  });

  // Unique options for filters
  const uniqueDistricts = Array.from(new Set(data.map(d => d.district).filter(Boolean)));
  const uniqueCategories = Array.from(new Set(data.map(d => d.category).filter(Boolean)));

  const handleExportCsv = () => {
    if (filteredData.length === 0) return;
    
    const headers = ['Reference Number', 'Type', 'Name', 'Organization', 'Category', 'Location', 'Craft Sector', 'Email', 'Phone', 'Status', 'Submitted At'];
    const rows = filteredData.map(item => [
      item.referenceNumber,
      item.type,
      item.name,
      item.organization || '',
      item.category || '',
      item.district || '',
      item.craftSector || '',
      item.email || '',
      item.phone || '',
      item.status,
      new Date(item.submittedAt).toLocaleDateString()
    ]);
    
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `skc-stakeholder-registrations-${dateStr}.csv`;
    
    exportToCsv(filename, [headers, ...rows]);
    logExportAudit('Stakeholders', 'CSV', filteredData.length);
  };

  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'APPROVED': return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1"><FaCheckCircle/> Approved</span>;
          case 'REJECTED': return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1"><FaTimesCircle/> Rejected</span>;
          case 'UNDER_REVIEW': return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1"><FaSearch/> Reviewing</span>;
          default: return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1"><FaClock/> Submitted</span>;
      }
  }

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
       <header className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm sticky top-0 z-10 gap-4">
          <div>
            <h1 className="text-2xl font-black text-brand-dark flex items-center gap-3">
                <FaUsers data-ui-icon  className="" /> Stakeholder & Institution Registry
            </h1>
            <p className="text-sm text-gray-500 mt-1">Review and approve SKC 2026 assessment participants.</p>
          </div>
          <div className="flex items-center gap-3">
             <span className="px-3 py-1 bg-brand-primary/10 text-brand-dark font-bold rounded-lg text-xs uppercase tracking-wider">{data.length} Total Registrations</span>
             <button 
                onClick={handleExportCsv}
                disabled={filteredData.length === 0}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-200 font-bold rounded-lg hover:bg-gray-50 transition text-sm flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                <FaDownload /> Export CSV
             </button>
          </div>
       </header>

       {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center gap-3 text-red-700">
          <FaExclamationTriangle />
          <div>
            <p className="font-bold">Error loading registry</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
       )}

       <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <div className="flex items-center gap-2 text-gray-700 font-bold text-sm mb-2">
            <FaFilter className="text-gray-400" /> Filter & Search
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search name, ref, email..." 
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select name="type" value={filters.type} onChange={handleFilterChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-brand-primary">
              <option value="">All Types</option>
              <option value="INDIVIDUAL">Individuals</option>
              <option value="INSTITUTION">Institutions</option>
            </select>

            <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-brand-primary">
              <option value="">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>

            <select name="district" value={filters.district} onChange={handleFilterChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-brand-primary">
              <option value="">All Districts</option>
              {uniqueDistricts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            <select name="category" value={filters.category} onChange={handleFilterChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-brand-primary">
              <option value="">All Categories</option>
              {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
       </div>

       {/* Data Table */}
       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
         <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                 <th className="px-6 py-4 font-bold">Applicant / Inst</th>
                 <th className="px-6 py-4 font-bold">Details</th>
                 <th className="px-6 py-4 font-bold">Contact</th>
                 <th className="px-6 py-4 font-bold">Status</th>
                 <th className="px-6 py-4 font-bold text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      <FaSpinner data-ui-icon  className="animate-spin text-3xl mx-auto mb-3 opacity-50 " />
                      Loading registrations...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium">
                      No registrations found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 p-2 rounded-lg text-white ${item.type === 'INSTITUTION' ? 'bg-indigo-500' : 'bg-brand-primary'}`}>
                            {item.type === 'INSTITUTION' ? <FaBuilding /> : <FaUser />}
                          </div>
                          <div>
                            <div className="font-bold text-brand-dark">{item.name}</div>
                            {item.organization && item.organization !== item.name && (
                                <div className="text-xs text-gray-500">{item.organization}</div>
                            )}
                            <div className="text-[10px] font-mono text-gray-400 mt-1">{item.referenceNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="text-sm font-medium text-gray-700 flex items-center gap-2"><FaHammer className="text-gray-400"/> {item.category}</div>
                         <div className="text-xs text-gray-500 flex items-center gap-2 mt-1"><FaMapMarkerAlt className="text-gray-400"/> {(item.locationType === "INTERNATIONAL" || item.locationType === "DIASPORA") ? (item.country || "International") : (item.district || "Unspecified")}</div>
                         {item.craftSector && <div className="text-xs text-gray-500 mt-1">Sector: {item.craftSector}</div>}
                      </td>
                      <td className="px-6 py-4">
                         {item.email && <div className="text-xs text-gray-600 flex items-center gap-2 mb-1"><FaEnvelope className="text-gray-400"/> {item.email}</div>}
                         {item.phone && <div className="text-xs text-gray-600 flex items-center gap-2"><FaPhone className="text-gray-400"/> {item.phone}</div>}
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex flex-col items-start gap-1">
                             {getStatusBadge(item.status)}
                             <span className="text-[10px] text-gray-400">{new Date(item.submittedAt).toLocaleDateString()}</span>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex justify-end gap-2">
                             {item.status !== 'APPROVED' && (
                                <button 
                                    disabled={updating === item.id}
                                    onClick={() => handleStatusUpdate(item.id, item.type, 'APPROVED')}
                                    className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-200 hover:bg-green-100 transition disabled:opacity-50">
                                    Approve
                                </button>
                             )}
                             {item.status !== 'REJECTED' && (
                                <button 
                                    disabled={updating === item.id}
                                    onClick={() => handleStatusUpdate(item.id, item.type, 'REJECTED')}
                                    className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-bold rounded-lg border border-red-200 hover:bg-red-100 transition disabled:opacity-50">
                                    Reject
                                </button>
                             )}
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
