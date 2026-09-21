"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  FaAward,
  FaSearch,
  FaFilter,
  FaEye,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import Link from "next/link";
import { normalizeArray } from "@/lib/normalize";

export default function CceApplicationsAdminPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await api.get("/cce");
      setApplications(normalizeArray(data, ["applications", "items", "results", "data"]));
    } catch (error) {
      console.error("Fetch Error", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = applications.filter((app) => {
    const matchesSearch =
      app.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.entityName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "APPROVED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaAward data-ui-icon  className="" /> CCE Award Applications
          </h1>
          <p className="text-gray-500 mt-1">
            Review and evaluate CCE Program submissions.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID or Entity Name..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-6 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 outline-none"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="DOCUMENTS_REVIEW">Docs Review</option>
          <option value="EVALUATION">Evaluation</option>
          <option value="SHORTLISTED">Shortlisted</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-widest">
              <tr>
                <th className="px-8 py-5">Ref Number</th>
                <th className="px-8 py-5">Applicant / Entity</th>
                <th className="px-8 py-5">Award Category</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Submission Date</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-20">
                    <FaClock data-ui-icon  className="animate-spin text-4xl  mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-20 text-gray-400">
                    No applications found.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-8 py-5 font-bold text-brand-primary">
                      {app.referenceNumber}
                    </td>
                    <td className="px-8 py-5">
                      <div className="font-bold text-gray-900">
                        {app.entityName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {app.craftCategory}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium">
                      {app.awardCategory}
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(app.status)}`}
                      >
                        {app.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <Link
                        href={`/dashboard/business/cce-applications/${app.id}`}
                        className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-brand-primary hover:text-white transition-all inline-block shadow-sm"
                      >
                        <FaEye />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
