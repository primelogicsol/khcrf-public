"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import Link from "next/link";
import {
  FaSearch,
  FaFilter,
  FaFileAlt,
  FaSpinner,
  FaEye,
} from "react-icons/fa";
import { useSearchParams, useRouter } from "next/navigation";

export default function CCSIListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [limit] = useState(10);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [craft, setCraft] = useState(searchParams.get("craft") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (search) params.append("search", search);
      if (craft) params.append("craft", craft);
      if (status) params.append("status", status);

      const { data } = await api.get(`/ccsi/profiles?${params.toString()}`);
      setProfiles(data.data);
      setTotal(data.total);
    } catch (error) {
      console.error("Fetch Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
    // Update URL without reload
    const params = new URLSearchParams();
    if (page > 1) params.set("page", page.toString());
    if (search) params.set("search", search);
    if (craft) params.set("craft", craft);
    if (status) params.set("status", status);
    router.replace(`/legislative-dashboard/ccsi/list?${params.toString()}`);
  }, [page, search, craft, status]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
            Verified
          </span>
        );
      case "SUBMITTED":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
            Submitted
          </span>
        );
      case "UNDER_REVIEW":
        return (
          <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
            Reviewing
          </span>
        );
      case "PENDING_JURISDICTION":
        return (
          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
            Pending Jurisdiction
          </span>
        );
      case "GENERAL_INTAKE":
        return (
          <span className="px-2 py-1 bg-stone-100 text-stone-700 rounded-full text-xs font-bold">
            General Intake
          </span>
        );
      case "JURISDICTION_APPROVED":
        return (
          <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-bold">
            Jurisdiction Confirmed
          </span>
        );
      case "REJECTED":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">
            {status}
          </span>
        );
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-playfair text-stone-900">
            Stakeholder Registry
          </h1>
          <p className="text-gray-600">
            Manage and view all registered constituency profiles.
          </p>
        </div>
        <Link
          href="/legislative-dashboard/ccsi/intake"
          className="px-6 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg hover:bg-brand-dark transition-all flex items-center gap-2"
        >
          <FaFileAlt /> Add New
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, contact, or business..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-primary/20 transition-all"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select
            className="p-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-hidden"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="PENDING_JURISDICTION">Pending Jurisdiction</option>
            <option value="JURISDICTION_APPROVED">
              Jurisdiction Confirmed
            </option>
            <option value="VERIFIED">Verified</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="GENERAL_INTAKE">General Intake</option>
          </select>
          <select
            className="p-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-hidden"
            value={craft}
            onChange={(e) => {
              setCraft(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Crafts</option>
            {/* Ideally populate dynamically */}
            <option value="Handloom">Handloom</option>
            <option value="Handicraft">Handicraft</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <FaSpinner data-ui-icon  className="animate-spin text-3xl  mx-auto" />
          </div>
        ) : profiles.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 font-bold uppercase text-xs">
                  <tr>
                    <th className="p-4">Profile</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Details</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {profiles.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      <td className="p-4">
                        <div className="font-bold text-gray-900">
                          {p.fullName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {p.primaryContact}
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">
                        {p.applicantCategory}
                      </td>
                      <td className="p-4 text-gray-600">
                        <div className="flex flex-col">
                          <span>{p.primaryCraft}</span>
                          <span className="text-xs text-gray-400">
                            {p.village}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(p.status)}
                        {p.status === "PENDING_JURISDICTION" &&
                          p.jurisdictionExpiresAt && (
                            <div className="mt-1 text-xs text-rose-500 font-medium">
                              {Math.max(
                                0,
                                Math.ceil(
                                  (new Date(p.jurisdictionExpiresAt).getTime() -
                                    Date.now()) /
                                    (1000 * 60 * 60 * 24),
                                ),
                              )}{" "}
                              Days Left
                            </div>
                          )}
                      </td>
                      <td className="p-4 text-gray-500">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/legislative-dashboard/ccsi/${p.id}`}
                          className="text-gray-400 hover:text-brand-primary transition-colors inline-block"
                        >
                          <FaEye className="text-lg" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
              <div className="text-sm text-gray-500">
                Showing {(page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, total)} of {total} results
              </div>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 border rounded hover:bg-white disabled:opacity-50"
                >
                  Prev
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const p = i + 1; // Simplify logic for now
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`px-3 py-1 border rounded ${page === p ? "bg-brand-primary text-white" : "hover:bg-white"}`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1 border rounded hover:bg-white disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-12 text-center text-gray-500">
            No profiles found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
