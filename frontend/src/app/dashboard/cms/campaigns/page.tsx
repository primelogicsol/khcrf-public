"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { FaPlus, FaTrash, FaEdit, FaCheckSquare, FaRegSquare, FaUpload } from "react-icons/fa";
import CampaignPreviewCard from "@/components/campaigns/CampaignPreviewCard";
import { toast } from "react-hot-toast";
import { initiativeApi } from "@/lib/api";
import { normalizeArray } from "@/lib/normalize";

interface Campaign {
  id: string;
  title: string;
  hashtags: string[];
  link?: string;
}

export default function CampaignsListPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCampaigns = async () => {
    try {
      const data = await initiativeApi.getAll("CAMPAIGN");
      setCampaigns(normalizeArray(data, ["campaigns", "items", "results", "data"]));
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;

    try {
      await initiativeApi.delete(id);
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
      toast.success("Campaign deleted");
      const newSel = new Set(selectedIds);
      newSel.delete(id);
      setSelectedIds(newSel);
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast.error("Error deleting campaign");
    }
  };

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  const toggleAll = () => {
    if (selectedIds.size === campaigns.length && campaigns.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(campaigns.map((c) => c.id)));
    }
  };

  const removeSelected = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} campaign(s)?`)) return;

    setIsDeleting(true);
    try {
      await Promise.all(Array.from(selectedIds).map(id => initiativeApi.delete(id)));
      setCampaigns((prev) => prev.filter((c) => !selectedIds.has(c.id)));
      setSelectedIds(new Set());
      toast.success("Selected campaigns deleted");
    } catch (error) {
      console.error("Error deleting campaigns:", error);
      toast.error("Error deleting some campaigns");
      fetchCampaigns();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        
        if (Array.isArray(parsed)) {
          setIsUploading(true);
          try {
            await Promise.all(parsed.map(p => 
              initiativeApi.create({
                title: p.title || "Untitled",
                hashtags: Array.isArray(p.hashtags) ? p.hashtags : [],
                link: p.link || "",
                type: "CAMPAIGN"
              })
            ));
            toast.success("Campaigns imported successfully");
            fetchCampaigns();
          } catch(err) {
            console.error("Error creating campaigns:", err);
            toast.error("Failed to import some campaigns");
            fetchCampaigns();
          } finally {
            setIsUploading(false);
          }
        } else {
          toast.error("Invalid file format. Please upload a JSON array.");
        }
      } catch (error) {
        toast.error("Failed to parse JSON file.");
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-brand-dark">Campaigns</h1>
          <p className="text-gray-500">
            Manage your advocacy campaigns and hashtags.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            accept=".json" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-6 py-3 bg-white border-2 border-brand-primary text-icon-on-light rounded-xl font-bold shadow-sm hover:bg-brand-primary/5 transition-all flex items-center gap-2 disabled:opacity-70"
          >
            {isUploading ? <div className="w-4 h-4 border-2 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" /> : <FaUpload />} Bulk Upload
          </button>
          <Link
            href="/dashboard/cms/campaigns/add"
            className="px-6 py-3 bg-brand-primary text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2"
          >
            <FaPlus /> Add New Campaign
          </Link>
        </div>
      </div>

      {campaigns.length > 0 && (
        <div className="mb-4 flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleAll}
              className="flex items-center gap-2 text-gray-700 hover:text-brand-primary font-bold"
            >
              {selectedIds.size === campaigns.length ? (
                <FaCheckSquare data-ui-icon  className="text-xl " />
              ) : (
                <FaRegSquare className="text-xl" />
              )}
              Select All
            </button>
            <span className="text-sm text-gray-500 font-medium">
              ({selectedIds.size} selected)
            </span>
          </div>
          {selectedIds.size > 0 && (
            <button
              onClick={removeSelected}
              disabled={isDeleting}
              className="text-red-500 hover:text-red-700 flex items-center gap-2 font-bold px-3 py-1 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
            >
              {isDeleting ? <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" /> : <FaTrash />} Delete Selected
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-400">
                No campaigns found. Create your first one!
              </p>
            </div>
          ) : (
            campaigns.map((campaign) => (
              <div key={campaign.id} className={`relative group rounded-2xl overflow-hidden transition-all ${selectedIds.has(campaign.id) ? "ring-2 ring-brand-primary shadow-lg" : "hover:shadow-lg"}`}>
                <div className="absolute top-4 left-4 z-20">
                  <button
                    onClick={() => toggleSelection(campaign.id)}
                    className="text-gray-400 hover:text-brand-primary transition-colors bg-white rounded-full p-1 shadow-sm"
                  >
                    {selectedIds.has(campaign.id) ? (
                      <FaCheckSquare data-ui-icon  className="text-xl " />
                    ) : (
                      <FaRegSquare className="text-xl" />
                    )}
                  </button>
                </div>
                <CampaignPreviewCard
                  title={campaign.title}
                  hashtags={campaign.hashtags}
                  link={campaign.link}
                />

                {/* Admin Actions Overlay */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <button
                    onClick={() => handleDelete(campaign.id)}
                    className="p-2 bg-white text-red-500 rounded-full shadow-lg hover:bg-red-50 transition-colors"
                  >
                    <FaTrash />
                  </button>
                  <Link
                    href={`/dashboard/cms/campaigns/edit/${campaign.id}`}
                    className="p-2 bg-white text-blue-500 rounded-full shadow-lg hover:bg-blue-50 transition-colors"
                  >
                    <FaEdit />
                  </Link>
                  {/* Edit button could go here linked to /edit/[id] */}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
