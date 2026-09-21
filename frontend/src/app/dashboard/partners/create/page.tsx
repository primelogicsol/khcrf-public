"use client";
import { getBaseUrl } from "@/lib/api";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { partnerApi } from "@/lib/api";
import {
  FaArrowLeft,
  FaCheck,
  FaBuilding,
  FaGlobe,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";

export default function CreatePartner() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    orgName: "",
    website: "",
    contactName: "",
    email: "",
    phone: "",
    country: "",
    projectTitle: "",
    projectDescription: "",
    expectedOutcomes: "",
    status: "ACTIVE", // Default to Active since admin is creating it
    logoUrl: "",
    collaborationAreas: [] as string[],
    collaborationType: [] as string[],
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", "ml_default");

    try {
      const response = await axios.post(
        `${getBaseUrl()}/upload`,
        uploadData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      setFormData({ ...formData, logoUrl: response.data.url });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload logo.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await partnerApi.create({
        ...formData,
        collaborationAreas:
          formData.collaborationAreas.length > 0
            ? formData.collaborationAreas
            : ["Strategic Partnership"], // Default if empty
        collaborationType:
          formData.collaborationType.length > 0
            ? formData.collaborationType
            : ["Joint Program"], // Default if empty
      });
      alert("Partner created successfully!");
      router.push("/dashboard/partners");
    } catch (error) {
      console.error("Failed to create partner:", error);
      alert("Failed to create partner.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/partners"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FaArrowLeft className="text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Add New Partner</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Left Column: Logo & Contact */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Organization Logo</h3>
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 mb-4 overflow-hidden relative">
                {formData.logoUrl ? (
                  <Image
                    src={formData.logoUrl}
                    alt="Logo"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <FaBuilding className="text-gray-300 text-3xl" />
                )}
              </div>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-200 pointer-events-none"
                >
                  {uploading ? "Uploading..." : "Upload Logo"}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800">Contact Info</h3>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Organization Name
              </label>
              <input
                name="orgName"
                value={formData.orgName}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Website
              </label>
              <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg px-2">
                <FaGlobe className="text-gray-400 mr-2" />
                <input
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full p-2 bg-transparent outline-none"
                  placeholder="https://"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Contact Person
              </label>
              <input
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Email
              </label>
              <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg px-2">
                <FaEnvelope className="text-gray-400 mr-2" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-2 bg-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Country
              </label>
              <input
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Project Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800">Partnership Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="PENDING">Pending</option>
                  <option value="ACTIVE">Active (Public)</option>
                  <option value="APPROVED">Approved (Public)</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Project Title
              </label>
              <input
                name="projectTitle"
                value={formData.projectTitle}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
                placeholder="e.g. Sustainable Wool Initiative"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Description (Public)
              </label>
              <textarea
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleChange}
                rows={5}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
                placeholder="Describe the collaboration..."
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Expected Outcomes
              </label>
              <textarea
                name="expectedOutcomes"
                value={formData.expectedOutcomes}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-secondary transition-colors shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                "Creating..."
              ) : (
                <>
                  <FaCheck /> Create Partner
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
