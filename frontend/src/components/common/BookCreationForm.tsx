"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FaBook,
  FaPlus,
  FaSpinner,
  FaArrowLeft,
  FaFileUpload,
  FaTrash,
  FaSave,
  FaMagic,
  FaImage,
  FaLayerGroup,
  FaListUl,
  FaTimes,
} from "react-icons/fa";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import Select from "@/components/common/Select";

import dynamic from "next/dynamic";
const RichTextEditor = dynamic(
  () => import("@/components/common/RichTextEditor"),
  { ssr: false },
);
import BulkUploadModal from "@/components/dashboard/publications/BulkUploadModal";
import SmartImportModal from "@/components/dashboard/publications/SmartImportModal";

// --- Types ---
interface Page {
  id?: string;
  content: string;
  pageNumber: number;
}

interface Chapter {
  id?: string;
  title: string;
  order: number;
  pages: Page[];
}

interface BookCreationFormProps {
  isAdmin?: boolean;
  redirectUrl?: string;
}

import { useAuth } from "@/context/AuthContext";

export default function BookCreationForm({
  isAdmin = false,
  redirectUrl = "/dashboard/business",
}: BookCreationFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  // UI States
  const [activeTab, setActiveTab] = useState<"basic" | "content">("basic");
  const [loading, setLoading] = useState(false);

  // Data States
  const [categories, setCategories] = useState<
    { id: string; name: string; slug: string }[]
  >([]);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showSmartImport, setShowSmartImport] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Content Mode State
  const [contentType, setContentType] = useState<"pdf" | "write">("pdf");
  const [chapters, setChapters] = useState<Chapter[]>([
    { title: "Chapter 1", order: 1, pages: [{ content: "", pageNumber: 1 }] },
  ]);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [activePageIndex, setActivePageIndex] = useState(0);

  // Tracking Deletions
  const [deletedChapterIds, setDeletedChapterIds] = useState<string[]>([]);
  const [deletedPageIds, setDeletedPageIds] = useState<string[]>([]);

  // Form Data
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    author: "",
    price: "",
    pages: "",
    description: "",
    imagePath: "",
    slug: "",
    published: new Date().getFullYear().toString(),
    category: "Best Practices",
    categoryId: "",
    language: "English",
    pdfPath: "",
  });

  // Pre-fill author with user name
  useEffect(() => {
    if (user?.name && !formData.author && !editId) {
      setFormData((prev) => ({ ...prev, author: user.name }));
    }
  }, [user, editId]);

  // --- Loading Data ---
  const fetchCategories = async () => {
    try {
      const res = await api.get("/publications/categories");
      setCategories(res.data);
      if (
        res.data.length > 0 &&
        formData.category === "Best Practices" &&
        !editId
      ) {
        setFormData((prev) => ({
          ...prev,
          category: res.data[0].name,
          categoryId: res.data[0].id,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const fetchPublicationDetails = async (id: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/publications/${id}`);
      const pub = res.data;

      setFormData({
        title: pub.title,
        subtitle: pub.subtitle || "",
        author: pub.author,
        price: pub.price.toString(),
        pages: pub.pages.toString(),
        description: pub.description || "",
        imagePath: pub.imagePath,
        slug: pub.slug,
        published: pub.published,
        category: pub.category,
        categoryId: pub.categoryId || "",
        language: pub.language || "English",
        pdfPath: pub.pdfPath || "",
      });

      if (pub.chapters && pub.chapters.length > 0) {
        const loadedChapters: Chapter[] = pub.chapters.map((ch: any) => ({
          id: ch.id,
          title: ch.title,
          order: ch.order,
          pages:
            ch.pages && ch.pages.length > 0
              ? ch.pages.map((p: any) => ({
                  id: p.id,
                  content: p.content,
                  pageNumber: p.pageNumber,
                }))
              : [{ content: "", pageNumber: 1 }],
        }));
        loadedChapters.sort((a, b) => a.order - b.order);
        setChapters(loadedChapters);
        setContentType("write");
      } else {
        setContentType(pub.type === "WRITTEN" ? "write" : "pdf");
      }
    } catch (error) {
      console.error("Failed to fetch publication details", error);
      toast.error("Failed to load publication details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    if (editId) fetchPublicationDetails(editId);
  }, [editId]);

  // --- Handlers ---
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "category") {
      const selectedCat = categories.find((c) => c.name === value);
      if (selectedCat)
        setFormData((prev) => ({ ...prev, categoryId: selectedCat.id }));
    }
  };

  const generateSlug = () => {
    if (editId || !formData.title) return;
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName) return;
    try {
      const slug = newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const res = await api.post("/publications/categories", {
        name: newCategoryName,
        slug,
        description: "Created from admin panel",
      });

      setCategories((prev) => [...prev, res.data]);
      setFormData((prev) => ({
        ...prev,
        category: res.data.name,
        categoryId: res.data.id,
      }));
      setShowNewCategory(false);
      setNewCategoryName("");
      toast.success("Category created!");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to create category");
    }
  };

  // --- Content Helpers ---
  const handleSmartImport = (importedChapters: any[]) => {
    setChapters(importedChapters);
    setContentType("write");
    setActiveChapterIndex(0);
    setActivePageIndex(0);
    toast.success("Content imported successfully!");
  };

  const addChapter = () => {
    setChapters((prev) => [
      ...prev,
      {
        title: `Chapter ${prev.length + 1}`,
        order: prev.length + 1,
        pages: [{ content: "", pageNumber: 1 }],
      },
    ]);
    setActiveChapterIndex(chapters.length);
    setActivePageIndex(0);
  };

  const removeChapter = (index: number) => {
    if (chapters.length === 1)
      return toast.error("At least one chapter is required");
    const chapterToRemove = chapters[index];
    if (chapterToRemove.id)
      setDeletedChapterIds((prev) => [...prev, chapterToRemove.id!]);

    // Mark pages for deletion too, though backend might cascade
    if (chapterToRemove.pages) {
      chapterToRemove.pages.forEach((p) => {
        if (p.id) setDeletedPageIds((prev) => [...prev, p.id!]);
      });
    }

    const newChapters = chapters
      .filter((_, i) => i !== index)
      .map((ch, i) => ({ ...ch, order: i + 1 }));
    setChapters(newChapters);
    setActiveChapterIndex(Math.max(0, activeChapterIndex - 1));
  };

  const updateChapterTitle = (index: number, title: string) => {
    setChapters((prev) =>
      prev.map((ch, i) => (i === index ? { ...ch, title } : ch)),
    );
  };

  const addPage = (chapterIndex: number) => {
    const currentPages = chapters[chapterIndex].pages;
    setChapters((prev) =>
      prev.map((ch, i) =>
        i === chapterIndex
          ? {
              ...ch,
              pages: [
                ...ch.pages,
                { content: "", pageNumber: currentPages.length + 1 },
              ],
            }
          : ch,
      ),
    );
    setActivePageIndex(chapters[chapterIndex].pages.length);
  };

  const updatePageContent = (
    chapterIndex: number,
    pageIndex: number,
    content: string,
  ) => {
    setChapters((prev) =>
      prev.map((ch, i) =>
        i === chapterIndex
          ? {
              ...ch,
              pages: ch.pages.map((p, j) =>
                j === pageIndex ? { ...p, content } : p,
              ),
            }
          : ch,
      ),
    );
  };

  const removePage = (chapterIndex: number, pageIndex: number) => {
    const chapter = chapters[chapterIndex];
    if (chapter.pages.length === 1)
      return toast.error("Chapter must have at least one page");
    const pageToRemove = chapter.pages[pageIndex];
    if (pageToRemove.id)
      setDeletedPageIds((prev) => [...prev, pageToRemove.id!]);

    const newPages = chapter.pages
      .filter((_, i) => i !== pageIndex)
      .map((p, i) => ({ ...p, pageNumber: i + 1 }));
    const newChapters = [...chapters];
    newChapters[chapterIndex] = { ...chapter, pages: newPages };
    setChapters(newChapters);
    setActivePageIndex(Math.max(0, activePageIndex - 1));
  };

  // --- Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "basic") {
      setActiveTab("content");
      return;
    }

    setLoading(true);
    try {
      let publicationId: string;
      const pubData = {
        ...formData,
        type: contentType === "write" ? "WRITTEN" : "PDF",
        price: formData.price.toString(),
        pages: formData.pages.toString(),
      };

      if (editId) {
        await api.put(`/publications/${editId}`, pubData);
        publicationId = editId;
        toast.success("Publication metadata updated");
      } else {
        const pubRes = await api.post("/publications", pubData);
        publicationId = pubRes.data.id;
        toast.success("Publication created");
      }

      if (contentType === "write") {
        if (deletedPageIds.length > 0)
          await Promise.all(
            deletedPageIds.map((id) => api.delete(`/publications/pages/${id}`)),
          );
        if (deletedChapterIds.length > 0)
          await Promise.all(
            deletedChapterIds.map((id) =>
              api.delete(`/publications/chapters/${id}`),
            ),
          );

        for (let i = 0; i < chapters.length; i++) {
          const chapter = chapters[i];
          let chapterId = chapter.id;

          if (chapterId) {
            await api.put(`/publications/chapters/${chapterId}`, {
              title: chapter.title,
              order: i + 1,
            });
          } else {
            const res = await api.post("/publications/chapters", {
              title: chapter.title,
              order: i + 1,
              publicationId,
            });
            chapterId = res.data.id;
          }

          for (let j = 0; j < chapter.pages.length; j++) {
            const page = chapter.pages[j];
            if (page.id) {
              await api.put(`/publications/pages/${page.id}`, {
                content: page.content,
                pageNumber: j + 1,
              });
            } else {
              await api.post("/publications/pages", {
                content: page.content,
                pageNumber: j + 1,
                chapterId,
              });
            }
          }
        }
        toast.success("Content saved successfully!");
      }
      router.push(redirectUrl);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to save publication");
    } finally {
      setLoading(false);
    }
  };

  // --- Renders ---
  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] overflow-hidden bg-gray-50/50">
      <SmartImportModal
        isOpen={showSmartImport}
        onClose={() => setShowSmartImport(false)}
        onImport={handleSmartImport}
      />
      <BulkUploadModal
        isOpen={showBulkUpload}
        onClose={() => setShowBulkUpload(false)}
        onSuccess={() => toast.success("Batch processing started")}
      />

      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">
              {editId ? "Edit Publication" : "Create New Book"}
            </h1>
            <p className="text-xs text-gray-500">
              Manage your publication details and content
            </p>
          </div>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg">
          {["basic", "content"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`relative px-6 py-2 text-sm font-medium rounded-md transition-all z-10 ${activeTab === tab ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white shadow-sm rounded-md -z-10"
                />
              )}
              {tab === "basic" ? "Basic Info" : "Content Editor"}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {(isAdmin || user?.role === "COLLABORATOR_EBOOKS") && (
            <button
              onClick={() => setShowBulkUpload(true)}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaFileUpload className="inline mr-2" /> Bulk Upload
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 text-sm font-medium text-white bg-brand-primary rounded-lg hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/25 transition-all flex items-center gap-2"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
            {activeTab === "basic" ? "Next" : "Publish"}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeTab === "basic" ? (
            <motion.div
              key="basic"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full overflow-y-auto p-8"
            >
              <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <FaBook />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">
                        Book Metadata
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. The Art of Craft"
                        onBlur={generateSlug}
                        required
                      />
                      <Input
                        label="Subtitle"
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleChange}
                        placeholder="Optional subtitle"
                      />
                      <Input
                        label="Author"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        placeholder="Author Name"
                        required
                      />
                      <Input
                        label="Published Year"
                        name="published"
                        value={formData.published}
                        onChange={handleChange}
                        placeholder="2024"
                        required
                      />
                    </div>
                    <Textarea
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Detailed description of your book..."
                      rows={5}
                      required
                    />
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">
                      <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                        <FaLayerGroup />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">
                        Classification & Formats
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Select
                          label="Category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          options={categories.map((cat) => ({
                            value: cat.name,
                            label: cat.name,
                          }))}
                          labelAction={
                            isAdmin ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setShowNewCategory(!showNewCategory)
                                }
                                className="text-xs font-semibold text-brand-primary"
                              >
                                {showNewCategory ? "Cancel" : "+ New"}
                              </button>
                            ) : undefined
                          }
                        />
                        {showNewCategory && isAdmin && (
                          <div className="mt-2 flex gap-2">
                            <input
                              value={newCategoryName}
                              onChange={(e) =>
                                setNewCategoryName(e.target.value)
                              }
                              placeholder="New Category"
                              className="flex-1 px-3 py-2 text-sm border rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={handleCreateCategory}
                              className="px-3 py-1 bg-brand-primary text-white rounded-lg text-xs"
                            >
                              Add
                            </button>
                          </div>
                        )}
                      </div>
                      <Select
                        label="Language"
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        options={[
                          { value: "English", label: "English" },
                          { value: "Hindi", label: "Hindi" },
                          { value: "Urdu", label: "Urdu" },
                        ]}
                      />
                      <Input
                        label="Price (₹)"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        required
                      />
                      <Input
                        label="Page Count"
                        name="pages"
                        type="number"
                        value={formData.pages}
                        onChange={handleChange}
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                        <FaImage />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">
                        Cover & Slug
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <Input
                        label="Cover Image Path"
                        name="imagePath"
                        value={formData.imagePath}
                        onChange={handleChange}
                        placeholder="cover.jpg"
                        subtext="assets/publications/..."
                        required
                      />
                      <Input
                        label="URL Slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        disabled={!!editId}
                        subtext="Auto-generated"
                      />
                    </div>
                  </div>

                  <div className="bg-brand-primary/5 p-6 rounded-2xl border border-brand-primary/10">
                    <h4 className="font-bold text-brand-primary mb-2">
                      Publishing Tips
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                      <li>Use high-quality cover images.</li>
                      <li>Write a compelling description.</li>
                      <li>Double-check pricing and currency.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col"
            >
              {/* Format Selector if not chosen */}
              {/* Actually, let's include the format switcher nicely at the top or just assume 'write' if chapters exist */}

              <div className="flex-1 flex overflow-hidden">
                {contentType === "pdf" && (
                  <div className="m-auto max-w-lg w-full bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center space-y-6">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-3xl">
                      <FaFileUpload />
                    </div>
                    <h2 className="text-2xl font-bold">Upload PDF Document</h2>
                    <p className="text-gray-500">
                      Upload a pre-formatted PDF for your publication.
                    </p>
                    <Input
                      label="PDF File Path"
                      name="pdfPath"
                      value={formData.pdfPath}
                      onChange={handleChange}
                      placeholder="Path to PDF file..."
                    />
                    <div className="flex gap-4 justify-center pt-4">
                      <button
                        onClick={() => setContentType("write")}
                        className="text-sm text-gray-500 hover:text-brand-primary underline"
                      >
                        Switch to Writer Mode
                      </button>
                    </div>
                  </div>
                )}

                {contentType === "write" && (
                  <>
                    {/* Sidebar - Chapter Navigation */}
                    <div className="w-80 bg-white border-r border-gray-200 flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                      <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                          <FaListUl /> Outline
                        </h3>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setShowSmartImport(true)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                            title="AI Import"
                          >
                            <FaMagic />
                          </button>
                          <button
                            onClick={addChapter}
                            className="p-2 text-icon-on-light hover:bg-brand-primary/10 rounded-lg"
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {chapters.map((chapter, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setActiveChapterIndex(idx);
                              setActivePageIndex(0);
                            }}
                            className={`group p-3 rounded-xl cursor-pointer border transition-all relative ${activeChapterIndex === idx ? "bg-brand-primary/5 border-brand-primary/20 shadow-sm" : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-200"}`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span
                                className={`text-xs font-bold uppercase tracking-wider ${activeChapterIndex === idx ? "text-editorial-accent" : "text-gray-400"}`}
                              >
                                Chapter {idx + 1}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeChapter(idx);
                                }}
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity p-1"
                              >
                                <FaTrash size={10} />
                              </button>
                            </div>
                            <div
                              className={`font-medium truncate ${activeChapterIndex === idx ? "text-gray-900" : "text-gray-600"}`}
                            >
                              {chapter.title || "Untitled Chapter"}
                            </div>
                            <div className="flex gap-1 mt-2">
                              {chapter.pages.map((_, pIdx) => (
                                <div
                                  key={pIdx}
                                  className={`h-1 flex-1 rounded-full ${activeChapterIndex === idx && activePageIndex === pIdx ? "bg-brand-primary" : "bg-gray-200"}`}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Editor Workspace */}
                    <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
                      {/* Chapter Header Tooling */}
                      <div className="px-8 py-4 border-b border-gray-100 flex items-center gap-4 bg-white z-10">
                        <input
                          value={chapters[activeChapterIndex]?.title || ""}
                          onChange={(e) =>
                            updateChapterTitle(
                              activeChapterIndex,
                              e.target.value,
                            )
                          }
                          placeholder="Chapter Title"
                          className="flex-1 text-2xl font-bold border-none px-0 py-1 focus:ring-0 placeholder:text-gray-300 text-gray-800 outline-none bg-transparent"
                        />
                        <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-lg shrink-0">
                          {chapters[activeChapterIndex]?.pages.map(
                            (_, pIdx) => (
                              <button
                                key={pIdx}
                                onClick={() => setActivePageIndex(pIdx)}
                                className={`w-8 h-8 rounded-md text-sm font-medium flex items-center justify-center transition-all ${activePageIndex === pIdx ? "bg-white shadow-sm text-brand-primary" : "text-gray-500 hover:text-gray-900"}`}
                              >
                                {pIdx + 1}
                              </button>
                            ),
                          )}
                          <button
                            onClick={() => addPage(activeChapterIndex)}
                            className="w-8 h-8 rounded-md hover:bg-white hover:shadow-sm text-gray-500 hover:text-brand-primary flex items-center justify-center transition-all"
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            removePage(activeChapterIndex, activePageIndex)
                          }
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>

                      {/* Rich Text Editor */}
                      <div className="flex-1 overflow-y-auto bg-gray-50/30">
                        <div className="max-w-4xl mx-auto h-full min-h-[500px] bg-white shadow-sm my-8 rounded-xl overflow-hidden border border-gray-100">
                          <RichTextEditor
                            key={`${activeChapterIndex}-${activePageIndex}`}
                            value={
                              chapters[activeChapterIndex]?.pages[
                                activePageIndex
                              ]?.content || ""
                            }
                            onChange={(val) =>
                              updatePageContent(
                                activeChapterIndex,
                                activePageIndex,
                                val,
                              )
                            }
                            placeholder="Start writing your masterpiece..."
                            className="h-full border-none"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
