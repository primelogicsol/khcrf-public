"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FaArrowLeft, FaSearch, FaFilter, FaCheck, FaTimes, FaEye, 
  FaUserEdit, FaArchive, FaFolderOpen, FaLink
} from "react-icons/fa";
import api from "@/lib/api";

export default function DocumentationSupportPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    // Attempt to fetch from backend, otherwise use mock data for layout approval
    api.get("/participation/documentation")
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setDocuments(Array.isArray(data) ? data : []);
      })
      .catch((err: any) => {
        setError(err?.response?.data?.message || err.message || "Failed to load data.");
        setDocuments([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = documents.filter(d => {
    const matchesSearch = !search || d.submitter.toLowerCase().includes(search.toLowerCase()) || d.submissionNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || d.status === statusFilter;
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
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Documentation Support</h1>
          <p className="text-sm text-gray-500 mt-1">Review and process public evidence, photographs, certificates, and archival records.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-stone-100 bg-stone-50/60 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 text-xs" />
            <input 
              type="text" 
              placeholder="Search ID or Submitter..." 
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
                <th className="px-6 py-4">Submission ID</th>
                <th className="px-6 py-4">Document Type</th>
                <th className="px-6 py-4">Submitter & Subject</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map(doc => (
                <tr key={doc.id} className="hover:bg-stone-50/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-medium text-stone-600">{doc.submissionNumber}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{doc.type}</td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 font-medium">{doc.subject}</div>
                    <div className="text-xs text-gray-500">By: {doc.submitter}</div>
                  </td>
                  <td className="px-6 py-4 text-xs text-stone-500">{doc.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded border text-[10px] font-black uppercase tracking-wider ${getStatusBadge(doc.status)}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button title="View Documents" className="p-2 hover:bg-stone-100 rounded-lg text-stone-500 transition-colors"><FaEye size={14} /></button>
                      
                      <div className="w-px h-4 bg-stone-200 mx-1"></div>
                      
                      {doc.status === 'APPROVED' ? (
                        <>
                          <button title="Link to Record (Artisan/Object/Story)" className="p-2 hover:bg-stone-100 rounded-lg text-blue-600 transition-colors"><FaLink size={14} /></button>
                        </>
                      ) : (
                        <>
                          <button title="Verify & Approve" className="p-2 hover:bg-stone-100 rounded-lg text-emerald-500 transition-colors"><FaCheck size={14} /></button>
                          <button title="Reject" className="p-2 hover:bg-stone-100 rounded-lg text-red-500 transition-colors"><FaTimes size={14} /></button>
                        </>
                      )}
                      
                      <button title="Archive" className="p-2 hover:bg-stone-100 rounded-lg text-stone-400 transition-colors"><FaArchive size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-stone-500">
                    No documentation submissions found.
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
