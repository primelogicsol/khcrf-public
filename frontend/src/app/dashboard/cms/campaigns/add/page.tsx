"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CampaignPreviewCard from "@/components/campaigns/CampaignPreviewCard";
import { FaArrowLeft, FaSave, FaSpinner } from "react-icons/fa";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { initiativeApi } from "@/lib/api";

export default function AddCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    hashtags: "", // Comma separated input
    link: "",
    description: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getHashtagArray = () => {
    return formData.hashtags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await initiativeApi.create({
        type: "CAMPAIGN",
        title: formData.title,
        description: formData.description,
        hashtags: getHashtagArray(),
        link: formData.link,
        tagline: "", // Optional or auto-generated
      });

      toast.success("Campaign created successfully!");
      router.push("/dashboard/cms/campaigns");
    } catch (error) {
      console.error(error);
      toast.error("Error creating campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/cms/campaigns"
            className="p-2 bg-white rounded-full text-gray-400 hover:text-brand-dark transition-colors"
          >
            <FaArrowLeft />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-brand-dark">
              Add New Campaign
            </h1>
            <p className="text-gray-500 text-sm">
              Create a new campaign with a generated graphic.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form Section */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Campaign Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                placeholder="e.g. Crafting Equality"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Hashtags (comma separated) *
              </label>
              <input
                type="text"
                name="hashtags"
                required
                value={formData.hashtags}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                placeholder="#ArtisanRights, #FairWages"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Redirect Link (Optional)
              </label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Description (Internal Note or Full Text)
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                placeholder="Details about this campaign..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-brand-dark text-white rounded-xl font-bold uppercase tracking-widest hover:bg-brand-primary transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <FaSave /> Save Campaign
                </>
              )}
            </button>
          </form>
        </div>

        {/* Live Preview Section */}
        <div className="flex flex-col items-center">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">
            Live Graphic Preview
          </h3>
          <div className="w-full max-w-sm sticky top-10">
            <CampaignPreviewCard
              title={formData.title}
              hashtags={getHashtagArray()}
              link={formData.link}
            />
            <p className="text-center text-xs text-gray-400 mt-6 max-w-xs mx-auto">
              This graphic is auto-generated using HTML/CSS and will appear
              exactly like this on the website.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
