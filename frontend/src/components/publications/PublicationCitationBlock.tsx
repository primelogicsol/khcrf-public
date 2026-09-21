import React from "react";
import { FaCopy, FaCheck } from "react-icons/fa";

interface PublicationCitationBlockProps {
  title: string;
  author: string;
  publicationYear: string | null;
  slug: string;
  isbn: string | null;
  customApa?: string;
  customMla?: string;
  customChicago?: string;
  customBibtex?: string;
}

export default function PublicationCitationBlock({
  title,
  author,
  publicationYear,
  slug,
  isbn,
  customApa,
  customMla,
  customChicago,
  customBibtex,
}: PublicationCitationBlockProps) {
  const [copied, setCopied] = React.useState<string | null>(null);

  const handleCopy = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopied(format);
    setTimeout(() => setCopied(null), 2000);
  };

  const citationApa =
    customApa ||
    `${author}. (${publicationYear || "n.d."}). ${title}. KHCRF Press.`;
  const citationMla =
    customMla ||
    `${author}. "${title}." KHCRF Press, ${publicationYear || "n.d."}.`;
  const citationChicago =
    customChicago ||
    `${author}. ${publicationYear || "n.d."}. ${title}. Srinagar: KHCRF Press.`;

  let citationBibtex = customBibtex;
  if (!citationBibtex) {
    citationBibtex = `@book{hcrf_${slug},\n  author = {${author}},\n  title = {${title}},\n  publisher = {KHCRF Press},\n  year = {${publicationYear || "n.d."}}`;
    if (isbn && isbn !== "Pending") {
      citationBibtex += `,\n  isbn = {${isbn}}`;
    }
    citationBibtex += `\n}`;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-serif font-black text-brand-dark uppercase tracking-wider border-b border-stone-150 pb-2">
        Cite This Work
      </h2>
      <div className="bg-white border border-stone-200/60 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest block">
          Official Bibliographic Citations
        </span>

        {/* APA */}
        <div className="space-y-1">
          <span className="text-[9px] font-bold text-stone-400 uppercase block">
            APA 7th Edition
          </span>
          <div className="bg-stone-50 p-3 rounded-lg border border-stone-200/50 flex justify-between items-center text-xs text-stone-700">
            <span className="font-serif italic select-all pr-4 break-words">
              {citationApa}
            </span>
          </div>
        </div>

        {/* MLA */}
        <div className="space-y-1">
          <span className="text-[9px] font-bold text-stone-400 uppercase block">
            MLA 9th Edition
          </span>
          <div className="bg-stone-50 p-3 rounded-lg border border-stone-200/50 flex justify-between items-center text-xs text-stone-700">
            <span className="font-serif italic select-all pr-4 break-words">
              {citationMla}
            </span>
          </div>
        </div>

        {/* Chicago */}
        <div className="space-y-1">
          <span className="text-[9px] font-bold text-stone-400 uppercase block">
            Chicago 17th Edition
          </span>
          <div className="bg-stone-50 p-3 rounded-lg border border-stone-200/50 flex justify-between items-center text-xs text-stone-700">
            <span className="font-serif italic select-all pr-4 break-words">
              {citationChicago}
            </span>
          </div>
        </div>

        {/* BibTeX */}
        <div className="space-y-1 pt-2">
          <div className="flex justify-between items-end mb-1">
            <span className="text-[9px] font-bold text-stone-400 uppercase block">
              BibTeX
            </span>
            <button
              onClick={() => handleCopy(citationBibtex!, "bibtex")}
              className="text-[9px] font-bold uppercase tracking-widest text-brand-primary hover:text-brand-dark transition-colors flex items-center gap-1"
            >
              {copied === "bibtex" ? (
                <>
                  <FaCheck /> Copied
                </>
              ) : (
                <>
                  <FaCopy /> Copy BibTeX
                </>
              )}
            </button>
          </div>
          <div className="bg-stone-900 p-3 rounded-lg flex justify-between items-start text-xs text-stone-300">
            <pre className="font-mono whitespace-pre-wrap select-all">
              {citationBibtex}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
