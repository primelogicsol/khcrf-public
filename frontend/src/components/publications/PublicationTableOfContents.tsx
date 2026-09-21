"use client";
import { publicationEditorialProfiles } from "@/data/publicationEditorialProfiles";

import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface Chapter {
  id: string;
  title: string;
  order: number;
  status?: string | null;
  sectionType?: string | null;
  type?: string | null;
}

interface PublicationTableOfContentsProps {
  slug: string;
  chapters?: Chapter[];
  pubTitle: string;
  readerAvailability?: string;
}

function TocPart({ title, children, defaultExpanded = true }: { title: string, children: React.ReactNode, defaultExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  return (
    <div className="mb-4 last:mb-0 border-b border-stone-100 last:border-0 pb-4 last:pb-0">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left group"
      >
        <h3 className="text-sm font-black text-stone-800 uppercase tracking-widest group-hover:text-brand-primary transition-colors">
          {title}
        </h3>
        <span className="text-stone-400 group-hover:text-brand-primary transition-colors">
          {expanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
        </span>
      </button>
      {expanded && (
        <div className="mt-3 pl-2 border-l-2 border-stone-100 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
}

function TocChapter({ title }: { title: string }) {
  return (
    <div className="flex items-start gap-3 py-1.5 group cursor-pointer">
      <span className="text-brand-primary/50 mt-1 text-xs">•</span>
      <span className="font-serif text-[15px] font-medium text-stone-600 group-hover:text-brand-primary transition-colors leading-tight">
        {title}
      </span>
    </div>
  );
}

export default function PublicationTableOfContents({
  chapters,
  pubTitle,
  readerAvailability,
  slug
}: PublicationTableOfContentsProps) {
  const editorialProfile = publicationEditorialProfiles[slug] || { insideThisPublication: [] };
  const approvedChapters = [...(chapters || [])].filter(ch => ch.status === 'APPROVED' || ch.status === 'RELEASED' || ch.status === 'PUBLISHED' || !ch.status).sort((a, b) => a.order - b.order);
  const hasApprovedChapters = approvedChapters.length > 0;
  const isProvisional = readerAvailability !== "AVAILABLE";

  // Group chapters by Part
  const parts: { title: string, items: Chapter[] }[] = [];
  let currentPart: { title: string, items: Chapter[] } | null = null;

  approvedChapters.forEach((ch) => {
    const isPart = ch.sectionType === 'part' || ch.type === 'PART' || ch.type === 'part';
    if (isPart) {
      currentPart = { title: ch.title, items: [] };
      parts.push(currentPart);
    } else {
      if (!currentPart) {
        currentPart = { title: 'Contents', items: [] };
        parts.push(currentPart);
      }
      currentPart.items.push(ch);
    }
  });

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-serif font-black text-brand-dark uppercase tracking-wider border-b border-stone-200 pb-2">
        {hasApprovedChapters ? "Table of Contents" : "Inside This Publication"}
      </h2>
      <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-4 sm:p-6">
        {hasApprovedChapters ? (
          <div>
            
            {parts.map((part, idx) => (
              <TocPart key={idx} title={part.title} defaultExpanded={idx === 0 || idx === 1}>
                {part.items.map((ch) => (
                  <TocChapter key={ch.id} title={ch.title} />
                ))}
              </TocPart>
            ))}
            
          </div>
        ) : editorialProfile.insideThisPublication && editorialProfile.insideThisPublication.length > 0 ? (
          <div className="py-2 text-stone-700 font-serif text-sm leading-relaxed space-y-4">
            {editorialProfile.insideThisPublication.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
