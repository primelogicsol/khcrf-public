"use client";

import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLinkedin,
  FaFilePdf,
  FaBriefcase,
  FaGraduationCap,
  FaPaperPlane,
  FaCommentDots,
  FaDownload,
} from "react-icons/fa";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { careerApi } from "@/lib/api";

export default function CandidateProfilePage() {
  const params = useParams();
  const router = useRouter();
  // params.id is a string (CUID)
  const id = params.id as string;

  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const data = await careerApi.getApplicationById(id);
        setCandidate(data);
      } catch (error) {
        console.error("Failed to fetch candidate:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCandidate();
    }
  }, [id]);

  if (loading) {
    return <div className="p-10 text-center">Loading candidate profile...</div>;
  }

  if (!candidate) {
    return (
      <div className="p-10 text-center text-red-500">Candidate not found.</div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FaArrowLeft className="text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">
            {candidate.fullName}
          </h1>
          <p className="text-sm text-gray-500">
            ID: #{candidate.id.slice(-6)} • Joined{" "}
            {new Date(candidate.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
            <FaCommentDots /> Schedule Chat
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-secondary transition-colors shadow-md">
            <FaPaperPlane /> Contact
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto flex items-center justify-center text-gray-400 text-5xl font-bold mb-4 border-4 border-white shadow-lg">
              <FaUser />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {candidate.fullName}
            </h2>
            <p className="text-brand-primary font-medium text-sm mb-4">
              Talent Pool Candidate
            </p>

            <div className="flex justify-center gap-3 mb-6">
              {candidate.linkedinProfile && (
                <a
                  href={candidate.linkedinProfile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-50 rounded-full text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <FaLinkedin />
                </a>
              )}
              <a
                href={`mailto:${candidate.email}`}
                className="p-2 bg-gray-50 rounded-full text-gray-600 hover:text-red-500 transition-colors"
              >
                <FaEnvelope />
              </a>
              <a
                href={`tel:${candidate.phone}`}
                className="p-2 bg-gray-50 rounded-full text-gray-600 hover:text-green-600 transition-colors"
              >
                <FaPhone />
              </a>
            </div>

            <div className="text-left space-y-3 pt-4 border-t border-gray-100">
              {/* Location is not in DB yet */}
              {/* <div className="flex items-center gap-3 text-sm text-gray-600">
                                <FaMapMarkerAlt className="text-gray-400 shrink-0" /> {candidate.location}
                            </div> */}
              {candidate.portfolioUrl && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FaBriefcase className="text-gray-400 shrink-0" />
                  <a
                    href={candidate.portfolioUrl}
                    target="_blank"
                    className="hover:underline text-blue-600"
                  >
                    Portfolio
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaFilePdf className="text-red-500" /> Documents
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-sm font-medium text-gray-700">
                  Resume
                </span>
                {candidate.resumeUrl ? (
                  <a
                    href={candidate.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand-primary font-bold hover:underline"
                  >
                    View
                  </a>
                ) : (
                  <span className="text-xs text-gray-400">N/A</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio / Cover Letter */}
          {candidate.coverLetter && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">
                Cover Letter / Summary
              </h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {candidate.coverLetter}
              </p>
            </div>
          )}

          {/* Resume Preview */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaFilePdf data-ui-icon  className="" /> Resume Preview
            </h3>
            {candidate.resumeUrl ? (
              <iframe
                src={candidate.resumeUrl}
                className="w-full h-[500px] rounded-xl border border-gray-200"
                title="Resume PDF"
              ></iframe>
            ) : (
              <p className="text-gray-400">No resume available to preview.</p>
            )}
          </div>

          {/* Skills & Timeline - Removed as data is not in DB */}
        </div>
      </div>
    </div>
  );
}
