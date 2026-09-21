"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Story } from "./types";

export default function StoriesListPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [accessFilter, setAccessFilter] = useState("");
  const [page, setPage] = useState(1);

  const fetchStories = async () => {
    setLoading(true);
    setError("");
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        ...(search && { search }),
        ...(statusFilter && { publicationStatus: statusFilter }),
        ...(typeFilter && { storyType: typeFilter }),
        ...(accessFilter && { accessLevel: accessFilter }),
      });
      const res = await fetch(`/api/master-artisans/admin/stories?${query.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch stories");
      const data = await res.json();
      setStories(Array.isArray(data) ? data : data.stories || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [page, search, statusFilter, typeFilter, accessFilter]);

  const handleArchive = async (id: string) => {
    if (!confirm("Are you sure you want to archive this story?")) return;
    try {
      const res = await fetch(`/api/master-artisans/admin/stories/${id}/archive`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to archive");
      fetchStories();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Master Artisan Stories</h1>
        <Link
          href="/dashboard/master-artisans/stories/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow text-sm font-medium"
        >
          Create Story
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
        >
          <option value="">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="REVIEW">Review</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
        >
          <option value="">All Types</option>
          <option value="INTERVIEW">Interview</option>
          <option value="PROFILE">Profile</option>
          <option value="ARTICLE">Article</option>
        </select>
        <select
          value={accessFilter}
          onChange={(e) => setAccessFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
        >
          <option value="">All Access Levels</option>
          <option value="PUBLIC">Public</option>
          <option value="REGISTERED_USERS">Registered Users</option>
          <option value="MEMBERS_ONLY">Members Only</option>
        </select>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading stories...</div>
        ) : stories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No stories found.</div>
        ) : (
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Author</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Craft</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Access</th>
                <th className="px-4 py-3 font-medium">Published</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3 font-medium">Version</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stories.map((story) => (
                <tr key={story.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{story.title}</td>
                  <td className="px-4 py-3 text-gray-500">{story.slug}</td>
                  <td className="px-4 py-3 text-gray-500">{story.authorDisplayName}</td>
                  <td className="px-4 py-3 text-gray-500">{story.storyType}</td>
                  <td className="px-4 py-3 text-gray-500">{story.primaryCraft}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                      {story.publicationStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{story.accessLevel}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {story.publishedAt ? new Date(story.publishedAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(story.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{story.version}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <Link
                      href={`/dashboard/master-artisans/stories/${story.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <a
                      href={`/master-artisans/stories/${story.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:underline"
                    >
                      Preview
                    </a>
                    {story.publicationStatus !== "ARCHIVED" && (
                      <button
                        onClick={() => handleArchive(story.id)}
                        className="text-red-600 hover:underline"
                      >
                        Archive
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 disabled:opacity-50 hover:bg-gray-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
