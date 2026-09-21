"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  FaAward,
  FaDownload,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBriefcase,
  FaArrowLeft,
  FaSave,
  FaExclamationTriangle,
  FaEye,
} from "react-icons/fa";
import Link from "next/link";
import ConfirmationModal from "@/components/common/ConfirmationModal";

export default function CceApplicationDetailAdminPage() {
  const { id } = useParams();
  const router = useRouter();
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [evalScores, setEvalScores] = useState({
    complianceScore: 0,
    craftQualityScore: 0,
    innovationScore: 0,
    clusterContributionScore: 0,
    marketReadinessScore: 0,
    documentationScore: 0,
    adminNotes: "",
  });
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    isWarning: false,
    onConfirm: () => {},
  });

  const closeModal = () => setModal((prev) => ({ ...prev, isOpen: false }));

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      const { data } = await api.get(`/cce/${id}`);
      setApp(data);
      setStatus(data.status);
      setEvalScores({
        complianceScore: data.complianceScore || 0,
        craftQualityScore: data.craftQualityScore || 0,
        innovationScore: data.innovationScore || 0,
        clusterContributionScore: data.clusterContributionScore || 0,
        marketReadinessScore: data.marketReadinessScore || 0,
        documentationScore: data.documentationScore || 0,
        adminNotes: data.adminNotes || "",
      });
    } catch (error) {
      console.error("Fetch Error", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return Object.keys(evalScores).reduce((acc, key) => {
      if (key === "adminNotes") return acc;
      return acc + (evalScores[key as keyof typeof evalScores] as number);
    }, 0);
  };

  const handleSaveEvaluation = async () => {
    setIsSaving(true);
    try {
      await api.patch(`/cce/${id}/status`, {
        ...evalScores,
        status,
      });
      setModal({
        isOpen: true,
        title: "Evaluation Saved",
        message: "Application evaluation and status updated successfully.",
        isWarning: false,
        onConfirm: () => {
          closeModal();
          fetchApplication();
        },
      });
    } catch (error) {
      alert("Failed to save evaluation");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center">
        <FaClock data-ui-icon  className="animate-spin text-4xl  mx-auto" />
      </div>
    );
  if (!app)
    return (
      <div className="p-20 text-center text-red-500 font-bold">
        Application not found.
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
      <ConfirmationModal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onClose={closeModal}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard/business/cce-applications"
            className="p-3 bg-gray-100 text-gray-500 rounded-2xl hover:bg-gray-200 transition-all"
          >
            <FaArrowLeft />
          </Link>
          <div>
            <div data-editorial-accent-text className="flex items-center gap-3  font-black uppercase tracking-widest text-[10px]">
              <FaAward /> <span>{app.referenceNumber}</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 font-playfair">
              {app.entityName}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <select
            className="px-6 py-3 rounded-2xl border-2 border-gray-100 focus:border-brand-primary outline-none font-bold"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="PENDING">Pending</option>
            <option value="DOCUMENTS_REVIEW">Docs Review</option>
            <option value="EVALUATION">Evaluation</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <button
            onClick={handleSaveEvaluation}
            disabled={isSaving}
            className="px-8 py-3 bg-brand-primary text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:bg-brand-dark transition-all flex items-center gap-2"
          >
            {isSaving ? (
              <FaClock className="animate-spin" />
            ) : (
              <>
                <FaSave /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Application Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Info */}
          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 font-playfair">
                <FaUser data-ui-icon  className="" /> Applicant Information
              </h3>
              <span data-editorial-accent-text className="text-[10px] font-black uppercase tracking-widest  bg-brand-primary/10 px-3 py-1 rounded-full">
                Section 1
              </span>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem
                label="Stakeholder Category"
                value={app.stakeholderCategory}
              />
              <DetailItem
                label="CCSI Registration ID"
                value={app.ccsiRegistrationId}
              />
              <DetailItem label="Craft Category" value={app.craftCategory} />
              <DetailItem label="Cluster / Location" value={app.clusterName} />
              <DetailItem label="Phone" value={app.phone} icon={<FaPhone />} />
              <DetailItem
                label="Email"
                value={app.email}
                icon={<FaEnvelope />}
              />
              <div className="col-span-2">
                <DetailItem
                  label="Address"
                  value={app.address}
                  icon={<FaMapMarkerAlt />}
                />
              </div>
            </div>
          </section>

          {/* Section 3: Performance */}
          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 font-playfair">
                <FaBriefcase data-ui-icon  className="" /> Performance
                Metrics
              </h3>
              <span data-editorial-accent-text className="text-[10px] font-black uppercase tracking-widest  bg-brand-primary/10 px-3 py-1 rounded-full">
                Section 3
              </span>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <DetailItem
                label="Experience"
                value={`${app.yearsExperience} Years`}
              />
              <DetailItem
                label="Production Scale"
                value={app.productionScale}
              />
              <DetailItem label="Team Size" value={app.teamSize || "N/A"} />
              <div className="col-span-3">
                <DetailItem
                  label="Markets Served"
                  value={app.marketsServed?.join(", ")}
                />
              </div>
            </div>
          </section>

          {/* Section 4: Merit Statement */}
          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-gray-900">
            <div className="px-8 py-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 font-playfair">
                <FaAward data-ui-icon  className="" /> Merit Statement
              </h3>
              <span data-editorial-accent-text className="text-[10px] font-black uppercase tracking-widest  bg-brand-primary/10 px-3 py-1 rounded-full">
                Section 4
              </span>
            </div>
            <div className="p-8 prose prose-stone max-w-none prose-sm leading-relaxed whitespace-pre-wrap">
              {app.meritStatement}
            </div>
          </section>

          {/* Section 5: Evidence */}
          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 font-playfair">
                <FaDownload data-ui-icon  className="" /> Supporting
                Evidence
              </h3>
              <span data-editorial-accent-text className="text-[10px] font-black uppercase tracking-widest  bg-brand-primary/10 px-3 py-1 rounded-full">
                Section 5
              </span>
            </div>
            <div className="p-8 space-y-6">
              {app.productImages?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                    Product Showcase
                  </p>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {app.productImages.map((img: string, i: number) => (
                      <a
                        key={i}
                        href={img}
                        target="_blank"
                        className="block relative group overflow-hidden rounded-2xl h-32 border border-gray-100"
                      >
                        <img
                          src={img}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                          <FaEye className="text-white text-xl" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {/* Add more doc links if needed */}
            </div>
          </section>
        </div>

        {/* Right Column: Evaluation Dashboard */}
        <div className="space-y-8">
          <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black font-playfair text-yellow-500">
                  Evaluation Scoring
                </h3>
                <div className="text-center">
                  <div className="text-4xl font-black text-white">
                    {calculateTotal()}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Total Score
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <ScoreInput
                  label="Compliance (20%)"
                  max={20}
                  value={evalScores.complianceScore}
                  onChange={(v) =>
                    setEvalScores({ ...evalScores, complianceScore: v })
                  }
                />
                <ScoreInput
                  label="Craft Quality (25%)"
                  max={25}
                  value={evalScores.craftQualityScore}
                  onChange={(v) =>
                    setEvalScores({ ...evalScores, craftQualityScore: v })
                  }
                />
                <ScoreInput
                  label="Innovation (15%)"
                  max={15}
                  value={evalScores.innovationScore}
                  onChange={(v) =>
                    setEvalScores({ ...evalScores, innovationScore: v })
                  }
                />
                <ScoreInput
                  label="Cluster Contribution (15%)"
                  max={15}
                  value={evalScores.clusterContributionScore}
                  onChange={(v) =>
                    setEvalScores({
                      ...evalScores,
                      clusterContributionScore: v,
                    })
                  }
                />
                <ScoreInput
                  label="Market Readiness (15%)"
                  max={15}
                  value={evalScores.marketReadinessScore}
                  onChange={(v) =>
                    setEvalScores({ ...evalScores, marketReadinessScore: v })
                  }
                />
                <ScoreInput
                  label="Docs Completeness (10%)"
                  max={10}
                  value={evalScores.documentationScore}
                  onChange={(v) =>
                    setEvalScores({ ...evalScores, documentationScore: v })
                  }
                />
              </div>

              <div className="space-y-3 pt-6 border-t border-white/10">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Internal Admin Notes
                </label>
                <textarea
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:bg-white/10 outline-none transition-all h-32"
                  placeholder="Add evaluation summary or notes..."
                  value={evalScores.adminNotes}
                  onChange={(e) =>
                    setEvalScores({ ...evalScores, adminNotes: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-3xl border border-yellow-100 flex gap-4">
            <FaExclamationTriangle className="text-yellow-600 text-xl shrink-0" />
            <p className="text-xs text-yellow-800 leading-relaxed font-medium">
              Evaluation scores are weighted and influence the final decision.
              Ensure all documentation has been reviewed before finalizing
              status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: any;
  icon?: any;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
        {label}
      </p>
      <p className="font-bold text-gray-900 flex items-center gap-2">
        {icon && <span className="text-brand-primary/50 text-xs">{icon}</span>}
        {value || "-"}
      </p>
    </div>
  );
}

function ScoreInput({
  label,
  max,
  value,
  onChange,
}: {
  label: string;
  max: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
        <span>{label}</span>
        <span className="text-white">
          {value} / {max}
        </span>
      </div>
      <input
        type="range"
        min="0"
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-yellow-500"
      />
    </div>
  );
}
