"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  FaSearch,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaFileAlt,
  FaGlobe,
  FaHandshake,
  FaDownload,
} from "react-icons/fa";
import { format } from "date-fns";
import { exportToCsv } from "@/utils/exportCsv";
import { normalizeArray } from "@/lib/normalize";

interface PartnerApplication {
  id: string;
  orgName: string;
  website?: string;
  contactName: string;
  email: string;
  phone?: string;
  country: string;
  collaborationAreas: string[];
  otherArea?: string;
  projectTitle?: string;
  projectDescription?: string;
  expectedOutcomes?: string;
  collaborationType: string[];
  otherCollaboration?: string;
  supportingDoc?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export default function PartnerManagementClient() {
  const [applications, setApplications] = useState<PartnerApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] =
    useState<PartnerApplication | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await api.get("/partner");
      setApplications(normalizeArray(data, ["applications", "items", "results", "data"]));
    } catch (error) {
      console.error("Failed to fetch partner applications", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/partner/${id}/status`, { status: newStatus });
      fetchApplications(); // Refresh list
      if (selectedApplication?.id === id) {
        setSelectedApplication((prev) =>
          prev ? { ...prev, status: newStatus as any } : null,
        );
      }
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status");
    }
  };

  const filteredApplications = applications.filter(
    (app) =>
      app.orgName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Partner Applications
          </h1>
          <p className="text-gray-500">
            Manage partnership requests and collaborations
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search organizations..."
              className="pl-10 pr-4 py-3 border border-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary w-full placeholder:text-gray-500 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() =>
              exportToCsv("partner_applications", filteredApplications)
            }
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:text-brand-primary transition-all shadow-sm shrink-0"
            title="Export to CSV"
          >
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading applications...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Key Areas
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No applications found using your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">
                          {app.orgName}
                        </div>
                        <a
                          href={app.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-brand-primary hover:underline truncate max-w-[150px] inline-block"
                        >
                          {app.website}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {app.contactName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {app.country}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {(app.collaborationAreas as string[])
                            .slice(0, 2)
                            .map((area, index) => (
                              <span
                                key={index}
                                className="inline-flex px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700"
                              >
                                {area}
                              </span>
                            ))}
                          {(app.collaborationAreas as string[]).length > 2 && (
                            <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600">
                              +{(app.collaborationAreas as string[]).length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(app.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(app.status)}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => setSelectedApplication(app)}
                          className="p-2 text-gray-400 hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-all mx-auto inline-block"
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedApplication.orgName}
                </h2>
                <p className="text-sm text-gray-500">
                  Application ID: {selectedApplication.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedApplication(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-400 hover:text-red-500 shadow-sm transition-colors"
              >
                <FaTimesCircle size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar space-y-8 flex-1">
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FaGlobe data-ui-icon  className="" /> Contact Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-500">Contact:</span>{" "}
                      {selectedApplication.contactName}
                    </p>
                    <p>
                      <span className="text-gray-500">Email:</span>{" "}
                      {selectedApplication.email}
                    </p>
                    <p>
                      <span className="text-gray-500">Phone:</span>{" "}
                      {selectedApplication.phone || "N/A"}
                    </p>
                    <p>
                      <span className="text-gray-500">Country:</span>{" "}
                      {selectedApplication.country}
                    </p>
                    <p>
                      <span className="text-gray-500">Website:</span>{" "}
                      <a
                        href={selectedApplication.website}
                        className="text-brand-primary hover:underline"
                      >
                        {selectedApplication.website || "N/A"}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FaClock data-ui-icon  className="" /> Status & Actions
                  </h3>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Current Status</p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border inline-block ${getStatusColor(selectedApplication.status)}`}
                    >
                      {selectedApplication.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        handleStatusUpdate(selectedApplication.id, "APPROVED")
                      }
                      className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                    >
                      <FaCheckCircle /> Approve
                    </button>
                    <button
                      onClick={() =>
                        handleStatusUpdate(selectedApplication.id, "REJECTED")
                      }
                      className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1"
                    >
                      <FaTimesCircle /> Reject
                    </button>
                    <button
                      onClick={() =>
                        handleStatusUpdate(selectedApplication.id, "PENDING")
                      }
                      className="px-3 py-1.5 bg-yellow-500 text-white text-xs font-bold rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-1"
                    >
                      <FaClock /> Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Collaboration Details */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FaHandshake data-ui-icon  className="" /> Collaboration
                  Details
                </h3>
                <div className="bg-white border rounded-xl p-4 space-y-4">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Areas of Interest
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(selectedApplication.collaborationAreas as string[]).map(
                        (area, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium border border-blue-100"
                          >
                            {area}
                          </span>
                        ),
                      )}
                      {selectedApplication.otherArea && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs font-medium border border-gray-200">
                          Other: {selectedApplication.otherArea}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Activities
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(selectedApplication.collaborationType as string[]).map(
                        (type, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium border border-purple-100"
                          >
                            {type}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Proposal Details */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FaFileAlt data-ui-icon  className="" /> Proposal
                </h3>
                <div className="bg-white border rounded-xl p-4 space-y-4 text-sm">
                  <div>
                    <p className="font-bold text-gray-900">Project Title</p>
                    <p className="text-gray-600">
                      {selectedApplication.projectTitle || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Description</p>
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {selectedApplication.projectDescription || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Expected Outcomes</p>
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {selectedApplication.expectedOutcomes || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Supporting Doc */}
              {selectedApplication.supportingDoc && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FaDownload data-ui-icon  className="" /> Documents
                  </h3>
                  <a
                    href={selectedApplication.supportingDoc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200 group"
                  >
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-red-500 shadow-sm group-hover:scale-110 transition-transform">
                      <FaFileAlt />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        Supporting Document
                      </p>
                      <p className="text-xs text-gray-500">
                        Click to view or download
                      </p>
                    </div>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
