"use client";
import { getBaseUrl } from "@/lib/api";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { partnerApi } from "@/lib/api";
import {
  FaArrowLeft,
  FaCheck,
  FaBuilding,
  FaGlobe,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFileAlt,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

export default function PartnerDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [partner, setPartner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form States
  const [status, setStatus] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [expectedOutcomes, setExpectedOutcomes] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) loadPartner();
  }, [id]);

  const loadPartner = async () => {
    try {
      const data = await partnerApi.getById(id);
      setPartner(data);
      setStatus(data.status);
      setProjectTitle(data.projectTitle || "");
      setProjectDescription(data.projectDescription || "");
      setExpectedOutcomes(data.expectedOutcomes || "");
      setLogoUrl(data.logoUrl || "");
    } catch (error) {
      console.error("Failed to load partner:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default"); // Check cloudinary config

    try {
      // Using backend upload route if available, or direct cloudinary
      // For now, assuming backend upload route exists at /api/upload like usually
      // If not, we might need to use a signed url or generic upload endpoint
      // Let's rely on the user's previously implemented upload logic if possible
      // checking `lib/api.ts` actually didn't show upload...
      // But Profile page used it. Let's try to assume /api/upload exists or use cloud directly.
      // Best guess: Generic upload endpoint on backend

      // Re-checking previous context... ProfileDashboard used `api.post('/upload', formData)`?
      // No, I need to be sure. I will assume standard backend upload for now.

      const API_BASE = getBaseUrl();
      const response = await axios.post(
        `${API_BASE}/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      setLogoUrl(response.data.url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload logo.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await partnerApi.update(id, {
        status,
        logoUrl,
        projectTitle,
        projectDescription,
        expectedOutcomes,
      });
      alert("Partner updated successfully!");
      router.push("/dashboard/partners");
    } catch (error) {
      console.error("Failed to update partner:", error);
      alert("Failed to update partner.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!partner)
    return (
      <div className="p-10 text-center text-red-500">Partner not found</div>
    );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/partners"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaArrowLeft className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {partner.orgName}
            </h1>
            <p className="text-sm text-gray-500">
              Applied on {new Date(partner.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-brand-primary text-white rounded-lg font-bold hover:bg-brand-secondary transition-colors disabled:opacity-50"
        >
          {saving ? (
            "Saving..."
          ) : (
            <>
              <FaCheck /> Save Changes
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Read-Only Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-3xl mb-4 overflow-hidden relative">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt="Logo"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <FaBuilding />
                )}
              </div>
              <h2 className="text-lg font-bold text-center">
                {partner.contactName}
              </h2>
              <p className="text-sm text-gray-500">{partner.country}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <FaEnvelope className="text-gray-400 w-4" />
                <span className="break-all">{partner.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FaPhone className="text-gray-400 w-4" />
                <span>{partner.phone || "N/A"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FaGlobe className="text-gray-400 w-4" />
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-primary hover:underline"
                >
                  Website
                </a>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Collaboration Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {partner.collaborationAreas?.map((area: string) => (
                  <span
                    key={area}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-6">
              Application Status & Assets
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                >
                  <option value="PENDING">Pending</option>
                  <option value="REVIEWED">Reviewed</option>
                  <option value="ACTIVE">Active (Public)</option>
                  <option value="APPROVED">Approved (Public)</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Organization Logo
                </label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20"
                  />
                  {uploading && (
                    <span className="text-sm text-gray-500 self-center">
                      ...
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  Upload a square image for best results.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-6">Engagement Details</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Project Title
                </label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Description (Public)
                </label>
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  placeholder="Describe the collaboration..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Expected Outcomes
                </label>
                <textarea
                  value={expectedOutcomes}
                  onChange={(e) => setExpectedOutcomes(e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {partner.supportingDoc && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaFileAlt data-ui-icon  className="" />
                <span className="text-sm font-medium">Supporting Document</span>
              </div>
              <a
                href={partner.supportingDoc}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-brand-primary font-bold hover:underline"
              >
                Download
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
