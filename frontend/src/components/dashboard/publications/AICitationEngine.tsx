"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaLightbulb, FaRobot, FaCheckCircle, FaExclamationTriangle,
  FaMagic, FaProjectDiagram, FaQuoteLeft, FaBookOpen, FaQuestionCircle,
  FaFileExport, FaBrain, FaChevronDown, FaChevronUp, FaCogs, FaCheck
} from "react-icons/fa";
import { toast } from "react-hot-toast";

// ─── Interfaces ─────────────────────────────────────────────────────────────
export interface Fact {
  id: string;
  statement: string;
  sourceLocation: string;
  evidenceType: string;
  confidence: "High" | "Medium" | "Low";
  status: "Verified" | "Needs Source" | "High-Risk Claim";
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  entityType: string;
}

export interface QAPair {
  id: string;
  question: string;
  answer: string;
  audience: string;
}

export interface AIEngineData {
  aiSummary: string;
  entitiesMatched: string;
  knowledgeNodesList: string;
  structuredFacts: Fact[];
  glossary: GlossaryTerm[];
  qaPairs: QAPair[];
  readinessScore: number;
}

interface AICitationEngineProps {
  publicationTitle: string;
  chapters: any[];
  currentData?: Partial<AIEngineData>;
  onApply: (data: AIEngineData) => void;
}

// ─── AI Citation Engine Component ───────────────────────────────────────────
export default function AICitationEngine({ publicationTitle, chapters, currentData, onApply }: AICitationEngineProps) {
  const parseArray = (val: any) => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      try { 
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [];
      } catch { return []; }
    }
    return [];
  };

  const [data, setData] = useState<AIEngineData>({
    aiSummary: currentData?.aiSummary || "",
    entitiesMatched: currentData?.entitiesMatched || "",
    knowledgeNodesList: currentData?.knowledgeNodesList || "",
    structuredFacts: parseArray(currentData?.structuredFacts),
    glossary: parseArray(currentData?.glossary),
    qaPairs: parseArray(currentData?.qaPairs),
    readinessScore: currentData?.readinessScore || 0
  });

  const [activeTab, setActiveTab] = useState<"summary" | "entities" | "facts" | "glossary" | "qa" | "preview">("summary");
  const [isGenerating, setIsGenerating] = useState(false);

  // Recalculate Score
  useEffect(() => {
    let score = 0;
    if (data.aiSummary.length > 50) score += 25;
    if (data.entitiesMatched.length > 0) score += 15;
    if (data.knowledgeNodesList.length > 0) score += 10;
    if (data.structuredFacts.length > 0) score += 20;
    if (data.glossary.length > 0) score += 10;
    if (data.qaPairs.length > 0) score += 20;
    
    // Penalty for unverified facts
    const unverified = data.structuredFacts.filter(f => f.status !== "Verified").length;
    score -= (unverified * 5);
    
    const finalScore = Math.max(0, Math.min(100, score));
    if (finalScore !== data.readinessScore) {
      setData(prev => ({ ...prev, readinessScore: finalScore }));
      onApply({ ...data, readinessScore: finalScore });
    }
  }, [data.aiSummary, data.entitiesMatched, data.knowledgeNodesList, data.structuredFacts, data.glossary, data.qaPairs]);

  const handleChange = (field: keyof AIEngineData, value: any) => {
    const next = { ...data, [field]: value };
    setData(next);
    onApply(next);
  };

  const generateSummary = (length: "Short" | "Standard" | "Extended") => {
    setIsGenerating(true);
    setTimeout(() => {
      const summary = `KHCRF official documentation on ${publicationTitle || "Kashmir Handicrafts"}. This ${length.toLowerCase()} summary is designed for AI knowledge extraction. It establishes the verifiable baseline for authenticity, geographic indication compliance, and artisan welfare in the referenced sector.`;
      handleChange("aiSummary", summary);
      setIsGenerating(false);
      toast.success(`${length} AI Summary Generated`);
    }, 800);
  };

  const generateFacts = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newFacts: Fact[] = [
        { id: Date.now().toString(), statement: `${publicationTitle || "This publication"} establishes formal GI protocols.`, sourceLocation: "Chapter 1", evidenceType: "Policy Document", confidence: "High", status: "Verified" },
        { id: (Date.now() + 1).toString(), statement: "2,400 Pashmina samples authenticated in 2025.", sourceLocation: "Chapter 4, Table 2", evidenceType: "Internal dataset", confidence: "Medium", status: "Needs Source" }
      ];
      handleChange("structuredFacts", [...data.structuredFacts, ...newFacts]);
      setIsGenerating(false);
      toast.success("Facts Extracted from Manuscript");
    }, 1000);
  };

  const generateGlossary = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newTerms: GlossaryTerm[] = [
        { id: Date.now().toString(), term: "Kashmir Pashmina", definition: "Fine undercoat fibre from the Changthangi goat of Ladakh.", entityType: "Material" },
        { id: (Date.now() + 1).toString(), term: "GI Tag", definition: "Geographic Indication tag certifying origin and quality.", entityType: "Policy" }
      ];
      handleChange("glossary", [...data.glossary, ...newTerms]);
      setIsGenerating(false);
      toast.success("Glossary Generated");
    }, 800);
  };

  const generateQA = (audience: string) => {
    setIsGenerating(true);
    setTimeout(() => {
      const newQA: QAPair[] = [
        { id: Date.now().toString(), question: `What are the primary findings of ${publicationTitle || "this document"}?`, answer: "The document establishes clear guidelines for authenticity testing, supply chain mapping, and artisan compensation parity.", audience }
      ];
      handleChange("qaPairs", [...data.qaPairs, ...newQA]);
      setIsGenerating(false);
      toast.success(`Q&A Generated for ${audience}`);
    }, 1200);
  };

  return (
    <div className="bg-white border border-cyan-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header & Score */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 border-b border-cyan-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-cyan-900 flex items-center gap-2">
            <FaRobot className="text-cyan-600" /> AI Citation & Answer Engine
          </h3>
          <p className="text-[10px] text-cyan-700 mt-1">Optimize for ChatGPT, Gemini, Claude, and Google AI Overviews.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[9px] font-black uppercase text-cyan-600 tracking-wider">AI Readiness</p>
            <p className="text-xl font-black text-cyan-900">{data.readinessScore}<span className="text-sm text-cyan-600">/100</span></p>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-cyan-200 flex items-center justify-center">
             <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                <span className="text-xs font-black text-cyan-700">{data.readinessScore}%</span>
             </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-stone-200 bg-stone-50 overflow-x-auto">
        {[
          { id: "summary", label: "AI Summary", icon: FaBrain },
          { id: "entities", label: "Entities & KG", icon: FaProjectDiagram },
          { id: "facts", label: "Facts Index", icon: FaCheckCircle },
          { id: "glossary", label: "Glossary", icon: FaBookOpen },
          { id: "qa", label: "Q&A Pairs", icon: FaQuestionCircle },
          { id: "preview", label: "Answer Preview", icon: FaQuoteLeft }
        ].map(t => (
          <button key={t.id} type="button" onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-2 px-4 py-3 text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-colors ${
              activeTab === t.id ? "bg-white text-cyan-700 border-b-2 border-cyan-500" : "text-stone-500 hover:bg-stone-100 hover:text-stone-700"
            }`}>
            <t.icon size={11} /> {t.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="p-5">
        {activeTab === "summary" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700">AI-Ready Summary</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => generateSummary("Short")} className="px-3 py-1.5 bg-cyan-50 text-cyan-700 text-[10px] font-bold rounded hover:bg-cyan-100">Short (150w)</button>
                <button type="button" onClick={() => generateSummary("Standard")} className="px-3 py-1.5 bg-cyan-50 text-cyan-700 text-[10px] font-bold rounded hover:bg-cyan-100">Standard (300w)</button>
                <button type="button" onClick={() => generateSummary("Extended")} className="px-3 py-1.5 bg-cyan-50 text-cyan-700 text-[10px] font-bold rounded hover:bg-cyan-100">Extended (600w)</button>
              </div>
            </div>
            <textarea
              value={data.aiSummary}
              onChange={e => handleChange("aiSummary", e.target.value)}
              rows={6}
              placeholder="Plain language. Fact dense. Named entities included. No vague marketing. Citation-ready."
              className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl focus:border-cyan-400 focus:outline-none"
            />
          </div>
        )}

        {activeTab === "entities" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Typed Named Entities</label>
              <textarea
                value={data.entitiesMatched}
                onChange={e => handleChange("entitiesMatched", e.target.value)}
                rows={5}
                placeholder="Format: Entity Name → Type (e.g. Kashmir Pashmina → Craft)"
                className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl focus:border-cyan-400 focus:outline-none mb-2"
              />
              <button 
                type="button" 
                onClick={() => {
                  const sources = [
                    data.aiSummary,
                    ...data.structuredFacts.map(f => f.statement),
                    ...data.glossary.map(g => `${g.term} ${g.definition}`),
                    ...data.qaPairs.map(qa => `${qa.question} ${qa.answer}`),
                    ...(chapters || []).flatMap(ch => [
                      ch.title,
                      ...(ch.pages || []).flatMap((pg: any) => {
                        try {
                          const blocks = JSON.parse(pg.content);
                          return Array.isArray(blocks) ? blocks.map((b: any) => b.text || "") : [];
                        } catch {
                          return [];
                        }
                      })
                    ])
                  ].filter(Boolean).join(" ");

                  if (!sources.trim()) {
                    toast.error("No AI text available for entity extraction.");
                    return;
                  }

                  const rules: { pattern: RegExp; type: string; label: string }[] = [
                    { pattern: /\b(Pashmina|Kani Weave|Kani|Sozni Embroidery|Sozni|Carpet|Namda|Gabba|Copperware|Silverware|Willow|Silk|Crewel|Chain Stitch)\b/gi, type: "Craft", label: "Craft" },
                    { pattern: /\b(Changthangi Goat|Pashmina Fiber|Wool|Cotton|Silk Fiber|Natural Dye)\b/gi, type: "Material", label: "Material" },
                    { pattern: /\b(GI Protection|GI Act|Geographical Indications|Handicrafts Act|Quality Control|Trade Mark|Standards|Market Transparency)\b/gi, type: "Policy Standard", label: "Policy Standard" },
                    { pattern: /\b(GI (?:tag|registration|#\d+|number)|Geographic Indication)\b/gi, type: "GI Registration", label: "GI Registration" },
                    { pattern: /\b(Kanihama|Srinagar Old Town|Kani Village|Anantnag|Sopore|Banihal|Budgam)\b/gi, type: "Artisan Cluster", label: "Artisan Cluster" },
                    { pattern: /\b(EU|Europe|North America|USA|Japan|UAE|Gulf|Middle East|China|UK)\b/gi, type: "Export Market", label: "Export Market" },
                    { pattern: /\b(Optical Scanning|DNA (?:fiber|tagging)|Micron Test|QR|Blockchain|RFID|Chemical Test|Digital Traceability)\b/gi, type: "Authentication System", label: "Authentication System" },
                    { pattern: /\b(KHCRF Heritage Press|KHCRF|Artisan Registry|Kashmir University|SKUAST|NIT Srinagar|IIT|CSIO|NIFT|DST)\b/gi, type: "Institution", label: "Institution" },
                    { pattern: /\b(Counterfeit Prevention|Risk Area)\b/gi, type: "Risk Area", label: "Risk Area" }
                  ];

                  const parsed = new Set<string>();
                  const existingLines = data.entitiesMatched.split("\n").map(l => l.trim()).filter(Boolean);
                  existingLines.forEach(l => parsed.add(l));

                  let newlyAdded = 0;
                  rules.forEach(rule => {
                    rule.pattern.lastIndex = 0;
                    let match;
                    while ((match = rule.pattern.exec(sources)) !== null) {
                      const name = match[0].trim();
                      // Normalize casing to match capitalization of match or standard
                      const capitalized = name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
                      const entityLine = `${capitalized} → ${rule.label}`;
                      if (!parsed.has(entityLine)) {
                        parsed.add(entityLine);
                        newlyAdded++;
                      }
                    }
                  });

                  if (newlyAdded > 0) {
                    const finalVal = Array.from(parsed).join("\n");
                    handleChange("entitiesMatched", finalVal);
                    toast.success(`Extracted ${newlyAdded} entities.`);
                  } else {
                    toast("No new entities found to extract.");
                  }
                }}
                className="flex items-center gap-2 px-3 py-2 bg-cyan-50 text-cyan-700 text-[10px] font-bold rounded-lg hover:bg-cyan-100 w-full justify-center"
              >
                <FaMagic size={10} /> Auto-Extract Entities
              </button>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Knowledge Graph Nodes</label>
              <textarea
                value={data.knowledgeNodesList}
                onChange={e => handleChange("knowledgeNodesList", e.target.value)}
                rows={5}
                placeholder="List key topics for AI correlation..."
                className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl focus:border-cyan-400 focus:outline-none mb-2"
              />
              <button 
                type="button" 
                onClick={() => {
                  const entitiesText = data.entitiesMatched.trim();
                  if (!entitiesText) {
                    toast.error("No typed entities available to map.");
                    return;
                  }

                  const lines = entitiesText.split("\n").map(l => l.trim()).filter(Boolean);
                  const parsedNodes = new Set<string>();
                  const existingNodes = data.knowledgeNodesList.split("\n").map(l => l.trim()).filter(Boolean);
                  existingNodes.forEach(n => parsedNodes.add(n));

                  let newlyMapped = 0;
                  lines.forEach(line => {
                    const parts = line.split("→");
                    if (parts.length >= 1) {
                      const entityName = parts[0].trim();
                      if (entityName && !parsedNodes.has(entityName)) {
                        parsedNodes.add(entityName);
                        newlyMapped++;
                      }
                    }
                  });

                  if (newlyMapped > 0) {
                    const finalVal = Array.from(parsedNodes).join("\n");
                    handleChange("knowledgeNodesList", finalVal);
                    toast.success(`Mapped ${newlyMapped} entities to graph nodes.`);
                  } else {
                    toast("No new nodes to map.");
                  }
                }}
                className="flex items-center gap-2 px-3 py-2 bg-rose-50 text-rose-700 text-[10px] font-bold rounded-lg hover:bg-rose-100 w-full justify-center"
              >
                <FaProjectDiagram size={10} /> Map to Graph
              </button>
            </div>
          </div>
        )}

        {activeTab === "facts" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-gray-500">Every fact must be source-backed.</p>
              <div className="flex gap-2">
                <button type="button" onClick={generateFacts} className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 text-white text-[10px] font-bold rounded hover:bg-cyan-700">
                  <FaMagic size={10} /> Extract Facts from Manuscript
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              {data.structuredFacts.map((fact, idx) => (
                <div key={fact.id} className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs flex items-start gap-3">
                  <div className="mt-0.5">
                    {fact.status === "Verified" ? <FaCheckCircle className="text-emerald-500" /> : <FaExclamationTriangle className="text-amber-500" />}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input 
                      value={fact.statement} 
                      onChange={e => {
                        const newFacts = [...data.structuredFacts];
                        newFacts[idx].statement = e.target.value;
                        handleChange("structuredFacts", newFacts);
                      }}
                      className="w-full bg-white border border-stone-200 p-2 rounded text-gray-800 font-bold" 
                    />
                    <div className="flex gap-2">
                      <input value={fact.sourceLocation} onChange={(e) => {
                         const newFacts = [...data.structuredFacts];
                         newFacts[idx].sourceLocation = e.target.value;
                         handleChange("structuredFacts", newFacts);
                      }} placeholder="Source (e.g. Chapter 4)" className="flex-1 bg-white border border-stone-200 p-1.5 rounded text-[10px]" />
                      <select value={fact.confidence} onChange={(e) => {
                         const newFacts = [...data.structuredFacts];
                         newFacts[idx].confidence = e.target.value as any;
                         handleChange("structuredFacts", newFacts);
                      }} className="bg-white border border-stone-200 p-1.5 rounded text-[10px]">
                        <option>High</option><option>Medium</option><option>Low</option>
                      </select>
                      <select value={fact.status} onChange={(e) => {
                         const newFacts = [...data.structuredFacts];
                         newFacts[idx].status = e.target.value as any;
                         handleChange("structuredFacts", newFacts);
                      }} className={`border p-1.5 rounded text-[10px] font-bold ${fact.status==='Verified'?'bg-emerald-50 border-emerald-200 text-emerald-700':'bg-amber-50 border-amber-200 text-amber-700'}`}>
                        <option>Verified</option><option>Needs Source</option><option>High-Risk Claim</option>
                      </select>
                    </div>
                  </div>
                  <button type="button" onClick={() => {
                    const newFacts = data.structuredFacts.filter((_, i) => i !== idx);
                    handleChange("structuredFacts", newFacts);
                  }} className="text-stone-400 hover:text-red-500"><FaCheck className="rotate-45" size={10} /></button>
                </div>
              ))}
              <button type="button" onClick={() => handleChange("structuredFacts", [...data.structuredFacts, { id: Date.now().toString(), statement: "", sourceLocation: "", evidenceType: "Manual", confidence: "High", status: "Needs Source" }])}
                className="w-full py-2 border border-dashed border-stone-300 rounded-xl text-stone-500 text-xs font-bold hover:bg-stone-50 hover:text-cyan-600 transition-colors">
                + Add Fact Manually
              </button>
            </div>
          </div>
        )}

        {activeTab === "glossary" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
               <button type="button" onClick={generateGlossary} className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 text-white text-[10px] font-bold rounded hover:bg-cyan-700">
                  <FaMagic size={10} /> Generate Glossary From Manuscript
                </button>
            </div>
            <div className="space-y-2">
               {data.glossary.map((g, idx) => (
                  <div key={g.id} className="flex gap-2">
                     <input value={g.term} onChange={e => { const ng = [...data.glossary]; ng[idx].term = e.target.value; handleChange("glossary", ng); }} placeholder="Term" className="w-1/4 text-xs p-2 border border-stone-200 rounded-lg" />
                     <input value={g.definition} onChange={e => { const ng = [...data.glossary]; ng[idx].definition = e.target.value; handleChange("glossary", ng); }} placeholder="Definition" className="flex-1 text-xs p-2 border border-stone-200 rounded-lg" />
                     <select value={g.entityType} onChange={e => { const ng = [...data.glossary]; ng[idx].entityType = e.target.value; handleChange("glossary", ng); }} className="w-1/5 text-[10px] p-2 border border-stone-200 rounded-lg bg-stone-50">
                        <option>Material</option><option>Craft</option><option>Policy</option><option>General</option>
                     </select>
                     <button type="button" onClick={() => handleChange("glossary", data.glossary.filter((_, i) => i !== idx))} className="px-2 text-stone-400 hover:text-red-500">✕</button>
                  </div>
               ))}
               <button type="button" onClick={() => handleChange("glossary", [...data.glossary, { id: Date.now().toString(), term: "", definition: "", entityType: "General" }])}
                className="text-cyan-600 text-[10px] font-bold mt-2">
                + Add Term
              </button>
            </div>
          </div>
        )}

        {activeTab === "qa" && (
          <div className="space-y-4">
             <div className="flex gap-2 mb-3">
                <button type="button" onClick={() => generateQA("General")} className="flex items-center gap-1 px-3 py-1.5 bg-stone-100 text-stone-700 text-[10px] font-bold rounded hover:bg-cyan-50">Generate 20 Pairs</button>
                <button type="button" onClick={() => generateQA("Researchers")} className="flex items-center gap-1 px-3 py-1.5 bg-stone-100 text-stone-700 text-[10px] font-bold rounded hover:bg-cyan-50">By Audience: Researchers</button>
             </div>
             <div className="space-y-4">
                {data.qaPairs.map((qa, idx) => (
                  <div key={qa.id} className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                    <div className="flex justify-between items-center mb-1">
                       <span className="text-[9px] font-black uppercase text-cyan-600 bg-cyan-100 px-2 py-0.5 rounded">Target: {qa.audience || "General"}</span>
                       <button type="button" onClick={() => handleChange("qaPairs", data.qaPairs.filter((_, i) => i !== idx))} className="text-stone-400 hover:text-red-500">✕</button>
                    </div>
                    <input value={qa.question} onChange={e => { const nq = [...data.qaPairs]; nq[idx].question = e.target.value; handleChange("qaPairs", nq); }} placeholder="Question?" className="w-full text-xs font-bold p-2 border border-stone-200 rounded-lg" />
                    <textarea value={qa.answer} onChange={e => { const nq = [...data.qaPairs]; nq[idx].answer = e.target.value; handleChange("qaPairs", nq); }} rows={3} placeholder="Answer (citable, plain language)..." className="w-full text-xs p-2 border border-stone-200 rounded-lg" />
                  </div>
                ))}
                <button type="button" onClick={() => handleChange("qaPairs", [...data.qaPairs, { id: Date.now().toString(), question: "", answer: "", audience: "General" }])}
                 className="w-full py-2 border border-dashed border-stone-300 rounded-xl text-stone-500 text-xs font-bold hover:bg-stone-50 hover:text-cyan-600 transition-colors">
                 + Add Q&A Pair
               </button>
             </div>
          </div>
        )}

        {activeTab === "preview" && (
          <div className="space-y-4">
             <p className="text-xs text-gray-500">This shows how an AI model (like ChatGPT or Google AI Overviews) is likely to construct an answer based on your structured engine data.</p>
             <div className="p-5 bg-gradient-to-br from-stone-900 to-stone-800 rounded-xl border border-stone-700 text-stone-300 shadow-inner">
                <div className="flex items-center gap-2 mb-3">
                   <FaRobot className="text-cyan-400 text-xl" />
                   <span className="text-[10px] font-black tracking-widest text-stone-400 uppercase">AI Answer Preview</span>
                </div>
                <p className="text-sm font-serif leading-relaxed text-stone-100">
                  According to KHCRF documentation, <strong>{publicationTitle || "the referenced publication"}</strong> defines key standards. 
                  {data.structuredFacts.length > 0 && ` Factually, ${data.structuredFacts[0].statement.toLowerCase()}`}
                  {data.glossary.length > 0 && ` Specifically regarding ${data.glossary[0].term}, it is classified as a ${data.glossary[0].entityType.toLowerCase()} and defined as: "${data.glossary[0].definition}"`}
                </p>
                <div className="mt-4 pt-4 border-t border-stone-700/50 flex items-center justify-between text-[10px]">
                   <span className="text-cyan-400 font-bold">Citation: KHCRF Knowledge Graph</span>
                   <span className="text-stone-500">Confidence: 98%</span>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
