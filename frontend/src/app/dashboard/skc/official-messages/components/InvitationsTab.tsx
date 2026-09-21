"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FaSearch,
  FaCopy,
  FaPaperPlane,
  FaCalendarPlus,
  FaBan,
  FaEye,
  FaPlus,
  FaFilter,
  FaSpinner,
  FaEnvelopeOpenText,
  FaExclamationTriangle,
} from "react-icons/fa";
import api from "@/lib/api";
import { format } from "date-fns";

// --- Types -------------------------------------------------------------------

interface InvitationMessage {
  id: string;
}

interface Invitation {
  id: string;
  tokenLastFour: string;
  fullName?: string;
  contributorName?: string;
  designation?: string;
  institution?: string;
  organization?: string;
  email?: string;
  category?: string;
  status: string;
  expiresAt?: string;
  createdAt?: string;
  message?: InvitationMessage | null;
}

// --- Status config -----------------------------------------------------------

type StatusKey =
  | "DRAFT"
  | "SENT"
  | "DELIVERED"
  | "OPENED"
  | "DRAFT_STARTED"
  | "SUBMITTED"
  | "EXPIRED"
  | "REVOKED"
  | "DECLINED";

const STATUS_CONFIG: Record<StatusKey, { label: string; className: string }> = {
  DRAFT:         { label: "Draft",         className: "bg-gray-100 text-gray-600" },
  SENT:          { label: "Sent",          className: "bg-blue-100 text-blue-700" },
  DELIVERED:     { label: "Delivered",     className: "bg-cyan-100 text-cyan-700" },
  OPENED:        { label: "Opened",        className: "bg-cyan-100 text-cyan-700" },
  DRAFT_STARTED: { label: "Draft Started", className: "bg-indigo-100 text-indigo-700" },
  SUBMITTED:     { label: "Submitted",     className: "bg-green-100 text-green-700" },
  EXPIRED:       { label: "Expired",       className: "bg-red-100 text-red-700" },
  REVOKED:       { label: "Revoked",       className: "bg-red-900/20 text-red-900" },
  DECLINED:      { label: "Declined",      className: "bg-rose-100 text-rose-700" },
};

const ALL_STATUSES: StatusKey[] = [
  "DRAFT", "SENT", "DELIVERED", "OPENED", "DRAFT_STARTED",
  "SUBMITTED", "EXPIRED", "REVOKED", "DECLINED",
];

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as StatusKey];
  if (!cfg) {
    return (
      <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs font-bold uppercase tracking-wide">
        {status}
      </span>
    );
  }
  return (
    <span
      className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

// --- Toast ------------------------------------------------------------------

interface ToastItem {
  id: number;
  message: string;
  type: "success" | "error";
}

let toastCounter = 0;

function ToastContainer({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-xl shadow-lg text-sm font-semibold text-white flex items-center gap-2 pointer-events-auto ${
            t.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {t.type === "success" ? "\u2713" : "\u2715"} {t.message}
        </div>
      ))}
    </div>
  );
}

// --- Main Component ---------------------------------------------------------

export default function InvitationsTab() {
  const [items, setItems] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // -- Toast helpers ----------------------------------------------------------

  const showToast = useCallback((message: string, type: "success" | "error") => {
    const id = ++toastCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  // -- Data fetching ----------------------------------------------------------

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/api/skc/admin/official-messages/invitations");
      const data = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      setItems(data);
    } catch (err: unknown) {
      console.error("Failed to fetch invitations", err);
      const msg =
        err instanceof Error ? err.message : "Failed to load invitations.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // -- Filtering --------------------------------------------------------------

  const filteredItems = items.filter((item) => {
    const term = searchTerm.toLowerCase();
    const name = (item.fullName || item.contributorName || "").toLowerCase();
    const inst = (item.institution || item.organization || "").toLowerCase();
    const matchSearch = !term || name.includes(term) || inst.includes(term);
    const matchStatus = statusFilter === "ALL" || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // -- Actions ----------------------------------------------------------------

  // Token links can no longer be copied for security reasons.

  const handleResend = async (item: Invitation) => {
    setActionLoading(`resend-${item.id}`);
    try {
      await api.patch(`/api/skc/admin/official-messages/invitations/${item.id}/resend`);
      showToast("Invitation resent successfully.", "success");
      await fetchData();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to resend invitation.";
      showToast(msg, "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleExtend = async (item: Invitation) => {
    setActionLoading(`extend-${item.id}`);
    try {
      await api.patch(`/api/skc/admin/official-messages/invitations/${item.id}/extend`);
      showToast("Invitation deadline extended.", "success");
      await fetchData();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to extend invitation.";
      showToast(msg, "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevoke = async (item: Invitation) => {
    const name = item.fullName || item.contributorName || "this invitee";
    if (
      !window.confirm(
        `Are you sure you want to revoke the invitation for ${name}? This cannot be undone.`
      )
    ) {
      return;
    }
    setActionLoading(`revoke-${item.id}`);
    try {
      await api.patch(`/api/skc/admin/official-messages/invitations/${item.id}/revoke`);
      showToast("Invitation revoked.", "success");
      await fetchData();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to revoke invitation.";
      showToast(msg, "error");
    } finally {
      setActionLoading(null);
    }
  };

  // -- Visibility helpers -----------------------------------------------------

  const canResend = (status: string) =>
    ["SENT", "DRAFT", "EXPIRED"].includes(status);
  const canExtend = (status: string) =>
    ["SENT", "EXPIRED"].includes(status);
  const canRevoke = (status: string) =>
    !["REVOKED", "SUBMITTED"].includes(status);

  // -- Render -----------------------------------------------------------------

  return (
    <>
      <ToastContainer toasts={toasts} />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <FaEnvelopeOpenText data-ui-icon  className="" />
              Invitations
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage dignitary and institutional invitations
            </p>
          </div>
          <Link
            href="/dashboard/skc/official-messages/create-invitation"
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-brand-primary/20 hover:-translate-y-0.5 transition-all whitespace-nowrap"
          >
            <FaPlus className="text-xs" />
            Create Invitation
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 bg-gray-50/30">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              placeholder="Search name or institution..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-white"
            />
          </div>

          {/* Status dropdown */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-8 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-white appearance-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_CONFIG[s].label}
                </option>
              ))}
            </select>
          </div>

          {/* Count summary */}
          <div className="ml-auto flex items-center text-xs text-gray-500 font-medium whitespace-nowrap self-center">
            Showing&nbsp;
            <span className="mx-1 text-gray-800 font-bold">{filteredItems.length}</span>
            &nbsp;of&nbsp;
            <span className="mx-1 text-gray-800 font-bold">{items.length}</span>
            &nbsp;invitation{items.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Name / Designation</th>
                <th className="px-6 py-4">Institution</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Expiry</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {/* Loading */}
              {loading && (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-3">
                      <FaSpinner data-ui-icon  className="animate-spin text-2xl /50" />
                      <span className="text-sm font-medium">Loading invitations...</span>
                    </div>
                  </td>
                </tr>
              )}

              {/* Error */}
              {!loading && error && (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <FaExclamationTriangle className="text-2xl text-red-400" />
                      <p className="text-sm font-semibold text-red-600">{error}</p>
                      <button
                        onClick={fetchData}
                        className="mt-1 px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-lg hover:opacity-90 transition"
                      >
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {/* Empty */}
              {!loading && !error && filteredItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <FaEnvelopeOpenText className="text-3xl text-gray-200" />
                      <p className="text-sm font-semibold text-gray-400">
                        {items.length === 0
                          ? "No invitations yet. Create one to get started."
                          : "No invitations match your filters."}
                      </p>
                      {items.length === 0 && (
                        <Link
                          href="/dashboard/skc/official-messages/create-invitation"
                          className="mt-1 px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-lg hover:opacity-90 transition"
                        >
                          + Create Invitation
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              )}

              {/* Data rows */}
              {!loading &&
                !error &&
                filteredItems.map((item) => {
                  const displayName = item.fullName || item.contributorName || "\u2014";
                  const displayInst = item.institution || item.organization || "\u2014";

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/60 transition-colors group"
                    >
                      {/* Name / Designation */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 leading-tight">
                          {displayName}
                        </div>
                        {item.designation && (
                          <div className="text-xs text-gray-500 mt-0.5">
                            {item.designation}
                          </div>
                        )}
                      </td>

                      {/* Institution */}
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        {displayInst}
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {item.email || "\u2014"}
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 text-gray-500 text-xs font-medium uppercase tracking-wide">
                        {item.category || "\u2014"}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <StatusBadge status={item.status} />
                      </td>

                      {/* Expiry */}
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {item.expiresAt
                          ? format(new Date(item.expiresAt), "MMM d, yyyy")
                          : "\u2014"}
                      </td>

                      {/* Submitted (createdAt) */}
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {item.createdAt
                          ? format(new Date(item.createdAt), "MMM d, yyyy")
                          : "\u2014"}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* No copy link button for security */}
                          {/* Resend: SENT | DRAFT | EXPIRED */}
                          {canResend(item.status) && (
                            <button
                              onClick={() => handleResend(item)}
                              disabled={actionLoading === `resend-${item.id}`}
                              title="Resend invitation"
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {actionLoading === `resend-${item.id}` ? (
                                <FaSpinner className="text-xs animate-spin" />
                              ) : (
                                <FaPaperPlane className="text-xs" />
                              )}
                            </button>
                          )}

                          {/* Extend: SENT | EXPIRED */}
                          {canExtend(item.status) && (
                            <button
                              onClick={() => handleExtend(item)}
                              disabled={actionLoading === `extend-${item.id}`}
                              title="Extend deadline"
                              className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {actionLoading === `extend-${item.id}` ? (
                                <FaSpinner className="text-xs animate-spin" />
                              ) : (
                                <FaCalendarPlus className="text-xs" />
                              )}
                            </button>
                          )}

                          {/* Revoke: not REVOKED | SUBMITTED */}
                          {canRevoke(item.status) && (
                            <button
                              onClick={() => handleRevoke(item)}
                              disabled={actionLoading === `revoke-${item.id}`}
                              title="Revoke invitation"
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {actionLoading === `revoke-${item.id}` ? (
                                <FaSpinner className="text-xs animate-spin" />
                              ) : (
                                <FaBan className="text-xs" />
                              )}
                            </button>
                          )}

                          {/* View Submission: only when message exists */}
                          {item.message?.id && (
                            <Link
                              href={`/dashboard/skc/official-messages/review/${item.message.id}`}
                              title="View submission"
                              className="p-2 text-gray-400 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <FaEye className="text-xs" />
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
