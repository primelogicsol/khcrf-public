"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FaArrowLeft, FaSearch, FaPlus, FaFilter,
  FaCrown, FaFemale, FaStar, FaUserGraduate, FaBuilding,
  FaMapMarkerAlt, FaFileAlt, FaCheckCircle, FaTimesCircle, FaClock,
  FaEye, FaEdit, FaTimes, FaGlobe, FaCalendarAlt, FaPhoneAlt,
  FaEnvelope, FaIdCard, FaDownload, FaUpload, FaLayerGroup, FaHistory,
  FaUndo, FaArchive, FaCheck, FaBan, FaPaperPlane
} from "react-icons/fa";
import api from "@/lib/api";

function FaUsers(props: any) {
  return (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M144 160c-44.2 0-80-35.8-80-80S99.8 0 144 0s80 35.8 80 80-35.8 80-80 80zm352 0c-44.2 0-80-35.8-80-80s35.8-80 80-80 80 35.8 80-80 80zM320 256c-61.9 0-112-50.1-112-112S258.1 32 320 32s112 50.1 112 112-50.1 112-112 112zm272 64h-32c-35.3 0-64 28.7-64 64v96c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32v-96c0-35.3-28.7-64-64-64zM240 480h160c17.7 0 32-14.3 32-32V320c0-35.3-28.7-64-64-64H272c-35.3 0-64 28.7-64 64v128c0 17.7 14.3 32 32 32zM128 320c0-35.3-28.7-64-64-64H32c-35.3 0-64 28.7-64 64v96c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32v-96z"></path>
    </svg>
  );
}

const CLASSIFICATION_CHIPS = [
  { id: "ALL", label: "All Records", icon: FaUsers },
  { id: "PEOPLE", label: "People", icon: FaUsers },
  { id: "MASTER_ARTISAN", label: "Master", icon: FaStar, tooltip: "Master Artisan" },
  { id: "LIVING_LEGEND", label: "Legend", icon: FaCrown, tooltip: "Living Legend" },
  { id: "WOMEN_ARTISAN", label: "Women", icon: FaFemale, tooltip: "Women Artisan" },
  { id: "EMERGING_ARTISAN", label: "Emerging", icon: FaStar, tooltip: "Emerging Artisan" },
  { id: "WORKSHOP", label: "Community", icon: FaBuilding, tooltip: "Workshop Community" },
];

const OPERATIONAL_QUICK_FILTERS = [
  { id: "ALL", label: "All States", bg: "bg-slate-100 text-slate-700 border-slate-300" },
  { id: "SUBMITTED", label: "Submitted", bg: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "UNDER_REVIEW", label: "Under Review", bg: "bg-amber-50 text-amber-800 border-amber-200" },
  { id: "VERIFIED", label: "Verified", bg: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  { id: "PUBLISHED", label: "Published", bg: "bg-slate-900 text-white border-slate-900" },
  { id: "NEEDS_EVIDENCE", label: "Needs Evidence", bg: "bg-purple-50 text-purple-700 border-purple-200" },
  { id: "REJECTED", label: "Rejected", bg: "bg-orange-50 text-orange-800 border-orange-200" },
  { id: "ARCHIVED", label: "Archived", bg: "bg-red-50 text-red-700 border-red-200" },
];

const REJECT_REASONS = [
  "Does not meet eligibility criteria",
  "Insufficient evidence",
  "Duplicate submission",
  "Consent not established",
  "Unable to verify",
  "Outside archive scope",
  "Other"
];

const ARCHIVE_REASONS = [
  "Duplicate",
  "Superseded",
  "Withdrawn",
  "Administrative cleanup",
  "Other"
];

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  undoAction?: () => void;
}

export default function ArtisanRegistryPage() {
  const [activeClassification, setActiveClassification] = useState("ALL");
  const [activeQuickFilter, setActiveQuickFilter] = useState("ALL");
  const [artisans, setArtisans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  
  // Application Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Slide-out drawer state
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  // Workflow Decision Modal States
  // 1. Verify Modal
  const [verifyingRecord, setVerifyingRecord] = useState<any | null>(null);
  const [verifyClassification, setVerifyClassification] = useState("MASTER_ARTISAN");
  const [verifyRecognitions, setVerifyRecognitions] = useState<string[]>([]);
  const [verificationNote, setVerificationNote] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // 2. Publish Modal
  const [publishingRecord, setPublishingRecord] = useState<any | null>(null);
  const [publicTitle, setPublicTitle] = useState("");
  const [profileSlug, setProfileSlug] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  // 3. Request Evidence Modal
  const [evidenceRecord, setEvidenceRecord] = useState<any | null>(null);
  const [sendRequestTo, setSendRequestTo] = useState("Artisan");
  const [requestedItems, setRequestedItems] = useState<string[]>(["Government artisan identification"]);
  const [evidenceMessage, setEvidenceMessage] = useState("");
  const [responseDeadline, setResponseDeadline] = useState("2026-08-15");
  const [isSendingEvidence, setIsSendingEvidence] = useState(false);

  // 4. Reject Modal
  const [rejectingRecord, setRejectingRecord] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState(REJECT_REASONS[0]);
  const [rejectionNote, setRejectionNote] = useState("");
  const [notifyNominator, setNotifyNominator] = useState(true);
  const [isRejecting, setIsRejecting] = useState(false);

  // 5. Archive Modal
  const [archivingRecord, setArchivingRecord] = useState<any | null>(null);
  const [archiveReason, setArchiveReason] = useState(ARCHIVE_REASONS[0]);
  const [archiveNote, setArchiveNote] = useState("");
  const [isArchiving, setIsArchiving] = useState(false);

  // Edit Drawer Modal State
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    craft: "",
    district: "",
    yearsOfPractice: 15,
    workflowStatus: "VERIFIED",
    bio: ""
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Add Record Admin Multi-step Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addEntityType, setAddEntityType] = useState<'PERSON' | 'WORKSHOP_COMMUNITY' | null>(null);
  const [addFormStep, setAddFormStep] = useState(1);
  const [addFormData, setAddFormData] = useState({
    name: "",
    craft: "Pashmina Weaving",
    district: "Srinagar",
    village: "",
    yearsOfPractice: 15,
    primaryClassification: "MASTER_ARTISAN",
    bio: "",
    workflowStatus: "VERIFIED",
    publicationStatus: "UNPUBLISHED"
  });
  const [isCreatingRecord, setIsCreatingRecord] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success', undoAction?: () => void) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message, undoAction }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 6000);
  };

  const fetchRegistry = () => {
    setLoading(true);
    api.get("/admin/master-artisans/registry")
      .then((res) => {
        let items: any[] = [];
        const payload = res.data;
        if (payload?.data?.data && Array.isArray(payload.data.data)) {
          items = payload.data.data;
        } else if (payload?.data && Array.isArray(payload.data)) {
          items = payload.data;
        } else if (Array.isArray(payload)) {
          items = payload;
        }
        setArtisans(items);
        setError("");
      })
      .catch((err: any) => {
        setError(err?.response?.data?.message || err.message || "Failed to load registry records.");
        setArtisans([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRegistry();
  }, []);

  const metrics = {
    total: artisans.length,
    submitted: artisans.filter(a => a.workflowStatus === 'SUBMITTED' && !a.isArchived).length,
    underReview: artisans.filter(a => a.workflowStatus === 'UNDER_REVIEW' && !a.isArchived).length,
    verified: artisans.filter(a => a.workflowStatus === 'VERIFIED' && !a.isArchived).length,
    published: artisans.filter(a => a.workflowStatus === 'PUBLISHED' && !a.isArchived).length,
    rejected: artisans.filter(a => a.workflowStatus === 'REJECTED' && !a.isArchived).length,
    archived: artisans.filter(a => a.workflowStatus === 'ARCHIVED' || a.isArchived).length,
  };

  const filtered = artisans.filter(a => {
    const matchesSearch = !search || 
      a.name?.toLowerCase().includes(search.toLowerCase()) || 
      a.craft?.toLowerCase().includes(search.toLowerCase()) ||
      (a.location && a.location.toLowerCase().includes(search.toLowerCase())) ||
      (a.district && a.district.toLowerCase().includes(search.toLowerCase())) ||
      (a.hcrfId && a.hcrfId.toLowerCase().includes(search.toLowerCase())) ||
      (a.submissionNumber && a.submissionNumber.toLowerCase().includes(search.toLowerCase())) ||
      (a.govtArtisanId && a.govtArtisanId.toLowerCase().includes(search.toLowerCase())) ||
      (a.bio && a.bio.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeQuickFilter !== "ALL") {
      if (activeQuickFilter === "NEEDS_EVIDENCE") {
        if (a.workflowStatus !== 'INFORMATION_REQUESTED' && a.evidenceStatus === 'PENDING') return false;
      } else if (activeQuickFilter === "ARCHIVED") {
        if (a.workflowStatus !== 'ARCHIVED' && !a.isArchived) return false;
      } else {
        if (a.isArchived) return false;
        if (a.workflowStatus !== activeQuickFilter) return false;
      }
    } else {
      if (a.workflowStatus === 'ARCHIVED' || a.isArchived) return false;
    }

    if (activeClassification === "ALL") return true;
    if (activeClassification === "PEOPLE") return a.entityType !== 'WORKSHOP_COMMUNITY';
    if (activeClassification === "WORKSHOP") return a.entityType === 'WORKSHOP_COMMUNITY' || a.primaryClassification === 'WORKSHOP_COMMUNITY';
    if (activeClassification === "LIVING_LEGEND") return a.recognitions?.includes("LIVING_LEGEND");
    if (activeClassification === "WOMEN_ARTISAN") return a.publicCollections?.includes("WOMEN_ARTISANS");

    return a.primaryClassification === activeClassification;
  });

  // Action Menu Handlers
  const handleOpenVerifyModal = (artisan: any) => {
    setVerifyingRecord(artisan);
    setVerifyClassification(artisan.primaryClassification || "MASTER_ARTISAN");
    setVerifyRecognitions(artisan.recognitions || []);
    setVerificationNote("Craft practice and lineage verified against regional archive standards.");
  };

  const handleConfirmVerify = async () => {
    if (!verifyingRecord) return;
    setIsVerifying(true);
    const target = verifyingRecord;
    try {
      await api.patch(`/admin/master-artisans/registry/${target.id}/verify`, {
        primaryClassification: verifyClassification,
        recognitions: verifyRecognitions,
        verificationNote
      });

      setArtisans(prev => prev.map(item => {
        if (item.id === target.id) {
          return {
            ...item,
            workflowStatus: 'VERIFIED',
            primaryClassification: verifyClassification,
            recognitions: verifyRecognitions
          };
        }
        return item;
      }));

      if (selectedRecord?.id === target.id) {
        setSelectedRecord((prev: any) => ({
          ...prev,
          workflowStatus: 'VERIFIED',
          primaryClassification: verifyClassification,
          recognitions: verifyRecognitions
        }));
      }

      setVerifyingRecord(null);
      showToast("Record approved and verified successfully.", "success");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Verification failed.", "error");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOpenPublishModal = (artisan: any) => {
    setPublishingRecord(artisan);
    setPublicTitle(artisan.name);
    setProfileSlug(`master-artisan-${artisan.name.toLowerCase().replace(/\s+/g, '-')}`);
  };

  const handleConfirmPublish = async () => {
    if (!publishingRecord) return;
    setIsPublishing(true);
    const target = publishingRecord;
    try {
      await api.patch(`/admin/master-artisans/registry/${target.id}/publish`, {
        publicTitle,
        profileSlug
      });

      setArtisans(prev => prev.map(item => {
        if (item.id === target.id) {
          return {
            ...item,
            workflowStatus: 'PUBLISHED',
            publicationStatus: 'PUBLISHED',
            isPublic: true
          };
        }
        return item;
      }));

      if (selectedRecord?.id === target.id) {
        setSelectedRecord((prev: any) => ({
          ...prev,
          workflowStatus: 'PUBLISHED',
          publicationStatus: 'PUBLISHED',
          isPublic: true
        }));
      }

      setPublishingRecord(null);
      showToast("Public profile published successfully.", "success");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Publication failed.", "error");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleOpenEvidenceModal = (artisan: any) => {
    setEvidenceRecord(artisan);
    setEvidenceMessage(`Please provide additional evidence for ${artisan.name} including government artisan ID card and workshop media.`);
  };

  const handleConfirmEvidenceRequest = async () => {
    if (!evidenceRecord) return;
    setIsSendingEvidence(true);
    const target = evidenceRecord;
    try {
      await api.post(`/admin/master-artisans/registry/${target.id}/evidence-requests`, {
        sendRequestTo,
        requestedItems,
        message: evidenceMessage,
        responseDeadline
      });

      setArtisans(prev => prev.map(item => {
        if (item.id === target.id) {
          return {
            ...item,
            workflowStatus: 'UNDER_REVIEW',
            evidenceStatus: 'PENDING'
          };
        }
        return item;
      }));

      if (selectedRecord?.id === target.id) {
        setSelectedRecord((prev: any) => ({
          ...prev,
          workflowStatus: 'UNDER_REVIEW',
          evidenceStatus: 'PENDING'
        }));
      }

      setEvidenceRecord(null);
      showToast("Evidence request sent successfully.", "success");
    } catch (err: any) {
      showToast("Failed to send evidence request.", "error");
    } finally {
      setIsSendingEvidence(false);
    }
  };

  const handleOpenRejectModal = (artisan: any) => {
    setRejectingRecord(artisan);
    setRejectionReason(REJECT_REASONS[0]);
    setRejectionNote("");
  };

  const handleConfirmReject = async () => {
    if (!rejectingRecord) return;
    setIsRejecting(true);
    const target = rejectingRecord;
    try {
      await api.patch(`/admin/master-artisans/registry/${target.id}/reject`, {
        rejectionReason,
        rejectionNote,
        notifyNominator
      });

      setArtisans(prev => prev.map(item => {
        if (item.id === target.id) {
          return {
            ...item,
            workflowStatus: 'REJECTED',
            rejectionReason,
            rejectionNote
          };
        }
        return item;
      }));

      if (selectedRecord?.id === target.id) {
        setSelectedRecord((prev: any) => ({
          ...prev,
          workflowStatus: 'REJECTED',
          rejectionReason,
          rejectionNote
        }));
      }

      setRejectingRecord(null);
      showToast("Nomination rejected successfully.", "info");
    } catch (err: any) {
      showToast("Failed to reject nomination.", "error");
    } finally {
      setIsRejecting(false);
    }
  };

  const handleOpenArchiveModal = (artisan: any) => {
    setArchivingRecord(artisan);
    setArchiveReason(ARCHIVE_REASONS[0]);
    setArchiveNote("");
  };

  const handleConfirmArchive = async () => {
    if (!archivingRecord) return;
    setIsArchiving(true);
    const target = archivingRecord;
    try {
      await api.post(`/admin/master-artisans/registry/${target.id}/archive`, {
        archiveReason,
        archiveNote
      });

      setArtisans(prev => prev.map(item => {
        if (item.id === target.id) {
          return {
            ...item,
            workflowStatus: 'ARCHIVED',
            isArchived: true,
            archivedAt: new Date().toISOString(),
            archiveReason,
            archiveNote
          };
        }
        return item;
      }));

      if (selectedRecord?.id === target.id) {
        setSelectedRecord(null);
      }

      setArchivingRecord(null);
      showToast(`Record ${target.name} archived successfully.`, "info", () => handleRestoreRecord(target));
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to archive record.", "error");
    } finally {
      setIsArchiving(false);
    }
  };

  const handleRestoreRecord = async (artisan: any) => {
    try {
      await api.post(`/admin/master-artisans/registry/${artisan.id}/restore`, {});
      
      setArtisans(prev => prev.map(item => {
        if (item.id === artisan.id) {
          return {
            ...item,
            workflowStatus: 'VERIFIED',
            isArchived: false,
          };
        }
        return item;
      }));

      showToast(`Record ${artisan.name} restored successfully.`, "success");
    } catch (err: any) {
      showToast("Failed to restore record.", "error");
    }
  };

  const handleAdminCreateRecord = async () => {
    setIsCreatingRecord(true);
    try {
      const res = await api.post("/admin/master-artisans/registry", {
        entityType: addEntityType,
        ...addFormData
      });

      const newRecord = res.data.data;
      setArtisans(prev => [newRecord, ...prev]);
      setSelectedRecord(newRecord);
      setIsAddModalOpen(false);
      setAddEntityType(null);
      setAddFormStep(1);
      showToast(`Record ${newRecord.name} created directly in registry.`, "success");
    } catch (err: any) {
      showToast("Failed to create registry record.", "error");
    } finally {
      setIsCreatingRecord(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800 border border-blue-200">Submitted</span>;
      case 'UNDER_REVIEW':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900 border border-amber-200">Under Review</span>;
      case 'VERIFIED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">Verified</span>;
      case 'PUBLISHED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-900 text-white border border-slate-900">Published</span>;
      case 'REJECTED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-orange-100 text-orange-900 border border-orange-200">Rejected</span>;
      case 'ARCHIVED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-red-100 text-red-800 border border-red-200">Archived</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700 border border-slate-200">{status || 'VERIFIED'}</span>;
    }
  };

  const getCompactPills = (artisan: any) => {
    const isWorkshop = artisan.entityType === 'WORKSHOP_COMMUNITY' || artisan.primaryClassification === 'WORKSHOP_COMMUNITY';
    const isLegend = artisan.recognitions?.includes('LIVING_LEGEND');
    const isWomen = artisan.publicCollections?.includes('WOMEN_ARTISANS');
    const isMaster = artisan.primaryClassification === 'MASTER_ARTISAN' || (!isWorkshop && !isLegend);

    return (
      <div className="flex flex-wrap gap-1">
        {isWorkshop && (
          <span title="Workshop Community" className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-purple-50 text-purple-800 border border-purple-200">
            Community
          </span>
        )}
        {isMaster && (
          <span title="Master Artisan" className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200">
            Master
          </span>
        )}
        {isLegend && (
          <span title="Living Legend" className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
            Legend
          </span>
        )}
        {isWomen && (
          <span title="Women Artisan" className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-pink-50 text-pink-800 border border-pink-200">
            Women
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="w-full -mt-2 -mb-4 -mx-2 px-2 py-2 font-sans space-y-4 relative">
      {/* Application Toasts */}
      <div className="fixed bottom-5 right-5 z-50 space-y-2 max-w-sm">
        {toasts.map(toast => (
          <div key={toast.id} className={`p-4 rounded-xl shadow-2xl border text-xs font-bold flex items-center justify-between gap-3 animate-fadeIn ${
            toast.type === 'error' ? 'bg-red-900 text-white border-red-700' :
            toast.type === 'info' ? 'bg-slate-900 text-white border-slate-700' :
            'bg-emerald-900 text-white border-emerald-700'
          }`}>
            <span>{toast.message}</span>
            {toast.undoAction && (
              <button 
                onClick={() => { toast.undoAction!(); setToasts(prev => prev.filter(t => t.id !== toast.id)); }} 
                className="px-2 py-1 bg-white/20 hover:bg-white/30 text-white rounded text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0"
              >
                <FaUndo size={9} /> Undo
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/master-artisans" className="p-2 rounded-lg hover:bg-stone-100 text-stone-500 transition-colors">
            <FaArrowLeft size={14} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Kashmir Heritage Craft Archive</span>
              <span className="text-stone-300">•</span>
              <span data-editorial-accent-text className="text-xs font-black  uppercase tracking-wider">Records Management</span>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none mt-1">
              Administrative Registry Dashboard
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Verified Profiles • Entity Classification • Archival Evidence Review • Direct Publication
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => showToast("Exporting filtered registry records to CSV...", "info")} 
            className="flex items-center gap-1.5 bg-white border border-stone-300 text-stone-700 px-3 py-1.5 text-xs font-bold rounded-lg hover:bg-stone-50 transition-all shadow-xs"
          >
            <FaDownload size={11} /> Export CSV
          </button>
          <button 
            onClick={() => { setIsAddModalOpen(true); setAddEntityType(null); setAddFormStep(1); }} 
            className="flex items-center gap-1.5 bg-slate-900 text-white px-4 py-1.5 text-xs font-bold rounded-lg hover:bg-slate-800 transition-all shadow-sm"
          >
            <FaPlus size={11} /> Add Record
          </button>
        </div>
      </div>

      {/* 4. Clickable KPI Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        <div onClick={() => setActiveQuickFilter("ALL")} className={`p-3 rounded-xl border cursor-pointer transition-all ${activeQuickFilter === 'ALL' ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20' : 'bg-white text-slate-800 border-stone-200'}`}>
          <div className={`text-[10px] font-black uppercase tracking-wider ${activeQuickFilter === 'ALL' ? 'text-slate-300' : 'text-stone-400'}`}>Total Active</div>
          <div className="text-xl font-black mt-0.5">{metrics.total}</div>
        </div>
        <div onClick={() => setActiveQuickFilter("SUBMITTED")} className={`p-3 rounded-xl border cursor-pointer transition-all ${activeQuickFilter === 'SUBMITTED' ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-800 border-stone-200'}`}>
          <div className={`text-[10px] font-black uppercase tracking-wider ${activeQuickFilter === 'SUBMITTED' ? 'text-blue-100' : 'text-blue-600'}`}>Submitted</div>
          <div className="text-xl font-black mt-0.5">{metrics.submitted}</div>
        </div>
        <div onClick={() => setActiveQuickFilter("UNDER_REVIEW")} className={`p-3 rounded-xl border cursor-pointer transition-all ${activeQuickFilter === 'UNDER_REVIEW' ? 'bg-amber-600 text-white border-amber-600 shadow-md' : 'bg-white text-slate-800 border-stone-200'}`}>
          <div className={`text-[10px] font-black uppercase tracking-wider ${activeQuickFilter === 'UNDER_REVIEW' ? 'text-amber-100' : 'text-amber-600'}`}>Under Review</div>
          <div className="text-xl font-black mt-0.5">{metrics.underReview}</div>
        </div>
        <div onClick={() => setActiveQuickFilter("VERIFIED")} className={`p-3 rounded-xl border cursor-pointer transition-all ${activeQuickFilter === 'VERIFIED' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-slate-800 border-stone-200'}`}>
          <div className={`text-[10px] font-black uppercase tracking-wider ${activeQuickFilter === 'VERIFIED' ? 'text-emerald-100' : 'text-emerald-600'}`}>Verified</div>
          <div className="text-xl font-black mt-0.5">{metrics.verified}</div>
        </div>
        <div onClick={() => setActiveQuickFilter("PUBLISHED")} className={`p-3 rounded-xl border cursor-pointer transition-all ${activeQuickFilter === 'PUBLISHED' ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-800 border-stone-200'}`}>
          <div className={`text-[10px] font-black uppercase tracking-wider ${activeQuickFilter === 'PUBLISHED' ? 'text-slate-300' : 'text-slate-800'}`}>Published</div>
          <div className="text-xl font-black mt-0.5">{metrics.published}</div>
        </div>
        <div onClick={() => setActiveQuickFilter("REJECTED")} className={`p-3 rounded-xl border cursor-pointer transition-all ${activeQuickFilter === 'REJECTED' ? 'bg-orange-600 text-white border-orange-600 shadow-md' : 'bg-white text-slate-800 border-stone-200'}`}>
          <div className={`text-[10px] font-black uppercase tracking-wider ${activeQuickFilter === 'REJECTED' ? 'text-orange-100' : 'text-orange-600'}`}>Rejected</div>
          <div className="text-xl font-black mt-0.5">{metrics.rejected}</div>
        </div>
        <div onClick={() => setActiveQuickFilter("ARCHIVED")} className={`p-3 rounded-xl border cursor-pointer transition-all ${activeQuickFilter === 'ARCHIVED' ? 'bg-red-600 text-white border-red-600 shadow-md' : 'bg-white text-slate-800 border-stone-200'}`}>
          <div className={`text-[10px] font-black uppercase tracking-wider ${activeQuickFilter === 'ARCHIVED' ? 'text-red-100' : 'text-red-600'}`}>Archived</div>
          <div className="text-xl font-black mt-0.5">{metrics.archived}</div>
        </div>
      </div>

      {/* 2 & 7. Classification Chips & Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs" />
            <input 
              type="text" 
              placeholder="Search Name, KHCRF ID, Submission ID, Govt ID, Craft, Village..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 text-xs font-medium border border-stone-300 rounded-lg bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs">
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto py-0.5">
            <span className="text-[10px] font-black uppercase text-stone-400 mr-1 flex items-center gap-1">
              <FaFilter size={9} /> Entity:
            </span>
            {CLASSIFICATION_CHIPS.map(chip => {
              const active = activeClassification === chip.id;
              return (
                <button
                  key={chip.id}
                  onClick={() => setActiveClassification(chip.id)}
                  title={chip.tooltip || chip.label}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
                    active 
                      ? 'bg-slate-900 text-white shadow-xs' 
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
                  }`}
                >
                  <chip.icon size={11} className={active ? 'text-brand-primary' : 'text-stone-500'} />
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between border-t border-stone-100 pt-2 gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-black uppercase text-stone-400 mr-1">Status Filter:</span>
            {OPERATIONAL_QUICK_FILTERS.map(qf => (
              <button
                key={qf.id}
                onClick={() => setActiveQuickFilter(qf.id)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-all ${
                  activeQuickFilter === qf.id
                    ? `${qf.bg} ring-2 ring-slate-900/10 font-black`
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {qf.label}
              </button>
            ))}
          </div>

          <div className="text-[11px] font-bold text-stone-500 ml-auto">
            Showing <span className="font-black text-slate-900">{filtered.length}</span> of {artisans.length} records
          </div>
        </div>
      </div>

      {/* High-Density Data Table & Slide-Out Layout */}
      <div className="flex gap-4 items-start relative">
        <div className={`bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs transition-all ${selectedRecord ? 'w-full lg:w-3/5' : 'w-full'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[950px]">
              <thead>
                <tr className="bg-stone-100/90 border-b border-stone-200 text-[10px] font-black uppercase text-stone-600 tracking-wider sticky top-0 bg-stone-100 z-10">
                  <th className="p-2.5 pl-3 border-r border-stone-200 bg-stone-100">KHCRF / Ref ID</th>
                  <th className="p-2.5 border-r border-stone-200 bg-stone-100">Artisan / Craft Entity</th>
                  <th className="p-2.5">Classifications</th>
                  <th className="p-2.5">Location</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5 text-right pr-3">Required Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {filtered.map(artisan => {
                  const isSelected = selectedRecord?.id === artisan.id;
                  const isWorkshop = artisan.entityType === 'WORKSHOP_COMMUNITY' || artisan.primaryClassification === 'WORKSHOP_COMMUNITY';
                  const isArchived = artisan.workflowStatus === 'ARCHIVED' || artisan.isArchived;

                  return (
                    <tr 
                      key={artisan.id} 
                      onClick={() => setSelectedRecord(artisan)}
                      className={`cursor-pointer transition-colors hover:bg-slate-50 ${isSelected ? 'bg-slate-100/80 font-medium' : ''} ${isArchived ? 'bg-red-50/40 opacity-75' : ''}`}
                    >
                      <td className="p-2 pl-3 border-r border-stone-200 whitespace-nowrap font-mono font-bold text-slate-900 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${isArchived ? 'bg-red-500' : 'bg-editorial-accent'}`}></span>
                          <span>{artisan.hcrfId || artisan.submissionNumber || `REG-${artisan.id.slice(0, 6)}`}</span>
                        </div>
                      </td>

                      <td className="p-2 border-r border-stone-200 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-stone-100 border border-stone-300 shrink-0 flex items-center justify-center text-slate-700 font-black text-xs">
                            {isWorkshop ? <FaBuilding size={14} className="text-purple-700" /> : artisan.name ? artisan.name.charAt(0).toUpperCase() : <FaUsers size={14} />}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 text-xs truncate max-w-[200px]">
                              {artisan.name}
                            </div>
                            <div className="text-[11px] font-semibold text-stone-600 truncate max-w-[200px]">
                              {artisan.craft} • {artisan.yearsOfPractice || 15} yrs exp
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-2 whitespace-nowrap">
                        {getCompactPills(artisan)}
                      </td>

                      <td className="p-2 whitespace-nowrap text-stone-700 font-medium text-[11px]">
                        <div className="flex items-center gap-1">
                          <FaMapMarkerAlt size={10} className="text-stone-400 shrink-0" />
                          <span className="truncate max-w-[120px]">{artisan.district || artisan.location || 'Srinagar'}</span>
                        </div>
                      </td>

                      <td className="p-2 whitespace-nowrap">
                        {getStatusBadge(artisan.workflowStatus || 'VERIFIED')}
                      </td>

                      <td className="p-2 text-right pr-3 whitespace-nowrap font-bold">
                        <div className="flex items-center justify-end gap-1 text-[11px]">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedRecord(artisan); }}
                            className="px-2 py-1 bg-stone-100 text-stone-800 hover:bg-slate-900 hover:text-white rounded transition-all flex items-center gap-1"
                            title="View Detail Drawer"
                          >
                            <FaEye size={10} /> View
                          </button>

                          {isArchived ? (
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleRestoreRecord(artisan); }}
                              className="px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-600 hover:text-white rounded transition-all flex items-center gap-1"
                              title="Restore Record"
                            >
                              <FaUndo size={10} /> Restore
                            </button>
                          ) : (
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleOpenArchiveModal(artisan); }}
                              className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 hover:bg-red-600 hover:text-white rounded transition-all flex items-center gap-1"
                              title="Archive Record"
                            >
                              <FaArchive size={10} /> Archive
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && !loading && (
            <div className="py-16 text-center text-sm text-stone-500">
              No registry records matching search query or filters.
            </div>
          )}
        </div>

        {/* 15. Right-Side Detail Drawer Panel with Real Decision Controls */}
        {selectedRecord && (
          <div className="w-full lg:w-2/5 bg-white border border-stone-300 rounded-xl shadow-xl p-5 sticky top-2 space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto z-20">
            <div className="flex items-start justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-brand-primary tracking-wider font-mono">
                  {selectedRecord.hcrfId || selectedRecord.submissionNumber || `REG-${selectedRecord.id.slice(0,6)}`}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">{selectedRecord.name}</h3>
                <p className="text-xs font-semibold text-stone-600">{selectedRecord.craft} Practitioner</p>
              </div>
              <button 
                onClick={() => setSelectedRecord(null)}
                className="text-stone-400 hover:text-slate-900 p-1 rounded-lg hover:bg-stone-100 transition-all font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center justify-between bg-stone-50 p-2.5 rounded-lg border border-stone-200 text-xs">
              <span className="font-bold text-stone-600">Current Workflow Status:</span>
              {getStatusBadge(selectedRecord.workflowStatus || 'VERIFIED')}
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-black text-slate-900 uppercase text-[10px] tracking-wider border-b pb-1">
                Profile & Classifications
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-stone-400 font-bold block">Years of Practice</span>
                  <span className="font-bold text-slate-800">{selectedRecord.yearsOfPractice || 15} Years</span>
                </div>
                <div>
                  <span className="text-stone-400 font-bold block">Location</span>
                  <span className="font-bold text-slate-800">{selectedRecord.district || selectedRecord.location || 'Srinagar'}</span>
                </div>
                <div>
                  <span className="text-stone-400 font-bold block">Entity Type</span>
                  <span className="font-bold text-slate-800">{selectedRecord.entityType || 'Person'}</span>
                </div>
                <div>
                  <span className="text-stone-400 font-bold block">Primary Class.</span>
                  <span className="font-bold text-slate-800">{selectedRecord.primaryClassification || 'Master Artisan'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-black text-slate-900 uppercase text-[10px] tracking-wider border-b pb-1">
                Contact & Verification
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center gap-2 text-slate-800">
                  <FaPhoneAlt size={10} className="text-stone-400" />
                  <span className="font-bold">{selectedRecord.phone || '+91 99060 00000'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800">
                  <FaEnvelope size={10} className="text-stone-400" />
                  <span className="font-bold">{selectedRecord.email || 'artisan.contact@khcrf.org'}</span>
                </div>
              </div>
            </div>

            {selectedRecord.bio && (
              <div className="space-y-1 text-xs">
                <div className="font-black text-slate-900 uppercase text-[10px] tracking-wider border-b pb-1">
                  Archival Biography
                </div>
                <p className="text-[11px] text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-200 italic leading-relaxed">
                  &quot;{selectedRecord.bio}&quot;
                </p>
              </div>
            )}

            {/* REAL WORKFLOW DECISION CONTROLS IN DRAWER */}
            <div className="pt-3 border-t border-stone-200 space-y-2">
              <div className="font-black text-slate-900 uppercase text-[10px] tracking-wider mb-2">
                Administrative Decision Controls
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                {/* 1. Approve & Verify */}
                <button 
                  onClick={() => handleOpenVerifyModal(selectedRecord)}
                  className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-center transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <FaCheck size={11} /> Approve & Verify
                </button>

                {/* 2. Publish to Public (Disabled if unverified) */}
                <button 
                  onClick={() => handleOpenPublishModal(selectedRecord)}
                  disabled={selectedRecord.workflowStatus !== 'VERIFIED' && selectedRecord.workflowStatus !== 'PUBLISHED'}
                  className={`py-2 px-3 text-white rounded-lg text-center transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                    selectedRecord.workflowStatus === 'VERIFIED' || selectedRecord.workflowStatus === 'PUBLISHED'
                      ? 'bg-slate-900 hover:bg-slate-800 cursor-pointer'
                      : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  }`}
                  title={selectedRecord.workflowStatus !== 'VERIFIED' ? "Record must be verified before publication" : "Publish Public Profile"}
                >
                  🚀 Publish Profile
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                {/* 3. Request Evidence */}
                <button 
                  onClick={() => handleOpenEvidenceModal(selectedRecord)}
                  className="py-2 px-3 bg-purple-50 border border-purple-300 text-purple-800 hover:bg-purple-600 hover:text-white rounded-lg text-center transition-all flex items-center justify-center gap-1.5"
                >
                  <FaPaperPlane size={11} /> Request Evidence
                </button>

                {/* 4. Reject Nomination */}
                <button 
                  onClick={() => handleOpenRejectModal(selectedRecord)}
                  className="py-2 px-3 bg-orange-50 border border-orange-300 text-orange-900 hover:bg-orange-600 hover:text-white rounded-lg text-center transition-all flex items-center justify-center gap-1.5"
                >
                  <FaBan size={11} /> Reject Nomination
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-1">
                {/* 5. Archive Record */}
                {selectedRecord.workflowStatus === 'ARCHIVED' || selectedRecord.isArchived ? (
                  <button 
                    onClick={() => handleRestoreRecord(selectedRecord)}
                    className="col-span-2 py-2 px-3 bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-600 hover:text-white rounded-lg text-center transition-all flex items-center justify-center gap-1.5"
                  >
                    <FaUndo size={11} /> Restore Record to Verified
                  </button>
                ) : (
                  <button 
                    onClick={() => handleOpenArchiveModal(selectedRecord)}
                    className="col-span-2 py-2 px-3 bg-red-50 border border-red-200 text-red-700 hover:bg-red-600 hover:text-white rounded-lg text-center transition-all flex items-center justify-center gap-1.5"
                  >
                    <FaArchive size={11} /> Archive Record
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 1. APPROVE & VERIFY MODAL */}
      {verifyingRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FaCheckCircle className="text-emerald-600" /> Approve and Verify Record
              </h3>
              <button onClick={() => setVerifyingRecord(null)} className="text-stone-400 font-bold">✕</button>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
              <p className="font-bold text-emerald-900">Verifying:</p>
              <p className="font-black text-slate-900">{verifyingRecord.name}</p>
              <p className="font-mono text-stone-600">{verifyingRecord.hcrfId || verifyingRecord.submissionNumber}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Classification *</label>
                <select 
                  value={verifyClassification} 
                  onChange={e => setVerifyClassification(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-lg font-bold"
                >
                  <option value="MASTER_ARTISAN">Master Artisan</option>
                  <option value="ESTABLISHED_ARTISAN">Established Artisan</option>
                  <option value="EMERGING_ARTISAN">Emerging Artisan</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Verification Note *</label>
                <textarea 
                  value={verificationNote} 
                  onChange={e => setVerificationNote(e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <button onClick={() => setVerifyingRecord(null)} className="px-4 py-2 border rounded-lg text-xs font-bold">Cancel</button>
              <button onClick={handleConfirmVerify} disabled={isVerifying} className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700">
                {isVerifying ? 'Verifying...' : 'Approve & Verify'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. PUBLISH PROFILE MODAL */}
      {publishingRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                🚀 Publish Public Profile
              </h3>
              <button onClick={() => setPublishingRecord(null)} className="text-stone-400 font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Public Display Title *</label>
                <input type="text" value={publicTitle} onChange={e => setPublicTitle(e.target.value)} className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Profile Slug *</label>
                <input type="text" value={profileSlug} onChange={e => setProfileSlug(e.target.value)} className="w-full p-2 border rounded-lg font-mono" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <button onClick={() => setPublishingRecord(null)} className="px-4 py-2 border rounded-lg text-xs font-bold">Cancel</button>
              <button onClick={handleConfirmPublish} disabled={isPublishing} className="px-5 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800">
                {isPublishing ? 'Publishing...' : 'Publish Profile'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. REQUEST EVIDENCE MODAL */}
      {evidenceRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-black text-purple-900 flex items-center gap-2">
                <FaPaperPlane /> Request Additional Evidence
              </h3>
              <button onClick={() => setEvidenceRecord(null)} className="text-stone-400 font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Send Request To</label>
                <select value={sendRequestTo} onChange={e => setSendRequestTo(e.target.value)} className="w-full p-2 border rounded-lg font-bold">
                  <option value="Artisan">Artisan</option>
                  <option value="Nominator">Nominator</option>
                  <option value="Both">Both</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Message *</label>
                <textarea value={evidenceMessage} onChange={e => setEvidenceMessage(e.target.value)} rows={3} className="w-full p-2 border rounded-lg" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <button onClick={() => setEvidenceRecord(null)} className="px-4 py-2 border rounded-lg text-xs font-bold">Cancel</button>
              <button onClick={handleConfirmEvidenceRequest} disabled={isSendingEvidence} className="px-5 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700">
                {isSendingEvidence ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. REJECT NOMINATION MODAL */}
      {rejectingRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-black text-orange-600 flex items-center gap-2">
                <FaBan /> Reject Nomination
              </h3>
              <button onClick={() => setRejectingRecord(null)} className="text-stone-400 font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Rejection Reason *</label>
                <select value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} className="w-full p-2 border rounded-lg font-bold">
                  {REJECT_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Internal Note *</label>
                <textarea value={rejectionNote} onChange={e => setRejectionNote(e.target.value)} rows={3} className="w-full p-2 border rounded-lg" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <button onClick={() => setRejectingRecord(null)} className="px-4 py-2 border rounded-lg text-xs font-bold">Cancel</button>
              <button onClick={handleConfirmReject} disabled={isRejecting} className="px-5 py-2 bg-orange-600 text-white rounded-lg text-xs font-bold hover:bg-orange-700">
                {isRejecting ? 'Rejecting...' : 'Reject Nomination'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. ARCHIVE CONFIRMATION MODAL */}
      {archivingRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-black text-red-600 flex items-center gap-2">
                <FaArchive /> Archive Record?
              </h3>
              <button onClick={() => setArchivingRecord(null)} className="text-stone-400 font-bold">✕</button>
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs space-y-1 text-red-900">
              <p className="font-bold">You are about to archive:</p>
              <p className="font-black text-slate-900">{archivingRecord.name}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for archive *</label>
                <select value={archiveReason} onChange={e => setArchiveReason(e.target.value)} className="w-full p-2 border rounded-lg font-bold">
                  {ARCHIVE_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Internal note</label>
                <textarea value={archiveNote} onChange={e => setArchiveNote(e.target.value)} rows={3} className="w-full p-2 border rounded-lg" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <button onClick={() => setArchivingRecord(null)} className="px-4 py-2 border rounded-lg text-xs font-bold">Cancel</button>
              <button onClick={handleConfirmArchive} disabled={isArchiving} className="px-5 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700">
                {isArchiving ? 'Archiving...' : 'Archive Record'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD RECORD MULTI-STEP ADMIN INTAKE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl border border-stone-200 space-y-5">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <span data-editorial-accent-text className="text-[10px] font-mono font-bold  uppercase tracking-wider">Internal Admin Intake</span>
                <h3 className="text-xl font-black text-slate-900">Add Registry Record</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-stone-400 font-bold">✕</button>
            </div>

            {!addEntityType ? (
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-700">Select entity type to begin internal admin creation:</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { setAddEntityType('PERSON'); setAddFormStep(1); }}
                    className="p-4 rounded-2xl border-2 border-stone-200 hover:border-slate-900 transition-all text-left space-y-2"
                  >
                    <FaUsers size={24} className="text-slate-800" />
                    <div className="font-black text-slate-900 text-xs">Person (Individual Artisan)</div>
                  </button>
                  <button
                    onClick={() => { setAddEntityType('WORKSHOP_COMMUNITY'); setAddFormStep(1); }}
                    className="p-4 rounded-2xl border-2 border-stone-200 hover:border-slate-900 transition-all text-left space-y-2"
                  >
                    <FaBuilding size={24} className="text-purple-700" />
                    <div className="font-black text-slate-900 text-xs">Workshop Community</div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-2.5 bg-stone-100 rounded-lg flex justify-between items-center font-bold">
                  <span>Adding: {addEntityType === 'PERSON' ? 'Individual Person' : 'Workshop Community'}</span>
                  <button onClick={() => setAddEntityType(null)} className="text-[10px] text-brand-primary underline">Change</button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Name / Title *</label>
                    <input 
                      type="text" 
                      value={addFormData.name} 
                      onChange={e => setAddFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Master Ghulam Hassan"
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Primary Craft *</label>
                    <input 
                      type="text" 
                      value={addFormData.craft} 
                      onChange={e => setAddFormData(prev => ({ ...prev, craft: e.target.value }))}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">District *</label>
                    <input 
                      type="text" 
                      value={addFormData.district} 
                      onChange={e => setAddFormData(prev => ({ ...prev, district: e.target.value }))}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Years of Practice *</label>
                    <input 
                      type="number" 
                      value={addFormData.yearsOfPractice} 
                      onChange={e => setAddFormData(prev => ({ ...prev, yearsOfPractice: Number(e.target.value) }))}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1">Archival Notes / Biography</label>
                  <textarea 
                    value={addFormData.bio} 
                    onChange={e => setAddFormData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t">
                  <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border rounded-lg font-bold">Cancel</button>
                  <button onClick={handleAdminCreateRecord} disabled={isCreatingRecord || !addFormData.name} className="px-5 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 disabled:opacity-50">
                    {isCreatingRecord ? 'Creating Record...' : 'Create Registry Record'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
