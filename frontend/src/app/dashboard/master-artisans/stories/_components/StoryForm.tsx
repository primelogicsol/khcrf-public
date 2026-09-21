"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Story } from "../types";

interface StoryFormProps {
  initialData?: Story;
  isEdit?: boolean;
}

export default function StoryForm({ initialData, isEdit }: StoryFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Story>>(
    initialData || {
      title: "",
      slug: "",
      subtitle: "",
      excerpt: "",
      bodyMarkdown: "",
      heroImage: "",
      contributorId: "",
      authorDisplayName: "",
      storyType: "",
      primaryCraft: "",
      publicationStatus: "DRAFT",
      accessLevel: "PUBLIC",
      readingMinutes: 0,
      seoTitle: "",
      seoDescription: "",
    }
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [conflictError, setConflictError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "readingMinutes" ? parseInt(value) || 0 : value }));
  };

  const handleSubmit = async (e: React.FormEvent, statusOverride?: string) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setConflictError("");

    const dataToSubmit = { ...formData };
    if (statusOverride) {
      dataToSubmit.publicationStatus = statusOverride as any;
    }

    try {
      const url = isEdit
        ? `/api/master-artisans/admin/stories/${initialData?.id}`
        : `/api/master-artisans/admin/stories`;
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      });

      if (res.status === 409) {
        setConflictError("This story has been modified by another user since you loaded it. Please reload to see the latest version.");
        throw new Error("Conflict error");
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "An error occurred");
      }

      router.push("/dashboard/master-artisans/stories");
      router.refresh();
    } catch (err: any) {
      if (err.message !== "Conflict error") {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    if (!initialData?.id) return;
    if (!confirm("Are you sure you want to archive this story?")) return;
    try {
      const res = await fetch(`/api/master-artisans/admin/stories/${initialData.id}/archive`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to archive");
      router.push("/dashboard/master-artisans/stories");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <form className="bg-white p-6 rounded-lg shadow max-w-4xl mx-auto" onSubmit={(e) => handleSubmit(e)}>
      <h2 className="text-xl font-bold mb-6 text-gray-800">{isEdit ? "Edit Story" : "Create Story"}</h2>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
      
      {conflictError && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded mb-4 flex justify-between items-center">
          <p className="text-sm font-medium">{conflictError}</p>
          <button type="button" onClick={handleReload} className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded text-sm font-semibold">
            Reload Latest
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input required type="text" name="title" value={formData.title || ""} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
          <input required type="text" name="slug" value={formData.slug || ""} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
          <input type="text" name="subtitle" value={formData.subtitle || ""} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Author Display Name</label>
          <input type="text" name="authorDisplayName" value={formData.authorDisplayName || ""} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Story Type *</label>
          <input required type="text" name="storyType" value={formData.storyType || ""} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Primary Craft *</label>
          <input required type="text" name="primaryCraft" value={formData.primaryCraft || ""} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Access Level *</label>
          <select required name="accessLevel" value={formData.accessLevel || "PUBLIC"} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500">
            <option value="PUBLIC">Public</option>
            <option value="REGISTERED_USERS">Registered Users</option>
            <option value="MEMBERS_ONLY">Members Only</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reading Minutes</label>
          <input type="number" name="readingMinutes" value={formData.readingMinutes || 0} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image URL</label>
          <input type="text" name="heroImage" value={formData.heroImage || ""} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contributor ID</label>
          <input type="text" name="contributorId" value={formData.contributorId || ""} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
        <textarea name="excerpt" value={formData.excerpt || ""} onChange={handleChange} rows={3} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Body (Markdown) *</label>
        <textarea required name="bodyMarkdown" value={formData.bodyMarkdown || ""} onChange={handleChange} rows={10} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 font-mono" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
          <input type="text" name="seoTitle" value={formData.seoTitle || ""} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
          <input type="text" name="seoDescription" value={formData.seoDescription || ""} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex gap-2">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          {isEdit && formData.publicationStatus !== "ARCHIVED" && (
            <button type="button" onClick={handleArchive} className="px-4 py-2 bg-red-50 text-red-600 rounded text-sm font-medium hover:bg-red-100">
              Archive
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            onClick={(e) => handleSubmit(e, "DRAFT")}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded text-sm font-medium hover:bg-gray-200 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save as Draft"}
          </button>
          <button
            type="submit"
            disabled={loading}
            onClick={(e) => handleSubmit(e, "PUBLISHED")}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 shadow-sm"
          >
            {loading ? "Saving..." : "Publish"}
          </button>
        </div>
      </div>
    </form>
  );
}
