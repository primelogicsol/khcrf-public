"use client";

import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaUserTie,
  FaEnvelope,
  FaPhone,
  FaFileAlt,
  FaCheck,
  FaTimes,
  FaCalendarAlt,
  FaDownload,
  FaBriefcase,
} from "react-icons/fa";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { careerApi } from "@/lib/api";

export default function ApplicationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  // params.id is a string (CUID)
  const id = params.id as string;

  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const data = await careerApi.getApplicationById(id);
        setApp(data);
      } catch (error) {
        console.error("Failed to fetch application:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchApplication();
    }
  }, [id]);

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      const updated = await careerApi.updateApplicationStatus(id, newStatus);
      setApp(updated);
      alert(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center">Loading application details...</div>
    );
  }

  if (!app) {
    return (
      <div className="p-10 text-center text-red-500">
        Application not found.
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{app.fullName}</h1>
            <p className="text-sm text-gray-500">
              Applied for{" "}
              <span className="font-bold text-brand-primary">
                {app.job?.title || "General Talent Pool"}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold 
                        ${
                          app.status === "HIRED"
                            ? "bg-green-100 text-green-800"
                            : app.status === "REJECTED"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
          >
            {app.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Candidate Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col items-center mb-6">
              <div data-ui-icon className="w-24 h-24 bg-brand-secondary/10 rounded-full flex items-center justify-center  text-3xl font-bold mb-3">
                {app.fullName.charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {app.fullName}
              </h2>
              {/* Location isn't in current schema, maybe add later or infer? */}
              {/* <p className="text-gray-500 text-sm">{app.location}</p> */}
            </div>

            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <FaEnvelope className="text-gray-400 mr-3" />
                <span className="text-sm font-medium text-gray-700 break-all">
                  {app.email}
                </span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <FaPhone className="text-gray-400 mr-3" />
                <span className="text-sm font-medium text-gray-700">
                  {app.phone}
                </span>
              </div>
              {app.linkedinProfile && (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <FaUserTie className="text-gray-400 mr-3" />
                  <a
                    href={app.linkedinProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              )}
              {app.portfolioUrl && (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <FaBriefcase className="text-gray-400 mr-3" />
                  <a
                    href={app.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    Portfolio
                  </a>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              {app.resumeUrl ? (
                <a
                  href={app.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center p-3 border-2 border-brand-primary text-icon-on-light font-bold rounded-xl hover:bg-brand-primary hover:text-white transition-all"
                >
                  <FaDownload className="mr-2" /> Download Resume
                </a>
              ) : (
                <p className="text-center text-gray-400 text-sm">
                  No resume uploaded
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Application Details & Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Actions Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-wrap gap-4 items-center justify-between">
            <h3 className="font-bold text-gray-800">Actions</h3>
            <div className="flex gap-3">
              <button
                onClick={() => handleStatusUpdate("REJECTED")}
                className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition-colors"
              >
                <FaTimes className="mr-2" /> Reject
              </button>
              <button
                onClick={() => handleStatusUpdate("REVIEWED")}
                className="flex items-center px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg font-bold hover:bg-yellow-100 transition-colors"
              >
                <FaCalendarAlt className="mr-2" /> Mark Reviewed
              </button>
              <button
                onClick={() => handleStatusUpdate("INTERVIEWING")}
                className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-bold hover:bg-blue-100 transition-colors"
              >
                <FaUserTie className="mr-2" /> Interview
              </button>
              <button
                onClick={() => handleStatusUpdate("HIRED")}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors shadow-md"
              >
                <FaCheck className="mr-2" /> Hire Candidate
              </button>
            </div>
          </div>

          {/* Cover Letter */}
          {app.coverLetter && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaFileAlt data-ui-icon  className="" /> Cover Letter
              </h3>
              <div className="p-6 bg-gray-50 rounded-xl text-gray-700 italic leading-relaxed whitespace-pre-wrap border border-gray-200">
                "{app.coverLetter}"
              </div>
            </div>
          )}

          {/* Resume Preview */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaFileAlt data-ui-icon  className="" /> Resume
            </h3>
            {app.resumeUrl ? (
              <iframe
                src={app.resumeUrl}
                className="w-full h-[500px] rounded-xl border border-gray-200"
                title="Resume PDF"
              ></iframe>
            ) : (
              <p className="text-gray-400">No resume available to preview.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
