"use client";

import { useState, useEffect, useRef } from "react";
import { cmsApi } from "@/lib/api";
import { FaPlus, FaTrash, FaSave, FaProjectDiagram, FaCheckSquare, FaRegSquare, FaUpload } from "react-icons/fa";
import Input from "@/components/common/Input";

interface Phase {
  id: string;
  title: string;
  purpose: string;
  details: {
    activities: string[];
    outputs: string[];
    stakeholders: string[];
  };
}

const DEFAULT_PHASE: Phase = {
  id: "",
  title: "",
  purpose: "",
  details: {
    activities: [],
    outputs: [],
    stakeholders: [],
  },
};

export default function HCRFProjectCMS() {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const data = await cmsApi.getContent("hcrf-project-phases");
      if (data && data.content) {
        setPhases(data.content);
      } else {
        // Initialize with default empty phase if no content exists exists
        setPhases([{ ...DEFAULT_PHASE, id: "phase1" }]);
      }
    } catch (error) {
      console.error("Failed to fetch content:", error);
      // Fallback or init
      setPhases([{ ...DEFAULT_PHASE, id: "phase1" }]);
    } finally {
      setLoading(false);
    }
  };

  const handlePhaseChange = (index: number, field: keyof Phase, value: any) => {
    const newPhases = [...phases];
    newPhases[index] = { ...newPhases[index], [field]: value };
    setPhases(newPhases);
  };

  const handleArrayChange = (
    phaseIndex: number,
    arrayName: "activities" | "outputs" | "stakeholders",
    arrayIndex: number,
    value: string,
  ) => {
    const newPhases = [...phases];
    if (!newPhases[phaseIndex].details) {
      newPhases[phaseIndex].details = {
        activities: [],
        outputs: [],
        stakeholders: [],
      };
    }
    const newArray = [...(newPhases[phaseIndex].details[arrayName] || [])];
    newArray[arrayIndex] = value;
    newPhases[phaseIndex].details[arrayName] = newArray;
    setPhases(newPhases);
  };

  const addArrayItem = (
    phaseIndex: number,
    arrayName: "activities" | "outputs" | "stakeholders",
  ) => {
    const newPhases = [...phases];
    if (!newPhases[phaseIndex].details) {
      newPhases[phaseIndex].details = {
        activities: [],
        outputs: [],
        stakeholders: [],
      };
    }
    const newArray = [...(newPhases[phaseIndex].details[arrayName] || []), ""];
    newPhases[phaseIndex].details[arrayName] = newArray;
    setPhases(newPhases);
  };

  const removeArrayItem = (
    phaseIndex: number,
    arrayName: "activities" | "outputs" | "stakeholders",
    arrayIndex: number,
  ) => {
    const newPhases = [...phases];
    const newArray = [...(newPhases[phaseIndex].details[arrayName] || [])];
    newArray.splice(arrayIndex, 1);
    newPhases[phaseIndex].details[arrayName] = newArray;
    setPhases(newPhases);
  };

  const addPhase = () => {
    setPhases([
      ...phases,
      {
        ...DEFAULT_PHASE,
        id: `phase${phases.length + 1}`,
        details: { activities: [], outputs: [], stakeholders: [] },
      },
    ]);
  };

  const removePhase = (index: number) => {
    if (confirm("Are you sure you want to remove this phase?")) {
      const newPhases = [...phases];
      newPhases.splice(index, 1);
      setPhases(newPhases);
      
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
    if (selectedIndices.size === phases.length && phases.length > 0) {
      setSelectedIndices(new Set());
    } else {
      setSelectedIndices(new Set(phases.map((_, i) => i)));
    }
  };

  const removeSelected = () => {
    if (selectedIndices.size === 0) return;
    if (confirm(`Are you sure you want to remove ${selectedIndices.size} phase(s)?`)) {
      const newPhases = phases.filter((_, index) => !selectedIndices.has(index));
      setPhases(newPhases);
      setSelectedIndices(new Set());
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await cmsApi.updateContent("hcrf-project-phases", {
        title: "KHCRF Project Phases",
        content: phases,
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
          const validPhases = parsed.map((p, i) => ({
            id: p.id || `uploaded-phase-${Date.now()}-${i}`,
            title: p.title || "",
            purpose: p.purpose || "",
            details: {
              activities: Array.isArray(p.details?.activities) ? p.details.activities : [],
              outputs: Array.isArray(p.details?.outputs) ? p.details.outputs : [],
              stakeholders: Array.isArray(p.details?.stakeholders) ? p.details.stakeholders : []
            }
          }));
          
          if (confirm(`Found ${validPhases.length} phases. Do you want to REPLACE existing phases (OK) or APPEND them (Cancel)?`)) {
             setPhases(validPhases);
          } else {
             setPhases([...phases, ...validPhases]);
          }
          setSelectedIndices(new Set());
        } else {
          alert("Invalid file format. Please upload a JSON array of phases.");
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
            <FaProjectDiagram data-ui-icon  className="" />
            KHCRF Project Phases
          </h1>
          <p className="text-gray-500">
            Manage implementation phases for the KHCRF project page
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
            title="Upload JSON file to bulk add phases"
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

      {phases.length > 0 && (
        <div className="mb-4 flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleAll}
              className="flex items-center gap-2 text-gray-700 hover:text-brand-primary font-bold"
            >
              {selectedIndices.size === phases.length ? (
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

      <div className="space-y-8">
        {phases.map((phase, index) => (
          <div
            key={index}
            className={`bg-white rounded-2xl p-6 shadow-sm border ${selectedIndices.has(index) ? "border-brand-primary ring-1 ring-brand-primary/20" : "border-gray-100"} relative transition-all`}
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
                  Phase {index + 1}
                </h3>
              </div>
              <button
                onClick={() => removePhase(index)}
                className="text-red-500 hover:text-red-700 p-2"
                title="Remove Phase"
              >
                <FaTrash />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-6">
              <Input
                label="Phase Title"
                value={phase.title}
                onChange={(e) =>
                  handlePhaseChange(index, "title", e.target.value)
                }
                placeholder="e.g. Phase 1: Research & Documentation"
              />
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Purpose
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg border border-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all"
                  rows={2}
                  value={phase.purpose}
                  onChange={(e) =>
                    handlePhaseChange(index, "purpose", e.target.value)
                  }
                  placeholder="Brief description of the phase goal"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Activities */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-sm uppercase text-gray-500">
                    Activities
                  </h4>
                  <button
                    onClick={() => addArrayItem(index, "activities")}
                    className="text-icon-on-light hover:bg-brand-primary/10 p-1 rounded"
                  >
                    <FaPlus size={12} />
                  </button>
                </div>
                <div className="space-y-2">
                  {phase.details?.activities?.map((item, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        className="flex-1 px-3 py-2 text-sm rounded border border-gray-300 focus:border-brand-primary outline-none"
                        value={item}
                        onChange={(e) =>
                          handleArrayChange(
                            index,
                            "activities",
                            i,
                            e.target.value,
                          )
                        }
                      />
                      <button
                        onClick={() => removeArrayItem(index, "activities", i)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outputs */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-sm uppercase text-gray-500">
                    Outputs
                  </h4>
                  <button
                    onClick={() => addArrayItem(index, "outputs")}
                    className="text-icon-on-light hover:bg-brand-primary/10 p-1 rounded"
                  >
                    <FaPlus size={12} />
                  </button>
                </div>
                <div className="space-y-2">
                  {phase.details?.outputs?.map((item, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        className="flex-1 px-3 py-2 text-sm rounded border border-gray-300 focus:border-brand-primary outline-none"
                        value={item}
                        onChange={(e) =>
                          handleArrayChange(index, "outputs", i, e.target.value)
                        }
                      />
                      <button
                        onClick={() => removeArrayItem(index, "outputs", i)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stakeholders */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-sm uppercase text-gray-500">
                    Stakeholders
                  </h4>
                  <button
                    onClick={() => addArrayItem(index, "stakeholders")}
                    className="text-icon-on-light hover:bg-brand-primary/10 p-1 rounded"
                  >
                    <FaPlus size={12} />
                  </button>
                </div>
                <div className="space-y-2">
                  {phase.details?.stakeholders?.map((item, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        className="flex-1 px-3 py-2 text-sm rounded border border-gray-300 focus:border-brand-primary outline-none"
                        value={item}
                        onChange={(e) =>
                          handleArrayChange(
                            index,
                            "stakeholders",
                            i,
                            e.target.value,
                          )
                        }
                      />
                      <button
                        onClick={() =>
                          removeArrayItem(index, "stakeholders", i)
                        }
                        className="text-red-400 hover:text-red-600"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addPhase}
        className="mt-8 w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 font-bold hover:border-brand-primary hover:text-brand-primary transition-colors flex items-center justify-center gap-2"
      >
        <FaPlus /> Add New Phase
      </button>
    </div>
  );
}
