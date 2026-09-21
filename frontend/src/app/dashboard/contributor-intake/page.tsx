"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  FaArrowLeft, 
  FaInbox, 
  FaCheck, 
  FaTimes, 
  FaUserEdit, 
  FaSpinner, 
  FaEye, 
  FaExternalLinkAlt, 
  FaUserCircle, 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaPhone, 
  FaGlobe, 
  FaBookmark,
  FaSync,
  FaTrash
} from "react-icons/fa";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { normalizeArray } from "@/lib/normalize";

interface IntakeSubmission {
  id: string;
  userId: string | null;
  fullName: string;
  email: string;
  phone: string | null;
  country: string;
  roleType: string;
  institution: string | null;
  profileLink: string | null;
  purpose: string;
  expertise: string;
  craftFocus: string;
  title: string;
  summary: string;
  contributionType: string;
  evidence: string | null;
  fileUrl: string | null;
  sourceNotes: string | null;
  status: string; // Submitted, Under Review, Need More Information, Approved, Rejected, Invited to Dashboard, Active Contributor, Suspended
  assignedEditor: string | null;
  createdAt: string;
}

export default function ContributorIntakePage() {
  const [submissions, setSubmissions] = useState<IntakeSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [assignedEditorVal, setAssignedEditorVal] = useState<string>("");

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const url = selectedStatus === "All" 
        ? "/intake/admin/queue" 
        : `/intake/admin/queue?status=${selectedStatus}`;
      const { data } = await api.get(url);
      setSubmissions(normalizeArray(data, ["submissions", "items", "results", "data"]));
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load contributor intake queue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [selectedStatus]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.put(`/intake/admin/${id}/status`, { status: newStatus });
      toast.success(`Submission status updated to ${newStatus}`);
      fetchQueue();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to update status.");
    }
  };

  const handleAssignEditor = async (id: string) => {
    try {
      await api.put(`/intake/admin/${id}/status`, { assignedEditor: assignedEditorVal });
      toast.success("Editor assigned successfully!");
      setEditingId(null);
      fetchQueue();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to assign editor.");
    }
  };

  const [deleteTarget, setDeleteTarget] = useState<IntakeSubmission | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/intake/admin/${deleteTarget.id}`);
      setSubmissions(prev => prev.filter(s => s.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success("Submission deleted successfully.");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to delete submission.");
    } finally {
      setDeleting(false);
    }
  };

  const STATUS_FILTERS = [
    "All",
    "Submitted",
    "Under Review",
    "Need More Information",
    "Approved",
    "Rejected",
    "Invited to Dashboard",
    "Active Contributor",
    "Suspended"
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Submitted":
        return <span className="bg-amber-50 text-amber-700 border border-amber-250/30 text-[10px] font-black uppercase px-2 py-0.5 rounded">Submitted</span>;
      case "Under Review":
        return <span className="bg-blue-50 text-blue-700 border border-blue-250/30 text-[10px] font-black uppercase px-2 py-0.5 rounded">Under Review</span>;
      case "Need More Information":
        return <span className="bg-orange-50 text-orange-700 border border-orange-250/30 text-[10px] font-black uppercase px-2 py-0.5 rounded">Need Info</span>;
      case "Approved":
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-250/30 text-[10px] font-black uppercase px-2 py-0.5 rounded">Approved</span>;
      case "Rejected":
        return <span className="bg-rose-50 text-rose-700 border border-rose-250/20 text-[10px] font-black uppercase px-2 py-0.5 rounded">Rejected</span>;
      case "Invited to Dashboard":
        return <span className="bg-purple-50 text-purple-700 border border-purple-200/50 text-[10px] font-black uppercase px-2 py-0.5 rounded">Invited</span>;
      case "Active Contributor":
        return <span className="bg-green-100 text-green-800 border border-green-200/50 text-[10px] font-black uppercase px-2 py-0.5 rounded">Active</span>;
      case "Suspended":
        return <span className="bg-stone-100 text-stone-600 border border-stone-250/50 text-[10px] font-black uppercase px-2 py-0.5 rounded">Suspended</span>;
      default:
        return <span className="bg-stone-50 text-stone-500 text-[10px] font-black uppercase px-2 py-0.5 rounded">{status}</span>;
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 text-stone-500 hover:bg-stone-50 rounded-xl transition-all border border-stone-200"
          >
            <FaArrowLeft />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-serif">Knowledge Contributor Admin</h1>
            <p className="text-stone-500 text-sm">Review, evaluate, and edit research and case data submitted by public contributors.</p>
          </div>
        </div>

        <button 
          onClick={fetchQueue}
          className="p-2 text-stone-600 border border-stone-200 rounded-xl hover:bg-stone-50 transition-all self-start md:self-auto flex items-center gap-2 text-xs font-bold"
        >
          <FaSync className={loading ? "animate-spin" : ""} /> Refresh Queue
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-stone-200 pb-4">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${
              selectedStatus === status
                ? "bg-brand-primary text-white shadow-sm"
                : "text-stone-600 hover:text-brand-primary hover:bg-stone-50 border border-transparent"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Queue List */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <FaSpinner data-ui-icon  className="animate-spin text-3xl " />
        </div>
      ) : submissions.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-stone-200 rounded-3xl bg-stone-50/20 space-y-4 max-w-lg mx-auto">
          <FaInbox className="text-stone-300 text-4xl mx-auto" />
          <h3 className="text-sm font-bold text-stone-700">Intake Queue Empty</h3>
          <p className="text-xs text-stone-500">No submissions matching the status <span className="font-bold text-brand-primary">{selectedStatus}</span> were found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {submissions.map((sub) => (
            <div key={sub.id} className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4 relative hover:border-stone-300 transition-colors text-xs text-stone-750">
              
              {/* Header section */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-50 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getStatusBadge(sub.status)}
                    <span className="bg-brand-primary/5 text-brand-secondary px-2 py-0.5 rounded text-[10px] font-bold">
                      Target Role: {sub.roleType}
                    </span>
                    <span className="text-[10px] text-stone-400 font-semibold">
                      Submitted {new Date(sub.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-stone-850 mt-2">
                    Proposed Asset: <span className="font-serif text-brand-primary italic">{sub.title}</span>
                  </h3>
                </div>

                {/* Editor Assigned Indicator */}
                <div className="flex items-center gap-2">
                  {editingId === sub.id ? (
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Editor's name"
                        value={assignedEditorVal}
                        onChange={(e) => setAssignedEditorVal(e.target.value)}
                        className="bg-stone-50 border border-stone-200 rounded-lg p-1.5 outline-none focus:border-brand-primary font-medium"
                      />
                      <button
                        onClick={() => handleAssignEditor(sub.id)}
                        className="bg-brand-primary text-white p-2 rounded-lg"
                      >
                        <FaCheck size={10} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-stone-150 text-stone-600 p-2 rounded-lg"
                      >
                        <FaTimes size={10} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-stone-500 font-bold bg-stone-50 border border-stone-100 p-2 rounded-xl">
                      <span>Editor: {sub.assignedEditor || "None Assigned"}</span>
                      <button
                        onClick={() => {
                          setEditingId(sub.id);
                          setAssignedEditorVal(sub.assignedEditor || "");
                        }}
                        className="text-brand-primary hover:text-brand-dark transition-colors"
                        title="Assign / Edit Editor"
                      >
                        <FaUserEdit size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Contributor Profile details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-100 font-medium">
                <div className="space-y-1">
                  <span className="text-[9px] text-stone-400 block font-bold uppercase tracking-wider">Full Name</span>
                  <span className="font-bold text-stone-850 flex items-center gap-1.5"><FaUserCircle className="text-stone-400" /> {sub.fullName}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-stone-400 block font-bold uppercase tracking-wider">Institution / Org</span>
                  <span className="text-stone-800 flex items-center gap-1.5"><FaBuilding className="text-stone-400" /> {sub.institution || "N/A"}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-stone-400 block font-bold uppercase tracking-wider">Country</span>
                  <span className="text-stone-800 flex items-center gap-1.5"><FaMapMarkerAlt className="text-stone-400" /> {sub.country}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-stone-400 block font-bold uppercase tracking-wider">Links & Contact</span>
                  <div className="flex gap-2 flex-wrap items-center">
                    <span className="text-stone-500 flex items-center gap-1"><FaEnvelope className="text-stone-400" /> {sub.email}</span>
                    {sub.phone && <span className="text-stone-500 flex items-center gap-1"><FaPhone className="text-stone-400" /> {sub.phone}</span>}
                    {sub.profileLink && (
                      <a href={sub.profileLink} target="_blank" className="text-icon-on-light hover:underline flex items-center gap-1 font-bold">
                        <FaGlobe /> Profile <FaExternalLinkAlt size={8} />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Details of Asset */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                <div className="space-y-1">
                  <span className="text-[9px] text-stone-400 block font-bold uppercase tracking-wider">Classification</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="bg-stone-50 text-stone-650 px-2 py-0.5 rounded border border-stone-100 font-bold">Type: {sub.contributionType}</span>
                    <span className="bg-stone-50 text-stone-650 px-2 py-0.5 rounded border border-stone-100 font-bold">Craft: {sub.craftFocus}</span>
                    <span className="bg-stone-50 text-stone-650 px-2 py-0.5 rounded border border-stone-100 font-bold">Expertise: {sub.expertise}</span>
                  </div>
                </div>
                
                <div className="space-y-1 sm:col-span-2">
                  <span className="text-[9px] text-stone-400 block font-bold uppercase tracking-wider">Evidence & File link</span>
                  <div className="space-y-1.5 pt-1">
                    {sub.evidence && <p className="italic text-stone-600 text-[11px]">&ldquo;{sub.evidence}&rdquo;</p>}
                    {sub.fileUrl && (
                      <a href={sub.fileUrl} target="_blank" className="inline-flex items-center gap-1.5 font-bold text-icon-on-light hover:text-brand-dark hover:underline">
                        <FaBookmark size={9} /> Open Submitted Asset File <FaExternalLinkAlt size={8} />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Proposed Abstract */}
              <div className="space-y-2 pt-2 border-t border-stone-50">
                <span className="text-[9px] text-stone-400 block font-bold uppercase tracking-wider">Proposed abstract / Summary</span>
                <p className="text-stone-700 font-serif leading-relaxed italic bg-stone-50 p-4 rounded-xl border border-stone-100">
                  &ldquo;{sub.summary}&rdquo;
                </p>
                {sub.sourceNotes && (
                  <p className="text-[10px] text-stone-500">
                    <strong className="text-stone-600 block uppercase tracking-wide text-[8px] font-black">Sources & Reference Notes:</strong>
                    {sub.sourceNotes}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-stone-50 justify-end">
                {sub.status !== "Under Review" && (
                  <button
                    onClick={() => handleUpdateStatus(sub.id, "Under Review")}
                    className="border border-blue-200 text-blue-700 hover:bg-blue-50 px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all"
                  >
                    Mark Under Review
                  </button>
                )}
                {sub.status !== "Need More Information" && (
                  <button
                    onClick={() => handleUpdateStatus(sub.id, "Need More Information")}
                    className="border border-orange-200 text-orange-700 hover:bg-orange-50 px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all"
                  >
                    Need Info
                  </button>
                )}
                {sub.status !== "Approved" && (
                  <button
                    onClick={() => handleUpdateStatus(sub.id, "Approved")}
                    className="border border-emerald-250/20 text-emerald-700 hover:bg-emerald-50 px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all"
                  >
                    Approve
                  </button>
                )}
                {sub.status !== "Invited to Dashboard" && (
                  <button
                    onClick={() => handleUpdateStatus(sub.id, "Invited to Dashboard")}
                    className="bg-brand-primary text-white hover:bg-brand-dark px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1"
                  >
                    <FaCheck size={9} /> Invite to Dashboard
                  </button>
                )}
                {sub.status !== "Active Contributor" && sub.status === "Invited to Dashboard" && (
                  <button
                    onClick={() => handleUpdateStatus(sub.id, "Active Contributor")}
                    className="bg-green-600 text-white hover:bg-green-700 px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all"
                  >
                    Set Active
                  </button>
                )}
                {sub.status !== "Rejected" && (
                  <button
                    onClick={() => handleUpdateStatus(sub.id, "Rejected")}
                    className="border border-red-200 text-red-700 hover:bg-red-50 px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all"
                  >
                    Reject
                  </button>
                )}
                <button
                  onClick={() => setDeleteTarget(sub)}
                  className="border border-red-200 text-red-500 hover:bg-red-500 hover:text-white px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1"
                >
                  <FaTrash size={9} /> Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
            <h3 className="text-xl font-black text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the submission from <span className="font-bold">{deleteTarget.fullName}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-6 py-2.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
