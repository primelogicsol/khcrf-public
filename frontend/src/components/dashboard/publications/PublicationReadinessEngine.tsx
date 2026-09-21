"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaRocket, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaDownload,
  FaFilePdf, FaFileWord, FaBookOpen, FaEye, FaSearch, FaShareAlt, FaRobot,
  FaCalendarAlt, FaArchive, FaClipboardCheck, FaSpinner, FaSave, FaCheck
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

interface ReadinessEngineProps {
  formData: any;
  chapters: any[];
  aiScore: number;
  kgNodes?: any[];
  publicationId?: string;
  onSaveDraft: () => void;
  onSubmitReview: () => void;
  onPublishNow: () => void;
  onApprove: (approvedBy: string, version: string, notes: string) => void;
  onSchedule: () => void;
  onArchive: () => void;
  onPreviewBook: () => void;
  onPreviewPublic: () => void;
  onPreviewReader: () => void;
  draftLoading?: boolean;
  publishLoading?: boolean;
}

export default function PublicationReadinessEngine({
  formData,
  chapters,
  aiScore,
  kgNodes = [],
  publicationId,
  onSaveDraft,
  onSubmitReview,
  onPublishNow,
  onApprove,
  onSchedule,
  onArchive,
  onPreviewBook,
  onPreviewPublic,
  onPreviewReader,
  draftLoading,
  publishLoading
}: ReadinessEngineProps) {
  
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showApproval, setShowApproval] = useState(false);

  const [approvedBy, setApprovedBy] = useState(formData.approvedBy || "");
  const [publicationVersion, setPublicationVersion] = useState(formData.publicationVersion || "v1.0");
  const [approvalNotes, setApprovalNotes] = useState(formData.approvalNotes || "All validation checks passed. Approved for public release.");
  
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  // ─── Compute Validation Layers ──────────────────────────────────────────
  const validation = useMemo(() => {
    const layers = {
      metadata: { score: 0, blocks: [] as string[], warns: [] as string[] },
      manuscript: { score: 0, blocks: [] as string[], warns: [] as string[] },
      authority: { score: 0, blocks: [] as string[], warns: [] as string[] },
      kg: { score: 0, blocks: [] as string[], warns: [] as string[] },
      seo: { score: 0, blocks: [] as string[], warns: [] as string[] },
      ai: { score: aiScore, blocks: [] as string[], warns: [] as string[] },
      reader: { score: 0, blocks: [] as string[], warns: [] as string[] }
    };

    // Metadata
    if (formData.title && formData.slug) {
      layers.metadata.score = 100;
    } else {
      layers.metadata.score = 30;
      layers.metadata.blocks.push("Missing Title or Slug");
    }
    if (!formData.publicationBlueprint) layers.metadata.warns.push("No Blueprint Selected");

    // Manuscript
    if (chapters.length === 0) {
      layers.manuscript.blocks.push("No chapters found");
    } else {
      layers.manuscript.score = 60;
      const empty = chapters.filter(c => !c.pages?.[0]?.content || c.pages[0].content === "[]" || c.pages[0].content.length < 10);
      if (empty.length > 0) {
        layers.manuscript.blocks.push(`${empty.length} Empty Chapter(s)`);
      } else {
        layers.manuscript.score = 100;
      }
      if (!chapters.find(c => c.sectionType === "front-matter")) layers.manuscript.warns.push("No Front Matter");
      if (!chapters.find(c => c.sectionType === "back-matter")) layers.manuscript.warns.push("No Back Matter/References");
      
      const placeholderTerms = ["test", "demo", "sample", "placeholder", "draft chapter", "untitled"];
      const placeholders = chapters.filter(c => 
        placeholderTerms.some(term => c.title.toLowerCase().includes(term))
      );
      if (placeholders.length > 0) {
        layers.manuscript.score = Math.max(30, layers.manuscript.score - 25);
        layers.manuscript.blocks.push(`Contains ${placeholders.length} Placeholder Chapter(s)`);
      }

      // Check for duplicate sections
      const titles = chapters.map(c => c.title.toLowerCase().trim());
      const orders = chapters.map(c => c.order);
      const hasDuplicateTitles = titles.some((val, i) => titles.indexOf(val) !== i);
      const hasDuplicateOrders = orders.some((val, i) => orders.indexOf(val) !== i);
      if (hasDuplicateTitles || hasDuplicateOrders) {
        layers.manuscript.score = 0;
        layers.manuscript.blocks.push("Duplicate section structure detected");
      }
    }

    // Authority
    if (formData.craftSector) {
      layers.authority.score = 100;
    } else {
      layers.authority.score = 40;
      layers.authority.warns.push("Primary Craft Sector missing");
    }

    // KG
    if (kgNodes && kgNodes.length > 0) {
      let score = 20;
      if (kgNodes.some((n: any) => n.entityType === 'Craft')) score += 20;
      if (kgNodes.some((n: any) => n.entityType === 'Policy Standard' || n.entityType === 'GI Registration')) score += 20;
      if (kgNodes.some((n: any) => n.entityType === 'Artisan Cluster')) score += 15;
      if (kgNodes.some((n: any) => n.entityType === 'Authentication System')) score += 15;
      if (kgNodes.length >= 8) score += 10;
      layers.kg.score = Math.min(100, score);
      if (layers.kg.score < 100) layers.kg.warns.push("Graph nodes lack diversity");
    } else {
      layers.kg.score = 20;
      layers.kg.warns.push("No Knowledge Graph Nodes linked");
    }

    // SEO
    if (formData.seoTitle && formData.seoDescription) {
      layers.seo.score = 100;
    } else {
      layers.seo.score = 50;
      layers.seo.warns.push("Missing Meta Title or Description");
    }

    // AI
    if (aiScore < 50) layers.ai.warns.push("AI Readiness Score is low");
    if (aiScore === 0) layers.ai.warns.push("AI Agent Optimization not run");

    // Reader
    layers.reader.score = 100; // Assume good defaults

    const overallScore = Math.round(
      (layers.metadata.score + layers.manuscript.score + layers.authority.score + 
       layers.kg.score + layers.seo.score + layers.ai.score + layers.reader.score) / 7
    );

    const totalBlocks = Object.values(layers).flatMap(l => l.blocks);
    const totalWarns = Object.values(layers).flatMap(l => l.warns);

    return { layers, overallScore, totalBlocks, totalWarns };
  }, [formData, chapters, aiScore]);

  const parseContentSafely = (content: any) => {
    if (!content) return [];
    if (Array.isArray(content)) return content;
    if (typeof content === "object") return content.blocks || [content];
    if (typeof content === "string") {
      try {
        const parsed = JSON.parse(content);
        return Array.isArray(parsed) ? parsed : parsed.blocks || [parsed];
      } catch {
        return [{ type: "Paragraph", text: content }];
      }
    }
    return [];
  };

  const blockToText = (block: any): string => {
    if (!block) return "";
    if (typeof block === "string") return block;
    if (block.text) return block.text;
    if (block.content && Array.isArray(block.content)) {
      return block.content.map(blockToText).join(" ");
    }
    return "";
  };

  const hasManuscriptContent = () => {
    if (!chapters || chapters.length === 0) return false;
    for (const chapter of chapters) {
      if (chapter.pages?.[0]?.content && chapter.pages[0].content !== "[]") {
        return true;
      }
    }
    return false;
  };

  const effectivePublicationId = publicationId || formData?.id;

  const handleExportPDF = () => {
    if (!effectivePublicationId) {
      toast.error("Save Draft first to enable PDF export");
      return;
    }
    if (!hasManuscriptContent()) {
      toast.error("Cannot export: no manuscript content found.");
      return;
    }
    
    toast.loading("Generating PDF...", { id: "pdf-export" });
    try {
      const doc = new jsPDF();
      let yPos = 20;
      
      // Front Matter & Metadata
      doc.setFontSize(22);
      doc.text(formData.title || "Untitled Book", 20, yPos);
      yPos += 15;
      
      doc.setFontSize(12);
      doc.text(`Status: ${formData.publishedStatus || "DRAFT"}`, 20, yPos);
      yPos += 7;
      doc.text(`Publisher/Author: ${formData.primaryAuthor || "KHCRF Foundation"}`, 20, yPos);
      yPos += 7;
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, yPos);
      yPos += 15;
      
      chapters.forEach((chapter, index) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(chapter.title || `Chapter ${index + 1}`, 20, yPos);
        yPos += 10;
        
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        
        const contentRaw = chapter.pages?.[0]?.content;
        const blocks = parseContentSafely(contentRaw);
        
        blocks.forEach((block: any) => {
          const text = blockToText(block);
          if (text) {
            const lines = doc.splitTextToSize(text, 170);
            lines.forEach((line: string) => {
              if (yPos > 280) {
                doc.addPage();
                yPos = 20;
              }
              doc.text(line, 20, yPos);
              yPos += 7;
            });
            yPos += 3;
          }
        });
        
        yPos += 10;
      });
      
      doc.save(`${formData.slug || "export"}.pdf`);
      toast.success("PDF Generated!", { id: "pdf-export" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF", { id: "pdf-export" });
    }
  };

  const handleExportDOCX = async () => {
    if (!effectivePublicationId) {
      toast.error("Save Draft first to enable DOCX export");
      return;
    }
    if (!hasManuscriptContent()) {
      toast.error("Cannot export: no manuscript content found.");
      return;
    }

    toast.loading("Generating DOCX...", { id: "docx-export" });
    try {
      const children: any[] = [];
      
      children.push(new Paragraph({
        text: formData.title || "Untitled Book",
        heading: HeadingLevel.TITLE,
      }));
      
      children.push(new Paragraph({
        children: [
          new TextRun({ text: `Status: ${formData.publishedStatus || "DRAFT"}`, break: 1 }),
          new TextRun({ text: `Publisher/Author: ${formData.primaryAuthor || "KHCRF Foundation"}`, break: 1 }),
          new TextRun({ text: `Generated: ${new Date().toLocaleString()}`, break: 1 }),
        ]
      }));
      
      chapters.forEach((chapter, index) => {
        children.push(new Paragraph({
          text: chapter.title || `Chapter ${index + 1}`,
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
        }));
        
        const contentRaw = chapter.pages?.[0]?.content;
        const blocks = parseContentSafely(contentRaw);
        
        blocks.forEach((block: any) => {
          const text = blockToText(block);
          if (text) {
            children.push(new Paragraph({
              children: [new TextRun(text)],
            }));
          }
        });
      });
      
      const doc = new Document({
        sections: [{ properties: {}, children }],
      });
      
      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${formData.slug || "export"}.docx`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.success("DOCX Generated!", { id: "docx-export" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate DOCX", { id: "docx-export" });
    }
  };

  const generateReport = () => {
    if (!effectivePublicationId) {
      toast.error("Save Draft first to generate report");
      return;
    }
    setIsGeneratingReport(true);
    
    try {
      const report = {
        title: formData.title || "Untitled",
        timestamp: new Date().toISOString(),
        overallScore: validation.overallScore,
        status: formData.publishedStatus || "DRAFT",
        blockingIssues: validation.totalBlocks,
        warnings: validation.totalWarns,
        layers: Object.entries(validation.layers).map(([k, v]) => ({
          layer: k,
          score: v.score,
          blocks: v.blocks.length,
          warns: v.warns.length
        }))
      };
      
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${formData.slug || "validation"}-report.json`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.success("Validation Report Generated");
    } catch (e) {
      toast.error("Failed to generate report");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const isReady = validation.totalBlocks.length === 0;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-stone-900 to-black rounded-2xl p-8 text-white shadow-xl border border-stone-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl font-black mb-2 flex items-center gap-3">
              <FaClipboardCheck data-ui-icon  className="" /> Publication Readiness
            </h2>
            <p className="text-sm text-stone-400 max-w-md">Multi-layer pre-flight validation. A publication cannot enter the public knowledge network with blocking issues.</p>
          </div>
          <div className="relative">
             <div className="w-32 h-32 rounded-full border-8 border-stone-800 flex items-center justify-center relative z-10 bg-black">
                <span className="text-4xl font-black">{validation.overallScore}</span>
             </div>
             <svg className="absolute top-0 left-0 w-32 h-32 -rotate-90 z-20">
                <circle cx="64" cy="64" r="56" fill="none" stroke={validation.overallScore > 85 ? "#10b981" : validation.overallScore > 50 ? "#f59e0b" : "#ef4444"} strokeWidth="8" strokeDasharray="351.85" strokeDashoffset={351.85 - (351.85 * validation.overallScore / 100)} className="transition-all duration-1000 ease-out" />
             </svg>
          </div>
        </div>

        {/* Blocking Issues Panel */}
        {(validation.totalBlocks.length > 0 || validation.totalWarns.length > 0) && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {validation.totalBlocks.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <h4 className="text-xs font-black text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FaTimesCircle /> Blocking Issues ({validation.totalBlocks.length})
                </h4>
                <ul className="space-y-2">
                  {validation.totalBlocks.map((b, i) => <li key={i} className="text-xs text-red-200 flex items-center gap-2"><span>✗</span> {b}</li>)}
                </ul>
              </div>
            )}
            {validation.totalWarns.length > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FaExclamationTriangle /> Warnings ({validation.totalWarns.length})
                </h4>
                <ul className="space-y-2">
                  {validation.totalWarns.map((w, i) => <li key={i} className="text-xs text-amber-200 flex items-center gap-2"><span>⚠</span> {w}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Layer Validation Scores */}
        <div className="col-span-2 space-y-3">
          <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Validation Layers</h3>
          {[
            { id: "metadata", label: "Metadata Readiness", val: validation.layers.metadata },
            { id: "manuscript", label: "Manuscript Validation", val: validation.layers.manuscript },
            { id: "authority", label: "Authority Mapping", val: validation.layers.authority },
            { id: "kg", label: "Knowledge Graph", val: validation.layers.kg },
            { id: "seo", label: "SEO Readiness", val: validation.layers.seo },
            { id: "ai", label: "AI Optimization", val: validation.layers.ai },
            { id: "reader", label: "Reader Experience", val: validation.layers.reader },
          ].map(layer => (
             <div key={layer.id} className="flex items-center justify-between p-3 bg-stone-50 border border-stone-200 rounded-xl">
                <div className="flex items-center gap-3">
                  {layer.val.blocks.length > 0 ? <FaTimesCircle className="text-red-500" /> : 
                   layer.val.warns.length > 0 ? <FaExclamationTriangle className="text-amber-500" /> : 
                   <FaCheckCircle className="text-emerald-500" />}
                  <span className="text-xs font-bold text-gray-700">{layer.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                     <div className={`h-full rounded-full ${layer.val.score > 80 ? "bg-emerald-500" : layer.val.score > 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${layer.val.score}%` }} />
                  </div>
                  <span className="text-[10px] font-black w-8 text-right">{layer.val.score}%</span>
                </div>
             </div>
          ))}
        </div>

        {/* Previews & Exports */}
        <div className="space-y-6">
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5">
            <h3 className="text-xs font-black text-blue-900 uppercase tracking-wider mb-3">Preview Center</h3>
            <div className="space-y-2">
              <button type="button" onClick={onPreviewBook} className="w-full flex items-center gap-3 p-2 bg-white border border-blue-200 rounded-lg text-xs font-bold text-blue-800 hover:bg-blue-50 transition-colors"><FaBookOpen className="text-blue-500"/> Preview Full Book</button>
              <button type="button" onClick={onPreviewReader} className="w-full flex items-center gap-3 p-2 bg-white border border-blue-200 rounded-lg text-xs font-bold text-blue-800 hover:bg-blue-50 transition-colors"><FaEye className="text-blue-500"/> Preview Reader Experience</button>
              <button type="button" onClick={onPreviewPublic} className="w-full flex items-center gap-3 p-2 bg-white border border-blue-200 rounded-lg text-xs font-bold text-blue-800 hover:bg-blue-50 transition-colors"><FaShareAlt className="text-blue-500"/> Preview Public Page</button>
              <button type="button" className="w-full flex items-center gap-3 p-2 bg-white border border-blue-200 rounded-lg text-xs font-bold text-blue-800 hover:bg-blue-50 transition-colors"><FaSearch className="text-blue-500"/> Preview Search Result</button>
              <button type="button" className="w-full flex items-center gap-3 p-2 bg-white border border-blue-200 rounded-lg text-xs font-bold text-blue-800 hover:bg-blue-50 transition-colors"><FaRobot className="text-blue-500"/> Preview AI Citation</button>
            </div>
          </div>

          <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-5">
            <h3 className="text-xs font-black text-purple-900 uppercase tracking-wider mb-3">Export Validation</h3>
            <div className="flex gap-2">
              <button type="button" onClick={handleExportPDF} className="flex-1 flex flex-col items-center gap-2 p-3 bg-white border border-purple-200 rounded-xl hover:bg-purple-50 transition-colors">
                <FaFilePdf size={16} className="text-red-500" />
                <span className="text-[10px] font-bold text-gray-700">Test PDF</span>
              </button>
              <button type="button" onClick={handleExportDOCX} className="flex-1 flex flex-col items-center gap-2 p-3 bg-white border border-purple-200 rounded-xl hover:bg-purple-50 transition-colors">
                <FaFileWord size={16} className="text-blue-600" />
                <span className="text-[10px] font-bold text-gray-700">Test DOCX</span>
              </button>
              <button type="button" onClick={generateReport} className="flex-1 flex flex-col items-center gap-2 p-3 bg-white border border-purple-200 rounded-xl hover:bg-purple-50 transition-colors">
                {isGeneratingReport ? <FaSpinner className="animate-spin text-purple-600" size={16} /> : <FaClipboardCheck size={16} className="text-emerald-600" />}
                <span className="text-[10px] font-bold text-gray-700">Report</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Workflow Controls */}
      <div className="border-t border-stone-200 pt-6">
        <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider mb-4">Release Management</h3>
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex flex-wrap gap-3 items-center justify-between">
           <div className="flex gap-3">
             <button type="button" onClick={onSaveDraft} disabled={draftLoading} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-300 text-stone-700 text-xs font-bold rounded-xl hover:bg-stone-100 transition-colors shadow-sm">
               {draftLoading ? <FaSpinner className="animate-spin" /> : <FaSave />} Save Draft
             </button>
             <button type="button" onClick={onSubmitReview} className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold rounded-xl hover:bg-amber-100 transition-colors shadow-sm">
               Submit for Review
             </button>
             {!showApproval && (
               <button type="button" onClick={() => setShowApproval(true)} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl hover:bg-emerald-100 transition-colors shadow-sm">
                 <FaCheckCircle /> Approve...
               </button>
             )}
           </div>
           <div className="flex gap-3">
             <button type="button" onClick={onSchedule} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold rounded-xl hover:bg-indigo-100 transition-colors shadow-sm">
                <FaCalendarAlt /> Schedule
             </button>
             <button type="button" onClick={() => setShowPublishConfirm(true)} disabled={!isReady || publishLoading} className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white text-xs font-black rounded-xl hover:bg-brand-primary/90 transition-all shadow-md shadow-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">
               {publishLoading ? <FaSpinner className="animate-spin" /> : <FaRocket />} {isReady ? "Publish Now" : "Fix Issues to Publish"}
             </button>
           </div>
        </div>

        <AnimatePresence>
          {showApproval && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mt-4">
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-5 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <FaCheckCircle className="text-emerald-600 text-xl" />
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-800 mb-1">Approved By</label>
                    <input type="text" placeholder="Manager Name" value={approvedBy} onChange={e => setApprovedBy(e.target.value)} className="w-full text-xs p-2 border border-emerald-200 rounded bg-white focus:outline-none focus:border-emerald-400" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-800 mb-1">Publication Version</label>
                    <input type="text" value={publicationVersion} onChange={e => setPublicationVersion(e.target.value)} className="w-full text-xs p-2 border border-emerald-200 rounded bg-white focus:outline-none focus:border-emerald-400" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-emerald-800 mb-1">Approval Notes</label>
                    <textarea rows={2} value={approvalNotes} onChange={e => setApprovalNotes(e.target.value)} className="w-full text-xs p-2 border border-emerald-200 rounded bg-white focus:outline-none focus:border-emerald-400" />
                  </div>
                </div>
                <button type="button" onClick={() => {
                  if (!approvedBy.trim()) {
                    toast.error("Please specify who approved this publication");
                    return;
                  }
                  onApprove(approvedBy, publicationVersion, approvalNotes);
                  setShowApproval(false);
                }} className="text-emerald-800 hover:text-emerald-900 px-4 py-2 text-xs font-bold rounded-xl border border-emerald-200 bg-white shadow-sm shrink-0 self-end">
                  Confirm Approval
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Publish Confirmation Modal ────────────────────────────────────── */}
        <AnimatePresence>
          {showPublishConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
              onClick={() => setShowPublishConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 15, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 15, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl border border-stone-200"
                onClick={e => e.stopPropagation()}
              >
                <h3 className="text-lg font-black text-gray-900 mb-1 flex items-center gap-2">
                  <FaRocket data-ui-icon  className="" /> Confirm Publication Release
                </h3>
                <p className="text-xs text-gray-500 mb-5">
                  Verify the following publication metadata before pushing this scholarly document live to the network.
                </p>

                <div className="grid grid-cols-2 gap-4 border border-stone-100 rounded-xl p-4 bg-stone-50/50 mb-6 text-xs text-gray-700">
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Publication Title</span>
                    <span className="font-black text-gray-800">{formData.title || "Untitled"}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Slug Identifier</span>
                    <span className="font-mono text-gray-600 select-all">{formData.slug || "N/A"}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Current Status</span>
                    <span className="font-bold text-amber-600">{formData.publishedStatus || "DRAFT"}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Readiness Score</span>
                    <span className="font-black text-emerald-600">{validation.overallScore}%</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Access Tier</span>
                    <span className="font-bold text-gray-800">{formData.accessType || "PUBLIC"}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Visibility Status</span>
                    <span className="font-bold text-gray-800">{formData.isPublic ? "Public preview on" : "Private review"}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Reader Access</span>
                    <span className="font-bold text-gray-800">{formData.previewContent ? "Enabled" : "Full access only"}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Download Authorization</span>
                    <span className="font-bold text-gray-800">{formData.isDownloadable ? "Download Allowed" : "Download Blocked"}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Release Version</span>
                    <span className="font-bold text-purple-700 font-mono">{publicationVersion || formData.publicationVersion || "v1.0"}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Approved By</span>
                    <span className="font-bold text-gray-800">{approvedBy || formData.approvedBy || "System Admin"}</span>
                  </div>
                  <div className="col-span-2 grid grid-cols-3 gap-2 border-t border-stone-100 pt-3 mt-1 text-[11px]">
                    <div>
                      <span className="block text-[9px] font-bold text-gray-400 uppercase">SEO Integrity</span>
                      <span className="text-emerald-600 font-black">{validation.layers.seo.score === 100 ? "✓ Verified" : "⚠ Warnings"}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold text-gray-400 uppercase">Knowledge Graph</span>
                      <span className="text-emerald-600 font-black">{validation.layers.kg.score > 20 ? "✓ Connected" : "⚠ No links"}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold text-gray-400 uppercase">AI Citation Model</span>
                      <span className="text-emerald-600 font-black">{validation.layers.ai.score > 50 ? "✓ Ready" : "⚠ Incomplete"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPublishConfirm(false)}
                    className="flex-1 px-4 py-2.5 bg-stone-100 text-stone-700 text-xs font-black rounded-xl hover:bg-stone-200 transition-all text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onPublishNow();
                      setShowPublishConfirm(false);
                    }}
                    className="flex-1 px-4 py-2.5 bg-brand-primary text-white text-xs font-black rounded-xl hover:bg-brand-primary/90 transition-all text-center"
                  >
                    Confirm Publish
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
