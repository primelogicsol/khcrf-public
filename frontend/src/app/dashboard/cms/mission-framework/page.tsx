"use client";

import { useState, useEffect, useRef } from "react";
import { cmsApi } from "@/lib/api";
import { FaPlus, FaTrash, FaSave, FaHandsHelping, FaCheckSquare, FaRegSquare, FaUpload } from "react-icons/fa";
import Input from "@/components/common/Input";
import * as FaIcons from "react-icons/fa";

// List of available icons for selection
const ICON_OPTIONS = [
  "FaHandsHelping",
  "FaBrain",
  "FaGavel",
  "FaLeaf",
  "FaGlobe",
  "FaUsers",
  "FaLightbulb",
  "FaHandHoldingHeart",
];

interface MissionItem {
  title: string;
  description: string;
  icon: string;
}

const DEFAULT_ITEM: MissionItem = {
  title: "",
  description: "",
  icon: "FaHandsHelping",
};

export default function MissionFrameworkCMS() {
  const [items, setItems] = useState<MissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const data = await cmsApi.getContent("mission-framework");
      if (data && data.content) {
        setItems(data.content);
      } else {
        setItems([{ ...DEFAULT_ITEM }]);
      }
    } catch (error) {
      setItems([{ ...DEFAULT_ITEM }]);
    } finally {
      setLoading(false);
    }
  };

  const handleItemChange = (
    index: number,
    field: keyof MissionItem,
    value: any,
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { ...DEFAULT_ITEM }]);
  };

  const removeItem = (index: number) => {
    if (confirm("Are you sure you want to remove this pillar?")) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
      
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
    if (selectedIndices.size === items.length && items.length > 0) {
      setSelectedIndices(new Set());
    } else {
      setSelectedIndices(new Set(items.map((_, i) => i)));
    }
  };

  const removeSelected = () => {
    if (selectedIndices.size === 0) return;
    if (confirm(`Are you sure you want to remove ${selectedIndices.size} pillar(s)?`)) {
      const newItems = items.filter((_, index) => !selectedIndices.has(index));
      setItems(newItems);
      setSelectedIndices(new Set());
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await cmsApi.updateContent("mission-framework", {
        title: "Mission Framework Pillars",
        content: items,
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
          const validItems = parsed.map((p) => ({
            title: p.title || "",
            description: p.description || "",
            icon: p.icon || "FaHandsHelping"
          }));
          
          if (confirm(`Found ${validItems.length} items. Do you want to REPLACE existing items (OK) or APPEND them (Cancel)?`)) {
             setItems(validItems);
          } else {
             setItems([...items, ...validItems]);
          }
          setSelectedIndices(new Set());
        } else {
          alert("Invalid file format. Please upload a JSON array.");
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
            <FaHandsHelping data-ui-icon  className="" />
            Mission Framework Pillars
          </h1>
          <p className="text-gray-500">
            Manage the core pillars displayed on the Mission page
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
            title="Upload JSON file to bulk add pillars"
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

      {items.length > 0 && (
        <div className="mb-4 flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleAll}
              className="flex items-center gap-2 text-gray-700 hover:text-brand-primary font-bold"
            >
              {selectedIndices.size === items.length ? (
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, index) => (
          <div
            key={index}
            className={`bg-white rounded-2xl p-6 shadow-sm border ${selectedIndices.has(index) ? "border-brand-primary ring-1 ring-brand-primary/20" : "border-gray-100"} relative group transition-all`}
          >
            <div className="absolute top-4 left-4 z-10">
              <button
                onClick={() => toggleSelection(index)}
                className="text-gray-400 hover:text-brand-primary transition-colors bg-white rounded-full p-1"
              >
                {selectedIndices.has(index) ? (
                  <FaCheckSquare data-ui-icon  className="text-xl " />
                ) : (
                  <FaRegSquare className="text-xl" />
                )}
              </button>
            </div>
            <button
              onClick={() => removeItem(index)}
              className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors z-10"
              title="Remove Item"
            >
              <FaTrash />
            </button>

            <div className="flex gap-4 mb-4 mt-6">
              <div data-ui-icon className="w-14 h-14 shrink-0 bg-gray-50 rounded-xl flex items-center justify-center text-2xl  border border-gray-100">
                {(() => {
                  const IconComponent = (FaIcons as any)[item.icon];
                  return IconComponent ? (
                    <IconComponent />
                  ) : (
                    <FaIcons.FaHandsHelping />
                  );
                })()}
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  Icon
                </label>
                <select
                  value={item.icon}
                  onChange={(e) =>
                    handleItemChange(index, "icon", e.target.value)
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
            </div>

            <div className="space-y-4">
              <Input
                label="Pillar Title"
                value={item.title}
                onChange={(e) =>
                  handleItemChange(index, "title", e.target.value)
                }
                placeholder="e.g. Empower Artisan Livelihoods"
              />

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg border border-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all"
                  rows={4}
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange(index, "description", e.target.value)
                  }
                  placeholder="Brief description of the pillar..."
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addItem}
          className="rounded-2xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-brand-primary hover:text-brand-primary transition-colors flex flex-col items-center justify-center min-h-[300px] gap-4 font-bold"
        >
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
            <FaPlus />
          </div>
          Add New Pillar
        </button>
      </div>
    </div>
  );
}
