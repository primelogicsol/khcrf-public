"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FaArrowLeft, FaSearch, FaFilter, FaCheck, FaTimes, FaEye, 
  FaUserEdit, FaArchive, FaBookOpen, FaUserPlus, FaHistory, FaCheckDouble
} from "react-icons/fa";
import api from "@/lib/api";

export default function ArtisanNominationsPage() {
  const [nominations, setNominations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchNominations = () => {
    setLoading(true);
    api
      .get("/admin/master-artisans/nominations")
      .then((res) => {
        let items: any[] = [];
        const payload = res.data;
        if (payload?.data?.data && Array.isArray(payload.data.data)) {
          items = payload.data.data;
        } else if (payload?.data && Array.isArray(payload.data)) {
          items = payload.data;
        } else if (Array.isArray(payload)) {
          items = payload;
        }
        setNominations(items);
        setError("");
      })
      .catch((err: any) => {
        setError(
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err.message ||
          "Failed to load nominations."
        );
        setNominations([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNominations();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/admin/master-artisans/nominations/${id}/status`, { status: newStatus });
      fetchNominations();
    } catch (err: any) {
      alert(err?.response?.data?.error?.message || err?.message || 'Failed to update status');
    }
  };

  const filtered = nominations.filter(n => {
    const matchesSearch = !search || n.nomineeName.toLowerCase().includes(search.toLowerCase()) || n.submissionNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || n.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      SUBMITTED:             "bg-stone-100 text-stone-600 border-stone-200",
      SCREENING:             "bg-blue-50 text-blue-600 border-blue-200",
      UNDER_REVIEW:          "bg-indigo-50 text-indigo-600 border-indigo-200",
      INFORMATION_REQUESTED: "bg-yellow-50 text-yellow-700 border-yellow-200",
      EVIDENCE_VERIFICATION: "bg-amber-50 text-amber-600 border-amber-200",
      APPROVED:              "bg-emerald-50 text-emerald-600 border-emerald-200",
      CONVERTED_TO_ARTISAN:  "bg-teal-50 text-teal-600 border-teal-200",
      REJECTED:              "bg-red-50 text-red-600 border-red-200",
      ARCHIVED:              "bg-stone-50 text-stone-400 border-stone-200"
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
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Artisan Nominations</h1>
          <p className="text-sm text-gray-500 mt-1">Review public nominations, verify evidence, and transition to registry profiles.</p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin w-8 h-8 rounded-full border-4 border-brand-primary border-t-transparent" />
          <span className="ml-3 text-sm text-stone-500">Loading nominations…</span>
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-bold">Could not load nominations</p>
            <p className="mt-1 text-red-600">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-stone-100 bg-stone-50/60 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 text-xs" />
            <input 
              type="text" 
              placeholder="Search ID or Name..." 
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
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="INFORMATION_REQUESTED">Information Requested</option>
              <option value="EVIDENCE_VERIFICATION">Evidence Verification</option>
              <option value="APPROVED">Approved</option>
              <option value="CONVERTED_TO_ARTISAN">Converted to Artisan</option>
              <option value="REJECTED">Rejected</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-stone-50/50 text-[10px] font-black uppercase tracking-wider text-stone-500 border-b border-stone-100">
              <tr>
                <th className="px-6 py-4">Nomination ID</th>
                <th className="px-6 py-4">Nominee</th>
                <th className="px-6 py-4">Craft & District</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Editorial Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map(nom => (
                <tr key={nom.id} className="hover:bg-stone-50/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-medium text-stone-600">{nom.submissionNumber}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{nom.nomineeName}</td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 font-medium">{nom.craft}</div>
                    <div className="text-xs text-gray-500">{nom.district}</div>
                  </td>
                  <td className="px-6 py-4 text-xs text-stone-500">{nom.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded border text-[10px] font-black uppercase tracking-wider ${getStatusBadge(nom.status)}`}>
                      {nom.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button title="View Details" className="p-2 hover:bg-stone-100 rounded-lg text-stone-500 transition-colors"><FaEye size={14} /></button>
                      <button title="Verify Evidence" className="p-2 hover:bg-stone-100 rounded-lg text-amber-500 transition-colors"><FaCheckDouble size={14} /></button>
                      <button title="Assign Reviewer" className="p-2 hover:bg-stone-100 rounded-lg text-blue-500 transition-colors"><FaUserEdit size={14} /></button>
                      
                      <div className="w-px h-4 bg-stone-200 mx-1"></div>
                      
                      {nom.status === 'APPROVED' ? (
                        <>
                          <button title="Convert to Artisan Profile" onClick={() => handleUpdateStatus(nom.id, 'CONVERTED_TO_ARTISAN')} className="p-2 hover:bg-stone-100 rounded-lg text-emerald-600 transition-colors"><FaUserPlus size={14} /></button>
                          <button title="Link to Magazine" className="p-2 hover:bg-stone-100 rounded-lg text-purple-600 transition-colors"><FaBookOpen size={14} /></button>
                        </>
                      ) : (
                        <>
                          <button title="Approve" onClick={() => handleUpdateStatus(nom.id, 'APPROVED')} className="p-2 hover:bg-stone-100 rounded-lg text-emerald-500 transition-colors"><FaCheck size={14} /></button>
                          <button title="Reject" onClick={() => handleUpdateStatus(nom.id, 'REJECTED')} className="p-2 hover:bg-stone-100 rounded-lg text-red-500 transition-colors"><FaTimes size={14} /></button>
                        </>
                      )}
                      
                      <button title="Archive" onClick={() => handleUpdateStatus(nom.id, 'ARCHIVED')} className="p-2 hover:bg-stone-100 rounded-lg text-stone-400 transition-colors"><FaArchive size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-stone-500">
                    No nominations found in the queue.
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
