"use client";

import { useState, useEffect } from "react";
import api, { adminApi, userApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  FaUserShield,
  FaEdit,
  FaCheck,
  FaTrash,
  FaUser,
  FaSearch,
  FaHistory,
  FaTimes,
  FaDesktop,
  FaMapMarkerAlt,
  FaClock,
  FaSignInAlt,
  FaDownload,
  FaArchive,
  FaUndo,
  FaBan,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";
import Select from "@/components/common/Select";
import { exportToCsv } from "@/utils/exportCsv";
import ImageUpload from "@/components/common/ImageUpload";
import { normalizeArray } from "@/lib/normalize";

const ROLE_GROUPS = [
  {
    label: "Administration",
    options: [
      { value: "SYSTEM_ADMIN", label: "System Administrator" },
      { value: "ADMIN", label: "Administrator" },
      { value: "OPERATIONS_MANAGER", label: "Operations Manager" },
      { value: "USER", label: "Standard User" },
    ]
  },
  {
    label: "Membership & Community",
    options: [
      { value: "MODERATOR_MEMBERSHIP", label: "Membership Moderator" },
      { value: "MEMBERSHIP_REVIEWER", label: "Membership Reviewer" },
      { value: "VOLUNTEER_COORDINATOR", label: "Volunteer Coordinator" },
      { value: "COMMUNITY_COORDINATOR", label: "Community Coordinator" },
    ]
  },
  {
    label: "Master Artisans",
    options: [
      { value: "MASTER_ARTISAN_MODERATOR", label: "Master Artisan Moderator" },
      { value: "MASTER_ARTISAN_REVIEWER", label: "Master Artisan Reviewer" },
      { value: "NOMINATION_REVIEWER", label: "Nomination Reviewer" },
      { value: "STORY_EDITOR", label: "Story Editor" },
    ]
  },
  {
    label: "Research & Policy",
    options: [
      { value: "RESEARCH_MODERATOR", label: "Research Moderator" },
      { value: "RESEARCH_REVIEWER", label: "Research Reviewer" },
      { value: "POLICY_MODERATOR", label: "Policy Moderator" },
      { value: "POLICY_REVIEWER", label: "Policy Reviewer" },
    ]
  },
  {
    label: "State of Kashmir Crafts Assessment",
    options: [
      { value: "ASSESSMENT_ADMINISTRATOR", label: "Assessment Administrator" },
      { value: "ASSESSMENT_MODERATOR", label: "Assessment Moderator" },
      { value: "EVIDENCE_REVIEWER", label: "Evidence Reviewer" },
      { value: "PUBLIC_HEARING_MODERATOR", label: "Public Hearing Moderator" },
      { value: "EXPERT_REVIEWER", label: "Expert Reviewer" },
      { value: "VALIDATION_REVIEWER", label: "Validation Reviewer" },
    ]
  },
  {
    label: "Publications",
    options: [
      { value: "MAGAZINE_EDITOR", label: "Magazine Editor" },
      { value: "PUBLICATIONS_EDITOR", label: "Publications Editor" },
      { value: "EDITORIAL_REVIEWER", label: "Editorial Reviewer" },
      { value: "EBOOKS_MODERATOR", label: "E-Books Moderator" },
    ]
  },
  {
    label: "Knowledge Base",
    options: [
      { value: "KNOWLEDGE_MODERATOR", label: "Knowledge Moderator" },
      { value: "GLOSSARY_EDITOR", label: "Glossary Editor" },
      { value: "LEARNING_CONTENT_MODERATOR", label: "Learning Content Moderator" },
    ]
  },
  {
    label: "Heritage Documentation",
    options: [
      { value: "ARCHIVE_CURATOR", label: "Archive Curator" },
      { value: "DOCUMENTATION_MODERATOR", label: "Documentation Moderator" },
      { value: "ORAL_HISTORY_MODERATOR", label: "Oral History Moderator" },
      { value: "MEDIA_ARCHIVIST", label: "Media Archivist" },
    ]
  },
  {
    label: "Museum & Collections",
    options: [
      { value: "MUSEUM_CURATOR", label: "Museum Curator" },
      { value: "COLLECTIONS_MANAGER", label: "Collections Manager" },
      { value: "ARTIFACT_DOCUMENTATION_MODERATOR", label: "Artifact Documentation Moderator" },
      { value: "COLLECTIONS_CURATOR", label: "Collections Curator" },
    ]
  },
  {
    label: "Business Support",
    options: [
      { value: "BUSINESS_SUPPORT_MODERATOR", label: "Business Support Moderator" },
      { value: "EXPORT_ADVISOR", label: "Export Advisor" },
      { value: "MARKET_DEVELOPMENT_MODERATOR", label: "Market Development Moderator" },
      { value: "BUYER_RELATIONS_COORDINATOR", label: "Buyer Relations Coordinator" },
    ]
  },
  {
    label: "Advocacy",
    options: [
      { value: "ADVOCACY_COLLABORATOR", label: "Advocacy Collaborator" },
      { value: "CAMPAIGN_COORDINATOR", label: "Campaign Coordinator" },
      { value: "LOBBYING_COLLABORATOR", label: "Lobbying Collaborator" },
    ]
  },
  {
    label: "Certification & Accreditation",
    options: [
      { value: "CERTIFICATION_MODERATOR", label: "Certification Moderator" },
      { value: "CERTIFICATION_REVIEWER", label: "Certification Reviewer" },
      { value: "ACCREDITATION_MODERATOR", label: "Accreditation Moderator" },
      { value: "ACCREDITATION_REVIEWER", label: "Accreditation Reviewer" },
      { value: "COMPLIANCE_REVIEWER", label: "Compliance Reviewer" },
    ]
  },
  {
    label: "Donations & Finance",
    options: [
      { value: "DONATIONS_MODERATOR", label: "Donations Moderator" },
      { value: "FINANCE_REVIEWER", label: "Finance Reviewer" },
      { value: "GRANT_COORDINATOR", label: "Grant Coordinator" },
      { value: "FUNDRAISING_COORDINATOR", label: "Fundraising Coordinator" },
    ]
  },
  {
    label: "Media Center",
    options: [
      { value: "MEDIA_MODERATOR", label: "Media Moderator" },
      { value: "PRESS_COORDINATOR", label: "Press Coordinator" },
      { value: "PHOTO_EDITOR", label: "Photo Editor" },
      { value: "VIDEO_EDITOR", label: "Video Editor" },
    ]
  },
  {
    label: "Events",
    options: [
      { value: "EVENTS_MODERATOR", label: "Events Moderator" },
      { value: "WORKSHOP_COORDINATOR", label: "Workshop Coordinator" },
      { value: "CONFERENCE_COORDINATOR", label: "Conference Coordinator" },
      { value: "TRAINING_COORDINATOR", label: "Training Coordinator" },
    ]
  },
  {
    label: "Partnerships",
    options: [
      { value: "PARTNER_COORDINATOR", label: "Partner Coordinator" },
      { value: "INSTITUTION_COORDINATOR", label: "Institution Coordinator" },
      { value: "INTERNATIONAL_RELATIONS_COORDINATOR", label: "International Relations Coordinator" },
    ]
  },
  {
    label: "Website",
    options: [
      { value: "WEBSITE_CONTENT_MANAGER", label: "Website Content Manager" },
      { value: "SEO_MANAGER", label: "SEO Manager" },
    ]
  },
  {
    label: "Technical",
    options: [
      { value: "DASHBOARD_AUDITOR", label: "Dashboard Auditor" },
      { value: "API_MANAGER", label: "API Manager" },
      { value: "DEVELOPER", label: "Developer" },
      { value: "QA_REVIEWER", label: "QA Reviewer" },
    ]
  }
];

const ROLE_DISPLAY_NAMES: Record<string, string> = ROLE_GROUPS.reduce((acc, group) => {
  group.options.forEach(opt => acc[opt.value] = opt.label);
  return acc;
}, {} as Record<string, string>);

const getRoleDisplayName = (role: string) => ROLE_DISPLAY_NAMES[role] || role;

export default function UsersClient() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleUpdating, setRoleUpdating] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"ACTIVE" | "TRASHED">("ACTIVE");
  const [showTestAccounts, setShowTestAccounts] = useState(false);

  // History State
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [selectedUserForHistory, setSelectedUserForHistory] = useState<any | null>(null);

  // Edit State
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState({ name: "", email: "", password: "", avatarUrl: "" });
  
  // Delete Confirmation State
  const [deletingUser, setDeletingUser] = useState<any | null>(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [deleteReason, setDeleteReason] = useState("");

  const roles = Object.keys(ROLE_DISPLAY_NAMES);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users");
      setUsers(normalizeArray(data, ["users", "items", "results"]));
    } catch (error) {
      console.error("Failed to fetch users", error);
      alert("Failed to load users. Ensure you are an Admin.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (user: any, newStatus: string, actionName: string) => {
    const reason = prompt(`Please enter a reason to ${actionName} this user (optional):`);
    if (reason === null) return; // cancelled

    try {
      const { data } = await api.put(`/users/${user.id}/status`, { status: newStatus, reason });
      setUsers(users.map((u) => (u.id === user.id ? { ...u, ...data } : u)));
    } catch (error: any) {
      console.error(`Failed to update status to ${newStatus}`, error);
      alert(error.response?.data?.error || `Failed to update status to ${newStatus}`);
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    if (!confirm(`Are you sure you want to change this user's role to ${getRoleDisplayName(newRole)}?`)) return;

    setRoleUpdating(userId);
    try {
      const reason = prompt("Enter a reason for this role change (optional):");
      await api.put(`/users/${userId}/role`, { role: newRole, reason });
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch (error: any) {
      console.error("Failed to update role", error);
      alert(error.response?.data?.message || error.response?.data?.error || "Failed to update role");
      // Revert optimism by refetching
      fetchUsers();
    } finally {
      setRoleUpdating(null);
    }
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setEditFormData({ name: user.name || "", email: user.email || "", password: "", avatarUrl: user.avatarUrl || "" });
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      const payload: any = { name: editFormData.name, email: editFormData.email, avatarUrl: editFormData.avatarUrl };
      if (editFormData.password.trim() !== "") payload.password = editFormData.password;

      const { data } = await api.put(`/users/${editingUser.id}`, payload);
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...data } : u)));
      setEditingUser(null);
      alert("User updated successfully");
    } catch (error: any) {
      console.error("Failed to update user", error);
      alert(error.response?.data?.error || "Failed to update user.");
    }
  };

  const handleTrashUser = async (user: any) => {
    if (currentUser?.id === user.id) {
        alert("You cannot trash your own account.");
        return;
    }
    if (!confirm(`Are you sure you want to move ${user.name} to the trash (deactivate)?`)) return;
    try {
      const { data } = await api.put(`/users/${user.id}/trash`);
      setUsers(users.map((u) => (u.id === user.id ? { ...u, isTrashed: true, status: 'DEACTIVATED' } : u)));
    } catch (error: any) {
      console.error("Failed to trash user", error);
      alert(error.response?.data?.message || "Failed to move user to trash.");
    }
  };

  const handleRestoreUser = async (user: any) => {
    if (!confirm(`Are you sure you want to restore ${user.name}?`)) return;
    try {
      await api.put(`/users/${user.id}/restore`);
      setUsers(users.map((u) => (u.id === user.id ? { ...u, isTrashed: false, status: 'APPROVED' } : u)));
    } catch (error: any) {
      console.error("Failed to restore user", error);
      alert(error.response?.data?.error || "Failed to restore user.");
    }
  };

  const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletingUser) return;
    if (deleteConfirmationText !== "DELETE") {
      alert("Please type DELETE to confirm.");
      return;
    }
    try {
      await api.delete(`/users/${deletingUser.id}`, { params: { reason: deleteReason } });
      setUsers(users.filter((u) => u.id !== deletingUser.id));
      setDeletingUser(null);
      setDeleteConfirmationText("");
      setDeleteReason("");
    } catch (error: any) {
      console.error("Failed to delete user", error);
      alert(error.response?.data?.message || error.response?.data?.error || "Failed to delete user.");
      setDeletingUser(null);
      setDeleteConfirmationText("");
      setDeleteReason("");
    }
  };

  const handleViewHistory = async (user: any) => {
    setSelectedUserForHistory(user);
    setHistoryLoading(true);
    setHistoryData([]);
    try {
      const data = await adminApi.getUserHistory(user.id);
      setHistoryData(normalizeArray(data, ["history", "items", "results", "data"]));
    } catch (error) {
      console.error("Failed to fetch history", error);
      alert("Failed to fetch login history.");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleImpersonate = async (user: any) => {
    if (!confirm(`Are you sure you want to login as ${user.name}?`)) return;
    try {
      const data = await userApi.impersonate(user.id);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Impersonation failed", error);
      alert("Failed to impersonate user");
    }
  };

  const isTestAccount = (user: any) => user.email?.startsWith("test-") || user.name?.startsWith("Test ");
  const safeUsers = Array.isArray(users) ? users : [];
  const filteredUsers = safeUsers
    .filter((user) => (viewMode === "ACTIVE" ? !user.isTrashed : user.isTrashed))
    .filter((user) => showTestAccounts ? true : !isTestAccount(user))
    .filter((user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getStatusBadge = (status: string) => {
    const s = status || "PENDING";
    switch (s) {
      case "APPROVED": return <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200 uppercase tracking-wide">Approved</span>;
      case "PENDING": return <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-yellow-200 uppercase tracking-wide">Pending</span>;
      case "REJECTED": return <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200 uppercase tracking-wide">Rejected</span>;
      case "SUSPENDED": return <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-200 uppercase tracking-wide">Suspended</span>;
      case "DEACTIVATED": return <span className="bg-gray-100 text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-200 uppercase tracking-wide">Deactivated</span>;
      default: return <span className="bg-gray-100 text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-200 uppercase tracking-wide">{s}</span>;
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-dark">User Management</h1>
          <p className="text-gray-500 mt-1">Manage system users and access roles</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="text" placeholder="Search users..." className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 text-brand-dark placeholder:text-gray-500 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary bg-white shadow-sm transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button onClick={() => exportToCsv("users_export", filteredUsers)} className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:text-brand-primary transition-all shadow-sm shrink-0" title="Export to CSV">
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-gray-200 pb-2">
        <div className="flex gap-2">
          <button onClick={() => setViewMode("ACTIVE")} className={`px-4 py-2 font-bold text-sm rounded-lg transition-colors ${viewMode === "ACTIVE" ? "bg-brand-primary text-white" : "text-gray-500 hover:bg-gray-100"}`}>Active Users</button>
          <button onClick={() => setViewMode("TRASHED")} className={`px-4 py-2 font-bold text-sm rounded-lg transition-colors flex items-center gap-2 ${viewMode === "TRASHED" ? "bg-red-50 text-red-600 border border-red-200" : "text-gray-500 hover:bg-gray-100"}`}>
            <FaTrash /> Trash Bin
          </button>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-500 font-medium cursor-pointer hover:text-brand-primary transition-colors">
            <input type="checkbox" checked={showTestAccounts} onChange={(e) => setShowTestAccounts(e.target.checked)} className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
            Show Test Accounts
          </label>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 font-bold">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Assign Account Role</th>
                <th className="px-6 py-4">Actions</th>
                <th className="px-6 py-4 text-right">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div data-ui-icon className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center  text-sm font-bold shrink-0 overflow-hidden">
                        {user.avatarUrl ? <img src={user.avatarUrl} alt={`${user.name}'s DP`} className="w-full h-full object-cover" /> : user.name?.[0]?.toUpperCase() || <FaUser />}
                      </div>
                      <div>
                        <div className="font-bold text-brand-dark text-sm">{user.name}</div>
                        <div className="text-xs text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-start gap-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.status === 'APPROVED' ? (user.role === "ADMIN" || user.role === "SYSTEM_ADMIN" ? "bg-purple-50 text-purple-700 border-purple-100" : user.role === "USER" ? "bg-gray-50 text-gray-600 border-gray-100" : "bg-blue-50 text-blue-700 border-blue-100") : "bg-gray-100 text-gray-500 border-gray-200"}`}>
                        {getRoleDisplayName(user.role)}
                      </span>
                      {user.status !== 'APPROVED' && <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Requested</span>}
                      {user.status === 'APPROVED' && <span className="text-[10px] text-green-500 font-bold uppercase tracking-wide">Effective</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative min-w-[200px]">
                      <Select
                        label=""
                        value={user.role}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleRoleUpdate(user.id, e.target.value)}
                        disabled={roleUpdating === user.id || user.id === currentUser?.id}
                        options={ROLE_GROUPS}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* PENDING Actions */}
                      {user.status === 'PENDING' && !user.isTrashed && user.id !== currentUser?.id && (
                        <>
                          <button onClick={() => handleStatusUpdate(user, 'APPROVED', 'Approve')} title="Approve User" className="flex items-center gap-1 text-xs font-medium text-green-600 border border-green-200 rounded-lg px-2 py-1 bg-white hover:bg-green-50"><FaCheckCircle /> Approve</button>
                          <button onClick={() => handleStatusUpdate(user, 'REJECTED', 'Reject')} title="Reject User" className="flex items-center gap-1 text-xs font-medium text-red-600 border border-red-200 rounded-lg px-2 py-1 bg-white hover:bg-red-50"><FaTimesCircle /> Reject</button>
                        </>
                      )}

                      {/* APPROVED Actions */}
                      {user.status === 'APPROVED' && !user.isTrashed && user.id !== currentUser?.id && (
                        <>
                          <button onClick={() => handleStatusUpdate(user, 'SUSPENDED', 'Suspend')} title="Suspend User" className="flex items-center gap-1 text-xs font-medium text-orange-600 border border-orange-200 rounded-lg px-2 py-1 bg-white hover:bg-orange-50"><FaBan /> Suspend</button>
                          <button onClick={() => handleTrashUser(user)} title="Deactivate" className="flex items-center gap-1 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg px-2 py-1 bg-white hover:bg-gray-50"><FaArchive /> Deactivate</button>
                        </>
                      )}

                      {/* SUSPENDED Actions */}
                      {user.status === 'SUSPENDED' && !user.isTrashed && user.id !== currentUser?.id && (
                        <>
                          <button onClick={() => handleStatusUpdate(user, 'APPROVED', 'Reactivate')} title="Reactivate User" className="flex items-center gap-1 text-xs font-medium text-green-600 border border-green-200 rounded-lg px-2 py-1 bg-white hover:bg-green-50"><FaUndo /> Reactivate</button>
                          <button onClick={() => handleTrashUser(user)} title="Deactivate" className="flex items-center gap-1 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg px-2 py-1 bg-white hover:bg-gray-50"><FaArchive /> Deactivate</button>
                        </>
                      )}

                      {/* REJECTED Actions */}
                      {user.status === 'REJECTED' && !user.isTrashed && user.id !== currentUser?.id && (
                        <>
                          <button onClick={() => handleStatusUpdate(user, 'PENDING', 'Reconsider')} title="Reconsider User" className="flex items-center gap-1 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg px-2 py-1 bg-white hover:bg-blue-50"><FaUndo /> Reconsider</button>
                          <button onClick={() => setDeletingUser(user)} title="Hard Delete" className="flex items-center gap-1 text-xs font-medium text-red-600 border border-red-200 rounded-lg px-2 py-1 bg-white hover:bg-red-50"><FaTrash /> Delete</button>
                        </>
                      )}

                      {/* DEACTIVATED / TRASHED Actions */}
                      {user.isTrashed && user.id !== currentUser?.id && (
                        <>
                          <button onClick={() => handleRestoreUser(user)} title="Restore User" className="flex items-center gap-1 text-xs font-medium text-green-600 border border-green-200 rounded-lg px-2 py-1 bg-white hover:bg-green-50"><FaUndo /> Restore</button>
                          <button onClick={() => setDeletingUser(user)} title="Permanently Delete User" className="flex items-center gap-1 text-xs font-medium text-red-600 border border-red-200 rounded-lg px-2 py-1 bg-white hover:bg-red-50"><FaTrash /> Delete</button>
                        </>
                      )}

                      {/* Universal Actions */}
                      <button onClick={() => handleEditUser(user)} title="View/Edit Profile" className="flex items-center gap-1 text-xs font-medium text-icon-on-light border border-brand-primary/20 rounded-lg px-2 py-1 bg-white hover:bg-brand-primary/5"><FaEdit /> View</button>
                      <button onClick={() => handleViewHistory(user)} title="View Login History" className="flex items-center gap-1 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg px-2 py-1 bg-white hover:bg-gray-50"><FaHistory /></button>
                      {currentUser?.id !== user.id && !user.isTrashed && (
                        <button onClick={() => handleImpersonate(user)} title="Login as User" className="flex items-center gap-1 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg px-2 py-1 bg-white hover:bg-blue-50"><FaSignInAlt /></button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] text-gray-400 font-mono">ID: {user.id.slice(-6)}</span>
                      {getStatusBadge(user.status)}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No users found matching your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-slide-up border-2 border-red-500">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-red-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-lg"><FaTrash /></div>
                <div>
                  <h3 className="text-lg font-bold text-red-900">Confirm Hard Deletion</h3>
                  <p className="text-sm text-red-600 font-medium">Permanent Action</p>
                </div>
              </div>
              <button onClick={() => { setDeletingUser(null); setDeleteConfirmationText(""); setDeleteReason(""); }} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"><FaTimes /></button>
            </div>
            <form onSubmit={handleDeleteSubmit} className="p-6 space-y-4">
              <div className="bg-red-50 text-red-800 p-4 rounded-xl text-sm border border-red-200">
                You are about to permanently delete <strong>{deletingUser.name} ({deletingUser.email})</strong>. This action cannot be undone and will fail if the user has any dependent records (evidence, applications, etc.).
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Reason for deletion (Required)</label>
                <input type="text" required value={deleteReason} onChange={(e) => setDeleteReason(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" placeholder="State reason for audit log..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Type DELETE to confirm</label>
                <input type="text" required value={deleteConfirmationText} onChange={(e) => setDeleteConfirmationText(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" placeholder="DELETE" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => { setDeletingUser(null); setDeleteConfirmationText(""); setDeleteReason(""); }} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={deleteConfirmationText !== "DELETE" || deleteReason.trim() === ""} className="px-6 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-600/30">Permanently Delete</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div data-ui-icon className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center  text-lg"><FaEdit /></div>
                <div><h3 className="text-lg font-bold text-gray-900">View/Edit User</h3></div>
              </div>
              <button onClick={() => setEditingUser(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"><FaTimes /></button>
            </div>
            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label><input type="text" required value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all" /></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label><input type="email" required value={editFormData.email} onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all" /></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1">New Password <span className="text-xs font-normal text-gray-400">(leave blank to keep current)</span></label><input type="password" value={editFormData.password} onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all" /></div>
              <div><ImageUpload value={editFormData.avatarUrl} onChange={(url) => setEditFormData({ ...editFormData, avatarUrl: url })} label="Profile Picture (DP) (optional)" /></div>
              <div className="pt-4 flex justify-end gap-3"><button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">Cancel</button><button type="submit" className="px-6 py-2 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-dark transition-colors shadow-lg shadow-brand-primary/30">Save Changes</button></div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {selectedUserForHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div data-ui-icon className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center  text-lg"><FaHistory /></div>
                <div><h3 className="text-lg font-bold text-gray-900">Login History</h3><p className="text-sm text-gray-500">For {selectedUserForHistory.email}</p></div>
              </div>
              <button onClick={() => setSelectedUserForHistory(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"><FaTimes /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              {historyLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4 text-gray-400"><div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div><p>Loading history records...</p></div>
              ) : historyData.length === 0 ? (
                <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200"><FaUserShield className="text-4xl mx-auto mb-3 opacity-20" /><p>No login history found for this user.</p></div>
              ) : (
                <div className="space-y-4">
                  {historyData.map((log: any) => (
                    <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow gap-4">
                      <div className="flex items-start gap-4">
                        <div className="mt-1 text-gray-400"><FaDesktop /></div>
                        <div>
                          <div className="flex items-center gap-2"><p className="font-semibold text-gray-800 text-sm">{log.device || "Unknown Device"}</p>{log.isActive && <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200 uppercase tracking-wide">Active Now</span>}</div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500"><FaMapMarkerAlt className="opacity-50" /><span>{log.ipAddress || "Unknown IP"}</span></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 whitespace-nowrap"><FaClock />{new Date(log.loginAt).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
              <button onClick={() => setSelectedUserForHistory(null)} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm">Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
