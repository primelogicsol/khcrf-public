"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StoryForm from "../_components/StoryForm";
import { Story } from "../types";

export default function EditStoryPage() {
  const params = useParams();
  const id = params.id as string;
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    
    const fetchStory = async () => {
      try {
        const res = await fetch(`/api/master-artisans/admin/stories/${id}`);
        if (!res.ok) throw new Error("Failed to load story");
        const data = await res.json();
        setStory(data.story || data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading story details...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {story && <StoryForm initialData={story} isEdit={true} />}
    </div>
  );
}
