"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  FaSearch,
  FaFileAlt,
  FaCheck,
  FaTimes, // Added for close button
  FaSpinner,
  FaEye,
  FaDownload, // Added for CSV export
  FaBuilding,
  FaUserTie,
  FaMapMarkerAlt,
  FaEdit,
  FaTrashAlt,
  FaEllipsisV,
} from "react-icons/fa";
import { exportToCsv } from "@/utils/exportCsv";
import Select from "@/components/common/Select";
import toast from "react-hot-toast";

export default function CcsiClient() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [constituencyFilter, setConstituencyFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [constituencies, setConstituencies] = useState<
    { value: string; label: string }[]
  >([]);

  // Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<any>(null);

  const statuses = [
    { value: "ALL", label: "All Statuses" },
    { value: "SUBMITTED", label: "Submitted" },
    { value: "PENDING_JURISDICTION", label: "Pending Jurisdiction" },
    { value: "JURISDICTION_APPROVED", label: "Jurisdiction Approved" },
    { value: "GENERAL_INTAKE", label: "General Intake" },
    { value: "VERIFIED", label: "Verified" },
    { value: "CONDITIONAL_REVIEW", label: "Conditional Review" },
    { value: "REJECTED", label: "Rejected" },
  ];

  useEffect(() => {
    fetchConstituencies();
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [page, statusFilter, constituencyFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1); // Reset to first page on search
      fetchProfiles();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchConstituencies = async () => {
    try {
      const { data } = await api.get("/admin/offices");
      // Extract unique constituencies
      const uniqueConstituencies = Array.from(
        new Set(data.map((office: any) => office.constituency).filter(Boolean)),
      );

      const options = uniqueConstituencies.map((c) => ({
        value: c as string,
        label: c as string,
      }));
      setConstituencies(options.sort((a, b) => a.label.localeCompare(b.label)));
    } catch (error) {
      console.error("Failed to load constituencies", error);
    }
  };

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      let url = `/admin/ccsi-profiles?page=${page}&limit=15`;
      if (statusFilter !== "ALL") url += `&status=${statusFilter}`;
      if (constituencyFilter !== "ALL")
        url += `&constituency=${encodeURIComponent(constituencyFilter)}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

      const { data } = await api.get(url);
      setProfiles(data.data);
      setTotalPages(data.pages);
      setTotalItems(data.total);
    } catch (error) {
      console.error("Failed to fetch CCSI profiles", error);
      toast.error("Failed to load CCSI profiles.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.put(`/admin/ccsi-profiles/${id}/status`, { status: newStatus });
      toast.success("Profile status updated successfully");
      fetchProfiles(); // Refresh
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update status");
    }
  };

  const handleDeleteClick = (profile: any) => {
    setProfileToDelete(profile);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!profileToDelete) return;

    try {
      setIsSaving(true);
      await api.delete(`/admin/ccsi-profiles/${profileToDelete.id}`);
      toast.success("Profile deleted successfully");
      setIsDeleteModalOpen(false);
      setProfileToDelete(null);
      fetchProfiles();
    } catch (error) {
      console.error("Failed to delete profile", error);
      toast.error("Failed to delete profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = (profile: any) => {
    setEditingProfile({ ...profile });
    setIsEditModalOpen(true);
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;

    try {
      setIsSaving(true);
      // Clean up relations from payload before sending to edit endpoint
      const {
        legislativeOffice,
        applications,
        id,
        createdAt,
        updatedAt,
        ...updateData
      } = editingProfile;

      await api.put(`/admin/ccsi-profiles/${editingProfile.id}`, updateData);
      toast.success("Profile updated successfully");
      setIsEditModalOpen(false);
      setEditingProfile(null);
      fetchProfiles();
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return (
          <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold whitespace-nowrap">
            Verified
          </span>
        );
      case "JURISDICTION_APPROVED":
      case "SUBMITTED":
        return (
          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold whitespace-nowrap">
            {status.replace("_", " ")}
          </span>
        );
      case "GENERAL_INTAKE":
        return (
          <span className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-bold whitespace-nowrap">
            General Intake
          </span>
        );
      case "PENDING_JURISDICTION":
      case "CONDITIONAL_REVIEW":
        return (
          <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold whitespace-nowrap">
            {status.replace("_", " ")}
          </span>
        );
      case "REJECTED":
        return (
          <span className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-bold whitespace-nowrap">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-gray-50 text-gray-700 border border-gray-200 rounded-full text-xs font-bold whitespace-nowrap">
            {status}
          </span>
        );
    }
  };

  const handleExport = () => {
    exportToCsv("ccsi_profiles_export", profiles);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-dark">
            All CCSI Profiles
          </h1>
          <p className="text-gray-500 mt-1">
            Global view of all Constituency Craft & Stakeholder Intake profiles
            ({totalItems} total)
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name, phone..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 text-brand-dark placeholder:text-gray-500 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary bg-white shadow-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-48">
            <Select
              label=""
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              options={statuses}
              className="py-2"
            />
          </div>

          <div className="w-full sm:w-48">
            <Select
              label=""
              value={constituencyFilter}
              onChange={(e) => {
                setConstituencyFilter(e.target.value);
                setPage(1);
              }}
              options={[
                { value: "ALL", label: "All Constituencies" },
                ...constituencies,
              ]}
              className="py-2"
            />
          </div>

          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:text-brand-primary transition-all shadow-sm shrink-0"
            title="Export current page to CSV"
          >
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative pb-16">
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4 text-gray-400">
              <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
              <p>Loading profiles...</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 font-bold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Craft Details</th>
                  <th className="px-6 py-4">Constituency/Office</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4 whitespace-nowrap">Status & Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {profiles.map((profile) => (
                  <tr
                    key={profile.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-brand-dark text-sm border-b border-gray-100 pb-1 mb-1 font-mono">
                        {profile.applicationCode ||
                          profile.id.slice(0, 8).toUpperCase()}
                      </div>
                      <div className="font-bold text-gray-700 text-sm">
                        {profile.fullName}
                      </div>
                      {profile.businessName && (
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <FaBuilding className="text-gray-400 shrink-0" />{" "}
                          <span className="truncate max-w-[150px]">
                            {profile.businessName}
                          </span>
                        </div>
                      )}
                      <span className="inline-block mt-1 text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {profile.applicantCategory}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-800">
                        {profile.primaryCraft}
                      </div>
                      {profile.secondaryCraft && (
                        <div className="text-xs text-gray-500">
                          Sec: {profile.secondaryCraft}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-0.5">
                        Exp: {profile.yearsExperience || "N/A"} yrs
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {profile.legislativeOffice ? (
                        <div>
                          <div className="font-medium text-sm text-gray-800 flex items-center gap-1">
                            <FaUserTie data-ui-icon  className="/70 shrink-0" />{" "}
                            <span className="truncate max-w-[150px]">
                              {profile.legislativeOffice.representativeName}
                            </span>
                          </div>
                          <div className="text-xs text-brand-primary/80 font-medium truncate max-w-[170px]">
                            {profile.legislativeOffice.constituency}
                          </div>
                          <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <FaMapMarkerAlt className="shrink-0" />{" "}
                            <span className="truncate max-w-[150px]">
                              {profile.village}, {profile.district}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                            General Intake
                          </span>
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <FaMapMarkerAlt className="shrink-0" />{" "}
                            <span className="truncate max-w-[150px]">
                              {profile.village}, {profile.district}
                            </span>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-800">
                        {profile.primaryContact}
                      </div>
                      {profile.email && (
                        <div className="text-xs text-gray-500 truncate max-w-[150px]">
                          {profile.email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-1">
                        <select
                          className="text-xs border border-gray-200 rounded-md py-1 px-2 bg-white text-gray-700 shadow-sm focus:ring-1 focus:ring-brand-primary focus:border-brand-primary cursor-pointer max-w-[150px]"
                          value={profile.status}
                          onChange={(e) =>
                            handleUpdateStatus(profile.id, e.target.value)
                          }
                        >
                          {statuses
                            .filter((s) => s.value !== "ALL")
                            .map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.label}
                              </option>
                            ))}
                        </select>
                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                          {new Date(profile.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(profile)}
                          className="p-2 text-brand-primary bg-brand-primary/10 hover:bg-brand-primary/20 rounded-lg transition-colors"
                          title="Edit Profile"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(profile)}
                          className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete Profile"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                      <div className="mt-2 text-[10px] text-gray-400 font-mono">
                        ID: {profile.id.substring(0, 6)}...
                      </div>
                    </td>
                  </tr>
                ))}
                {profiles.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-400"
                    >
                      <FaFileAlt className="text-4xl mx-auto mb-3 opacity-20" />
                      <p>No CCSI profiles found matching your criteria.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination - absolute positioned at bottom for cleaner flow if table grows */}
        {!loading && totalPages > 1 && (
          <div className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/90 backdrop-blur-sm z-10 w-full">
            <div className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-bold text-gray-700">
                {(page - 1) * 15 + profiles.length}
              </span>{" "}
              of <span className="font-bold text-gray-700">{totalItems}</span>{" "}
              results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-sm"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- Edit Modal --- */}
      {isEditModalOpen && editingProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-black text-brand-dark">
                Edit CCSI Profile
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6 overflow-y-auto w-full custom-scrollbar flex-1">
              <form
                id="edit-ccsi-form"
                onSubmit={handleEditSave}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
              >
                <div className="space-y-4">
                  <h3 className="font-bold text-brand-primary border-b border-gray-100 pb-2">
                    Applicant Details
                  </h3>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      value={editingProfile.fullName || ""}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          fullName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={editingProfile.businessName || ""}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          businessName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={
                        editingProfile.applicantCategory ||
                        "Constituency Member"
                      }
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          applicantCategory: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary bg-white"
                    >
                      <option value="Constituency Member">
                        Constituency Member
                      </option>
                      <option value="Non-Member/Visitor">
                        Non-Member/Visitor
                      </option>
                      <option value="Stakeholder">Stakeholder</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Primary Craft
                    </label>
                    <input
                      required
                      type="text"
                      value={editingProfile.primaryCraft || ""}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          primaryCraft: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Years Experience
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingProfile.yearsExperience || ""}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          yearsExperience: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-brand-primary border-b border-gray-100 pb-2">
                    Contact & Location
                  </h3>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Primary Contact (Phone)
                    </label>
                    <input
                      required
                      type="text"
                      value={editingProfile.primaryContact || ""}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          primaryContact: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editingProfile.email || ""}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      District
                    </label>
                    <input
                      required
                      type="text"
                      value={editingProfile.district || ""}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          district: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Village/Town
                    </label>
                    <input
                      required
                      type="text"
                      value={editingProfile.village || ""}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          village: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <input
                      type="checkbox"
                      id="isCommerceInterested"
                      checked={editingProfile.isCommerceInterested || false}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          isCommerceInterested: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary"
                    />
                    <label
                      htmlFor="isCommerceInterested"
                      className="text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      Interested in KHCRF Commerce Chamber?
                    </label>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="edit-ccsi-form"
                disabled={isSaving}
                className="px-6 py-2 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-secondary transition-colors shadow-lg shadow-brand-primary/25 disabled:opacity-50 flex items-center justify-center min-w-[120px]"
              >
                {isSaving ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Delete Confirmation Modal --- */}
      {isDeleteModalOpen && profileToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrashAlt className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-brand-dark mb-2">
              Delete Profile?
            </h2>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete the CCSI Profile for{" "}
              <strong className="text-gray-800">
                {profileToDelete.fullName}
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 flex items-center justify-center"
              >
                {isSaving ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// helper for proper pagination label depending on count
function profileItemsCount(profiles: any[], page: number, total: number) {
  if (profiles.length === 0) return 0;
  return `${profiles.length === 15 ? 15 : profiles.length}`;
}
