"use client";

import { useState, useRef } from "react";
import {
  FaCloudUploadAlt,
  FaFileCode,
  FaTimes,
  FaCheckCircle,
  FaSpinner,
  FaTrash,
  FaEdit,
  FaUpload,
  FaDownload,
  FaExclamationTriangle,
  FaBook,
  FaMagic,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import PublicationForm, {
  PublicationFormData,
  Chapter,
} from "@/components/dashboard/publications/PublicationForm"; // Import reused component

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BulkUploadModal({
  isOpen,
  onClose,
  onSuccess,
}: BulkUploadModalProps) {
  const [step, setStep] = useState<"upload" | "review" | "edit">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [importList, setImportList] = useState<PublicationFormData[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  // --- Validations ---
  const [validationReport, setValidationReport] = useState<{
    valid: PublicationFormData[];
    invalid: { item: any; errors: string[] }[];
  } | null>(null);
  const [syntaxError, setSyntaxError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state when opening
  if (!isOpen) return null;

  const mapToFormData = (item: any): PublicationFormData => ({
    title: item.title || "",
    subtitle: item.subtitle || "",
    author: item.author || "",
    price: item.price || "0",
    description: item.description || "",
    category: item.category || "Best Practices",
    language: item.language || "English",
    imagePath: item.imagePath || "",
    pdfPath: item.pdfPath || "",
    slug:
      item.slug ||
      (item.title
        ? item.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")
        : ""),
    published: item.published || new Date().getFullYear().toString(),
    pages: item.pages || "0",
    categoryId: item.categoryId || "",
    type: item.type === "WRITTEN" ? "WRITTEN" : "PDF",
    chapters: item.chapters || [],
    accessType: item.accessType || "PUBLIC",
    publicationType: item.publicationType || "EBOOK",
    isDownloadable: item.isDownloadable ?? true,
    previewEnabled: item.previewEnabled ?? true,
    memberOnlyDownload: item.memberOnlyDownload ?? false,
    citationEnabled: item.citationEnabled ?? false,
    seoEnabled: item.seoEnabled ?? false,
    seoTitle: item.seoTitle || "",
    seoDescription: item.seoDescription || "",
    previewContent: item.previewContent || "",
    fullContent: item.fullContent || "",
    downloadUrl: item.downloadUrl || "",
    memberDownloadUrl: item.memberDownloadUrl || "",
    publishedStatus: item.publishedStatus || "DRAFT",
    structuredDataType: item.structuredDataType || "Book",
  });

  const validateImport = (parsedJson: any[]) => {
    const valid: PublicationFormData[] = [];
    const invalid: { item: any; errors: string[] }[] = [];

    parsedJson.forEach((item, index) => {
      const errors: string[] = [];

      // Critical checks
      if (!item.title) errors.push("Missing Title");
      if (!item.author) errors.push("Missing Author");

      // Warning checks
      if (!item.price || isNaN(Number(item.price)))
        errors.push("Invalid Price");
      if (!item.slug && !item.title)
        errors.push("Cannot generate Slug (Missing Title)");

      if (errors.length > 0) {
        invalid.push({ item, errors });
      } else {
        valid.push(mapToFormData(item));
      }
    });

    if (invalid.length > 0) {
      setValidationReport({ valid, invalid });
    } else {
      setImportList(valid);
      setStep("review");
      toast.success("All items validated successfully!");
    }
  };

  const handleAutoRepair = () => {
    if (!validationReport) return;

    // Attempt repairs on invalid items
    const repaired = validationReport.invalid.map(({ item }) => {
      // Fallbacks
      const repairedItem = { ...item };
      if (!repairedItem.title) repairedItem.title = "Untitled Publication";
      if (!repairedItem.author) repairedItem.author = "Unknown Author";
      if (!repairedItem.price || isNaN(Number(repairedItem.price)))
        repairedItem.price = "0";

      return mapToFormData(repairedItem);
    });

    setImportList([...validationReport.valid, ...repaired]);
    setValidationReport(null);
    setStep("review");
    toast.success(`Repaired ${repaired.length} items. Please review.`);
  };

  // --- Template Helpers ---
  const downloadTemplate = (type: "json") => {
    if (type === "json") {
      const template = [
        {
          title: "Example Book Title",
          subtitle: "An Optional Subtitle",
          author: "Author Name",
          price: "0",
          description: "Book description...",
          category: "Best Practices",
          language: "English",
          imagePath: "placeholder.jpg",
          type: "WRITTEN",
          chapters: [
            {
              title: "Chapter 1",
              order: 1,
              pages: [
                {
                  content: "<h1>Chapter Content</h1><p>Start writing...</p>",
                  pageNumber: 1,
                },
              ],
            },
          ],
        },
      ];
      const blob = new Blob([JSON.stringify(template, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "publication_template.json";
      a.click();
    }
  };

  // --- File Handling ---
  const handleFile = (file: File) => {
    setSyntaxError(null); // Reset syntax error
    if (file.type === "application/json" || file.name.endsWith(".json")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          if (Array.isArray(json)) {
            validateImport(json);
          } else {
            toast.error("JSON must be an array of publications");
          }
        } catch (err: any) {
          // Set Syntax Error state instead of just toast
          setSyntaxError(err.message);
        }
      };
      reader.readAsText(file);
    } else {
      toast.error("Unsupported file type. Use JSON.");
    }
  };

  // ... (in render)
  {
    /* Syntax Error Visualizer */
  }
  {
    syntaxError && (
      <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-2xl border border-red-200 max-w-lg w-full p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <FaFileCode size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              JSON Syntax Error
            </h3>
            <p className="text-gray-500 mt-2">
              Your file could not be parsed. Please fix the error below and try
              again.
            </p>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-left font-mono text-xs text-red-700 break-all">
            {syntaxError}
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={() => setSyntaxError(null)}
              className="px-6 py-2 border border-gray-200 rounded-lg text-gray-600 font-medium hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={() => downloadTemplate("json")}
              className="px-6 py-2 bg-brand-primary text-white rounded-lg font-bold hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/20 flex items-center gap-2"
            >
              <FaDownload /> Download Valid Template
            </button>
          </div>
        </div>
      </div>
    );
  }

  {
    /* Validation Report Modal Overlay */
  }
  {
    validationReport && (
      <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-2xl border border-red-100 max-w-2xl w-full p-6 space-y-6">
          <div className="flex items-center gap-4 text-red-600 border-b border-red-50 pb-4">
            <div className="p-3 bg-red-50 rounded-full">
              <FaExclamationTriangle size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Import Issues Found</h3>
              <p className="text-sm text-gray-500">
                found {validationReport.invalid.length} items with issues from{" "}
                {validationReport.invalid.length +
                  validationReport.valid.length}{" "}
                total.
              </p>
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
            {validationReport.invalid.map((entry, idx) => (
              <div key={idx} className="flex gap-3 text-sm">
                <span className="font-mono font-bold text-gray-400">
                  #{idx + 1}
                </span>
                <div className="space-y-1">
                  <div className="font-medium text-gray-800">
                    {entry.item.title || "Untitled"}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {entry.errors.map((err, eIdx) => (
                      <span
                        key={eIdx}
                        className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full border border-red-200"
                      >
                        {err}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setValidationReport(null)}
              className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel Import
            </button>
            <button
              onClick={handleAutoRepair}
              className="px-6 py-2 bg-brand-primary text-white rounded-lg font-bold hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/20 flex items-center gap-2"
            >
              <FaMagic /> Check & Repair
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Actions ---
  // ... (handleEdit, handleSaveEdit, handleDelete same as before)
  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setStep("edit");
  };

  const handleSaveEdit = async (
    data: PublicationFormData,
    chapters: Chapter[],
  ) => {
    // Update item in list
    const newList = [...importList];
    if (editingIndex !== null) {
      newList[editingIndex] = { ...data, chapters };
      setImportList(newList);
      setStep("review");
      setEditingIndex(null);
      toast.success("Item updated internally");
    }
  };

  const handleDelete = (index: number) => {
    const newList = [...importList];
    newList.splice(index, 1);
    setImportList(newList);
    if (newList.length === 0) setStep("upload");
  };

  const handlePublishAll = async () => {
    if (importList.length === 0) return;
    setUploading(true);
    let successCount = 0;
    let failCount = 0;

    for (const pub of importList) {
      try {
        // 1. Create Publication
        const pubData = {
          ...pub,
          price: pub.price.toString(),
          pages: pub.pages?.toString() || "0",
          // Ensure type is uppercase
          type: pub.type === "WRITTEN" ? "WRITTEN" : "PDF",
        };

        const res = await api.post("/publications", pubData);
        const pubId = res.data.id;

        // 2. If Written, upload content
        if (pub.type === "WRITTEN" && pub.chapters) {
          for (let i = 0; i < pub.chapters.length; i++) {
            const chapter = pub.chapters[i];
            const chRes = await api.post("/publications/chapters", {
              title: chapter.title,
              order: i + 1,
              publicationId: pubId,
            });
            const chId = chRes.data.id;

            if (chapter.pages) {
              for (let j = 0; j < chapter.pages.length; j++) {
                const page = chapter.pages[j];
                await api.post("/publications/pages", {
                  content: page.content,
                  pageNumber: j + 1,
                  chapterId: chId,
                });
              }
            }
          }
        }
        successCount++;
      } catch (err) {
        console.error(err);
        failCount++;
      }
    }

    setUploading(false);
    if (failCount === 0) {
      toast.success(`Successfully published ${successCount} books!`);
      onSuccess();
      onClose();
    } else {
      toast.error(
        `Published ${successCount}, Failed ${failCount}. Check console.`,
      );
    }
  };

  // --- Render ---
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`bg-white rounded-2xl shadow-xl w-full ${step === "edit" ? "max-w-6xl h-[90vh]" : "max-w-4xl max-h-[90vh]"} overflow-hidden relative flex flex-col transition-all duration-300`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 shrink-0">
          <h3 className="text-lg font-bold text-gray-800">
            {step === "upload" && "Bulk Upload Books"}
            {step === "review" && "Review & Publish"}
            {step === "edit" && "Edit Draft"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-50/50">
          {step === "upload" && (
            <div className="p-8 flex flex-col items-center">
              <div className="grid grid-cols-1 gap-6 w-full max-w-lg mb-8">
                <button
                  onClick={() => downloadTemplate("json")}
                  className="flex items-center justify-center gap-3 p-6 bg-white border border-gray-200 rounded-xl hover:border-brand-primary hover:text-brand-primary transition-all shadow-sm group"
                >
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FaFileCode size={24} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-gray-800">JSON Template</div>
                    <div className="text-xs text-gray-500">
                      Best for full content
                    </div>
                  </div>
                  <FaDownload className="ml-auto text-gray-300 group-hover:text-brand-primary/50" />
                </button>
              </div>

              <div
                className="w-full max-w-2xl border-2 border-dashed border-gray-300 hover:border-brand-primary hover:bg-brand-primary/5 rounded-2xl p-12 flex flex-col items-center cursor-pointer transition-all bg-white"
                onClick={() => inputRef.current?.click()}
              >
                <FaCloudUploadAlt size={64} className="text-gray-300 mb-4" />
                <h4 className="text-xl font-bold text-gray-700">
                  Drag & Drop or Click to Upload
                </h4>
                <p className="text-gray-500 mt-2">Supports JSON</p>
                <input
                  ref={inputRef}
                  type="file"
                  className="hidden"
                  accept=".json"
                  onChange={(e) =>
                    e.target.files && handleFile(e.target.files[0])
                  }
                />
              </div>
            </div>
          )}

          {step === "review" && (
            <div className="p-6">
              <div className="space-y-4">
                {importList.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                      <FaBook />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 truncate">
                        {item.title || "Untitled"}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {item.author || "Unknown Author"} • {item.type}
                      </p>
                      <div className="flex gap-2 mt-1">
                        {(!item.title || !item.author) && (
                          <span className="text-xs text-red-500 flex items-center gap-1">
                            <FaExclamationTriangle /> Missing Metadata
                          </span>
                        )}
                        {item.type === "WRITTEN" &&
                          (!item.chapters || item.chapters.length === 0) && (
                            <span className="text-xs text-orange-500 flex items-center gap-1">
                              <FaExclamationTriangle /> No Content
                            </span>
                          )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(idx)}
                        className="p-2 text-gray-500 hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(idx)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === "edit" && editingIndex !== null && (
            <div className="h-full">
              <PublicationForm
                initialData={importList[editingIndex]}
                onSubmit={handleSaveEdit}
                onCancel={() => setStep("review")}
                isEditing={true} // For UI title
                isAdmin={true}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        {step === "review" && (
          <div className="px-6 py-4 bg-white border-t border-gray-100 flex justify-between items-center shrink-0">
            <button
              onClick={() => setStep("upload")}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Back to Upload
            </button>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePublishAll}
                disabled={uploading || importList.length === 0}
                className="px-6 py-2 bg-brand-primary text-white rounded-lg font-bold hover:bg-brand-primary/90 flex items-center gap-2 disabled:opacity-70"
              >
                {uploading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaUpload />
                )}
                Publish All ({importList.length})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
