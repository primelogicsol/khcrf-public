import { useState, useEffect } from "react";
import { FaMagic, FaCheck, FaTimes, FaSpinner, FaList } from "react-icons/fa";

interface SmartImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (chapters: any[]) => void;
}

export default function SmartImportModal({ isOpen, onClose, onImport }: SmartImportModalProps) {
    const [rawText, setRawText] = useState("");
    const [previewChapters, setPreviewChapters] = useState<any[]>([]);
    const [processing, setProcessing] = useState(false);

    // Initial Example Content
    useEffect(() => {
        if (isOpen && !rawText) {
            setRawText(`Table of Contents

1. Introduction
Welcome to the book. This is the first chapter.

2. Getting Started
Here is how you start.`);
        }
    }, [isOpen]);

    const processText = () => {
        setProcessing(true);
        setTimeout(() => {
            // STEP 1: Pre-process text to fix missing newlines (e.g. "End of section.1. New Section")
            // We match a period/letter followed immediately by a number and dot, and inject a newline.
            // Also handle "Table of Contents" if stuck to previous text.
            let cleanText = rawText
                .replace(/([a-z0-9\.])\s*(\d+\.\s+[A-Z])/g, '$1\n\n$2') // Fix "text.1. Title"
                .replace(/([a-z0-9\.])\s*(Table of Contents)/gi, '$1\n\n$2'); // Fix "textTable of Contents"

            // STEP 2: Main logic to split chapters
            // Matches:
            // 1. Newline + "1. Title"
            // 2. Newline + "Chapter 1"
            // 3. Newline + "Table of Contents"
            // 4. "Introduction" if it looks like a header (optional, risky, but useful for start)

            const splitPattern = /(?=\n^(?:\d+\.|Chapter\s+\w+|[IVX]+\.|Table of Contents|Introduction)\s?)/gm;

            // Initial split (with cleaned text)
            let sections = cleanText.split(splitPattern);

            // Clean up empty first section if improved split left one
            if (!sections[0] || !sections[0].trim()) {
                sections.shift();
            }

            // Fallback: If no structure detected, treat as one block but try to format paragraphs
            if (sections.length <= 1) {
                sections = [cleanText];
            }

            const chapters = sections.map((section, index) => {
                const lines = section.trim().split('\n');
                let title = lines[0].trim();

                // If splitting resulted in just logic without title (rare), safeguard
                if (!title) title = `Chapter ${index + 1}`;

                // Content is the rest
                const contentBody = lines.slice(1).join('\n').trim();

                // Convert to JSON blocks
                const paragraphs = contentBody.split(/\n\n+/).filter(Boolean);
                const blocks = paragraphs.map(p => ({
                    type: "Paragraph",
                    text: p.replace(/\n/g, ' ')
                }));
                if (blocks.length === 0) {
                    blocks.push({ type: "Paragraph", text: "Coming soon..." });
                }

                return {
                    title: title.substring(0, 100) || `Chapter ${index + 1}`,
                    order: index + 1,
                    pages: [{ content: JSON.stringify(blocks), pageNumber: 1 }]
                };
            }).filter(c => c.title);

            setPreviewChapters(chapters);
            setProcessing(false);
        }, 500);
    };

    const handleImport = () => {
        onImport(previewChapters);
        onClose();
        setRawText("");
        setPreviewChapters([]);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            {/* Main Modal Container: Fixed Layout (95vw x 90vh) */}
            <div className="bg-white rounded-2xl shadow-2xl w-[95vw] h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-200">

                {/* Header */}
                <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-50 text-purple-600 rounded-xl shadow-sm border border-purple-100">
                            <FaMagic size={22} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Smart Content Import</h2>
                            <p className="text-sm text-gray-500 font-medium">Paste your entire manuscript. AI will detect chapters and format it.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                        <FaTimes size={24} />
                    </button>
                </div>

                {/* Content Area - Split Pane */}
                <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 bg-gray-50/30">

                    {/* Left Column: Input */}
                    <div className="flex flex-col h-full min-h-0 p-6 lg:p-8 bg-white">
                        <div className="flex justify-between items-center mb-4 flex-shrink-0">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs">1</span>
                                Paste Content
                            </label>
                        </div>

                        <textarea
                            value={rawText}
                            onChange={(e) => setRawText(e.target.value)}
                            className="flex-1 w-full p-6 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-50/50 font-mono text-sm lg:text-base text-gray-900 resize-none leading-relaxed transition-all shadow-inner bg-gray-50 focus:bg-white placeholder:text-gray-300"
                            placeholder="Paste your book text here..."
                            spellCheck={false}
                        />

                        <div className="mt-6 flex justify-end flex-shrink-0">
                            <button
                                onClick={processText}
                                disabled={!rawText || processing}
                                className="w-full sm:w-auto px-8 py-3.5 bg-gray-900 text-white rounded-xl hover:bg-black font-bold text-base flex items-center justify-center gap-2.5 transition-all transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-gray-900/20"
                            >
                                {processing ? <FaSpinner className="animate-spin" /> : <FaMagic />}
                                Analyze Structure
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Preview */}
                    <div className="flex flex-col h-full min-h-0 p-6 lg:p-8 bg-gray-50/50">
                        <div className="flex justify-between items-center mb-4 flex-shrink-0">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs">2</span>
                                Preview
                            </label>
                            {previewChapters.length > 0 && (
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200 flex items-center gap-1.5 animate-in fade-in slide-in-from-right-4">
                                    <FaCheck size={10} /> {previewChapters.length} Chapters Found
                                </span>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 -mr-2 custom-scrollbar contents-container">
                            {previewChapters.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center border-2 border-dashed border-gray-200 rounded-xl bg-white/40 p-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300">
                                        <FaList size={30} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">No content structure yet</h3>
                                    <p className="text-sm opacity-60 mt-1 max-w-xs">Paste your text on the left and click "Analyze" to see the magic happen.</p>
                                </div>
                            ) : (
                                previewChapters.map((chapter, i) => (
                                    <div key={i} className="bg-white p-5 rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md hover:border-purple-200 transition-all group cursor-default">
                                        <div className="flex items-start gap-4">
                                            <span className="flex-shrink-0 w-8 h-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center text-sm font-bold border border-purple-100 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                                {i + 1}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-gray-900 text-base lg:text-lg truncate mb-1.5">{chapter.title}</h4>

                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    <span className="text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                        {chapter.pages[0].content.split(/\s+/).length} Words
                                                    </span>
                                                    <span className="text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                        {chapter.pages.length} Page
                                                    </span>
                                                </div>

                                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-gray-600 text-sm line-clamp-3 font-serif leading-relaxed italic group-hover:bg-white group-hover:shadow-inner transition-colors">
                                                    {/* Strip HTML for preview */}
                                                    "{chapter.pages[0].content.replace(/<[^>]*>/g, ' ').substring(0, 150)}..."
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-200 flex-shrink-0">
                            <button
                                onClick={handleImport}
                                disabled={previewChapters.length === 0}
                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-purple-500/25 transition-all transform hover:scale-[1.01] hover:-translate-y-0.5 disabled:opacity-50 disabled:shadow-none disabled:transform-none"
                            >
                                <FaCheck />
                                {previewChapters.length > 0 ? `Import ${previewChapters.length} Detected Chapters` : "Ready to Import"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
