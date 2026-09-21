"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  FaLandmark,
  FaCheck,
  FaTimes,
  FaSearch,
  FaFilePdf,
  FaEye,
  FaFilter,
  FaEyeSlash,
  FaUndo,
  FaDownload, // Added for CSV Export
} from "react-icons/fa";
import Link from "next/link";
import Modal from "@/components/common/Modal";
import Select from "@/components/common/Select";
import DashboardControls from "@/components/dashboard/DashboardControls";
import { exportToCsv } from "@/utils/exportCsv";
import { normalizeArray } from "@/lib/normalize";

export default function LegislativeAdminClient() {
  const [activeTab, setActiveTab] = useState<"offices" | "reports" | "hidden">(
    "offices",
  );
  const [offices, setOffices] = useState<any[]>([]);
  const [filteredOffices, setFilteredOffices] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [hiddenPosts, setHiddenPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOffice, setSelectedOffice] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    let result = offices;
    if (statusFilter !== "ALL") {
      result = result.filter((o) => o.status === statusFilter);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (o) =>
          o.representativeName.toLowerCase().includes(lower) ||
          o.constituency.toLowerCase().includes(lower) ||
          o.username.toLowerCase().includes(lower),
      );
    }
    setFilteredOffices(result);
  }, [offices, searchTerm, statusFilter]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "offices") {
        const { data } = await api.get("/legislative/admin/all");
        setOffices(normalizeArray(data, ["offices", "items", "results", "data"]));
      } else if (activeTab === "reports") {
        const { data } = await api.get("/admin/reports");
        setReports(normalizeArray(data, ["reports", "items", "results", "data"]));
      } else if (activeTab === "hidden") {
        const { data } = await api.get("/admin/posts/hidden");
        setHiddenPosts(normalizeArray(data, ["hiddenposts", "items", "results", "data"]));
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    if (!confirm(`Are you sure you want to mark this as ${newStatus}?`)) return;
    try {
      await api.patch(`/legislative/admin/${id}/status`, { status: newStatus });
      setOffices((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
      );
      if (selectedOffice?.id === id) setSelectedOffice(null);
      alert(`Status updated to ${newStatus}`);
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const toggleBlacklist = async (officeId: string, currentStatus: string) => {
    const action = currentStatus === "BLACKLISTED" ? "activate" : "blacklist";
    if (!confirm(`Are you sure you want to ${action} this office?`)) return;
    try {
      await api.put("/admin/offices/blacklist", { officeId });
      setOffices((prev) =>
        prev.map((o) =>
          o.id === officeId
            ? {
                ...o,
                status:
                  currentStatus === "BLACKLISTED" ? "APPROVED" : "BLACKLISTED",
              }
            : o,
        ),
      );
      if (selectedOffice?.id === officeId) {
        setSelectedOffice((prev: any) => ({
          ...prev,
          status: currentStatus === "BLACKLISTED" ? "APPROVED" : "BLACKLISTED",
        }));
      }
      alert(`Office ${action === "blacklist" ? "blacklisted" : "activated"}.`);
    } catch (error) {
      console.error("Update status error", error);
      alert("Failed to update status.");
    }
  };

  const resolveReport = async (
    reportId: string,
    action: "DELETE_POST" | "DISMISS",
  ) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.post(`/admin/reports/${reportId}/resolve`, { action });
      alert(
        action === "DELETE_POST" ? "Post taken down." : "Report dismissed.",
      );
      fetchData();
    } catch (error: any) {
      console.error("Resolve report error", error);
      alert(error.response?.data?.error || "Failed to resolve report.");
    }
  };

  const restorePost = async (postId: string) => {
    if (!confirm("Are you sure you want to restore this post?")) return;
    try {
      await api.post("/admin/posts/restore", { postId });
      alert("Post restored successfully.");
      fetchData();
    } catch (error) {
      console.error("Restore post error", error);
      alert("Failed to restore post.");
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Legislative Admin Dashboard
          </h1>
          <p className="text-gray-500">
            Manage legislative offices and content reports.
          </p>
        </div>

        <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
          <button
            onClick={() => setActiveTab("offices")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "offices"
                ? "bg-brand-primary text-white shadow"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <FaLandmark /> Offices
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "reports"
                ? "bg-brand-primary text-white shadow"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <FaFilter /> Reports
          </button>
          <button
            onClick={() => setActiveTab("hidden")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "hidden"
                ? "bg-brand-primary text-white shadow"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <FaEyeSlash /> Hidden
          </button>
        </div>
      </div>

      {activeTab === "offices" && (
        <>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
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
                      { value: "BLACKLISTED", label: "Blacklisted" },
                    ],
                    onChange: setStatusFilter,
                  },
                ]}
                placeholder="Search offices..."
              />
            </div>
            <button
              onClick={() =>
                exportToCsv("legislative_offices", filteredOffices)
              }
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:text-brand-primary transition-all shadow-sm h-[42px] mt-0 md:mt-7"
              title="Export to CSV"
            >
              <FaDownload /> Export CSV
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Representative</th>
                    <th className="px-6 py-4">Constituency</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-8 text-center text-gray-400"
                      >
                        Loading requests...
                      </td>
                    </tr>
                  ) : filteredOffices.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-8 text-center text-gray-400"
                      >
                        No offices found.
                      </td>
                    </tr>
                  ) : (
                    filteredOffices.map((office) => (
                      <tr
                        key={office.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">
                            {office.representativeName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {office.designation}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {office.constituency}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1
                                                    ${
                                                      office.status ===
                                                      "APPROVED"
                                                        ? "bg-green-100 text-green-700"
                                                        : office.status ===
                                                              "REJECTED" ||
                                                            office.status ===
                                                              "BLACKLISTED"
                                                          ? "bg-red-100 text-red-700"
                                                          : "bg-yellow-100 text-yellow-700"
                                                    }`}
                          >
                            {office.status === "APPROVED" && <FaCheck />}
                            {office.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedOffice(office)}
                            className="text-brand-primary hover:bg-brand-primary/10 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
                          >
                            View
                          </button>
                          {office.status === "APPROVED" && (
                            <button
                              onClick={() =>
                                toggleBlacklist(office.id, office.status)
                              }
                              className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors border border-red-200"
                            >
                              Blacklist
                            </button>
                          )}
                          {office.status === "BLACKLISTED" && (
                            <button
                              onClick={() =>
                                toggleBlacklist(office.id, office.status)
                              }
                              className="text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors border border-green-200"
                            >
                              Activate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === "reports" && (
        <div className="space-y-4">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => exportToCsv("legislative_reports", reports)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:text-brand-primary transition-all shadow-sm"
              title="Export to CSV"
            >
              <FaDownload /> Export CSV
            </button>
          </div>
          {isLoading ? (
            <div className="p-12 text-center text-gray-500">
              Loading reports...
            </div>
          ) : reports.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
              <FaCheck className="text-4xl text-green-100 mx-auto mb-4" />
              <p>No active reports.</p>
            </div>
          ) : (
            reports.map((report) => (
              <div
                key={report.id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold uppercase rounded">
                      Reported
                    </span>
                    <span className="text-gray-400 text-sm">•</span>
                    <span className="text-sm font-bold text-gray-600">
                      {report.post.office.representativeName} (
                      {report.post.office.constituency})
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Post: {report.post.title}
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4">
                    <p className="text-sm text-gray-500 mb-1 uppercase tracking-wider font-bold">
                      Reason for Report:
                    </p>
                    <p className="text-gray-800">{report.reason}</p>
                  </div>
                  <div className="text-xs text-gray-400">
                    Reported by:{" "}
                    <span className="font-bold text-gray-600">
                      {report.user?.name || "Anonymous"}
                    </span>{" "}
                    on {new Date(report.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex flex-col gap-2 justify-center border-l border-gray-50 pl-6 border-none md:border-solid">
                  <a
                    href={`/legislative-office/post/${report.post.id}`}
                    target="_blank"
                    className="px-4 py-2 text-center border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaEye /> View Post
                  </a>
                  <button
                    onClick={() => resolveReport(report.id, "DELETE_POST")}
                    className="px-4 py-2 text-center bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaEyeSlash /> Take Down
                  </button>
                  <button
                    onClick={() => resolveReport(report.id, "DISMISS")}
                    className="px-4 py-2 text-center bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaCheck /> Dismiss
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "hidden" && (
        <div className="space-y-4">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => exportToCsv("hidden_posts", hiddenPosts)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:text-brand-primary transition-all shadow-sm"
              title="Export to CSV"
            >
              <FaDownload /> Export CSV
            </button>
          </div>
          {isLoading ? (
            <div className="p-12 text-center text-gray-500">
              Loading hidden posts...
            </div>
          ) : hiddenPosts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
              <FaCheck className="text-4xl text-green-100 mx-auto mb-4" />
              <p>No hidden posts found.</p>
            </div>
          ) : (
            hiddenPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 opacity-75"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold uppercase rounded flex items-center gap-2">
                      <FaEyeSlash /> Hidden
                    </span>
                    <span className="text-gray-400 text-sm">•</span>
                    <span className="text-sm font-bold text-gray-600">
                      {post.office?.representativeName}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {post.title}
                  </h3>
                  <div className="text-xs text-gray-400">
                    Taken down on{" "}
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex flex-col gap-2 justify-center border-l border-gray-50 pl-6 border-none md:border-solid">
                  <a
                    href={`/legislative-office/post/${post.id}`}
                    target="_blank"
                    className="px-4 py-2 text-center border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaEye /> View Post
                  </a>
                  <button
                    onClick={() => restorePost(post.id)}
                    className="px-4 py-2 text-center bg-green-50 text-green-600 font-bold rounded-xl hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaUndo /> Restore
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedOffice}
        onClose={() => setSelectedOffice(null)}
        title="Office Application Details"
      >
        {selectedOffice && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Representative
                </label>
                <p className="font-bold text-lg">
                  {selectedOffice.representativeName}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedOffice.designation}, {selectedOffice.party}
                </p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Constituency
                </label>
                <p className="font-bold text-lg">
                  {selectedOffice.constituency}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedOffice.officeAddress}
                </p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Admin Contact
                </label>
                <p className="font-bold">{selectedOffice.officeRepName}</p>
                <p className="text-sm text-gray-600">
                  {selectedOffice.officeRepDesignation}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedOffice.officeRepMobile}
                </p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Verification
                </label>
                <div className="mt-2 space-y-2">
                  {selectedOffice.authDocUrl && (
                    <a
                      href={selectedOffice.authDocUrl}
                      target="_blank"
                      className="flex items-center gap-2 text-blue-600 hover:underline text-sm font-medium"
                    >
                      <FaFilePdf /> View Authorization Doc
                    </a>
                  )}
                  <div className="text-sm text-gray-500">
                    Signed by:{" "}
                    <span className="font-mono bg-gray-100 px-1 rounded">
                      {selectedOffice.digitalSignature}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Date: {selectedOffice.declarationDate}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
                    Office Details
                  </label>
                  <ul className="text-sm space-y-1">
                    <li>
                      <span className="font-semibold">District:</span>{" "}
                      {selectedOffice.district}
                    </li>
                    <li>
                      <span className="font-semibold">Legislative Body:</span>{" "}
                      {selectedOffice.legislativeBody || "N/A"}
                    </li>
                    <li>
                      <span className="font-semibold">Term:</span>{" "}
                      {selectedOffice.termStart} - {selectedOffice.termEnd}
                    </li>
                    <li>
                      <span className="font-semibold">Email:</span>{" "}
                      {selectedOffice.officialEmail}
                    </li>
                    {selectedOffice.officialWebsite && (
                      <li>
                        <a
                          href={selectedOffice.officialWebsite}
                          target="_blank"
                          className="text-brand-primary underline"
                        >
                          Website
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
                    Artisan Profile
                  </label>
                  <ul className="text-sm space-y-1">
                    <li>
                      <span className="font-semibold">Est. Population:</span>{" "}
                      {selectedOffice.artisanPopulation}
                    </li>
                    <li>
                      <span className="font-semibold">Artisan Presence:</span>{" "}
                      {selectedOffice.artisanPresence}
                    </li>
                    <li>
                      <span className="font-semibold">Clusters:</span>{" "}
                      {selectedOffice.craftClusters || "None listed"}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {selectedOffice.status === "PENDING" && (
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() =>
                    handleStatusUpdate(selectedOffice.id, "APPROVED")
                  }
                  className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <FaCheck /> Approve Office
                </button>
                <button
                  onClick={() =>
                    handleStatusUpdate(selectedOffice.id, "REJECTED")
                  }
                  className="flex-1 bg-red-100 text-red-600 font-bold py-3 rounded-xl hover:bg-red-200 flex items-center justify-center gap-2"
                >
                  <FaTimes /> Reject
                </button>
              </div>
            )}

            {selectedOffice.status === "APPROVED" && (
              <div className="pt-4 border-t flex flex-col gap-2">
                <a
                  href={`/legislative-office/${selectedOffice.username}`}
                  target="_blank"
                  className="block w-full text-center bg-brand-primary text-white py-3 rounded-xl font-bold hover:bg-brand-dark"
                >
                  View Live Blog Page
                </a>
                <button
                  onClick={() =>
                    toggleBlacklist(selectedOffice.id, selectedOffice.status)
                  }
                  className="block w-full text-center bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-100 border border-red-200"
                >
                  Suspend Office Account
                </button>
              </div>
            )}
            {selectedOffice.status === "BLACKLISTED" && (
              <div className="pt-4 border-t flex flex-col gap-2">
                <div className="text-center text-red-600 font-bold bg-red-50 p-4 rounded-xl">
                  This office has been suspended.
                </div>
                <button
                  onClick={() =>
                    toggleBlacklist(selectedOffice.id, selectedOffice.status)
                  }
                  className="block w-full text-center bg-green-50 text-green-700 py-3 rounded-xl font-bold hover:bg-green-100 border border-green-200"
                >
                  Re-activate Office Account
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
