"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import api from "@/lib/api";
import {
  FaEye, FaTimes, FaSearch, FaDownload, FaSyncAlt, FaReceipt,
  FaCheckCircle, FaExclamationCircle, FaShieldAlt, FaFilter,
  FaSort, FaSortUp, FaSortDown, FaChevronLeft, FaChevronRight,
  FaBan, FaCheck, FaUniversity, FaClipboardList,
  FaExternalLinkAlt, FaCalendarAlt, FaUser, FaEnvelope,
  FaPhone, FaTag, FaInfoCircle, FaHistory,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { normalizeArray } from "@/lib/normalize";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Donor {
  id: string; name: string; email: string; phone: string | null;
  type: string; isAnonymous: boolean; recognitionConsent: boolean;
}
interface Allocation {
  id: string; amount: number; category: { id: string; name: string } | null;
}
interface Receipt {
  id: string; receiptNumber: string; receiptUrl: string | null;
  status: string; createdAt: string;
}
interface Refund {
  id: string; razorpayRefundId: string; amount: number;
  status: string; reason: string | null; createdAt: string;
}
interface DonationTransaction {
  id: string; amount: number; currency: string; status: string;
  razorpayOrderId: string | null; razorpayPaymentId: string | null;
  paymentMethod: string | null; capturedAt: string | null;
  settlementStatus: string; metadata: Record<string, unknown>;
  createdAt: string; donor: Donor | null;
  receipts: Receipt[]; allocations: Allocation[]; refunds: Refund[];
}
interface WebhookEvent {
  id: string; eventType: string; payload: Record<string, unknown>;
  processed: boolean; error: string | null; createdAt: string;
}
interface KPIStats {
  totalDonations: number; donationsToday: number; donationsThisMonth: number;
  onlineTotalDonations: number; offlineTotalDonations: number;
  successfulPayments: number; failedPayments: number; pendingPayments: number;
  offlinePendingVerification: number; refunds: number; refundAmount: number;
  topDonationPurpose: string; donorCount: number;
}
interface OfflineSubmission {
  id: string; paymentMethod?: string; amount?: number; currency?: string;
  utrNumber?: string; instrumentNumber?: string; issuingBank?: string;
  originatingBank?: string; paymentStatus?: string; submissionStatus?: string;
  status?: string; adminNotes?: string; rejectionReason?: string;
  createdAt: string;
  donationIntent?: {
    name: string; email: string; phone?: string; amount: number;
    currency: string; purpose: string; paymentMethod: string; donorType?: string;
  };
}
interface AuditLogEntry {
  id: string;
  action: string;
  entityType?: string;
  entityId?: string;
  userId?: string;
  details?: Record<string, unknown>;
  createdAt: string;
}

// ─── Toast ────────────────────────────────────────────────────────────────────
type ToastType = "success" | "error" | "info" | "warning";
interface Toast { id: string; type: ToastType; title: string; message?: string; }

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div key={t.id}
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.95 }}
            transition={{ duration: 0.22 }}
            className={`pointer-events-auto flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl border min-w-[300px] max-w-sm ${
              t.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : t.type === "error" ? "bg-red-50 border-red-200 text-red-900"
              : t.type === "warning" ? "bg-amber-50 border-amber-200 text-amber-900"
              : "bg-blue-50 border-blue-200 text-blue-900"
            }`}>
            <span className="text-lg shrink-0 mt-0.5">
              {t.type === "success" ? "✅" : t.type === "error" ? "❌" : t.type === "warning" ? "⚠️" : "ℹ️"}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm leading-tight">{t.title}</p>
              {t.message && <p className="text-xs mt-0.5 opacity-75 leading-snug">{t.message}</p>}
            </div>
            <button onClick={() => onDismiss(t.id)} className="shrink-0 text-current opacity-40 hover:opacity-70 transition-opacity mt-0.5">
              <FaTimes size={11} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const add = useCallback((type: ToastType, title: string, message?: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5500);
  }, []);
  const dismiss = useCallback((id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);
  return { toasts, add, dismiss };
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
interface ConfirmModalProps {
  isOpen: boolean; title: string; description: string;
  confirmLabel?: string; confirmColor?: "red" | "emerald" | "amber" | "brand";
  requireInput?: { label: string; placeholder: string; required: boolean };
  onConfirm: (value?: string) => void; onCancel: () => void;
}
function ConfirmModal({ isOpen, title, description, confirmLabel = "Confirm", confirmColor = "brand", requireInput, onConfirm, onCancel }: ConfirmModalProps) {
  const [val, setVal] = useState("");
  const [err, setErr] = useState("");
  // Reset form state when modal opens — using a ref to avoid setState-in-effect lint rule
  const prevOpen = useRef(false);
  if (isOpen && !prevOpen.current) { prevOpen.current = true; }
  if (!isOpen && prevOpen.current) { prevOpen.current = false; }
  if (!isOpen) return null;
  const handleConfirm = () => {
    if (requireInput?.required && !val.trim()) { setErr(`${requireInput.label} is required.`); return; }
    onConfirm(val.trim() || undefined);
  };
  const btnCls = confirmColor === "red" ? "bg-red-600 hover:bg-red-700"
    : confirmColor === "emerald" ? "bg-emerald-600 hover:bg-emerald-700"
    : confirmColor === "amber" ? "bg-amber-500 hover:bg-amber-600"
    : "bg-brand-primary hover:bg-brand-dark";
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onCancel}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-black text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">{description}</p>
        {requireInput && (
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              {requireInput.label}{requireInput.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea rows={3} placeholder={requireInput.placeholder} value={val}
              onChange={(e) => { setVal(e.target.value); setErr(""); }} autoFocus
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none resize-none transition-all" />
            {err && <p className="text-red-500 text-xs mt-1">{err}</p>}
          </div>
        )}
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-all">Cancel</button>
          <button onClick={handleConfirm} className={`px-5 py-2.5 rounded-xl text-white font-bold text-sm transition-all shadow-sm ${btnCls}`}>{confirmLabel}</button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtINR(v: unknown) { return `₹${(Number(v) || 0).toLocaleString("en-IN")}`; }
function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true });
}

// Status / Method badge maps
const S_MAP: Record<string, { label: string; cls: string; dot: string }> = {
  CAPTURED:              { label: "Captured",         cls: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  FAILED:                { label: "Failed",            cls: "bg-red-100 text-red-700",         dot: "bg-red-500" },
  REFUNDED:              { label: "Refunded",          cls: "bg-purple-100 text-purple-700",   dot: "bg-purple-500" },
  AWAITING_VERIFICATION: { label: "Awaiting Verify",  cls: "bg-amber-100 text-amber-700",     dot: "bg-amber-500" },
  AWAITING_RECEIPT:      { label: "Awaiting Receipt", cls: "bg-sky-100 text-sky-700",         dot: "bg-sky-500" },
  SUBMITTED:             { label: "Submitted",         cls: "bg-blue-100 text-blue-700",       dot: "bg-blue-500" },
  RECEIVED:              { label: "Received",          cls: "bg-teal-100 text-teal-700",       dot: "bg-teal-500" },
  DEPOSITED:             { label: "Deposited",         cls: "bg-cyan-100 text-cyan-700",       dot: "bg-cyan-500" },
  VERIFIED:              { label: "Verified",          cls: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  CLEARED:               { label: "Cleared",           cls: "bg-green-100 text-green-700",     dot: "bg-green-500" },
  REJECTED:              { label: "Rejected",          cls: "bg-red-100 text-red-700",         dot: "bg-red-500" },
  BOUNCED:               { label: "Bounced",           cls: "bg-rose-100 text-rose-700",       dot: "bg-rose-500" },
};
const M_MAP: Record<string, string> = {
  RAZORPAY: "bg-blue-100 text-blue-700", BANK_TRANSFER: "bg-indigo-100 text-indigo-700",
  UPI_STATIC_QR: "bg-violet-100 text-violet-700", CHEQUE: "bg-amber-100 text-amber-700",
  DEMAND_DRAFT: "bg-orange-100 text-orange-700",
  card: "bg-blue-100 text-blue-700", upi: "bg-violet-100 text-violet-700",
  netbanking: "bg-indigo-100 text-indigo-700",
};

function StatusBadge({ status }: { status: string }) {
  const m = S_MAP[status] ?? { label: status, cls: "bg-gray-100 text-gray-600", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${m.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />{m.label}
    </span>
  );
}
function MethodBadge({ method }: { method: string | null | undefined }) {
  if (!method) return <span className="text-gray-300 text-xs font-medium">—</span>;
  const cls = M_MAP[method] ?? "bg-gray-100 text-gray-600";
  const label = method.replace(/_/g, " ");
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${cls}`}>{label}</span>;
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────
type SortKey = "createdAt" | "amount" | "status";
type SortDir = "asc" | "desc";
function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <FaSort className="inline ml-1 text-gray-300" size={9} />;
  return sortDir === "asc"
    ? <FaSortUp data-ui-icon  className="inline ml-1 " size={9} />
    : <FaSortDown data-ui-icon  className="inline ml-1 " size={9} />;
}

// ─── Offline Action Buttons ───────────────────────────────────────────────────
interface ActionDef {
  action: string; label: string; btnCls: string;
  confirmColor: "emerald" | "red" | "amber" | "brand";
  show: boolean;
  ri?: { label: string; placeholder: string; required: boolean };
}
function OfflineActions({ sub, verifyingId, onAction }: {
  sub: OfflineSubmission; verifyingId: string | null;
  onAction: (id: string, action: string, opts?: { rejectionReason?: string; adminNotes?: string }) => void;
}) {
  const [modal, setModal] = useState<ActionDef | null>(null);
  const loading = verifyingId === sub.id;
  const st = sub.paymentStatus ?? sub.status ?? sub.submissionStatus ?? "SUBMITTED";
  const m = sub.paymentMethod ?? "";
  const isChequeDD = m === "CHEQUE" || m === "DEMAND_DRAFT";
  const amt = fmtINR(sub.amount ?? 0);
  const donor = sub.donationIntent?.name ?? "this donor";

  const actions: ActionDef[] = [
    {
      action: "VERIFY", label: "Verify & Approve", btnCls: "bg-emerald-600 hover:bg-emerald-700",
      confirmColor: "emerald" as const, show: ["AWAITING_VERIFICATION","AWAITING_RECEIPT","SUBMITTED"].includes(st),
      ri: { label: "Admin notes (optional)", placeholder: "Add verification notes…", required: false },
    },
    {
      action: "MARK_DEPOSITED", label: "Mark Deposited", btnCls: "bg-teal-600 hover:bg-teal-700",
      confirmColor: "emerald" as const, show: isChequeDD && st === "RECEIVED",
      ri: { label: "Admin notes (optional)", placeholder: "Deposit notes…", required: false },
    },
    {
      action: "MARK_CLEARED", label: "Mark Cleared", btnCls: "bg-green-600 hover:bg-green-700",
      confirmColor: "emerald" as const, show: isChequeDD && st === "DEPOSITED",
      ri: { label: "Admin notes (optional)", placeholder: "Clearance notes…", required: false },
    },
    {
      action: "REJECT", label: "Reject", btnCls: "bg-red-600 hover:bg-red-700",
      confirmColor: "red" as const, show: ["AWAITING_VERIFICATION","AWAITING_RECEIPT","SUBMITTED","RECEIVED"].includes(st),
      ri: { label: "Rejection reason", placeholder: "State reason for rejection…", required: true },
    },
    {
      action: "MARK_BOUNCED", label: "Mark Bounced", btnCls: "bg-rose-700 hover:bg-rose-800",
      confirmColor: "red" as const, show: isChequeDD && ["RECEIVED","DEPOSITED"].includes(st),
      ri: { label: "Bounce reason", placeholder: "e.g. Insufficient funds…", required: true },
    },
  ].filter((a) => a.show);

  if (actions.length === 0) return <span className="text-xs text-gray-400 italic">Resolved</span>;

  return (
    <>
      <div className="flex flex-wrap gap-1.5">
        {actions.map((a) => (
          <button key={a.action} disabled={loading}
            onClick={() => setModal(a)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all shadow-sm ${a.btnCls} disabled:opacity-50`}>
            {loading ? <FaSyncAlt className="animate-spin" size={10} />
              : ["VERIFY","MARK_DEPOSITED","MARK_CLEARED"].includes(a.action) ? <FaCheck size={10} /> : <FaBan size={10} />}
            {a.label}
          </button>
        ))}
      </div>
      {modal && (
        <ConfirmModal isOpen
          title={modal.label}
          description={`${modal.label} submission from ${donor} (${amt})?`}
          confirmLabel={modal.label} confirmColor={modal.confirmColor}
          requireInput={modal.ri}
          onConfirm={(val) => {
            const isRej = modal.action === "REJECT" || modal.action === "MARK_BOUNCED";
            onAction(sub.id, modal.action, isRej ? { rejectionReason: val } : { adminNotes: val });
            setModal(null);
          }}
          onCancel={() => setModal(null)} />
      )}
    </>
  );
}

// ─── Transaction Detail Modal ─────────────────────────────────────────────────
function TxModal({ tx, onClose, onSync }: { tx: DonationTransaction; onClose: () => void; onSync: (id: string) => void }) {
  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-100 px-7 py-5 rounded-t-3xl flex items-start justify-between">
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Transaction Detail</p>
            <h3 className="text-base font-black text-gray-900 font-mono">{tx.razorpayPaymentId || tx.id}</h3>
          </div>
          <div className="flex items-center gap-2 shrink-0 mt-1">
            <StatusBadge status={tx.status} />
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-all"><FaTimes size={13} /></button>
          </div>
        </div>
        <div className="px-7 py-6 space-y-5">
          {/* Amount row */}
          <div className="flex flex-wrap gap-5 items-center">
            <div><p className="text-[10px] text-gray-400 font-black uppercase mb-0.5">Amount</p>
              <p className="text-3xl font-black text-brand-primary">{fmtINR(tx.amount)}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{tx.currency}</p></div>
            <div><p className="text-[10px] text-gray-400 font-black uppercase mb-1">Method</p><MethodBadge method={tx.paymentMethod} /></div>
            <div><p className="text-[10px] text-gray-400 font-black uppercase mb-0.5">Date</p>
              <p className="text-sm font-medium text-gray-700">{fmtDate(tx.createdAt)}</p></div>
            <div><p className="text-[10px] text-gray-400 font-black uppercase mb-1">Reconciliation</p>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${tx.settlementStatus === "reconciled" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                {tx.settlementStatus || "unreconciled"}</span></div>
          </div>
          {/* Donor */}
          {tx.donor && (
            <div className="bg-gray-50 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-700"><FaUser className="text-gray-400 shrink-0" size={11} />
                <span className="font-bold">{tx.donor.isAnonymous ? "Anonymous" : tx.donor.name}</span>
                {tx.donor.isAnonymous && <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-bold">ANON</span>}</div>
              {!tx.donor.isAnonymous && <>
                <div className="flex items-center gap-2 text-gray-600"><FaEnvelope className="text-gray-400 shrink-0" size={11} />{tx.donor.email}</div>
                {tx.donor.phone && <div className="flex items-center gap-2 text-gray-600"><FaPhone className="text-gray-400 shrink-0" size={11} />+91 {tx.donor.phone}</div>}
              </>}
              <div className="flex items-center gap-2 text-gray-600"><FaTag className="text-gray-400 shrink-0" size={11} />{tx.donor.type}
                {tx.donor.recognitionConsent && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold ml-1">Recog. consent ✓</span>}</div>
            </div>
          )}
          {/* Razorpay IDs */}
          {(tx.razorpayOrderId || tx.razorpayPaymentId) && (
            <div className="bg-blue-50 rounded-2xl p-5">
              <p className="text-[10px] text-blue-400 font-black uppercase tracking-wider mb-2">Razorpay Reference</p>
              <div className="space-y-1 text-xs font-mono">
                {tx.razorpayOrderId && <p><span className="text-gray-500">Order: </span><span className="text-blue-800 font-bold">{tx.razorpayOrderId}</span></p>}
                {tx.razorpayPaymentId && <p><span className="text-gray-500">Payment: </span><span className="text-blue-800 font-bold">{tx.razorpayPaymentId}</span></p>}
              </div>
            </div>
          )}
          {/* Allocations */}
          {(tx.allocations?.length ?? 0) > 0 && (
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-2">Allocation</p>
              <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 overflow-hidden">
                {tx.allocations.map((a) => (
                  <div key={a.id} className="flex justify-between items-center px-4 py-3 text-sm bg-white">
                    <span className="text-gray-700">{a.category?.name ?? "Unallocated"}</span>
                    <span className="font-black text-brand-primary">{fmtINR(a.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Receipts */}
          {(tx.receipts?.length ?? 0) > 0 && (
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-2">Receipt</p>
              {tx.receipts.map((r) => (
                <div key={r.id} className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                  <div><p className="text-sm font-black text-emerald-800 font-mono">{r.receiptNumber}</p>
                    <p className="text-xs text-emerald-600">{fmtDate(r.createdAt)}</p></div>
                  <div className="flex items-center gap-2"><StatusBadge status={r.status} />
                    {r.receiptUrl && <a href={r.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-800"><FaExternalLinkAlt size={11} /></a>}</div>
                </div>
              ))}
            </div>
          )}
          {/* Refunds */}
          {(tx.refunds?.length ?? 0) > 0 && (
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-2">Refunds</p>
              {tx.refunds.map((r) => (
                <div key={r.id} className="bg-purple-50 border border-purple-100 rounded-xl px-4 py-3">
                  <div className="flex justify-between items-center"><p className="text-sm font-bold text-purple-800">{fmtINR(r.amount)}</p><StatusBadge status={r.status} /></div>
                  <p className="text-xs text-purple-600 font-mono mt-1">{r.razorpayRefundId}</p>
                  {r.reason && <p className="text-xs text-gray-500 mt-1">Reason: {r.reason}</p>}
                </div>
              ))}
            </div>
          )}
          {/* Raw metadata */}
          {Object.keys(tx.metadata ?? {}).length > 0 && (
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-1.5">Raw Metadata</p>
              <pre className="p-4 bg-gray-950 text-gray-300 font-mono text-xs rounded-xl overflow-x-auto max-h-40 leading-relaxed">{JSON.stringify(tx.metadata, null, 2)}</pre>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            {tx.razorpayPaymentId && (
              <button onClick={() => { onSync(tx.razorpayPaymentId!); onClose(); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary hover:bg-brand-dark text-white rounded-xl font-bold text-sm transition-all">
                <FaSyncAlt size={12} /> Sync with Razorpay
              </button>
            )}
            <button onClick={onClose} className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 rounded-xl font-bold text-sm text-gray-600 transition-all">Close</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const PAGE_SIZE = 50;

export default function DonationManagementClient() {
  const { toasts, add: toast, dismiss } = useToast();

  // Tab
  const [activeTab, setActiveTab] = useState<"ledger" | "offline" | "webhooks" | "audit">("ledger");

  // Data
  const [transactions, setTransactions] = useState<DonationTransaction[]>([]);
  const [offlineSubmissions, setOfflineSubmissions] = useState<OfflineSubmission[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<WebhookEvent[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [stats, setStats] = useState<KPIStats | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  // Filter state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [purpose, setPurpose] = useState("ALL");
  const [donorType, setDonorType] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("ALL");
  const [currency, setCurrency] = useState("ALL");
  const [receiptStatus, setReceiptStatus] = useState("ALL");

  // Sort + paginate
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);

  // Loading
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncInput, setSyncInput] = useState("");

  // Modals
  const [selectedTx, setSelectedTx] = useState<DonationTransaction | null>(null);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookEvent | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Build filter params ─────────────────────────────────────────────────
  const buildParams = useCallback(() => {
    const p: Record<string, string> = {};
    if (search) p.search = search;
    if (startDate) p.startDate = startDate;
    if (endDate) p.endDate = endDate;
    if (status !== "ALL") p.status = status;
    if (purpose !== "ALL") p.purpose = purpose;
    if (donorType !== "ALL") p.donorType = donorType;
    if (paymentMethod !== "ALL") p.paymentMethod = paymentMethod;
    if (currency !== "ALL") p.currency = currency;
    if (receiptStatus !== "ALL") p.receiptStatus = receiptStatus;
    return p;
  }, [search, startDate, endDate, status, purpose, donorType, paymentMethod, currency, receiptStatus]);

  // ─── Fetchers ────────────────────────────────────────────────────────────
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams(buildParams()).toString();
      const { data } = await api.get(`/donation/management/records${qs ? `?${qs}` : ""}`);
      setTransactions(normalizeArray(data, ["transactions", "items", "results", "data"]));
      setPage(1);
    } catch {
      toast("error", "Failed to load transactions");
    } finally { setLoading(false); }
  }, [buildParams, toast]);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get("/donation/management/metrics");
      // responseFormatter wraps all responses in { status, data: <body> }
      // Unwrap one level: data.data has the actual stats object
      const raw = data?.data ?? data ?? {};
      setStats({
        totalDonations:           Number(raw.totalDonations)           || 0,
        donationsToday:           Number(raw.donationsToday)           || 0,
        donationsThisMonth:       Number(raw.donationsThisMonth)       || 0,
        onlineTotalDonations:     Number(raw.onlineTotalDonations)     || 0,
        offlineTotalDonations:    Number(raw.offlineTotalDonations)    || 0,
        successfulPayments:       Number(raw.successfulPayments)       || 0,
        failedPayments:           Number(raw.failedPayments)           || 0,
        pendingPayments:          Number(raw.pendingPayments)          || 0,
        offlinePendingVerification: Number(raw.offlinePendingVerification) || 0,
        refunds:                  Number(raw.refunds)                  || 0,
        refundAmount:             Number(raw.refundAmount)             || 0,
        topDonationPurpose:       raw.topDonationPurpose ?? 'None',
        donorCount:               Number(raw.donorCount)               || 0,
      });
    } catch { toast("error", "Failed to load stats"); }
  }, [toast]);

  const fetchOffline = useCallback(async () => {
    try {
      const { data } = await api.get("/donation/management/offline-queue");
      setOfflineSubmissions(normalizeArray(data, ["submissions", "items", "results", "data"]));
    } catch { toast("error", "Failed to load offline submissions"); }
  }, [toast]);

  const fetchWebhooks = useCallback(async () => {
    try {
      const { data } = await api.get("/donation/management/system-events");
      setWebhookLogs(normalizeArray(data, ["webhooklogs", "items", "results", "data"]));
    } catch { toast("error", "Failed to load webhook log"); }
  }, [toast]);

  const fetchAuditLogs = useCallback(async () => {
    try {
      const { data } = await api.get('/donation/management/history');
      const raw = data?.data ?? data ?? [];
      setAuditLogs(Array.isArray(raw) ? raw : []);
    } catch { toast('error', 'Failed to load audit logs'); }
  }, [toast]);

  // Initial load
  useEffect(() => {
    fetchStats(); fetchOffline(); fetchWebhooks(); fetchAuditLogs();
    api.get("/donation/categories").then(({ data }) => {
      setCategories(normalizeArray(data, ["categories", "data", "items"]));
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-fetch on filter change (debounce search)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchTransactions(), search ? 400 : 0);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, startDate, endDate, status, purpose, donorType, paymentMethod, currency, receiptStatus]);

  // ─── Actions ─────────────────────────────────────────────────────────────
  const handleVerifyOffline = async (id: string, action: string, opts?: { rejectionReason?: string; adminNotes?: string }) => {
    if (verifyingId) return;
    setVerifyingId(id);
    try {
      await api.post(`/donation/management/verify-offline-submission/${id}`, {
        action, rejectionReason: opts?.rejectionReason, adminNotes: opts?.adminNotes,
      });
      toast("success", `${action.replace(/_/g, " ")} applied`, "Submission updated successfully.");
      await Promise.all([fetchOffline(), fetchTransactions(), fetchStats()]);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string; error?: string } } };
      toast("error", "Action failed", err.response?.data?.message || err.response?.data?.error || "Unable to update submission.");
    } finally { setVerifyingId(null); }
  };

  const handleManualSync = async (payId: string) => {
    if (!payId.trim()) return;
    setSyncLoading(true);
    try {
      const { data } = await api.post(`/donation/management/refresh-payment/${payId.trim()}`);
      toast("success", "Razorpay sync complete", (data as { message?: string }).message || "Payment data refreshed.");
      setSyncInput("");
      await Promise.all([fetchTransactions(), fetchStats()]);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string } } };
      toast("error", "Sync failed", err.response?.data?.error || "Could not reach Razorpay API.");
    } finally { setSyncLoading(false); }
  };

  const handleExportCSV = () => {
    const qs = new URLSearchParams(buildParams()).toString();
    window.open(`${api.defaults.baseURL}/donation/management/export-csv${qs ? `?${qs}` : ""}`, "_blank");
    toast("info", "CSV export started", "File will open in a new tab.");
  };

  const handleResetFilters = () => {
    setSearch(""); setStartDate(""); setEndDate(""); setStatus("ALL");
    setPurpose("ALL"); setDonorType("ALL"); setPaymentMethod("ALL");
    setCurrency("ALL"); setReceiptStatus("ALL");
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  // ─── Derived ─────────────────────────────────────────────────────────────
  const activeFilterCount = [
    search, startDate, endDate,
    status !== "ALL" ? status : "", purpose !== "ALL" ? purpose : "",
    donorType !== "ALL" ? donorType : "", paymentMethod !== "ALL" ? paymentMethod : "",
    currency !== "ALL" ? currency : "", receiptStatus !== "ALL" ? receiptStatus : "",
  ].filter(Boolean).length;

  const sorted = [...transactions].sort((a, b) => {
    const av = sortKey === "amount" ? (Number(a.amount) || 0) : sortKey === "status" ? a.status : a.createdAt;
    const bv = sortKey === "amount" ? (Number(b.amount) || 0) : sortKey === "status" ? b.status : b.createdAt;
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const pendingOfflineCount = offlineSubmissions.filter((s) => {
    const st = s.paymentStatus ?? s.status ?? s.submissionStatus ?? "";
    return ["AWAITING_VERIFICATION","AWAITING_RECEIPT","SUBMITTED","RECEIVED","DEPOSITED"].includes(st);
  }).length;

  // Status count summary for offline tab
  const statusCounts = offlineSubmissions.reduce<Record<string, number>>((acc, s) => {
    const k = s.paymentStatus ?? s.status ?? s.submissionStatus ?? "UNKNOWN";
    acc[k] = (acc[k] ?? 0) + 1; return acc;
  }, {});

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      <AnimatePresence>
        {selectedTx && <TxModal tx={selectedTx} onClose={() => setSelectedTx(null)} onSync={handleManualSync} />}
      </AnimatePresence>

      {/* Webhook payload modal */}
      <AnimatePresence>
        {selectedWebhook && (
          <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setSelectedWebhook(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-gray-900 text-gray-100 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                <div><p className="text-xs text-gray-500 uppercase tracking-widest">Webhook Payload</p>
                  <p className="font-mono text-sm font-bold text-emerald-400 mt-0.5">{selectedWebhook.eventType}</p></div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${selectedWebhook.processed ? "bg-emerald-900 text-emerald-300" : "bg-red-900 text-red-300"}`}>
                    {selectedWebhook.processed ? "Processed" : "Unprocessed"}</span>
                  <button onClick={() => setSelectedWebhook(null)} className="text-gray-500 hover:text-white"><FaTimes /></button>
                </div>
              </div>
              {selectedWebhook.error && <div className="bg-red-950 border-b border-red-900 px-6 py-3 text-xs text-red-300 font-mono">Error: {selectedWebhook.error}</div>}
              <div className="overflow-y-auto flex-1 p-6">
                <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap break-all leading-relaxed">{JSON.stringify(selectedWebhook.payload, null, 2)}</pre>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="p-4 md:p-8 max-w-[1440px] mx-auto space-y-6">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white px-6 py-5 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div data-ui-icon className="w-10 h-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center ">
              <FaShieldAlt className="text-lg" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-gray-900">Donation Command Centre</h2>
              <p className="text-gray-400 text-xs mt-0.5">Live ledger · Razorpay · Offline verification queue</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <form onSubmit={(e) => { e.preventDefault(); handleManualSync(syncInput); }}
              className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all">
              <input type="text" placeholder="Razorpay pay_… ID to sync"
                value={syncInput} onChange={(e) => setSyncInput(e.target.value)}
                className="px-3 py-1.5 bg-transparent text-sm focus:outline-none w-48 text-gray-900 placeholder:text-gray-400" />
              <button type="submit" disabled={syncLoading || !syncInput}
                className="px-3 py-1.5 bg-brand-primary hover:bg-brand-dark text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50">
                <FaSyncAlt className={syncLoading ? "animate-spin" : ""} size={10} /> Sync
              </button>
            </form>
            <button onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:border-brand-primary hover:text-brand-primary text-gray-700 font-bold rounded-xl text-sm transition-all shadow-sm">
              <FaDownload size={11} /> Export CSV{activeFilterCount > 0 ? " (filtered)" : ""}
            </button>
          </div>
        </div>

        {/* ── KPI Cards ────────────────────────────────────────────────────── */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            {/* Total */}
            <div className="col-span-2 sm:col-span-1 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Total Donated</p>
              <p className="text-2xl font-black text-brand-primary mt-1">{fmtINR(stats.totalDonations)}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">🌐 {fmtINR(stats.onlineTotalDonations)}</span>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">📋 {fmtINR(stats.offlineTotalDonations)}</span>
              </div>
            </div>
            {/* Today */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Today</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">{fmtINR(stats.donationsToday)}</p>
              <p className="text-[10px] text-gray-400 mt-1.5 flex items-center gap-1"><FaCalendarAlt size={9} className="text-gray-300" />
                {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
            </div>
            {/* This month */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">This Month</p>
              <p className="text-2xl font-black text-blue-600 mt-1">{fmtINR(stats.donationsThisMonth)}</p>
              <p className="text-[10px] text-gray-400 mt-1">{new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
            </div>
            {/* Tx counts */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-2">Transactions</p>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold"><span className="text-emerald-600">Captured</span><span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{stats.successfulPayments}</span></div>
                <div className="flex justify-between text-xs font-bold"><span className="text-red-500">Failed</span><span className="bg-red-50 text-red-700 px-2 py-0.5 rounded-full">{stats.failedPayments}</span></div>
                <div className="flex justify-between text-xs font-bold"><span className="text-amber-600">Pending</span><span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">{stats.pendingPayments}</span></div>
              </div>
            </div>
            {/* Offline queue */}
            <div className={`bg-white p-5 rounded-2xl border shadow-sm hover:shadow-md transition-all ${pendingOfflineCount > 0 ? "border-amber-300 ring-2 ring-amber-100" : "border-gray-100"}`}>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Offline Queue</p>
              <p className={`text-3xl font-black mt-1 ${pendingOfflineCount > 0 ? "text-amber-600" : "text-gray-300"}`}>{pendingOfflineCount}</p>
              <p className="text-[10px] text-gray-400 mt-1">awaiting verification</p>
              {pendingOfflineCount > 0 && <button onClick={() => setActiveTab("offline")} className="mt-2 text-[10px] text-amber-600 font-black hover:underline">Review now →</button>}
            </div>
            {/* Refunds */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Refunds</p>
              <p className="text-2xl font-black text-purple-600 mt-1">{stats.refunds}</p>
              <p className="text-[10px] text-gray-400 mt-1">{fmtINR(stats.refundAmount)} total</p>
            </div>
            {/* Top purpose */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Top Purpose</p>
              <p className="text-sm font-black text-gray-800 mt-2 leading-snug">{stats.topDonationPurpose || "—"}</p>
              <p className="text-[10px] text-gray-400 mt-1">{stats.donorCount} donors</p>
            </div>
          </div>
        )}

        {/* ── Tab Bar ───────────────────────────────────────────────────────── */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl w-fit">
          {(["ledger", "offline", "webhooks", "audit"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm capitalize transition-all flex items-center gap-2 ${activeTab === tab ? "bg-white text-icon-on-light shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>
              {tab === "ledger" && <><FaClipboardList size={12} /> Donation Ledger</>}
              {tab === "offline" && <><FaUniversity size={12} /> Offline Queue
                {pendingOfflineCount > 0 && <span className="bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">{pendingOfflineCount}</span>}
              </>}
              {tab === "webhooks" && <><FaShieldAlt size={12} /> Webhook Audits</>}
              {tab === "audit" && <><FaHistory size={12} /> Audit Log</>}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            LEDGER TAB
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === "ledger" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FaFilter className="text-gray-400 text-sm" />
                  <span className="text-sm font-black text-gray-700 uppercase tracking-wider">Filters</span>
                  {activeFilterCount > 0 && <span className="px-2 py-0.5 bg-brand-primary text-white text-xs font-black rounded-full">{activeFilterCount}</span>}
                </div>
                {activeFilterCount > 0 && (
                  <button onClick={handleResetFilters} className="text-xs font-bold text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 flex items-center gap-1 transition-all">
                    <FaTimes size={9} /> Clear all
                  </button>
                )}
              </div>
              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Search</label>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={10} />
                    <input type="text" placeholder="Name, email, payment ID…" value={search} onChange={(e) => setSearch(e.target.value)}
                      className="pl-8 pr-3 py-2.5 w-full rounded-xl border border-gray-200 bg-gray-50 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 focus:outline-none text-sm transition-all" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary/15 ${status !== "ALL" ? "border-brand-primary bg-brand-primary/5 text-brand-primary" : "border-gray-200 bg-gray-50 text-gray-700"}`}>
                    <option value="ALL">All Statuses</option>
                    <option value="CAPTURED">✓ Captured</option>
                    <option value="FAILED">✗ Failed</option>
                    <option value="REFUNDED">↩ Refunded</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Purpose</label>
                  <select value={purpose} onChange={(e) => setPurpose(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary/15 ${purpose !== "ALL" ? "border-brand-primary bg-brand-primary/5 text-brand-primary" : "border-gray-200 bg-gray-50 text-gray-700"}`}>
                    <option value="ALL">All Purposes</option>
                    {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Donor Type</label>
                  <select value={donorType} onChange={(e) => setDonorType(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary/15 ${donorType !== "ALL" ? "border-brand-primary bg-brand-primary/5 text-brand-primary" : "border-gray-200 bg-gray-50 text-gray-700"}`}>
                    <option value="ALL">All Donor Types</option>
                    <option value="INDIVIDUAL">Individual</option>
                    <option value="INSTITUTIONAL">Institutional</option>
                    <option value="CORPORATE">Corporate</option>
                    <option value="IN_KIND">In-Kind</option>
                    <option value="LEGACY">Legacy</option>
                  </select>
                </div>
              </div>
              {/* Row 2 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">From</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary/15 ${startDate ? "border-brand-primary bg-brand-primary/5 text-brand-primary font-medium" : "border-gray-200 bg-gray-50 text-gray-700"}`} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">To</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary/15 ${endDate ? "border-brand-primary bg-brand-primary/5 text-brand-primary font-medium" : "border-gray-200 bg-gray-50 text-gray-700"}`} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Method</label>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary/15 ${paymentMethod !== "ALL" ? "border-brand-primary bg-brand-primary/5 text-brand-primary" : "border-gray-200 bg-gray-50 text-gray-700"}`}>
                    <option value="ALL">All Methods</option>
                    <option value="RAZORPAY">Razorpay (Online)</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="UPI_STATIC_QR">UPI QR</option>
                    <option value="CHEQUE">Cheque</option>
                    <option value="DEMAND_DRAFT">Demand Draft</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Currency</label>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary/15 ${currency !== "ALL" ? "border-brand-primary bg-brand-primary/5 text-brand-primary" : "border-gray-200 bg-gray-50 text-gray-700"}`}>
                    <option value="ALL">All Currencies</option>
                    <option value="INR">INR — ₹ Rupee</option>
                    <option value="USD">USD — $ Dollar</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Receipt</label>
                  <select value={receiptStatus} onChange={(e) => setReceiptStatus(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary/15 ${receiptStatus !== "ALL" ? "border-brand-primary bg-brand-primary/5 text-brand-primary" : "border-gray-200 bg-gray-50 text-gray-700"}`}>
                    <option value="ALL">All Receipts</option>
                    <option value="GENERATED">Receipt Issued</option>
                    <option value="PENDING">No Receipt Yet</option>
                  </select>
                </div>
              </div>
              {/* Active chips */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                  <span className="text-[10px] font-black text-gray-400 uppercase self-center">Active:</span>
                  {search && <Chip label={`🔍 "${search}"`} color="blue" onRemove={() => setSearch("")} />}
                  {status !== "ALL" && <Chip label={`Status: ${status}`} color="emerald" onRemove={() => setStatus("ALL")} />}
                  {purpose !== "ALL" && <Chip label={`📂 ${purpose}`} color="purple" onRemove={() => setPurpose("ALL")} />}
                  {donorType !== "ALL" && <Chip label={`👤 ${donorType}`} color="amber" onRemove={() => setDonorType("ALL")} />}
                  {startDate && <Chip label={`From: ${startDate}`} color="slate" onRemove={() => setStartDate("")} />}
                  {endDate && <Chip label={`To: ${endDate}`} color="slate" onRemove={() => setEndDate("")} />}
                  {paymentMethod !== "ALL" && <Chip label={`Method: ${paymentMethod}`} color="indigo" onRemove={() => setPaymentMethod("ALL")} />}
                  {currency !== "ALL" && <Chip label={currency} color="rose" onRemove={() => setCurrency("ALL")} />}
                  {receiptStatus !== "ALL" && <Chip label={`Receipt: ${receiptStatus}`} color="teal" onRemove={() => setReceiptStatus("ALL")} />}
                </div>
              )}
            </div>

            {/* Ledger Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <span className="font-black text-gray-900 text-sm">Donation Ledger</span>
                  <span className="ml-2 text-xs text-gray-400">{transactions.length} record{transactions.length !== 1 ? "s" : ""}{activeFilterCount > 0 ? " (filtered)" : ""}</span>
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span>Page {page}/{totalPages}</span>
                    <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-all"><FaChevronLeft size={8} /></button>
                    <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-all"><FaChevronRight size={8} /></button>
                  </div>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer select-none hover:text-gray-700" onClick={() => toggleSort("createdAt")}>
                        Date <SortIcon col="createdAt" sortKey={sortKey} sortDir={sortDir} />
                      </th>
                      <th className="text-left px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Donor</th>
                      <th className="text-left px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer select-none hover:text-gray-700" onClick={() => toggleSort("amount")}>
                        Amount <SortIcon col="amount" sortKey={sortKey} sortDir={sortDir} />
                      </th>
                      <th className="text-left px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Purpose</th>
                      <th className="text-left px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Method</th>
                      <th className="text-left px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer select-none hover:text-gray-700" onClick={() => toggleSort("status")}>
                        Status <SortIcon col="status" sortKey={sortKey} sortDir={sortDir} />
                      </th>
                      <th className="text-left px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Receipt</th>
                      <th className="text-left px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading ? (
                      Array.from({ length: 6 }).map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          {Array.from({ length: 8 }).map((_, j) => (
                            <td key={j} className="px-4 py-4"><div className="h-3 bg-gray-100 rounded-full" style={{ width: `${50 + (i * j * 7) % 40}%` }} /></td>
                          ))}
                        </tr>
                      ))
                    ) : paginated.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-20 text-center">
                          <FaClipboardList className="text-4xl text-gray-200 mx-auto mb-3" />
                          <p className="font-bold text-sm text-gray-400">No transactions found</p>
                          {activeFilterCount > 0 && <button onClick={handleResetFilters} className="mt-2 text-xs text-brand-primary hover:underline font-medium">Clear filters</button>}
                        </td>
                      </tr>
                    ) : (
                      paginated.map((tx) => {
                        const purposeName = tx.allocations?.[0]?.category?.name ?? "General Support";
                        const hasReceipt = (tx.receipts?.length ?? 0) > 0;
                        return (
                          <tr key={tx.id} className="hover:bg-gray-50/60 transition-colors">
                            <td className="px-4 py-3.5 text-xs text-gray-500 whitespace-nowrap">{fmtDate(tx.createdAt)}</td>
                            <td className="px-4 py-3.5">
                              {tx.donor ? (
                                <div>
                                  <p className="font-bold text-gray-900 text-xs">{tx.donor.isAnonymous ? "Anonymous" : tx.donor.name}</p>
                                  <p className="text-[10px] text-gray-400 mt-0.5">{tx.donor.isAnonymous ? "—" : tx.donor.email}</p>
                                  <p className="text-[10px] text-gray-300">{tx.donor.type}</p>
                                </div>
                              ) : <span className="text-gray-300 text-xs">—</span>}
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              <span className="font-black text-gray-900">{fmtINR(tx.amount)}</span>
                              <span className="block text-[10px] text-gray-400 font-bold uppercase">{tx.currency}</span>
                            </td>
                            <td className="px-4 py-3.5 text-xs text-gray-600 max-w-[120px] truncate">{purposeName}</td>
                            <td className="px-4 py-3.5"><MethodBadge method={tx.paymentMethod} /></td>
                            <td className="px-4 py-3.5"><StatusBadge status={tx.status} /></td>
                            <td className="px-4 py-3.5">
                              {hasReceipt ? (
                                <a href={tx.receipts[0]?.receiptUrl ?? "#"} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-800 font-bold">
                                  <FaReceipt size={9} /> View
                                </a>
                              ) : <span className="text-[10px] text-gray-300">—</span>}
                            </td>
                            <td className="px-4 py-3.5">
                              <button onClick={() => setSelectedTx(tx)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-600 hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-all border border-transparent hover:border-brand-primary/20">
                                <FaEye size={9} /> Details
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination footer */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-xs text-gray-400">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, transactions.length)} of {transactions.length}</p>
                  <div className="flex items-center gap-1">
                    <button disabled={page <= 1} onClick={() => setPage(1)} className="px-2 py-1.5 text-xs rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 font-bold">«</button>
                    <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 font-bold flex items-center gap-1"><FaChevronLeft size={8} /> Prev</button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                      return (
                        <button key={p} onClick={() => setPage(p)}
                          className={`px-3 py-1.5 text-xs rounded-lg border font-bold transition-all ${p === page ? "border-brand-primary bg-brand-primary text-white" : "border-gray-200 hover:bg-gray-50 text-gray-700"}`}>
                          {p}
                        </button>
                      );
                    })}
                    <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 font-bold flex items-center gap-1">Next <FaChevronRight size={8} /></button>
                    <button disabled={page >= totalPages} onClick={() => setPage(totalPages)} className="px-2 py-1.5 text-xs rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 font-bold">»</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            OFFLINE QUEUE TAB
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === "offline" && (
          <div className="space-y-4">
            {/* Status summary chips */}
            {Object.keys(statusCounts).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {Object.entries(statusCounts).sort(([, a], [, b]) => b - a).map(([s, count]) => (
                  <div key={s} className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2 shadow-sm">
                    <StatusBadge status={s} /><span className="font-black text-gray-800 text-sm">{count}</span>
                  </div>
                ))}
              </div>
            )}
            {/* Info banner */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl text-blue-900 flex items-start gap-3 text-sm">
              <FaInfoCircle className="text-lg mt-0.5 shrink-0" />
              <div>
                <p className="font-bold">Offline Payment Verification Queue</p>
                <p className="text-xs opacity-80 mt-0.5">Review Bank Transfer UTRs, UPI QR references, and Cheques / Demand Drafts. Verifying generates a DonationTransaction and tax receipt automatically.</p>
              </div>
            </div>
            {/* Submission cards */}
            <div className="space-y-3">
              {offlineSubmissions.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 py-20 text-center">
                  <FaUniversity className="text-4xl text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 font-bold text-sm">No offline submissions</p>
                </div>
              ) : offlineSubmissions.map((sub) => {
                const st = sub.paymentStatus ?? sub.status ?? sub.submissionStatus ?? "SUBMITTED";
                const isResolved = ["VERIFIED","CLEARED","REJECTED","BOUNCED"].includes(st);
                return (
                  <motion.div key={sub.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className={`bg-white rounded-2xl border overflow-hidden ${isResolved ? "border-gray-100 opacity-60" : "border-gray-200 shadow-sm"}`}>
                    {/* Card header */}
                    <div className="px-5 py-3 flex flex-wrap items-center justify-between gap-3 bg-gray-50/50 border-b border-gray-100">
                      <div className="flex items-center gap-2 flex-wrap">
                        <MethodBadge method={sub.paymentMethod ?? null} />
                        <StatusBadge status={st} />
                        <span className="text-xs font-black text-gray-900">{fmtINR(sub.amount ?? 0)}</span>
                        <span className="text-xs text-gray-400">{fmtDate(sub.createdAt)}</span>
                      </div>
                      <span className="font-mono text-[10px] text-gray-300">#{sub.id.slice(-8).toUpperCase()}</span>
                    </div>
                    {/* Card body: 4-col grid */}
                    <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      {/* Donor */}
                      <div>
                        <p className="text-[10px] text-gray-400 font-black uppercase mb-1.5">Donor</p>
                        {sub.donationIntent ? (
                          <>
                            <p className="font-bold text-gray-900 text-sm">{sub.donationIntent.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{sub.donationIntent.email}</p>
                            {sub.donationIntent.phone && <p className="text-xs text-gray-500">+91 {sub.donationIntent.phone}</p>}
                            <span className="inline-block mt-1.5 text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{sub.donationIntent.donorType ?? "INDIVIDUAL"}</span>
                          </>
                        ) : <p className="text-xs text-gray-400">Intent not linked</p>}
                      </div>
                      {/* Reference */}
                      <div>
                        <p className="text-[10px] text-gray-400 font-black uppercase mb-1.5">Reference</p>
                        {sub.utrNumber && <p className="text-xs font-mono text-gray-700"><span className="text-gray-400">UTR: </span>{sub.utrNumber}</p>}
                        {sub.instrumentNumber && <p className="text-xs font-mono text-gray-700"><span className="text-gray-400">{sub.paymentMethod === "CHEQUE" ? "Cheque #: " : "DD #: "}</span>{sub.instrumentNumber}</p>}
                        {sub.issuingBank && <p className="text-xs text-gray-600 mt-1">Issuing bank: {sub.issuingBank}</p>}
                        {sub.originatingBank && <p className="text-xs text-gray-500">From: {sub.originatingBank}</p>}
                        {!sub.utrNumber && !sub.instrumentNumber && <p className="text-xs text-gray-300">—</p>}
                      </div>
                      {/* Purpose + notes */}
                      <div>
                        <p className="text-[10px] text-gray-400 font-black uppercase mb-1.5">Purpose</p>
                        <p className="text-xs text-gray-700 font-medium">{sub.donationIntent?.purpose ?? "—"}</p>
                        {sub.adminNotes && (
                          <div className="mt-2 p-2.5 bg-blue-50 rounded-xl text-xs text-blue-800">
                            <span className="font-bold block mb-0.5">Admin notes</span>{sub.adminNotes}
                          </div>
                        )}
                        {sub.rejectionReason && (
                          <div className="mt-2 p-2.5 bg-red-50 rounded-xl text-xs text-red-800">
                            <span className="font-bold block mb-0.5">Rejection reason</span>{sub.rejectionReason}
                          </div>
                        )}
                      </div>
                      {/* Actions */}
                      <div>
                        <p className="text-[10px] text-gray-400 font-black uppercase mb-1.5">Actions</p>
                        <OfflineActions sub={sub} verifyingId={verifyingId} onAction={handleVerifyOffline} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            WEBHOOKS TAB
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === "webhooks" && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="font-black text-gray-900 text-sm">Razorpay Webhook Event Log</p>
                <p className="text-xs text-gray-400 mt-0.5">{webhookLogs.length} event{webhookLogs.length !== 1 ? "s" : ""} recorded</p>
              </div>
              <button onClick={fetchWebhooks} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-primary font-bold px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all">
                <FaSyncAlt size={9} /> Refresh
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Timestamp</th>
                    <th className="text-left px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Event Type</th>
                    <th className="text-left px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="text-left px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Error</th>
                    <th className="text-left px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Payload</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {webhookLogs.length === 0 ? (
                    <tr><td colSpan={5} className="py-16 text-center text-gray-400 text-sm font-medium">No webhook events recorded yet.</td></tr>
                  ) : webhookLogs.map((wh) => (
                    <tr key={wh.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">{fmtDate(wh.createdAt)}</td>
                      <td className="px-5 py-3.5 font-mono text-xs font-bold text-gray-800">{wh.eventType}</td>
                      <td className="px-5 py-3.5">
                        {wh.processed
                          ? <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full font-bold"><FaCheckCircle size={9} /> Processed</span>
                          : <span className="inline-flex items-center gap-1 text-xs text-red-700 bg-red-50 px-2 py-1 rounded-full font-bold"><FaExclamationCircle size={9} /> Unprocessed</span>}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-red-600 max-w-[200px] truncate">{wh.error ?? <span className="text-gray-300">—</span>}</td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => setSelectedWebhook(wh)}
                          className="flex items-center gap-1 text-xs text-gray-500 hover:text-brand-primary font-bold hover:bg-brand-primary/5 px-2.5 py-1.5 rounded-lg transition-all border border-transparent hover:border-brand-primary/20">
                          <FaEye size={9} /> View JSON
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            AUDIT LOG TAB
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === "audit" && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="font-black text-gray-900 text-sm">System Audit Logs</p>
                <p className="text-xs text-gray-400 mt-0.5">{auditLogs.length} record{auditLogs.length !== 1 ? "s" : ""} found</p>
              </div>
              <button onClick={fetchAuditLogs} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-primary font-bold px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all">
                <FaSyncAlt size={9} /> Refresh
              </button>
            </div>
            <div className="overflow-x-auto">
              {auditLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <FaHistory size={28} className="text-gray-200 mb-3" />
                  <p className="text-gray-400 font-medium text-sm">No audit log entries yet.</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left py-3 px-5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Timestamp</th>
                      <th className="text-left py-3 px-5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Action</th>
                      <th className="text-left py-3 px-5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Entity</th>
                      <th className="text-left py-3 px-5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3.5 px-5 text-gray-500 font-mono text-xs whitespace-nowrap">{fmtDate(log.createdAt)}</td>
                        <td className="py-3.5 px-5">
                          <span className="px-2.5 py-1 bg-brand-primary/10 text-brand-primary font-bold text-[10px] rounded-full uppercase tracking-wider">{log.action}</span>
                        </td>
                        <td className="py-3.5 px-5 text-gray-600 text-xs">{log.entityType ? `${log.entityType}${log.entityId ? ` · ${log.entityId.slice(-6).toUpperCase()}` : ''}` : '—'}</td>
                        <td className="py-3.5 px-5 text-gray-400 text-xs max-w-xs truncate">{log.details ? JSON.stringify(log.details).slice(0, 80) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Filter chip helper ───────────────────────────────────────────────────────
const CHIP_COLORS: Record<string, string> = {
  blue: "bg-blue-100 text-blue-700", emerald: "bg-emerald-100 text-emerald-700",
  purple: "bg-purple-100 text-purple-700", amber: "bg-amber-100 text-amber-700",
  slate: "bg-slate-100 text-slate-700", indigo: "bg-indigo-100 text-indigo-700",
  rose: "bg-rose-100 text-rose-700", teal: "bg-teal-100 text-teal-700",
};
function Chip({ label, color, onRemove }: { label: string; color: string; onRemove: () => void }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${CHIP_COLORS[color] ?? "bg-gray-100 text-gray-600"}`}>
      {label}<button onClick={onRemove} className="ml-1 opacity-60 hover:opacity-100 transition-opacity"><FaTimes size={8} /></button>
    </span>
  );
}
