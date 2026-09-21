"use client";

import { useState, useEffect, useRef } from "react";
import { cmsApi } from "@/lib/api";
import { FaPlus, FaTrash, FaSave, FaCertificate, FaCheckSquare, FaRegSquare, FaUpload } from "react-icons/fa";
import Input from "@/components/common/Input";
import ImageUpload from "@/components/common/ImageUpload";

interface Certificate {
  title: string;
  image: string;
  description: string;
}

const DEFAULT_CERTIFICATE: Certificate = {
  title: "",
  image: "",
  description: "",
};

export default function AccreditationsCMS() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const data = await cmsApi.getContent("accreditation-certificates");
      if (data && data.content) {
        setCertificates(data.content);
      } else {
        setCertificates([{ ...DEFAULT_CERTIFICATE }]);
      }
    } catch (error) {
      setCertificates([{ ...DEFAULT_CERTIFICATE }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCertificateChange = (
    index: number,
    field: keyof Certificate,
    value: any,
  ) => {
    const newCertificates = [...certificates];
    newCertificates[index] = { ...newCertificates[index], [field]: value };
    setCertificates(newCertificates);
  };

  const addCertificate = () => {
    setCertificates([...certificates, { ...DEFAULT_CERTIFICATE }]);
  };

  const removeCertificate = (index: number) => {
    if (confirm("Are you sure you want to remove this certificate?")) {
      const newCertificates = [...certificates];
      newCertificates.splice(index, 1);
      setCertificates(newCertificates);
      
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
    if (selectedIndices.size === certificates.length && certificates.length > 0) {
      setSelectedIndices(new Set());
    } else {
      setSelectedIndices(new Set(certificates.map((_, i) => i)));
    }
  };

  const removeSelected = () => {
    if (selectedIndices.size === 0) return;
    if (confirm(`Are you sure you want to remove ${selectedIndices.size} certificate(s)?`)) {
      const newCertificates = certificates.filter((_, index) => !selectedIndices.has(index));
      setCertificates(newCertificates);
      setSelectedIndices(new Set());
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await cmsApi.updateContent("accreditation-certificates", {
        title: "Accreditation Certificates",
        content: certificates,
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
            image: p.image || "",
            description: p.description || ""
          }));
          
          if (confirm(`Found ${validItems.length} items. Do you want to REPLACE existing items (OK) or APPEND them (Cancel)?`)) {
             setCertificates(validItems);
          } else {
             setCertificates([...certificates, ...validItems]);
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
            <FaCertificate data-ui-icon  className="" />
            Accreditation Certificates
          </h1>
          <p className="text-gray-500">
            Manage certificates displayed on the Accreditation page
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
            title="Upload JSON file to bulk add certificates"
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

      {certificates.length > 0 && (
        <div className="mb-4 flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleAll}
              className="flex items-center gap-2 text-gray-700 hover:text-brand-primary font-bold"
            >
              {selectedIndices.size === certificates.length ? (
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
        {certificates.map((cert, index) => (
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
              onClick={() => removeCertificate(index)}
              className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors z-10"
              title="Remove Certificate"
            >
              <FaTrash />
            </button>

            <div className="space-y-4 pt-4">
              <Input
                label="Certificate Title"
                value={cert.title}
                onChange={(e) =>
                  handleCertificateChange(index, "title", e.target.value)
                }
                placeholder="e.g. ISO 9001"
              />

              <ImageUpload
                label="Certificate Image"
                value={cert.image}
                onChange={(url) => handleCertificateChange(index, "image", url)}
              />

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Description / Alt Text
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg border border-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all"
                  rows={2}
                  value={cert.description}
                  onChange={(e) =>
                    handleCertificateChange(
                      index,
                      "description",
                      e.target.value,
                    )
                  }
                  placeholder="Certificate description..."
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addCertificate}
          className="rounded-2xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-brand-primary hover:text-brand-primary transition-colors flex flex-col items-center justify-center min-h-[300px] gap-4 font-bold"
        >
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
            <FaPlus />
          </div>
          Add New Certificate
        </button>
      </div>
    </div>
  );
}
