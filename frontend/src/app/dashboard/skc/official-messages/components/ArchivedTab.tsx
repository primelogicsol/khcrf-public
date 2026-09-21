"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FaSearch, FaArchive, FaRedo, FaFilter } from "react-icons/fa";
import api from "@/lib/api";
import { format } from "date-fns";

const STATUS_COLORS: Record<string, string> = {
  ARCHIVED: "bg-gray-100 text-gray-600",
  WITHDRAWN: "bg-rose-100 text-rose-700",
  DECLINED: "bg-red-100 text-red-700",
};

type ToastType = { message: string; type: "success" | "error" };

export default function ArchivedTab() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastType | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/skc/admin/official-messages/messages?status=ARCHIVED&pageSize=100');
      const raw = res.data;
      const data = (raw?.success && raw?.data) ? raw.data : (Array.isArray(raw) ? raw : []);
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to load archived records");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredItems = items.filter(item => {
    const term = searchTerm.toLowerCase();
    const nameMatch = !term || (item.fullName || "").toLowerCase().includes(term) || (item.institution || "").toLowerCase().includes(term);
    const statusMatch = !statusFilter || item.workflowStatus === statusFilter;
    return nameMatch && statusMatch;
  });

  return (
    <div className="space-y-4">
      {toast && (
        <div className={`fixed top-6 right-6 z-[9999] px-5 py-3 rounded-xl shadow-xl text-sm font-bold ${toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.message}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input
            type="text"
            placeholder="Search name or institution..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
        </div>
        <div className="relative">
          <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-white"
          >
            <option value="">All Archive Types</option>
            <option value="ARCHIVED">Archived</option>
            <option value="WITHDRAWN">Withdrawn</option>
            <option value="DECLINED">Declined</option>
          </select>
        </div>
        <span className="text-sm text-gray-500">{filteredItems.length} records</span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          {error} <button onClick={fetchData} className="ml-2 underline font-bold">Retry</button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[800px]">
            <thead className="bg-gray-50/70 text-gray-500 uppercase text-xs font-bold">
              <tr>
                <th className="px-5 py-3">Contributor</th>
                <th className="px-5 py-3">Institution</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Reference</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-16 text-center text-gray-400 animate-pulse">Loading archived records...</td></tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <FaArchive className="mx-auto text-4xl text-gray-200 mb-4" />
                    <p className="text-gray-400 font-medium">No archived records.</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="font-bold text-gray-700">{item.fullName}</div>
                      <div className="text-xs text-gray-400">{item.designation}</div>
                    </td>
                    <td className="px-5 py-3 text-gray-600 max-w-[180px] truncate">{item.institution}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs text-gray-500">{item.category?.title || item.contributorCategory}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[item.workflowStatus] || "bg-gray-100 text-gray-600"}`}>
                        {item.workflowStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs text-gray-500">{item.referenceNumber || "—"}</span>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-400">
                      {item.archivedAt ? format(new Date(item.archivedAt), "MMM d, yyyy") : 
                       item.updatedAt ? format(new Date(item.updatedAt), "MMM d, yyyy") : "—"}
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
