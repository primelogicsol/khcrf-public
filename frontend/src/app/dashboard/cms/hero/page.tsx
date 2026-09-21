"use client";

import { useState, useEffect, useRef } from "react";
import { cmsApi } from "@/lib/api";
import { FaPlus, FaTrash, FaSave, FaImages, FaCheckSquare, FaRegSquare, FaUpload } from "react-icons/fa";
import Input from "@/components/common/Input";
import ImageUpload from "@/components/common/ImageUpload";

interface HeroSlide {
  title: string;
  text: string;
  bg: string;
  btnText: string;
  btnLink: string;
}

const DEFAULT_SLIDE: HeroSlide = {
  title: "",
  text: "",
  bg: "",
  btnText: "Discover More",
  btnLink: "/",
};

export default function HeroCMS() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const data = await cmsApi.getContent("hero-carousel");
      if (data && data.content) {
        setSlides(data.content);
      } else {
        setSlides([{ ...DEFAULT_SLIDE }]);
      }
    } catch (error) {
      setSlides([{ ...DEFAULT_SLIDE }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSlideChange = (
    index: number,
    field: keyof HeroSlide,
    value: any,
  ) => {
    const newSlides = [...slides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setSlides(newSlides);
  };

  const addSlide = () => {
    setSlides([...slides, { ...DEFAULT_SLIDE }]);
  };

  const removeSlide = (index: number) => {
    if (confirm("Are you sure you want to remove this slide?")) {
      const newSlides = [...slides];
      newSlides.splice(index, 1);
      setSlides(newSlides);
      
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
    if (selectedIndices.size === slides.length && slides.length > 0) {
      setSelectedIndices(new Set());
    } else {
      setSelectedIndices(new Set(slides.map((_, i) => i)));
    }
  };

  const removeSelected = () => {
    if (selectedIndices.size === 0) return;
    if (confirm(`Are you sure you want to remove ${selectedIndices.size} slide(s)?`)) {
      const newSlides = slides.filter((_, index) => !selectedIndices.has(index));
      setSlides(newSlides);
      setSelectedIndices(new Set());
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await cmsApi.updateContent("hero-carousel", {
        title: "Home Hero Carousel",
        content: slides,
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
            text: p.text || "",
            bg: p.bg || "",
            btnText: p.btnText || "Discover More",
            btnLink: p.btnLink || "/"
          }));
          
          if (confirm(`Found ${validItems.length} items. Do you want to REPLACE existing items (OK) or APPEND them (Cancel)?`)) {
             setSlides(validItems);
          } else {
             setSlides([...slides, ...validItems]);
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
            <FaImages data-ui-icon  className="" />
            Home Hero Carousel
          </h1>
          <p className="text-gray-500">
            Manage slides displayed on the Home page hero section
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
            title="Upload JSON file to bulk add slides"
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

      {slides.length > 0 && (
        <div className="mb-4 flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleAll}
              className="flex items-center gap-2 text-gray-700 hover:text-brand-primary font-bold"
            >
              {selectedIndices.size === slides.length ? (
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
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`bg-white rounded-2xl p-6 shadow-sm border ${selectedIndices.has(index) ? "border-brand-primary ring-1 ring-brand-primary/20" : "border-gray-100"} relative group transition-all`}
          >
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
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
                <h3 className="font-bold text-lg text-gray-700">
                  Slide {index + 1}
                </h3>
              </div>
              <button
                onClick={() => removeSlide(index)}
                className="text-gray-300 hover:text-red-500 transition-colors"
                title="Remove Slide"
              >
                <FaTrash />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Input
                  label="Title"
                  value={slide.title}
                  onChange={(e) =>
                    handleSlideChange(index, "title", e.target.value)
                  }
                  placeholder="Slide Title"
                />

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Subtitle / Text
                  </label>
                  <textarea
                    className="w-full px-4 py-3 rounded-lg border border-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all"
                    rows={3}
                    value={slide.text}
                    onChange={(e) =>
                      handleSlideChange(index, "text", e.target.value)
                    }
                    placeholder="Slide text content..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Button Text"
                    value={slide.btnText}
                    onChange={(e) =>
                      handleSlideChange(index, "btnText", e.target.value)
                    }
                    placeholder="e.g. Discover More"
                  />
                  <Input
                    label="Button Link"
                    value={slide.btnLink}
                    onChange={(e) =>
                      handleSlideChange(index, "btnLink", e.target.value)
                    }
                    placeholder="e.g. /about/mission"
                  />
                </div>
              </div>

              <div>
                {/* Background image selection has been removed per global design constraint */}
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addSlide}
          className="w-full rounded-2xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-brand-primary hover:text-brand-primary transition-colors py-8 gap-2 font-bold flex items-center justify-center bg-gray-50/50 hover:bg-brand-primary/5"
        >
          <FaPlus />
          Add New Slide
        </button>
      </div>
    </div>
  );
}
