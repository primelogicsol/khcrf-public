"use client";

import { useState } from "react";
import Link from "next/link";
import { FaArrowLeft, FaPalette, FaImage, FaCheck } from "react-icons/fa";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";

export default function CoverTemplatesPage() {
  const [logoPath, setLogoPath] = useState("/assets/images/HCRF_LOGO_1.png");
  const [accentColor, setAccentColor] = useState("#4A3E3D");
  const [selectedTemplate, setSelectedTemplate] = useState("scholarly");

  const templates = [
    { id: "scholarly", label: "Scholarly Monograph", description: "Minimalist header block with centered logo, serif typography, and primary color accents." },
    { id: "institutional", label: "Institutional Paper", description: "Structured multi-column metadata, left-aligned logo, bold sans headings, and light grey background." },
    { id: "press", label: "Foundation Press", description: "Immersive background cover image overlay, white typography, and brown/gold brand accent details." },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-stone-200 pb-6">
        <Link
          href="/dashboard/business/publications"
          className="p-2 text-stone-500 hover:bg-stone-50 rounded-xl transition-all"
        >
          <FaArrowLeft />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Cover Template Manager</h1>
          <p className="text-stone-500 text-sm">Design cover layout templates for public catalog cards and reader intros.</p>
          <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex gap-2">
            <strong>Notice:</strong> Template preferences are currently stored locally in this browser and are not synchronized across administrator accounts or devices. Server persistence is pending.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customization controls */}
        <div className="lg:col-span-1 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="font-bold text-stone-850 border-b border-stone-100 pb-3 flex items-center gap-2">
            <FaPalette data-ui-icon  className="" /> Template Customizer
          </h3>
          <div className="space-y-4">
            <Select
              label="Default Template Style"
              name="template"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              options={templates.map((t) => ({ value: t.id, label: t.label }))}
            />
            <Input
              label="Branding Logo Path"
              name="logoPath"
              value={logoPath}
              onChange={(e) => setLogoPath(e.target.value)}
            />
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 block">Accent Accent Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-10 w-10 border border-stone-200 rounded-lg shrink-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview canvas */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-bold text-stone-850 flex items-center gap-2">
            <FaImage data-ui-icon  className="" /> Cover Template Renders
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map((tpl) => {
              const isSelected = selectedTemplate === tpl.id;
              return (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl.id)}
                  className={`bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer relative ${
                    isSelected ? "border-brand-primary ring-2 ring-brand-primary/10" : "border-stone-200"
                  }`}
                >
                  {/* Miniature Cover Preview Box */}
                  <div className="h-44 bg-stone-50 border-b border-stone-100 flex flex-col p-4 justify-between relative overflow-hidden">
                    {tpl.id === "scholarly" && (
                      <div className="flex flex-col items-center justify-between h-full text-center">
                        <img src={logoPath} alt="" className="h-6 object-contain" />
                        <div>
                          <span className="block text-[8px] font-black uppercase tracking-widest text-stone-400">Heritage Series</span>
                          <span className="block text-[10px] font-serif font-black text-stone-800 leading-tight mt-1">Pricing Trends in Kashmir Crafts</span>
                        </div>
                        <div className="w-8 h-0.5" style={{ backgroundColor: accentColor }}></div>
                      </div>
                    )}

                    {tpl.id === "institutional" && (
                      <div className="flex flex-col items-start justify-between h-full">
                        <div className="flex justify-between items-start w-full">
                          <img src={logoPath} alt="" className="h-5 object-contain" />
                          <span className="text-[7px] font-bold text-stone-500 border border-stone-200 px-1.5 py-0.5 rounded-full">ISSN 481-9</span>
                        </div>
                        <div>
                          <span className="block text-[8px] font-bold text-stone-400">RESEARCH BRIEF</span>
                          <span className="block text-[10px] font-bold text-stone-800 leading-tight mt-1">GI Authentication Registries & Trust</span>
                        </div>
                        <div className="w-full h-1" style={{ backgroundColor: accentColor }}></div>
                      </div>
                    )}

                    {tpl.id === "press" && (
                      <div className="flex flex-col justify-end h-full text-white p-3 absolute inset-0 bg-stone-800" style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.1))` }}>
                        <div className="flex justify-between items-center w-full mb-4">
                          <img src={logoPath} alt="" className="h-5 object-contain brightness-0 invert" />
                        </div>
                        <div>
                          <span className="block text-[7px] uppercase tracking-wider text-amber-400 font-bold">Hamadan Crafts revival</span>
                          <span className="block text-[9px] font-serif font-bold leading-tight mt-0.5">Artisan Compensation Index Reports</span>
                        </div>
                      </div>
                    )}

                    {isSelected && (
                      <span className="absolute top-2 right-2 bg-brand-primary text-white p-1 rounded-full text-[8px]">
                        <FaCheck />
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-1">
                    <h4 className="font-bold text-xs text-stone-800">{tpl.label}</h4>
                    <p className="text-[10px] text-stone-500 leading-relaxed">{tpl.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


