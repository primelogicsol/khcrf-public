"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FaSearch, FaEye, FaFilter, FaInbox, FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import api from "@/lib/api";
import { format } from "date-fns";

type ToastType = { message: string; type: "success" | "error" };

export default function SubmissionsTab() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
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
      const res = await api.get('/api/skc/admin/official-messages/messages?status=SUBMITTED&pageSize=100');
      const raw = res.data;
      const data = (raw?.success && raw?.data) ? raw.data : (Array.isArray(raw) ? raw : []);
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to load submissions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleStartReview = async (id: string) => {
    setActionLoading(id);
    try {
      await api.patch(`/api/skc/admin/official-messages/messages/${id}/workflow`, { action: "IDENTITY_APPROVE" });
      showToast("Moved to Identity Review!");
      fetchData();
    } catch {
      showToast("Failed to start review", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredItems = items.filter(item => {
    const term = searchTerm.toLowerCase();
    return !term || (item.fullName || "").toLowerCase().includes(term) || (item.institution || "").toLowerCase().includes(term);
  });

  return (
    <div className="space-y-4">
      {toast && (
        <div className={`fixed top-6 right-6 z-[9999] px-5 py-3 rounded-xl shadow-xl text-sm font-bold ${toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.message}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[200px]">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input
            type="text"
            placeholder="Search by name or institution..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
        </div>
        <span className="text-sm text-gray-500">{filteredItems.length} new submission{filteredItems.length !== 1 ? "s" : ""}</span>
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
                <th className="px-5 py-3">Reference</th>
                <th className="px-5 py-3">Submitted</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-16 text-center text-gray-400 animate-pulse">Loading submissions...</td></tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <FaInbox className="mx-auto text-4xl text-gray-200 mb-4" />
                    <p className="text-gray-400 font-medium">No new submissions awaiting review.</p>
                    <p className="text-gray-400 text-sm mt-1">Submitted messages will appear here when received.</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-black shrink-0">
                          {(item.fullName || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{item.fullName}</div>
                          <div className="text-xs text-gray-500">{item.designation}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-700 font-medium max-w-[200px] truncate">{item.institution}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 bg-brand-secondary/10 text-brand-primary rounded text-xs font-bold">
                        {item.category?.title || item.contributorCategory}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs text-gray-600">{item.referenceNumber || "—"}</span>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500">
                      {item.createdAt ? format(new Date(item.createdAt), "MMM d, yyyy h:mm a") : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleStartReview(item.id)}
                          disabled={actionLoading === item.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
                        >
                          <FaChevronRight className="text-[10px]" />
                          {actionLoading === item.id ? "Processing..." : "Start Review"}
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
    </div>
  );
}
