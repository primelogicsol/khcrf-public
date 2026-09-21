"use client";

import { useState, useEffect, useRef } from "react";
import { cmsApi } from "@/lib/api";
import { FaPlus, FaTrash, FaSave, FaUserTie, FaCheckSquare, FaRegSquare, FaUpload } from "react-icons/fa";
import Input from "@/components/common/Input";
import * as FaIcons from "react-icons/fa";

// List of available icons for selection
const ICON_OPTIONS = [
  "FaUserTie",
  "FaUserCog",
  "FaUserMd",
  "FaUserGraduate",
  "FaUserNinja",
  "FaUserAstronaut",
  "FaUserSecret",
];

interface Profile {
  title: string;
  description: string;
  icon: string;
}

const DEFAULT_PROFILE: Profile = {
  title: "",
  description: "",
  icon: "FaUserTie",
};

export default function LeadershipCMS() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const data = await cmsApi.getContent("leadership-profiles");
      if (data && data.content) {
        setProfiles(data.content);
      } else {
        setProfiles([{ ...DEFAULT_PROFILE }]);
      }
    } catch (error) {
      setProfiles([{ ...DEFAULT_PROFILE }]);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (
    index: number,
    field: keyof Profile,
    value: any,
  ) => {
    const newProfiles = [...profiles];
    newProfiles[index] = { ...newProfiles[index], [field]: value };
    setProfiles(newProfiles);
  };

  const addProfile = () => {
    setProfiles([...profiles, { ...DEFAULT_PROFILE }]);
  };

  const removeProfile = (index: number) => {
    if (confirm("Are you sure you want to remove this profile?")) {
      const newProfiles = [...profiles];
      newProfiles.splice(index, 1);
      setProfiles(newProfiles);
      
      // Update selection
      const newSelection = new Set<number>();
      selectedIndices.forEach((selectedIndex) => {
        if (selectedIndex < index) newSelection.add(selectedIndex);
        else if (selectedIndex > index) newSelection.add(selectedIndex - 1);
      });
      setSelectedIndices(newSelection);
    }
  };

  const toggleSelection = (index: number) => {
    const newSelection = new Set(selectedIndices);
    if (newSelection.has(index)) {
      newSelection.delete(index);
    } else {
      newSelection.add(index);
    }
    setSelectedIndices(newSelection);
  };

  const toggleAll = () => {
    if (selectedIndices.size === profiles.length && profiles.length > 0) {
      setSelectedIndices(new Set());
    } else {
      setSelectedIndices(new Set(profiles.map((_, i) => i)));
    }
  };

  const removeSelected = () => {
    if (selectedIndices.size === 0) return;
    if (confirm(`Are you sure you want to remove ${selectedIndices.size} profile(s)?`)) {
      const newProfiles = profiles.filter((_, index) => !selectedIndices.has(index));
      setProfiles(newProfiles);
      setSelectedIndices(new Set());
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await cmsApi.updateContent("leadership-profiles", {
        title: "Leadership Profiles",
        content: profiles,
      });
      alert("Content saved successfully!");
    } catch (error) {
      console.error("Failed to save content:", error);
      alert("Failed to save content. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        
        if (Array.isArray(parsed)) {
          const validProfiles = parsed.map(p => ({
            title: p.title || "",
            description: p.description || "",
            icon: p.icon || "FaUserTie"
          }));
          
          if (confirm(`Found ${validProfiles.length} profiles. Do you want to REPLACE existing profiles (OK) or APPEND them (Cancel)?`)) {
             setProfiles(validProfiles);
          } else {
             setProfiles([...profiles, ...validProfiles]);
          }
          setSelectedIndices(new Set());
        } else {
          alert("Invalid file format. Please upload a JSON array of profiles.");
        }
      } catch (error) {
        alert("Failed to parse JSON file. Ensure it is valid JSON.");
      }
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-6 font-manrope max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaUserTie data-ui-icon  className="" />
            Leadership Profiles
          </h1>
          <p className="text-gray-500">
            Manage profiles displayed on the Leadership page
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
            className="bg-white border-2 border-brand-primary text-brand-primary px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-primary/5 transition-all shadow-sm"
            title="Upload JSON file to bulk add profiles"
          >
            <FaUpload /> Bulk Upload
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-brand-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/25 disabled:opacity-70"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FaSave />
            )}
            Save Changes
          </button>
        </div>
      </div>

      {profiles.length > 0 && (
        <div className="mb-4 flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleAll}
              className="flex items-center gap-2 text-gray-700 hover:text-brand-primary font-bold"
            >
              {selectedIndices.size === profiles.length ? (
                <FaCheckSquare data-ui-icon  className="text-xl " />
              ) : (
                <FaRegSquare className="text-xl" />
              )}
              Select All
            </button>
            <span className="text-sm text-gray-500 font-medium">
              ({selectedIndices.size} selected)
            </span>
          </div>
          {selectedIndices.size > 0 && (
            <button
              onClick={removeSelected}
              className="text-red-500 hover:text-red-700 flex items-center gap-2 font-bold px-3 py-1 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <FaTrash /> Delete Selected
            </button>
          )}
        </div>
      )}

      <div className="space-y-6">
        {profiles.map((profile, index) => (
          <div
            key={index}
            className={`bg-white rounded-2xl p-6 shadow-sm border ${selectedIndices.has(index) ? "border-brand-primary ring-1 ring-brand-primary/20" : "border-gray-100"} relative group transition-all`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleSelection(index)}
                  className="text-gray-400 hover:text-brand-primary transition-colors"
                >
                  {selectedIndices.has(index) ? (
                    <FaCheckSquare data-ui-icon  className="text-xl " />
                  ) : (
                    <FaRegSquare className="text-xl" />
                  )}
                </button>
                <h3 className="text-lg font-bold text-gray-800">
                  Profile {index + 1}
                </h3>
              </div>
              <button
                onClick={() => removeProfile(index)}
                className="text-red-500 hover:text-red-700 p-2"
                title="Remove Profile"
              >
                <FaTrash />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-2 flex flex-col items-center gap-4">
                <div data-ui-icon className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl  border border-gray-100">
                  {(() => {
                    const IconComponent = (FaIcons as any)[profile.icon];
                    return IconComponent ? (
                      <IconComponent />
                    ) : (
                      <FaIcons.FaUserTie />
                    );
                  })()}
                </div>
                <select
                  value={profile.icon}
                  onChange={(e) =>
                    handleProfileChange(index, "icon", e.target.value)
                  }
                  className="w-full px-2 py-2 text-sm rounded-lg border border-gray-300 focus:border-brand-primary outline-none"
                >
                  {ICON_OPTIONS.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon.replace("Fa", "")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-10 space-y-4">
                <Input
                  label="Name & Role"
                  value={profile.title}
                  onChange={(e) =>
                    handleProfileChange(index, "title", e.target.value)
                  }
                  placeholder="e.g. Jasif Khan - Founder & Chairman"
                />

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full px-4 py-3 rounded-lg border border-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all"
                    rows={3}
                    value={profile.description}
                    onChange={(e) =>
                      handleProfileChange(index, "description", e.target.value)
                    }
                    placeholder="Brief description of responsibilities..."
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addProfile}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 font-bold hover:border-brand-primary hover:text-brand-primary transition-colors flex items-center justify-center gap-2"
        >
          <FaPlus /> Add New Profile
        </button>
      </div>
    </div>
  );
}
