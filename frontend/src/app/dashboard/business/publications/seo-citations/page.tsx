"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { 
  FaArrowLeft, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaGlobe, 
  FaTags, 
  FaSpinner, 
  FaQuoteRight, 
  FaPlus, 
  FaEdit, 
  FaTrashAlt, 
  FaBookmark, 
  FaLink, 
  FaExclamationTriangle,
  FaArrowRight
} from "react-icons/fa";
import { toast } from "react-hot-toast";

interface Citation {
  id?: string;
  claim: string;
  evidenceStatus: "VERIFIED" | "UNVERIFIED" | "HYPOTHESIS" | "PROHIBITED_UNTIL_SOURCED";
  sourceData: string;
  chapterId?: string | null;
  pageId?: string | null;
}

interface Chapter {
  id: string;
  title: string;
  order: number;
  pages: {
    id: string;
    pageNumber: number;
  }[];
}

export default function SeoCitationsPage() {
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selected publication editor states
  const [selectedPub, setSelectedPub] = useState<any | null>(null);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [citationsLoading, setCitationsLoading] = useState(false);

  // Form states
  const [editingCitation, setEditingCitation] = useState<Citation | null>(null);
  const [formClaim, setFormClaim] = useState("");
  const [formStatus, setFormStatus] = useState<Citation["evidenceStatus"]>("UNVERIFIED");
  const [formSource, setFormSource] = useState("");
  const [formChapterId, setFormChapterId] = useState("");
  const [formPageId, setFormPageId] = useState("");
  const [formError, setFormError] = useState("");

  // Safely extract display string from any field (Prisma includes return nested objects)
  const str = (val: any, fallback = "—"): string => {
    if (!val) return fallback;
    if (typeof val === "string") return val;
    if (typeof val === "number") return String(val);
    if (typeof val === "object") return val.name || val.label || val.title || val.slug || fallback;
    return fallback;
  };

  const fetchPubs = async () => {
    try {
      const res = await api.get("/publications");
      const payload = res.data?.data ?? res.data;
      setPublications(Array.isArray(payload) ? payload : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load publications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPubs();
  }, []);

  const handleSelectPub = async (pub: any) => {
    setSelectedPub(pub);
    setCitationsLoading(true);
    setEditingCitation(null);
    clearForm();

    try {
      // 1. Fetch citations
      const citRes = await api.get(`/publications/${pub.id}/citations`);
      if (citRes.data?.success) {
        setCitations(citRes.data.data);
      } else {
        setCitations([]);
      }

      // 2. Fetch chapters & pages for linking
      const chapRes = await api.get(`/publications/${pub.id}/chapters`);
      setChapters(chapRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch citations details.");
    } finally {
      setCitationsLoading(false);
    }
  };

  const clearForm = () => {
    setFormClaim("");
    setFormStatus("UNVERIFIED");
    setFormSource("");
    setFormChapterId("");
    setFormPageId("");
    setFormError("");
    setEditingCitation(null);
  };

  const handleEditClick = (cit: Citation) => {
    setEditingCitation(cit);
    setFormClaim(cit.claim);
    setFormStatus(cit.evidenceStatus);
    setFormSource(cit.sourceData || "");
    setFormChapterId(cit.chapterId || "");
    setFormPageId(cit.pageId || "");
    setFormError("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Validation checks
    if (!formClaim.trim()) {
      setFormError("Citation claim text is required.");
      return;
    }

    if (formStatus === "PROHIBITED_UNTIL_SOURCED" && !formSource.trim()) {
      setFormError("A source bibliography reference is strictly required when the status is set to PROHIBITED_UNTIL_SOURCED.");
      return;
    }

    try {
      const payload = {
        id: editingCitation?.id,
        claim: formClaim,
        evidenceStatus: formStatus,
        sourceData: formSource,
        chapterId: formChapterId || null,
        pageId: formPageId || null
      };

      const res = await api.post(`/publications/${selectedPub.id}/citations`, payload);
      if (res.data?.success) {
        toast.success(editingCitation ? "Citation updated successfully!" : "Citation added successfully!");
        
        // Refresh list
        const citRes = await api.get(`/publications/${selectedPub.id}/citations`);
        if (citRes.data?.success) {
          setCitations(citRes.data.data);
        }
        clearForm();
      } else {
        setFormError(res.data?.error || "Failed to save citation.");
      }
    } catch (err: any) {
      console.error(err);
      setFormError(err.response?.data?.error || "An error occurred while saving the citation.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this citation?")) return;

    try {
      const res = await api.delete(`/publications/citations/${id}`);
      if (res.data?.success) {
        toast.success("Citation deleted successfully!");
        setCitations(citations.filter(c => c.id !== id));
        if (editingCitation?.id === id) {
          clearForm();
        }
      } else {
        toast.error(res.data?.error || "Failed to delete citation.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || "An error occurred while deleting the citation.");
    }
  };

  // Find pages matching the selected chapter
  const availablePages = chapters.find(c => c.id === formChapterId)?.pages || [];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* 1. Publication List View */}
      {!selectedPub && (
        <>
          <div className="flex items-center gap-4 border-b border-stone-200 pb-6">
            <Link
              href="/dashboard/business/publications"
              className="p-2 text-stone-500 hover:bg-stone-50 rounded-xl transition-all"
            >
              <FaArrowLeft />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Scholarly Citation & Bibliography Mapper</h1>
              <p className="text-stone-500 text-sm">Create and verify inline citations, connect footnotes, and manage academic reference indexes.</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <FaSpinner data-ui-icon  className="animate-spin text-3xl " />
            </div>
          ) : (
            <div className="bg-white border border-stone-200/60 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm text-gray-655">
                <thead className="bg-stone-50 border-b border-stone-200/50">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Publication</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">ISBN</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Year</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {publications.map((pub) => (
                    <tr key={pub.id} className="hover:bg-stone-50/20 transition-all">
                      <td className="px-6 py-4">
                        <span className="block text-sm font-bold text-stone-850 line-clamp-1">{pub.title}</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">{pub.author}</span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-stone-600">
                        {pub.isbn || "Pending"}
                      </td>
                      <td className="px-6 py-4 text-xs text-stone-600">
                        {pub.published || "2026"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-stone-100 text-stone-600 px-2.5 py-0.5 rounded text-[10px] font-bold">
                          {str(pub.category, "General")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleSelectPub(pub)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary/10 hover:bg-brand-primary text-icon-on-light hover:text-white rounded-lg text-xs font-bold transition-all"
                        >
                          Map Citations <FaArrowRight size={10} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* 2. Interactive Citation Editor View */}
      {selectedPub && (
        <div className="space-y-6">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedPub(null)}
                className="p-2 text-stone-500 hover:bg-stone-50 rounded-xl transition-all"
              >
                <FaArrowLeft />
              </button>
              <div>
                <span data-editorial-accent-text className="text-[10px]  font-black uppercase tracking-widest block">Bibliographic Reference Index</span>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">{selectedPub.title}</h1>
              </div>
            </div>
            <button
              onClick={() => setSelectedPub(null)}
              className="px-4 py-2 border border-stone-200 text-stone-700 hover:bg-stone-50 font-bold text-xs rounded-xl transition"
            >
              Back to Publications
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Form Column */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white border border-stone-200/60 rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-sm font-black text-stone-800 uppercase tracking-wider border-b border-stone-150 pb-2 flex items-center gap-2">
                    <FaQuoteRight data-ui-icon  className=" text-xs" /> 
                    {editingCitation ? "Edit Inline Citation" : "Add Inline Citation"}
                  </h3>
                  <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                    Map claims inside chapters or pages to validation nodes or bibliography sources.
                  </p>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  
                  {/* Claim */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                      Claim Text / Assertion *
                    </label>
                    <textarea
                      value={formClaim}
                      onChange={e => setFormClaim(e.target.value)}
                      placeholder="e.g., 'Walnut wood drying requires a minimum of 18 months under controlled humidity...'"
                      rows={4}
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-250 rounded-xl focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                      Evidence Status *
                    </label>
                    <select
                      value={formStatus}
                      onChange={e => setFormStatus(e.target.value as any)}
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-250 rounded-xl focus:outline-none focus:border-brand-primary"
                    >
                      <option value="UNVERIFIED">🔴 UNVERIFIED (Needs checking)</option>
                      <option value="VERIFIED">🟢 VERIFIED (Sourced & approved)</option>
                      <option value="HYPOTHESIS">🟡 HYPOTHESIS (Awaiting data)</option>
                      <option value="PROHIBITED_UNTIL_SOURCED">❌ PROHIBITED UNTIL SOURCED (Requires proof)</option>
                    </select>
                  </div>

                  {/* Source */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                      Source Bibliography Reference {formStatus === "PROHIBITED_UNTIL_SOURCED" && "*"}
                    </label>
                    <textarea
                      value={formSource}
                      onChange={e => setFormSource(e.target.value)}
                      placeholder="Author, Year, Title, Book/Journal, Pages..."
                      rows={3}
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-250 rounded-xl focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  {/* Hook / Linker */}
                  <div className="border-t border-stone-100 pt-4 space-y-3">
                    <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                      <FaLink data-ui-icon  size={10} className="" /> Hook Inline Target
                    </span>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[9px] font-bold text-stone-500">Chapter</label>
                        <select
                          value={formChapterId}
                          onChange={e => { setFormChapterId(e.target.value); setFormPageId(""); }}
                          className="w-full text-[11px] p-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none"
                        >
                          <option value="">(Select Chapter)</option>
                          {chapters.map(c => (
                            <option key={c.id} value={c.id}>Ch {c.order}: {c.title}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[9px] font-bold text-stone-500">Page Number</label>
                        <select
                          value={formPageId}
                          onChange={e => setFormPageId(e.target.value)}
                          disabled={!formChapterId}
                          className="w-full text-[11px] p-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none disabled:opacity-50"
                        >
                          <option value="">(Select Page)</option>
                          {availablePages.map(p => (
                            <option key={p.id} value={p.id}>Page {p.pageNumber}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Form Error Indicator */}
                  {formError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-xs flex items-start gap-2">
                      <FaExclamationTriangle className="shrink-0 mt-0.5" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-brand-primary hover:bg-brand-dark text-white font-bold text-xs rounded-xl transition"
                    >
                      {editingCitation ? "Update Citation" : "Create Citation"}
                    </button>
                    {(editingCitation || formClaim || formSource) && (
                      <button
                        type="button"
                        onClick={clearForm}
                        className="px-4 py-2.5 border border-stone-250 text-stone-700 hover:bg-stone-50 font-bold text-xs rounded-xl transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                </form>
              </div>
            </div>

            {/* Citations List Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Reference Preview Panel */}
              <div className="bg-stone-50 border border-stone-200/60 rounded-2xl p-6 shadow-sm">
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block mb-2">
                  Official Bibliographic Reference Example
                </span>
                <div className="bg-white border border-stone-150 p-4 rounded-xl space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-stone-400 block uppercase text-[9px]">APA format example</span>
                    <p className="font-serif italic text-stone-750">{selectedPub.author || "KHCRF Research"}. ({selectedPub.published || "2026"}). {selectedPub.title}. Srinagar: KHCRF Heritage Press.</p>
                  </div>
                </div>
              </div>

              {/* Citations List */}
              <div className="bg-white border border-stone-200/60 rounded-2xl p-6 shadow-sm space-y-4">
                <div>
                  <h3 className="text-sm font-black text-stone-800 uppercase tracking-wider border-b border-stone-150 pb-2">
                    Active Citations ({citations.length})
                  </h3>
                </div>

                {citationsLoading ? (
                  <div className="flex justify-center py-12">
                    <FaSpinner data-ui-icon  className="animate-spin text-2xl " />
                  </div>
                ) : citations.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-stone-200 rounded-xl bg-stone-50/30 text-stone-400 text-xs">
                    No citations have been mapped to this publication yet. Use the form on the left to add one.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {citations.map((cit, idx) => {
                      let statusBadge = "bg-red-50 text-red-700 border-red-100";
                      if (cit.evidenceStatus === "VERIFIED") statusBadge = "bg-green-50 text-green-700 border-green-100";
                      if (cit.evidenceStatus === "HYPOTHESIS") statusBadge = "bg-amber-50 text-amber-700 border-amber-100";

                      return (
                        <div 
                          key={cit.id} 
                          className="border border-stone-200 rounded-xl p-4 hover:border-brand-primary/30 transition flex flex-col md:flex-row justify-between items-start gap-4"
                        >
                          <div className="space-y-2 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="bg-stone-100 text-stone-700 font-mono text-[9px] px-2 py-0.5 rounded-md font-bold">
                                #{idx + 1}
                              </span>
                              <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusBadge}`}>
                                {cit.evidenceStatus.replace(/_/g, " ")}
                              </span>
                              {cit.chapterId && (
                                <span data-ui-icon className="bg-brand-primary/10  font-bold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <FaBookmark size={8} /> Ch Linked
                                </span>
                              )}
                            </div>
                            
                            <div>
                              <span className="block text-[10px] text-stone-400 uppercase font-black tracking-wide">Claim / Assertion</span>
                              <p className="text-xs text-stone-850 font-serif leading-relaxed italic">"{cit.claim}"</p>
                            </div>

                            {cit.sourceData && (
                              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-150 text-[11px] text-stone-600">
                                <span className="font-bold text-[9px] block text-stone-400 uppercase mb-0.5">Bibliography Reference</span>
                                {cit.sourceData}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2 self-end md:self-start">
                            <button
                              onClick={() => handleEditClick(cit)}
                              className="p-2 border border-stone-200 hover:border-brand-primary text-stone-500 hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition"
                              title="Edit Citation"
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              onClick={() => handleDelete(cit.id!)}
                              className="p-2 border border-stone-200 hover:border-red-500 text-stone-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                              title="Delete Citation"
                            >
                              <FaTrashAlt size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
