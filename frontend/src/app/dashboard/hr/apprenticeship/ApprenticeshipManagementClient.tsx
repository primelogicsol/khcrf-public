"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  FaSearch,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaDownload,
  FaUserGraduate,
  FaTools,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { format } from "date-fns";
import { exportToCsv } from "@/utils/exportCsv";
import { normalizeArray } from "@/lib/normalize";

interface ApprenticeshipApplication {
  id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  city: string;
  qualification: string;
  apprenticeTrack: string[];
  preferredLocation: string[];
  availability: string[];
  skills: string[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  cvUrl?: string;
  portfolioLink?: string;
  portfolioFileUrl?: string;
  motivation: string;
  experience?: string;
}

export default function ApprenticeshipManagementClient() {
  const [applications, setApplications] = useState<ApprenticeshipApplication[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] =
    useState<ApprenticeshipApplication | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await api.get("/apprenticeship");
      setApplications(normalizeArray(data, ["applications", "items", "results", "data"]));
    } catch (error) {
      console.error("Failed to fetch applications", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/apprenticeship/${id}/status`, { status: newStatus });
      fetchApplications();
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
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.apprenticeTrack &&
        app.apprenticeTrack.some((t: string) =>
          t.toLowerCase().includes(searchTerm.toLowerCase()),
        )),
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
            Apprenticeship Applications
          </h1>
          <p className="text-gray-500">
            Manage incoming applications for the apprenticeship program
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-80">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search applicant, email, track..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() =>
              exportToCsv("apprenticeship_applications", filteredApplications)
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
                    Applicant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Track & Skills
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Education
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
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">
                          {app.fullName}
                        </div>
                        <div className="text-xs text-brand-primary">
                          {app.email}
                        </div>
                        <div className="text-xs text-gray-400">
                          {app.contactNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 mb-1">
                          {(app.apprenticeTrack as string[])
                            .slice(0, 1)
                            .map((t, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700"
                              >
                                {t}
                              </span>
                            ))}
                          {(app.apprenticeTrack as string[]).length > 1 && (
                            <span className="text-[10px] text-gray-400">
                              +{app.apprenticeTrack.length - 1} more
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[150px]">
                          {(app.skills as string[])?.slice(0, 2).join(", ")}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {app.qualification}
                        </div>
                        <div className="text-xs text-gray-500">{app.city}</div>
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
                          className="p-2 text-gray-400 hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-all"
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
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedApplication.fullName}
                </h2>
                <p className="text-sm text-gray-500">Apprentice Application</p>
              </div>
              <button
                onClick={() => setSelectedApplication(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-400 hover:text-red-500 shadow-sm"
              >
                <FaTimesCircle size={20} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
              {/* Actions Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-700">
                    Status:
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(selectedApplication.status)}`}
                  >
                    {selectedApplication.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedApplication.id, "APPROVED")
                    }
                    className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedApplication.id, "REJECTED")
                    }
                    className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedApplication.id, "PENDING")
                    }
                    className="px-3 py-1.5 bg-gray-500 text-white rounded-lg text-xs font-bold hover:bg-gray-600"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Details Column 1 */}
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                      <FaUserGraduate data-ui-icon  className="" />{" "}
                      Education & Location
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2 text-sm">
                      <p>
                        <span className="text-gray-500">Qualification:</span>{" "}
                        <span className="font-medium">
                          {selectedApplication.qualification}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-500">Location:</span>{" "}
                        <span className="font-medium">
                          {selectedApplication.city}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-500">Preferred:</span>{" "}
                        <span className="font-medium">
                          {(
                            selectedApplication.preferredLocation as string[]
                          )?.join(", ")}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-500">Availability:</span>{" "}
                        <span className="font-medium">
                          {(selectedApplication.availability as string[])?.join(
                            ", ",
                          )}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                      <FaTools data-ui-icon  className="" /> Skills & Tracks
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Tracks
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(
                            selectedApplication.apprenticeTrack as string[]
                          ).map((t, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Skills
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(selectedApplication.skills as string[]).map(
                            (s, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700"
                              >
                                {s}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Column 2 */}
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Motivation</h3>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-600 leading-relaxed max-h-[200px] overflow-y-auto custom-scrollbar">
                      {selectedApplication.motivation}
                    </div>
                  </div>

                  {(selectedApplication.cvUrl ||
                    selectedApplication.portfolioFileUrl ||
                    selectedApplication.portfolioLink) && (
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3">
                        Documents
                      </h3>
                      <div className="space-y-3">
                        {selectedApplication.cvUrl && (
                          <a
                            href={selectedApplication.cvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-brand-primary transition-colors group"
                          >
                            <div className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center group-hover:bg-red-100">
                              <FaDownload />
                            </div>
                            <div className="text-sm font-medium text-gray-700">
                              Download CV/Resume
                            </div>
                          </a>
                        )}
                        {selectedApplication.portfolioFileUrl && (
                          <a
                            href={selectedApplication.portfolioFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-brand-primary transition-colors group"
                          >
                            <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center group-hover:bg-blue-100">
                              <FaDownload />
                            </div>
                            <div className="text-sm font-medium text-gray-700">
                              Download Portfolio
                            </div>
                          </a>
                        )}
                        {selectedApplication.portfolioLink && (
                          <a
                            href={selectedApplication.portfolioLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-brand-primary transition-colors group"
                          >
                            <div className="w-8 h-8 bg-purple-50 text-purple-500 rounded-lg flex items-center justify-center group-hover:bg-purple-100">
                              <FaEye />
                            </div>
                            <div className="text-sm font-medium text-gray-700">
                              View Portfolio Link
                            </div>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
