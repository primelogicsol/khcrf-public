"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaBook,
  FaTrash,
  FaEdit,
  FaCloudUploadAlt,
  FaEllipsisV,
  FaExternalLinkAlt,
  FaFileAlt,
  FaQuoteRight,
  FaCheck,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

import BulkUploadModal from "@/components/dashboard/publications/BulkUploadModal";
import ConfirmationModal from "@/components/common/ConfirmationModal";

export default function PublicationsList() {
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [selectedTier, setSelectedTier] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // States for Confirmation Modal
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "delete" | "archive" | "publish" | "unpublish";
    id: string | null;
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "delete",
    id: null,
    title: "",
    message: "",
  });
  const [actionLoading, setActionLoading] = useState(false);

  // Safely extract a display string from any value (Prisma includes return nested objects)
  const str = (val: any, fallback = "—"): string => {
    if (!val) return fallback;
    if (typeof val === "string") return val;
    if (typeof val === "number") return String(val);
    if (typeof val === "object") return val.name || val.label || val.title || val.slug || fallback;
    return fallback;
  };

  const fetchPublications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/publications");
      const payload = res.data?.data ?? res.data;
      setPublications(Array.isArray(payload) ? payload : []);
    } catch (error) {
      console.error("Failed to fetch publications", error);
      setPublications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const initiateDelete = (id: string, title: string) => {
    setConfirmModal({
      isOpen: true,
      type: "delete",
      id,
      title: "Delete Publication?",
      message: `Are you sure you want to permanently delete "${title}"? This cannot be undone.`,
    });
    setActiveMenuId(null);
  };

  const initiateArchive = (id: string, title: string) => {
    setConfirmModal({
      isOpen: true,
      type: "archive",
      id,
      title: "Archive Publication?",
      message: `Are you sure you want to archive "${title}"? It will be hidden from the public hub.`,
    });
    setActiveMenuId(null);
  };

  const togglePublishStatus = async (pub: any) => {
    const newStatus = pub.publishedStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      await api.put(`/publications/${pub.id}`, {
        ...pub,
        publishedStatus: newStatus,
      });
      toast.success(`Publication status changed to ${newStatus}`);
      fetchPublications();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
    setActiveMenuId(null);
  };

  const handleConfirmAction = async () => {
    if (!confirmModal.id) return;
    setActionLoading(true);

    try {
      if (confirmModal.type === "delete") {
        await api.delete(`/publications/${confirmModal.id}`);
        toast.success("Publication deleted successfully");
        setPublications((prev) => prev.filter((p) => p.id !== confirmModal.id));
      } else if (confirmModal.type === "archive") {
        const pub = publications.find((p) => p.id === confirmModal.id);
        await api.put(`/publications/${confirmModal.id}`, {
          ...pub,
          publishedStatus: "ARCHIVED",
        });
        toast.success("Publication archived");
        fetchPublications();
      }
      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    } catch (error) {
      console.error(error);
      toast.error(`Action failed: ${confirmModal.type}`);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredPubs = publications.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.author && p.author.toLowerCase().includes(search.toLowerCase())) ||
      (p.isbn && p.isbn.toLowerCase().includes(search.toLowerCase()));

    const matchesSector = selectedSector === "All" || p.craftSector === selectedSector;
    const matchesDomain = selectedDomain === "All" || p.domain === selectedDomain;
    const matchesTier = selectedTier === "All" || p.accessType === selectedTier || p.accessTier === selectedTier;
    const matchesStatus =
      selectedStatus === "All" ||
      (selectedStatus === "PUBLISHED" && p.publishedStatus === "PUBLISHED") ||
      (selectedStatus === "DRAFT" && p.publishedStatus !== "PUBLISHED");

    return matchesSearch && matchesSector && matchesDomain && matchesTier && matchesStatus;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <BulkUploadModal
        isOpen={showBulkUpload}
        onClose={() => setShowBulkUpload(false)}
        onSuccess={fetchPublications}
      />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmAction}
        title={confirmModal.title}
        message={confirmModal.message}
        isLoading={actionLoading}
        confirmLabel={confirmModal.type === "delete" ? "Delete" : "Confirm"}
        cancelLabel="Cancel"
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Publications Catalog</h1>
          <p className="text-gray-500 text-sm">
            Publish and manage research papers, policy briefs, and e-publications.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-600 border border-stone-200 rounded-xl hover:bg-stone-50 hover:text-brand-primary transition-all text-xs uppercase font-black tracking-wider"
            onClick={() => setShowBulkUpload(true)}
          >
            <FaCloudUploadAlt /> Bulk Upload
          </button>
          <Link
            href="/dashboard/business/publications/add"
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/20 transition-all text-xs uppercase font-black tracking-wider"
          >
            <FaPlus /> Add Publication
          </Link>
        </div>
      </div>

      {/* Advanced Filter Widgets */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/60 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
              <FaSearch size={14} />
            </span>
            <input
              type="text"
              placeholder="Search catalog by title, author, or ISBN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-brand-primary focus:bg-white transition-all text-sm"
            />
          </div>
          <div className="grid grid-cols-2 md:flex gap-3">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-650"
            >
              <option value="All">All Sectors</option>
              <option value="Pashmina">Pashmina</option>
              <option value="Kani">Kani</option>
              <option value="Carpet">Carpet</option>
              <option value="Papier-Mâché">Papier-Mâché</option>
              <option value="Walnut Wood">Walnut Wood</option>
              <option value="Sozni">Sozni</option>
            </select>

            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-650"
            >
              <option value="All">All Domains</option>
              <option value="Authentication">Authentication</option>
              <option value="GI Protection">GI Protection</option>
              <option value="Market Intelligence">Market Intelligence</option>
              <option value="Artisan Livelihoods">Artisan Livelihoods</option>
            </select>

            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-650"
            >
              <option value="All">All Access Tiers</option>
              <option value="PUBLIC">Open Access</option>
              <option value="MEMBER">Member Access</option>
              <option value="PREMIUM">Premium Research</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-650"
            >
              <option value="All">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Drafts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Catalog Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <FaSpinner data-ui-icon  className="animate-spin text-3xl " />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-650">
              <thead className="bg-stone-50 text-gray-400 font-bold uppercase text-[10px] tracking-wider border-b border-stone-200/50">
                <tr>
                  <th className="px-6 py-4">Cover / Title</th>
                  <th className="px-6 py-4">Series & Category</th>
                  <th className="px-6 py-4">Taxonomy</th>
                  <th className="px-6 py-4">Access Tier</th>
                  <th className="px-6 py-4">ISBN Status</th>
                  <th className="px-6 py-4">Reader Status</th>
                  <th className="px-6 py-4">SEO</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredPubs.map((pub) => {
                  const hasReader = pub.type === "WRITTEN" || (pub.chapters && pub.chapters.length > 0);
                  const hasISBN = !!pub.isbn;
                  const hasSEO = !!(pub.seoTitle || pub.seoDescription);

                  return (
                    <tr
                      key={pub.id}
                      className="hover:bg-stone-50/30 transition-colors align-middle"
                    >
                      {/* Cover & Title */}
                      <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-3 min-w-[280px]">
                        <div className="w-10 h-14 relative bg-stone-100 rounded border border-stone-200 shadow-sm overflow-hidden flex items-center justify-center shrink-0">
                          {pub.imagePath ? (
                            <img
                              src={pub.imagePath}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FaBook className="text-stone-300" size={16} />
                          )}
                        </div>
                        <div>
                          <span className="block text-sm font-bold text-stone-850 line-clamp-1">{pub.title}</span>
                          <span className="text-[10px] text-gray-400 font-mono block mt-0.5">{pub.author || "KHCRF Press"}</span>
                        </div>
                      </td>

                      {/* Series & Category */}
                      <td className="px-6 py-4">
                        <span className="block text-xs font-semibold text-gray-700">{pub.series || "Heritage Series"}</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">{str(pub.category, "General Research")}</span>
                      </td>

                      {/* Taxonomy */}
                      <td className="px-6 py-4 space-y-1">
                        <div className="flex gap-1.5 flex-wrap">
                          <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded text-[9px] font-bold">
                            Sector: {str(pub.craftSector, "Multi-Craft")}
                          </span>
                          <span className="text-[9px] text-gray-400">
                            Domain: {str(pub.domain, "Research")}
                          </span>
                        </div>
                        <span className="block text-[9px] text-gray-400">Audience: {pub.audience || "Researchers"}</span>
                      </td>

                      {/* Access Tier */}
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          str(pub.accessType) === "PREMIUM" ? "bg-rose-50 text-rose-700 border border-rose-100" :
                          str(pub.accessType) === "MEMBER" ? "bg-indigo-50 text-indigo-700 border border-indigo-100" :
                          "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        }`}>
                          {str(pub.accessType, "OPEN_ACCESS")}
                        </span>
                      </td>

                      {/* ISBN Status */}
                      <td className="px-6 py-4">
                        {hasISBN ? (
                          <div>
                            <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                              {pub.isbn}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-300 text-xs italic">Not Assigned</span>
                        )}
                      </td>

                      {/* Reader Status */}
                      <td className="px-6 py-4">
                        {hasReader ? (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-md text-[10px] font-bold">
                            <span className="w-1 h-1 rounded-full bg-amber-600 animate-pulse"></span>
                            Reader Enabled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-400 px-2 py-0.5 rounded-md text-[10px] font-bold">
                            <FaTimes size={8} /> PDF Link
                          </span>
                        )}
                      </td>

                      {/* SEO Status */}
                      <td className="px-6 py-4">
                        {hasSEO ? (
                          <span className="text-emerald-600" title="SEO Optimised">
                            <FaCheck size={12} />
                          </span>
                        ) : (
                          <span className="text-stone-300" title="SEO Missing">
                            <FaTimes size={12} />
                          </span>
                        )}
                      </td>

                      {/* Publish Status */}
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          str(pub.publishedStatus) === "PUBLISHED" ? "bg-green-100 text-green-800" :
                          str(pub.publishedStatus) === "ARCHIVED" ? "bg-stone-100 text-stone-500" :
                          "bg-amber-100 text-amber-800"
                        }`}>
                          {str(pub.publishedStatus, "DRAFT")}
                        </span>
                        <span className="block text-[8px] text-gray-400 mt-1 font-mono">
                          {new Date(pub.updatedAt || pub.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right relative">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === pub.id ? null : pub.id)}
                          className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-50 rounded-lg transition-all"
                        >
                          <FaEllipsisV size={14} />
                        </button>

                        {activeMenuId === pub.id && (
                          <div className="absolute right-6 mt-1 w-48 bg-white border border-stone-200 rounded-xl shadow-xl z-50 py-1 text-left font-sans animate-fadeIn">
                            <Link
                              href={`/dashboard/business/publications/add?edit=${pub.id}`}
                              className="flex items-center gap-2 px-4 py-2 hover:bg-stone-50 text-xs font-semibold text-gray-700 transition-colors"
                            >
                              <FaEdit className="text-stone-400" /> Edit Metadata
                            </Link>
                            <Link
                              href={`/dashboard/business/publications/add?edit=${pub.id}&tab=content`}
                              className="flex items-center gap-2 px-4 py-2 hover:bg-stone-50 text-xs font-semibold text-gray-700 transition-colors"
                            >
                              <FaFileAlt className="text-stone-400" /> Edit Reader
                            </Link>
                            <Link
                              href={`/publications/${pub.slug}`}
                              target="_blank"
                              className="flex items-center gap-2 px-4 py-2 hover:bg-stone-50 text-xs font-semibold text-gray-700 transition-colors"
                            >
                              <FaExternalLinkAlt className="text-stone-400" /> Preview Detail
                            </Link>
                            {hasReader && (
                              <Link
                                href={`/publications/read/${pub.slug}`}
                                target="_blank"
                                className="flex items-center gap-2 px-4 py-2 hover:bg-stone-50 text-xs font-semibold text-gray-700 transition-colors border-b border-stone-100"
                              >
                                <FaBook className="text-stone-400" /> Preview Reader
                              </Link>
                            )}
                            <button
                              onClick={() => togglePublishStatus(pub)}
                              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-stone-50 text-xs font-semibold text-gray-700 transition-colors text-left"
                            >
                              <FaCheck className="text-stone-400" /> {str(pub.publishedStatus) === "PUBLISHED" ? "Unpublish (Draft)" : "Publish"}
                            </button>
                            <button
                              onClick={() => initiateArchive(pub.id, pub.title)}
                              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-stone-50 text-xs font-semibold text-gray-700 transition-colors text-left"
                            >
                              <FaQuoteRight className="text-stone-400" /> Archive
                            </button>
                            <button
                              onClick={() => initiateDelete(pub.id, pub.title)}
                              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-xs font-semibold text-red-600 transition-colors text-left border-t border-stone-100"
                            >
                              <FaTrash className="text-red-400" /> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {filteredPubs.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-12 text-center text-gray-400 italic"
                    >
                      No matching publications found in catalog.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
