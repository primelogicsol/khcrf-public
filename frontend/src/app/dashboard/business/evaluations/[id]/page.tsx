"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaBuilding,
  FaChartLine,
  FaClipboardCheck,
  FaCloudUploadAlt,
} from "react-icons/fa";
import api from "@/lib/api";
import Input from "@/components/common/Input";
import ImageUpload from "@/components/common/ImageUpload";
import { EVALUATION_QUESTIONS } from "@/data/evaluationQuestions";
import { CERTIFICATION_QUESTIONS } from "@/data/certificationQuestions";

interface EvaluationSubmission {
  id: string;
  trackingId?: string;
  businessName: string;
  yearsInOperation: number;
  craftType: string;
  annualRevenue: string;
  website?: string;
  answers: Record<string, any>;
  score: number;
  tier: string;
  status: string;
  caseStatus?: string;
  evaluationType: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
  listing?: {
    id: string;
    artisanProfile?: { catalogUrl?: string | null };
    compliance?: {
      fairTradeDoc?: string | null;
      giCertDoc?: string | null;
      blockchainCertDoc?: string | null;
    };
  };
}

export default function AdminEvaluationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [evaluation, setEvaluation] = useState<EvaluationSubmission | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        const response = await api.get(`/evaluation/${id}`);
        setEvaluation(response.data);
      } catch (error) {
        console.error("Failed to fetch evaluation details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  
  const handleTransmitToCraftlore = async () => {
    setActionLoading(true);
    try {
      const res = await api.post(`/evaluation/${id}/transmit-craftlore`);
      toast.success(`CRAFTLORE CKTRE, Transmission: Acknowledged, Craftlore Import Reference: ${res.data.importId}, Entity Match: ${res.data.entityMatchStatus || res.data.status || 'MATCHED'}, Transmitted: ${new Date().toLocaleString()}`);
    } catch (e: any) {
      toast.error(e.response?.data?.detail || e.response?.data?.error || "Failed to transmit to Craftlore");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (status: "APPROVED" | "REJECTED") => {
    if (
      !confirm(
        `Are you sure you want to ${status.toLowerCase()} this evaluation?`,
      )
    )
      return;

    setActionLoading(true);
    try {
      const res = await api.post(`/evaluation/${id}/complete-review`, {
        requireGroundVerification: false,
      });
      toast.success("Review completed: " + res.data.status);
      setEvaluation((prev) =>
        prev ? { ...prev, caseStatus: res.data.status } : null,
      );
    } catch (e: any) {
      if (e.response?.data?.missingFactors) {
        toast.error(
          "Missing factors: " + e.response.data.missingFactors.join(", "),
        );
      } else {
        toast.error(e.response?.data?.error || "Failed to complete review");
      }
    } finally {
      setActionLoading(false);
      setCertificateUrl("");
    }
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner data-ui-icon  className="animate-spin text-4xl " />
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl m-8">
        <h3 className="text-xl font-bold text-gray-900">
          Evaluation Not Found
        </h3>
        <button
          onClick={() => router.back()}
          className="mt-4 text-brand-primary font-bold hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900">
              {evaluation.businessName}
            </h1>
            <p className="text-gray-500">
              Submitted by {evaluation.user?.name} on{" "}
              {new Date(evaluation.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span
            className={`px-4 py-2 rounded-full text-sm font-bold ${statusColors[evaluation.status] || "bg-gray-100 text-gray-800"}`}
          >
            {evaluation.status}
          </span>
          
            <div className="flex gap-2">
              {(evaluation.caseStatus === "VERIFICATION_COMPLETED" || evaluation.status === "VERIFICATION_COMPLETED") && (
                <button
                  onClick={handleTransmitToCraftlore}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-6 py-2 bg-[#050A1E] text-[#D4AF37] font-bold rounded-lg hover:bg-gray-800 transition-all shadow-md disabled:opacity-50"
                >
                  {actionLoading ? <FaSpinner className="animate-spin" /> : <FaCloudUploadAlt />} Send Verified Result to Craftlore CKTRE
                </button>
              )}
              
              {(evaluation.status === "PENDING" || evaluation.caseStatus === "SUBMITTED" || evaluation.caseStatus === "UNDER_REVIEW") && (
              <div className="flex flex-col items-end gap-3">
                <div className="w-64">
                  <ImageUpload
                    label="Upload Certificate"
                    value={certificateUrl}
                    onChange={setCertificateUrl}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusUpdate("APPROVED")}
                    disabled={actionLoading}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all shadow-md disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaCheck />
                    )}{" "}
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate("REJECTED")}
                    disabled={actionLoading}
                    className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all shadow-md disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaTimes />
                    )}{" "}
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Score Card */}
      <div className="bg-linear-to-r from-brand-primary to-brand-secondary text-white rounded-3xl p-8 shadow-lg flex items-center justify-between">
        <div>
          <p className="text-brand-accent font-bold uppercase tracking-wider text-sm mb-1">
            Evaluation Score
          </p>
          <h2 className="text-5xl font-black">
            {evaluation.score}
            <span className="text-2xl font-normal opacity-70">
              /Tier: {evaluation.tier}
            </span>
          </h2>
        </div>
        <FaChartLine className="text-6xl opacity-20" />
      </div>

      {/* Business Details */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 animate-fade-in-up">
        <h3 className="text-xl font-bold mb-6 text-gray-900 border-b pb-2 flex items-center gap-2">
          <FaBuilding data-ui-icon  className=" text-sm" /> Business
          Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Craft Type
            </label>
            <p className="text-lg font-medium text-gray-900">
              {evaluation.craftType}
            </p>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Years in Operation
            </label>
            <p className="text-lg font-medium text-gray-900">
              {evaluation.yearsInOperation} Years
            </p>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Annual Revenue
            </label>
            <p className="text-lg font-medium text-gray-900">
              {evaluation.annualRevenue}
            </p>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Website
            </label>
            <a
              href={evaluation.website}
              target="_blank"
              rel="noreferrer"
              className="text-lg font-medium text-brand-primary hover:underline"
            >
              {evaluation.website || "N/A"}
            </a>
          </div>
        </div>
      </div>

      {/* Submitted Documents */}
      {evaluation.listing && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 animate-fade-in-up">
          <h3 className="text-xl font-bold mb-6 text-gray-900 border-b pb-2 flex items-center gap-2">
            <FaClipboardCheck data-ui-icon  className=" text-sm" />{" "}
            Submitted Documents
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {evaluation.listing.artisanProfile?.catalogUrl && (
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Craft Catalog
                </label>
                <a
                  href={evaluation.listing.artisanProfile.catalogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-primary font-bold hover:underline break-all"
                >
                  View Document
                </a>
              </div>
            )}
            {evaluation.listing.compliance?.fairTradeDoc && (
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Fair Trade Certificate
                </label>
                <a
                  href={evaluation.listing.compliance.fairTradeDoc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-primary font-bold hover:underline break-all"
                >
                  View Document
                </a>
              </div>
            )}
            {evaluation.listing.compliance?.giCertDoc && (
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  GI Certificate
                </label>
                <a
                  href={evaluation.listing.compliance.giCertDoc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-primary font-bold hover:underline break-all"
                >
                  View Document
                </a>
              </div>
            )}
            {evaluation.listing.compliance?.blockchainCertDoc && (
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Blockchain Certificate
                </label>
                <a
                  href={evaluation.listing.compliance.blockchainCertDoc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-primary font-bold hover:underline break-all"
                >
                  View Document
                </a>
              </div>
            )}
            {!evaluation.listing.artisanProfile?.catalogUrl &&
              !evaluation.listing.compliance?.fairTradeDoc &&
              !evaluation.listing.compliance?.giCertDoc &&
              !evaluation.listing.compliance?.blockchainCertDoc && (
                <div className="col-span-2 text-gray-500 italic">
                  No documents found linked to this evaluation.
                </div>
              )}
          </div>
        </div>
      )}

      {/* Evaluation Answers */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 animate-fade-in-up">
        <h3 className="text-xl font-bold mb-6 text-gray-900 border-b pb-2 flex items-center gap-2">
          <FaClipboardCheck data-ui-icon  className=" text-sm" />{" "}
          Self-Assessment Answers
        </h3>
        <div className="space-y-6">
          {evaluation.answers &&
            Object.entries(evaluation.answers).map(
              ([questionId, answer], index) => {
                const questionSet =
                  evaluation.evaluationType === "CERTIFICATION"
                    ? CERTIFICATION_QUESTIONS
                    : EVALUATION_QUESTIONS;

                // In KHCRF_16_STEP, answers are plain keys, not indices to EVALUATION_QUESTIONS array
                if (evaluation.evaluationType === "KHCRF_16_STEP") {
                  return (
                    <div
                      key={questionId}
                      className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                    >
                      <h4 className="font-bold text-gray-800 mb-2 leading-relaxed">
                        <span className="space-y-1 block">
                          <span data-editorial-accent-text className="text-xs uppercase tracking-wider block font-bold mb-1">
                            {formatFactor(questionId)}
                          </span>
                        </span>
                      </h4>
                      <div className="text-gray-600 flex flex-col gap-2 mt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700 bg-white border border-gray-200 px-3 py-1 rounded-lg shadow-sm">
                            {String(answer)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }

                const qIndex = parseInt(questionId, 10);
                const questionData = questionSet[qIndex];
                const selectedOption = questionData?.options.find(
                  (opt) => opt.value === Number(answer),
                );

                return (
                  <div
                    key={questionId}
                    className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                  >
                    <h4 className="font-bold text-gray-800 mb-2 leading-relaxed">
                      {questionData ? (
                        <span className="space-y-1 block">
                          <span data-editorial-accent-text className="text-xs  uppercase tracking-wider block font-bold mb-1">
                            {questionData.section}
                          </span>
                          <span>{questionData.question}</span>
                        </span>
                      ) : (
                        `Question ${index + 1}`
                      )}
                    </h4>
                    <div className="text-gray-600 flex flex-col gap-2 mt-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-brand-primary/10 text-brand-primary font-bold rounded-lg text-sm border border-brand-primary/20">
                          Score: {String(answer)}
                        </span>
                        {selectedOption && (
                          <span className="text-sm font-medium text-gray-700 bg-white border border-gray-200 px-3 py-1 rounded-lg shadow-sm">
                            {selectedOption.label}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              },
            )}
          {!evaluation.answers && (
            <p className="text-gray-500 italic">
              No detailed answers available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
