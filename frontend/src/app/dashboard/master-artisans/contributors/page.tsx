"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FaArrowLeft, FaSearch, FaFilter, FaCheck, FaTimes, FaEye, 
  FaUserEdit, FaArchive, FaUserCheck
} from "react-icons/fa";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

export default function ContributorApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const updateStatus = async (id: string, status: string) => {
    try {
      setActionLoading(id);
      await api.patch(`/participation/contributor/${id}`, { status });
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      toast.success(`Application marked as ${status}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    // Attempt to fetch from backend, otherwise use mock data for layout approval
    api.get("/participation/contributor")
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setApplications(Array.isArray(data) ? data : []);
      })
      .catch((err: any) => {
        setError(err?.response?.data?.message || err.message || "Failed to load data.");
        setApplications([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = applications.filter(a => {
    const matchesSearch = !search || a.applicant.toLowerCase().includes(search.toLowerCase()) || a.submissionNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      SUBMITTED: "bg-stone-100 text-stone-600 border-stone-200",
      SCREENING: "bg-blue-50 text-blue-600 border-blue-200",
      VERIFICATION: "bg-amber-50 text-amber-600 border-amber-200",
      APPROVED: "bg-emerald-50 text-emerald-600 border-emerald-200",
      REJECTED: "bg-red-50 text-red-600 border-red-200",
      ARCHIVED: "bg-stone-50 text-stone-400 border-stone-200"
    };
    return map[status] || "bg-gray-50 text-gray-600 border-gray-200";
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/master-artisans" className="p-2 rounded-full hover:bg-stone-100 text-stone-500 transition-colors">
          <FaArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Contributor Applications</h1>
          <p className="text-sm text-gray-500 mt-1">Review applications for editorial roles, portfolio verification, and assignments.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-stone-100 bg-stone-50/60 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 text-xs" />
            <input 
              type="text" 
              placeholder="Search Applicant or ID..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-4 py-2 text-xs border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-brand-primary w-full sm:w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="text-stone-300 text-xs" />
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="py-2 pl-3 pr-8 text-xs border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-brand-primary font-medium text-stone-700 appearance-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="SCREENING">Screening</option>
              <option value="VERIFICATION">Verification</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-stone-50/50 text-[10px] font-black uppercase tracking-wider text-stone-500 border-b border-stone-100">
              <tr>
                <th className="px-6 py-4">Application ID</th>
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Expertise & Languages</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map(app => (
                <tr key={app.id} className="hover:bg-stone-50/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-medium text-stone-600">{app.submissionNumber}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{app.applicant}</td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 font-medium">{app.expertise}</div>
                    <div className="text-xs text-gray-500">{app.languages}</div>
                  </td>
                  <td className="px-6 py-4 text-xs text-stone-500">{app.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded border text-[10px] font-black uppercase tracking-wider ${getStatusBadge(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button title="View Application & Portfolio" onClick={() => toast.success("View coming soon")} disabled={actionLoading === app.id} className="p-2 hover:bg-stone-100 rounded-lg text-stone-500 transition-colors disabled:opacity-50"><FaEye size={14} /></button>
                      <button title="Assign Interview" onClick={() => updateStatus(app.id, 'VERIFICATION')} disabled={actionLoading === app.id} className="p-2 hover:bg-stone-100 rounded-lg text-blue-500 transition-colors disabled:opacity-50"><FaUserEdit size={14} /></button>
                      
                      <div className="w-px h-4 bg-stone-200 mx-1"></div>
                      
                      {app.status === 'APPROVED' ? (
                        <>
                          <button title="Create Contributor Account" onClick={() => toast.success("Account creation coming soon")} disabled={actionLoading === app.id} className="p-2 hover:bg-stone-100 rounded-lg text-emerald-600 transition-colors disabled:opacity-50"><FaUserCheck size={14} /></button>
                        </>
                      ) : (
                        <>
                          <button title="Approve" onClick={() => updateStatus(app.id, 'APPROVED')} disabled={actionLoading === app.id} className="p-2 hover:bg-stone-100 rounded-lg text-emerald-500 transition-colors disabled:opacity-50"><FaCheck size={14} /></button>
                          <button title="Reject" onClick={() => updateStatus(app.id, 'REJECTED')} disabled={actionLoading === app.id} className="p-2 hover:bg-stone-100 rounded-lg text-red-500 transition-colors disabled:opacity-50"><FaTimes size={14} /></button>
                        </>
                      )}
                      
                      <button title="Archive" onClick={() => updateStatus(app.id, 'ARCHIVED')} disabled={actionLoading === app.id} className="p-2 hover:bg-stone-100 rounded-lg text-stone-400 transition-colors disabled:opacity-50"><FaArchive size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-stone-500">
                    No contributor applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
