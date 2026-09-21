"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FaSearch, FaClock, FaCalendarCheck, FaBullhorn, FaTrash, FaFilter } from "react-icons/fa";
import api from "@/lib/api";
import { format } from "date-fns";

type ToastType = { message: string; type: "success" | "error" };

export default function ScheduledTab() {
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
      const res = await api.get('/api/skc/admin/official-messages/messages?status=SCHEDULED&pageSize=100');
      const raw = res.data;
      const data = (raw?.success && raw?.data) ? raw.data : (Array.isArray(raw) ? raw : []);
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to load scheduled messages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handlePublishNow = async (id: string) => {
    if (!confirm("Publish this message now?")) return;
    setActionLoading(id);
    try {
      await api.patch(`/api/skc/admin/official-messages/messages/${id}/workflow`, { action: "PUBLISH" });
      showToast("Message published successfully!");
      fetchData();
    } catch {
      showToast("Failed to publish", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnschedule = async (id: string) => {
    if (!confirm("Unschedule this message? It will return to Approved status.")) return;
    setActionLoading(id);
    try {
      await api.patch(`/api/skc/admin/official-messages/messages/${id}/workflow`, { action: "APPROVE" });
      showToast("Message unscheduled.");
      fetchData();
    } catch {
      showToast("Failed to unschedule", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredItems = items.filter(item => {
    const term = searchTerm.toLowerCase();
    return !term || (item.fullName || "").toLowerCase().includes(term) || (item.institution || "").toLowerCase().includes(term);
  });

  const isImminent = (date: string | null) => date && new Date(date) <= new Date(Date.now() + 24 * 60 * 60 * 1000);

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
        <span className="text-sm text-gray-500">{filteredItems.length} scheduled</span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          {error} <button onClick={fetchData} className="ml-2 underline font-bold">Retry</button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[700px]">
            <thead className="bg-gray-50/70 text-gray-500 uppercase text-xs font-bold">
              <tr>
                <th className="px-5 py-3">Contributor</th>
                <th className="px-5 py-3">Institution</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Scheduled For</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="px-5 py-16 text-center text-gray-400 animate-pulse">Loading scheduled messages...</td></tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <FaClock className="mx-auto text-4xl text-gray-200 mb-4" />
                    <p className="text-gray-400 font-medium">No messages scheduled for publication.</p>
                    <p className="text-gray-400 text-sm mt-1">Approved messages can be scheduled from the Review Queue.</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => (
                  <tr key={item.id} className={`hover:bg-gray-50/50 transition-colors group ${isImminent(item.scheduledFor) ? "bg-amber-50/30" : ""}`}>
                    <td className="px-5 py-3">
                      <div className="font-bold text-gray-900">{item.fullName}</div>
                      <div className="text-xs text-gray-500">{item.designation}</div>
                    </td>
                    <td className="px-5 py-3 text-gray-700 font-medium">{item.institution}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 bg-brand-secondary/10 text-brand-primary rounded text-xs font-bold">
                        {item.category?.title || item.contributorCategory}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {item.scheduledFor ? (
                        <div>
                          <div className={`text-sm font-bold flex items-center gap-1 ${isImminent(item.scheduledFor) ? "text-amber-600" : "text-gray-800"}`}>
                            <FaCalendarCheck className="text-xs" />
                            {format(new Date(item.scheduledFor), "MMM d, yyyy")}
                          </div>
                          {isImminent(item.scheduledFor) && (
                            <div className="text-xs text-amber-600 font-medium mt-0.5">Publishing soon</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">No date set</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handlePublishNow(item.id)}
                          disabled={actionLoading === item.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                        >
                          <FaBullhorn className="text-[10px]" />
                          {actionLoading === item.id ? "Publishing..." : "Publish Now"}
                        </button>
                        <button
                          onClick={() => handleUnschedule(item.id)}
                          disabled={!!actionLoading}
                          title="Unschedule"
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <FaTrash className="text-xs" />
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
