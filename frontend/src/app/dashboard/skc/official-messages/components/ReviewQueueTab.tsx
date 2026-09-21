"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FaSearch, FaCheck, FaTimes, FaExclamationTriangle, FaFilter, FaChevronRight, FaInbox, FaBan } from "react-icons/fa";
import api from "@/lib/api";
import { format } from "date-fns";

const WORKFLOW_STATUS_COLORS: Record<string, string> = {
  SUBMITTED: "bg-indigo-100 text-indigo-700",
  IDENTITY_REVIEW: "bg-purple-100 text-purple-700",
  AUTHORITY_VERIFICATION: "bg-violet-100 text-violet-700",
  EDITORIAL_REVIEW: "bg-pink-100 text-pink-700",
  REVISION_REQUESTED: "bg-orange-100 text-orange-700",
  AWAITING_CONTRIBUTOR_APPROVAL: "bg-teal-100 text-teal-700",
  APPROVED: "bg-green-100 text-green-700",
};

const IDENTITY_COLORS: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-600",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

const WORKFLOW_ACTIONS: Record<string, { label: string; action: string; color: string }[]> = {
  SUBMITTED: [{ label: "Start Identity Review", action: "IDENTITY_APPROVE", color: "bg-purple-600 text-white" }],
  IDENTITY_REVIEW: [{ label: "Verify Authority", action: "AUTHORITY_VERIFY", color: "bg-violet-600 text-white" }],
  AUTHORITY_VERIFICATION: [{ label: "Send to Editorial", action: "EDITORIAL_APPROVE", color: "bg-pink-600 text-white" }],
  EDITORIAL_REVIEW: [
    { label: "Request Revision", action: "REQUEST_REVISION", color: "bg-amber-500 text-white" },
    { label: "Approve", action: "APPROVE", color: "bg-green-600 text-white" },
  ],
  REVISION_REQUESTED: [{ label: "Re-Submit for Approval", action: "APPROVE", color: "bg-green-600 text-white" }],
  AWAITING_CONTRIBUTOR_APPROVAL: [{ label: "Publish Now", action: "PUBLISH", color: "bg-emerald-600 text-white" }],
  APPROVED: [
    { label: "Schedule", action: "SCHEDULE", color: "bg-cyan-600 text-white" },
    { label: "Publish Now", action: "PUBLISH", color: "bg-emerald-600 text-white" },
  ],
};

type ToastType = { message: string; type: "success" | "error" };

export default function ReviewQueueTab() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastType | null>(null);
  const [revisionReason, setRevisionReason] = useState("");
  const [revisionTarget, setRevisionTarget] = useState<string | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = statusFilter ? `?reviewQueue=true&status=${statusFilter}` : "?reviewQueue=true";
      const res = await api.get(`/api/skc/admin/official-messages/messages${params}`);
      const raw = res.data;
      const data = (raw?.success && raw?.data) ? raw.data : (Array.isArray(raw) ? raw : []);
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to load review queue");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleWorkflowAction = async (id: string, action: string, reason?: string) => {
    if (action === "DECLINE" && !confirm("Are you sure you want to decline this message? This action cannot be easily reversed.")) return;
    setActionLoading(`${id}-${action}`);
    try {
      await api.patch(`/api/skc/admin/official-messages/messages/${id}/workflow`, { action, reason });
      showToast(`Action "${action.replace(/_/g, " ")}" applied successfully!`);
      fetchData();
    } catch (err: any) {
      showToast(err?.response?.data?.error || "Action failed", "error");
    } finally {
      setActionLoading(null);
      setRevisionTarget(null);
      setRevisionReason("");
    }
  };

  const filteredItems = items.filter(item => {
    const term = searchTerm.toLowerCase();
    const name = (item.fullName || "").toLowerCase();
    const inst = (item.institution || "").toLowerCase();
    const title = (item.title || "").toLowerCase();
    const matches = !term || name.includes(term) || inst.includes(term) || title.includes(term);
    const statusMatch = !statusFilter || item.workflowStatus === statusFilter;
    return matches && statusMatch;
  });

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[9999] px-5 py-3 rounded-xl shadow-xl text-sm font-bold ${toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.message}
        </div>
      )}

      {/* Revision Reason Modal */}
      {revisionTarget && (
        <div className="fixed inset-0 z-[1000] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-bold text-gray-900 mb-3">Request Revision</h3>
            <p className="text-sm text-gray-500 mb-4">Provide a reason for requesting revision. This will be visible to the contributor.</p>
            <textarea
              rows={4}
              value={revisionReason}
              onChange={e => setRevisionReason(e.target.value)}
              placeholder="Describe what needs to be revised..."
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => { setRevisionTarget(null); setRevisionReason(""); }} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
              <button
                onClick={() => handleWorkflowAction(revisionTarget, "REQUEST_REVISION", revisionReason)}
                className="px-4 py-2 bg-amber-500 text-white text-sm font-bold rounded-xl hover:bg-amber-600 transition-colors"
              >
                Send Revision Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input
            type="text"
            placeholder="Search name, institution, title..."
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
            <option value="">All Review Stages</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="IDENTITY_REVIEW">Identity Review</option>
            <option value="AUTHORITY_VERIFICATION">Authority Verification</option>
            <option value="EDITORIAL_REVIEW">Editorial Review</option>
            <option value="REVISION_REQUESTED">Revision Requested</option>
            <option value="AWAITING_CONTRIBUTOR_APPROVAL">Awaiting Approval</option>
            <option value="APPROVED">Approved</option>
          </select>
        </div>
        <span className="text-sm text-gray-500">{filteredItems.length} in queue</span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm flex items-center gap-2">
          <FaExclamationTriangle /> {error}
          <button onClick={fetchData} className="ml-auto underline font-bold">Retry</button>
        </div>
      )}

      {/* Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-3/4 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-1/2 mb-5" />
              <div className="h-8 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <FaInbox className="mx-auto text-4xl text-gray-200 mb-4" />
          <p className="text-gray-400 font-medium">No messages in the review queue.</p>
          <p className="text-gray-400 text-sm mt-1">When submissions arrive they will appear here for review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map(item => {
            const actions = WORKFLOW_ACTIONS[item.workflowStatus] || [];
            return (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4 hover:shadow-md transition-all">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div data-ui-icon className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center  font-black text-sm shrink-0">
                      {(item.fullName || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{item.fullName}</div>
                      <div className="text-xs text-gray-500">{item.designation}</div>
                      <div className="text-xs text-gray-500">{item.institution}</div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${WORKFLOW_STATUS_COLORS[item.workflowStatus] || "bg-gray-100 text-gray-600"}`}>
                    {item.workflowStatus?.replace(/_/g, " ")}
                  </span>
                </div>

                {/* Message title */}
                {item.title && (
                  <div className="bg-gray-50 rounded-xl px-4 py-2 text-sm text-gray-700 font-medium italic">
                    &ldquo;{item.title}&rdquo;
                  </div>
                )}

                {/* Verification status chips */}
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${IDENTITY_COLORS[item.identityStatus] || "bg-gray-100 text-gray-600"}`}>
                    Identity: {item.identityStatus}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${IDENTITY_COLORS[item.authorityStatus] || "bg-gray-100 text-gray-600"}`}>
                    Authority: {item.authorityStatus}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${IDENTITY_COLORS[item.editorialStatus] || "bg-gray-100 text-gray-600"}`}>
                    Editorial: {item.editorialStatus}
                  </span>
                </div>

                {/* Date */}
                <div className="text-xs text-gray-400">
                  Submitted: {item.createdAt ? format(new Date(item.createdAt), "MMM d, yyyy") : "—"}
                  {item.assignedReviewerId && <span className="ml-3">Reviewer assigned</span>}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-50">
                  {actions.map(({ label, action, color }) => (
                    <button
                      key={action}
                      onClick={() => {
                        if (action === "REQUEST_REVISION") {
                          setRevisionTarget(item.id);
                        } else {
                          handleWorkflowAction(item.id, action);
                        }
                      }}
                      disabled={!!actionLoading}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all disabled:opacity-50 ${color}`}
                    >
                      <FaCheck className="text-[10px]" />
                      {actionLoading === `${item.id}-${action}` ? "Processing..." : label}
                    </button>
                  ))}
                  <button
                    onClick={() => handleWorkflowAction(item.id, "DECLINE")}
                    disabled={!!actionLoading}
                    className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-red-600 hover:text-white transition-all disabled:opacity-50 ml-auto"
                  >
                    <FaTimes className="text-[10px]" /> Decline
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
