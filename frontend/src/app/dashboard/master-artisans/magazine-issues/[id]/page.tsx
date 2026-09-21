"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { AlertCircle, Trash2, Star, Plus, ArrowUp, ArrowDown } from "lucide-react";

export default function MagazineIssueStoriesPage() {
  const params = useParams();
  const issueId = params.id as string;

  const [issue, setIssue] = useState<any>(null);
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newStoryId, setNewStoryId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchIssueAndStories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/master-artisans/admin/issues/${issueId}/stories`);
      if (!res.ok) throw new Error("Failed to load issue stories");
      const data = await res.json();
      setStories(data.stories || []);
      setIssue(data.issue || null);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [issueId]);

  useEffect(() => {
    fetchIssueAndStories();
  }, [fetchIssueAndStories]);

  const handleAddStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryId.trim()) return;
    try {
      setIsSubmitting(true);
      setError("");
      const res = await fetch(`/api/master-artisans/admin/issues/${issueId}/stories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyId: newStoryId.trim() }),
      });
      if (!res.ok) {
        if (res.status === 409) {
          throw new Error("Story already exists in this issue or a conflict occurred.");
        }
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to add story");
      }
      setNewStoryId("");
      await fetchIssueAndStories();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveStory = async (storyId: string) => {
    if (!confirm("Are you sure you want to remove this story?")) return;
    try {
      setError("");
      const res = await fetch(`/api/master-artisans/admin/issues/${issueId}/stories/${storyId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove story");
      await fetchIssueAndStories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSetCoverStory = async (storyId: string) => {
    try {
      setError("");
      const res = await fetch(`/api/master-artisans/admin/issues/${issueId}/cover-story`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyId }),
      });
      if (!res.ok) throw new Error("Failed to set cover story");
      await fetchIssueAndStories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const newStories = [...stories];
    const temp = newStories[index];
    newStories[index] = newStories[index - 1];
    newStories[index - 1] = temp;
    await saveOrder(newStories);
  };

  const handleMoveDown = async (index: number) => {
    if (index === stories.length - 1) return;
    const newStories = [...stories];
    const temp = newStories[index];
    newStories[index] = newStories[index + 1];
    newStories[index + 1] = temp;
    await saveOrder(newStories);
  };

  const saveOrder = async (newStories: any[]) => {
    try {
      setError("");
      // Optimistic update
      setStories(newStories);
      const order = newStories.map((s) => s.storyId);
      const res = await fetch(`/api/master-artisans/admin/issues/${issueId}/stories/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order }),
      });
      if (!res.ok) {
        if (res.status === 409) {
          throw new Error("Conflict occurred while saving order. Please refresh.");
        }
        throw new Error("Failed to save order");
      }
    } catch (err: any) {
      setError(err.message);
      await fetchIssueAndStories(); // revert
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Manage Issue Stories {issue?.title ? `- ${issue.title}` : ""}
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md flex items-center space-x-2">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Add Story Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Add Story to Issue</h2>
        <form onSubmit={handleAddStory} className="flex gap-4">
          <input
            type="text"
            value={newStoryId}
            onChange={(e) => setNewStoryId(e.target.value)}
            placeholder="Enter Story ID..."
            className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2 border"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting || !newStoryId.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 font-medium"
          >
            <Plus size={20} />
            {isSubmitting ? "Adding..." : "Add Story"}
          </button>
        </form>
      </div>

      {/* Stories List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Linked Stories ({stories.length})</h2>
          <span className="text-sm text-gray-500">
            Use arrows to reorder
          </span>
        </div>
        
        {stories.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No stories linked to this issue yet. Add one above.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {stories.map((link, index) => {
              const s = link.story || {};
              const status = s.publicationStatus || "UNKNOWN";
              const isUnpublished = status === "DRAFT" || status === "ARCHIVED";

              return (
                <li key={link.storyId || index} className="p-4 hover:bg-gray-50 transition flex items-center gap-4 group">
                  
                  {/* Reorder Controls */}
                  <div className="flex flex-col text-gray-300 group-hover:text-gray-500 transition-colors">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="hover:text-blue-600 disabled:opacity-30 disabled:hover:text-gray-300 p-1"
                      title="Move Up"
                    >
                      <ArrowUp size={20} />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === stories.length - 1}
                      className="hover:text-blue-600 disabled:opacity-30 disabled:hover:text-gray-300 p-1"
                      title="Move Down"
                    >
                      <ArrowDown size={20} />
                    </button>
                  </div>

                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ml-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {s.title || `Story ID: ${link.storyId}`}
                        </span>
                        {link.isCoverStory && (
                          <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                            <Star size={12} fill="currentColor" />
                            Cover Story
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        <span>ID: <code className="bg-gray-100 px-1 py-0.5 rounded">{link.storyId}</code></span>
                        <span>•</span>
                        <span>Status: {status}</span>
                      </div>
                      
                      {isUnpublished && (
                        <div className="mt-2 text-amber-700 text-sm flex items-center gap-1.5 bg-amber-50 px-2.5 py-1.5 rounded-md inline-flex border border-amber-200">
                          <AlertCircle size={16} className="text-amber-500" />
                          <span>Warning: This story is <strong>{status.toLowerCase()}</strong> and may not appear publicly.</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {!link.isCoverStory && (
                        <button
                          onClick={() => handleSetCoverStory(link.storyId)}
                          className="text-sm px-3 py-1.5 border border-gray-300 bg-white rounded-md hover:bg-gray-50 font-medium text-gray-700 shadow-sm transition-colors"
                        >
                          Set Cover
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleRemoveStory(link.storyId)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Remove from issue"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
