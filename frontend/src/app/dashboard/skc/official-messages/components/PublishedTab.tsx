"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FaSearch, FaStar, FaEye, FaTimesCircle, FaArchive, FaFilter, FaBullhorn, FaGlobe } from "react-icons/fa";
import Link from "next/link";
import api from "@/lib/api";
import { format } from "date-fns";

type ToastType = { message: string; type: "success" | "error" };

export default function PublishedTab() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
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
      const [msgRes, catRes] = await Promise.all([
        api.get('/api/skc/admin/official-messages/messages?status=PUBLISHED&pageSize=100'),
        api.get('/api/skc/admin/official-messages/categories')
      ]);
      const msgData = msgRes.data;
      const msgs = (msgData?.success && msgData?.data) ? msgData.data : (Array.isArray(msgData) ? msgData : []);
      setItems(Array.isArray(msgs) ? msgs : []);

      const catData = catRes.data;
      const cats = (catData?.success && catData?.data) ? catData.data : (Array.isArray(catData) ? catData : []);
      setCategories(Array.isArray(cats) ? cats : []);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to load published messages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleFeature = async (id: string, currentlyFeatured: boolean) => {
    setActionLoading(`${id}-feature`);
    try {
      await api.post(`/api/skc/admin/official-messages/messages/${id}/feature`);
      showToast(currentlyFeatured ? "Removed from featured" : "Message featured!");
      setItems(prev => prev.map(m => m.id === id ? { ...m, isFeatured: !m.isFeatured } : m));
    } catch {
      showToast("Failed to update featured status", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleWorkflow = async (id: string, action: string, confirmMsg: string) => {
    if (!confirm(confirmMsg)) return;
    setActionLoading(`${id}-${action}`);
    try {
      await api.patch(`/api/skc/admin/official-messages/messages/${id}/workflow`, { action });
      showToast(`Message ${action === "ARCHIVE" ? "archived" : "unpublished"} successfully.`);
      fetchData();
    } catch {
      showToast("Action failed", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredItems = items.filter(item => {
    const term = searchTerm.toLowerCase();
    const nameMatch = !term || (item.fullName || "").toLowerCase().includes(term) || (item.institution || "").toLowerCase().includes(term);
    const catMatch = !categoryFilter || item.category?.id === categoryFilter;
    return nameMatch && catMatch;
  });

  return (
    <div className="space-y-4">
      {toast && (
        <div className={`fixed top-6 right-6 z-[9999] px-5 py-3 rounded-xl shadow-xl text-sm font-bold ${toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.message}
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 flex-1">
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
          {categories.length > 0 && (
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-white"
              >
                <option value="">All Categories</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
          )}
          <span className="text-sm text-gray-500">{filteredItems.length} published message{filteredItems.length !== 1 ? "s" : ""}</span>
        </div>
        <Link href="/state-of-kashmir-crafts/official-messages" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-all shrink-0">
          <FaGlobe /> View Public Page
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          {error} <button onClick={fetchData} className="ml-2 underline font-bold">Retry</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[900px]">
            <thead className="bg-gray-50/70 text-gray-500 uppercase text-xs font-bold">
              <tr>
                <th className="px-5 py-3">Contributor</th>
                <th className="px-5 py-3">Institution</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Reference</th>
                <th className="px-5 py-3">Published</th>
                <th className="px-5 py-3">Featured</th>
                <th className="px-5 py-3 text-center">Views</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-32" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-24" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-20" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-24" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-20" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-6" /></td>
                    <td className="px-5 py-4 text-center"><div className="h-4 bg-gray-100 rounded w-8 mx-auto" /></td>
                    <td className="px-5 py-4"><div className="h-8 bg-gray-100 rounded w-24 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <FaBullhorn className="mx-auto text-4xl text-gray-200 mb-4" />
                    <p className="text-gray-400 font-medium">No published messages yet.</p>
                    <p className="text-gray-400 text-sm mt-1">Approved messages will appear here after publication.</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {item.photographUrl ? (
                          <img src={item.photographUrl} alt={item.fullName} className="w-8 h-8 rounded-full object-cover border border-gray-100" />
                        ) : (
                          <div data-ui-icon className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center  text-xs font-bold">
                            {(item.fullName || "?").charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-gray-900">{item.fullName}</div>
                          <div className="text-xs text-gray-500">{item.designation}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-700 font-medium max-w-[180px] truncate">{item.institution}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 bg-brand-secondary/10 text-brand-primary rounded text-xs font-bold">
                        {item.category?.title || item.contributorCategory}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs text-gray-600">{item.referenceNumber}</span>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500">
                      {item.publishedAt ? format(new Date(item.publishedAt), "MMM d, yyyy") : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleFeature(item.id, item.isFeatured)}
                        disabled={actionLoading === `${item.id}-feature`}
                        title={item.isFeatured ? "Remove from featured" : "Feature this message"}
                        className={`p-1 rounded transition-colors ${item.isFeatured ? "text-amber-500 hover:text-amber-600" : "text-gray-300 hover:text-amber-400"}`}
                      >
                        <FaStar className="text-base" />
                      </button>
                    </td>
                    <td className="px-5 py-3 text-center text-xs text-gray-500 font-medium">
                      {(item.pageViews ?? 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/state-of-kashmir-crafts/official-messages`} target="_blank" title="View public page"
                          className="p-1.5 text-gray-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors">
                          <FaEye className="text-xs" />
                        </Link>
                        <button
                          onClick={() => handleWorkflow(item.id, "UNPUBLISH", "Unpublish this message? It will move back to Submitted status.")}
                          disabled={!!actionLoading}
                          title="Unpublish"
                          className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <FaTimesCircle className="text-xs" />
                        </button>
                        <button
                          onClick={() => handleWorkflow(item.id, "ARCHIVE", "Archive this message? It will be removed from the public register.")}
                          disabled={!!actionLoading}
                          title="Archive"
                          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <FaArchive className="text-xs" />
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
