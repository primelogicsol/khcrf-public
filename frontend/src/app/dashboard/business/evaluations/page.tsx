"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaClipboardList, FaSpinner, FaEye } from "react-icons/fa";
import api from "@/lib/api";
import DashboardControls from "@/components/dashboard/DashboardControls";

interface EvaluationSubmission {
  id: string;
  businessName: string;
  userId: string;
  createdAt: string;
  status: string;
  evaluationType: string;
  caseStatus: string;
  trackingId: string;
  _count?: { evidence: number };
  score: number;
  tier: string;
  evaluationType: string;
  user?: {
    name: string;
    email: string;
  };
}

export default function AdminEvaluationsPage() {
  const [evaluations, setEvaluations] = useState<EvaluationSubmission[]>([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState<
    EvaluationSubmission[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [scoreTierFilter, setScoreTierFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("KHCRF_16_STEP");

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const response = await api.get(`/evaluation?evaluationType=${typeFilter}`);
        setEvaluations(response.data);
        setFilteredEvaluations(response.data);
      } catch (error) {
        console.error("Failed to fetch evaluations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, []);

  useEffect(() => {
    let result = evaluations;
    if (statusFilter !== "ALL") {
      result = result.filter((item) => item.status === statusFilter);
    }
    if (scoreTierFilter !== "ALL") {
      result = result.filter((item) => item.tier === scoreTierFilter);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.businessName.toLowerCase().includes(lower) ||
          (item.user?.name || "").toLowerCase().includes(lower) ||
          (item.user?.email || "").toLowerCase().includes(lower),
      );
    }
    setFilteredEvaluations(result);
  }, [evaluations, searchTerm, statusFilter, scoreTierFilter]);

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

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Evaluation Submissions
          </h1>
          <p className="text-gray-500">
            Manage and review business self-evaluations.
          </p>
        </div>
      </div>

      <DashboardControls
        onSearch={setSearchTerm}
        searchValue={searchTerm}
        filters={[
          {
            key: "status",
            value: statusFilter,
            options: [
              { value: "ALL", label: "All Status" },
              { value: "PENDING", label: "Pending" },
              { value: "APPROVED", label: "Approved" },
              { value: "REJECTED", label: "Rejected" },
            ],
            onChange: setStatusFilter,
          },
          {
            key: "tier",
            value: scoreTierFilter,
            options: [
              { value: "ALL", label: "All Tiers" },
              { value: "Gold", label: "Gold" },
              { value: "Silver", label: "Silver" },
              { value: "Bronze", label: "Bronze" },
            ],
            onChange: setScoreTierFilter,
          },
        ]}
        placeholder="Search business or applicant..."
      />

      {filteredEvaluations.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
            <FaClipboardList className="text-4xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No Submissions Found
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            There are no evaluation submissions to review at this time.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-6 font-bold">Business / User</th>
                  <th className="p-6 font-bold">Type</th>
                  <th className="p-6 font-bold">Score / Tier</th>
                  <th className="p-6 font-bold">Date</th>
                  <th className="p-6 font-bold">Status</th>
                  <th className="p-6 font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEvaluations.map((evaluation) => (
                  <tr
                    key={evaluation.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-6">
                      <div className="font-bold text-gray-900">
                        {evaluation.businessName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {evaluation.user?.name || "Unknown User"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {evaluation.user?.email}
                      </div>
                    </td>
                    <td className="p-6 text-gray-600 font-medium">
                      {evaluation.evaluationType.replace("_", " ")}
                    </td>
                    <td className="p-6">
                      <div className="font-bold text-brand-primary">
                        {evaluation.score}
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          evaluation.tier === "Gold"
                            ? "bg-yellow-100 text-yellow-800"
                            : evaluation.tier === "Silver"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {evaluation.tier}
                      </span>
                    </td>
                    <td className="p-6 text-gray-600 font-medium">
                      {new Date(evaluation.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[evaluation.status] || "bg-gray-100 text-gray-600"}`}
                      >
                        {evaluation.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <Link
                        href={`/dashboard/business/evaluations/${evaluation.id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:border-brand-primary hover:text-brand-primary transition-all shadow-sm w-fit"
                      >
                        <FaEye /> View
                      </Link>
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
