"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  FaSpinner,
  FaCircleCheck,
  FaCircleExclamation,
  FaClock,
} from "react-icons/fa6";
import Link from "next/link";

interface Evaluation {
  id: string;
  trackingId?: string;
  caseStatus: string;
  evaluationType?: string;
  createdAt: string;
  adminCertificateUrl?: string;
}

export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const response = await api.get("/evaluation/my-evaluation");
        const evals = Array.isArray(response.data?.data) ? response.data.data : [];
    setEvaluations(evals);
      } catch (error) {
        console.error("Failed to fetch evaluations", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner data-ui-icon className="animate-spin text-3xl" />
      </div>
    );

  const formatStatus = (status: string | null | undefined) => {
    if (!status) return "Legacy";
    if (status === "VERIFICATION_COMPLETED") return "Verification Completed";
    return status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusIcon = (status: string | null | undefined) => {
    if (status === "VERIFICATION_COMPLETED") return <FaCircleCheck className="text-green-500" />;
    if (status === "REJECTED" || status === "SUSPENDED") return <FaCircleExclamation className="text-red-500" />;
    return <FaClock className="text-blue-500" />;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-stone-900">
          My Verifications
        </h1>
        <p className="text-stone-600 mt-2">
          Track the status of your verification applications.
        </p>
      </div>

      {evaluations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <p className="text-stone-500">No verifications found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold text-stone-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-4 text-sm font-bold text-stone-500 uppercase">
                      Verification ID
                    </th>
                    <th className="px-6 py-4 text-sm font-bold text-stone-500 uppercase">
                      Business / Entity
                    </th>
                    <th className="px-6 py-4 text-sm font-bold text-stone-500 uppercase">
                      Craft
                    </th>
                  <th className="px-6 py-4 text-sm font-bold text-stone-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-sm font-bold text-stone-500 uppercase text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {evaluations.map((evaluation) => (
                  <tr
                    key={evaluation.id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-6 py-4 text-stone-700">
                      {new Date(evaluation.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-stone-900 font-mono">
                      {evaluation.trackingId || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-stone-700 font-medium">
                      {evaluation.businessName || "—"}
                    </td>
                    <td className="px-6 py-4 text-stone-600">
                      {evaluation.craftType || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(evaluation.caseStatus)}
                        <span className="text-stone-700 font-medium">
                          {formatStatus(evaluation.caseStatus)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {evaluation.caseStatus === "DRAFT" ? (
                          <Link
                            href={`/business-support/evaluation/form`}
                            className="inline-block px-4 py-2 border border-brand-primary bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-stone-900 hover:border-stone-900 transition-all"
                          >
                            Resume
                          </Link>
                        ) : (
                          <Link
                            href={`/profile/evaluations/${evaluation.id}`}
                            className="inline-block px-4 py-2 border border-stone-200 rounded-lg text-sm font-bold text-stone-600 hover:text-brand-primary hover:border-brand-primary hover:bg-brand-primary/5 transition-all"
                          >
                            View Details
                          </Link>
                        )}
                        {evaluation.adminCertificateUrl && (
                          <a
                            href={evaluation.adminCertificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-sm font-bold text-green-700 hover:bg-green-100 transition-all"
                          >
                            Download
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
