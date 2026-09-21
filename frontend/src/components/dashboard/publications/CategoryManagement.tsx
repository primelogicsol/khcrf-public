"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import {
  FaTrash, FaEdit, FaPlus, FaTimes, FaTags, FaFolder,
  FaGlobe, FaCheck, FaSearch, FaBrain, FaChevronRight,
  FaBook, FaFlask, FaBalanceScale, FaChartLine, FaBoxOpen,
  FaGraduationCap, FaMapMarkerAlt, FaCertificate, FaShieldAlt,
  FaLandmark, FaShoppingBag, FaStar, FaClipboardList, FaFileAlt,
  FaCogs, FaUsers,
} from "react-icons/fa";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import Select from "@/components/common/Select";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
  slug: string;
  publicLabel?: string;
  description: string | null;
  seoTitle?: string;
  seoDescription?: string;
  sortOrder?: number;
  visibility?: string;
  defaultAccessTier?: string;
  _count?: { publications: number };
}

// ─── 15 Knowledge Domain Presets ─────────────────────────────────────────────

const DOMAIN_PRESETS = [
  {
    name: "Research Papers",
    slug: "research-papers",
    publicLabel: "Research Papers",
    icon: FaFlask,
    color: "bg-blue-600",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description: "Peer-reviewed academic and field research on Kashmir handicraft materials, techniques, markets, and authentication.",
    seoTitle: "Kashmir Handicraft Research Papers | KHCRF",
    seoDescription: "Peer-reviewed research papers on Kashmir handicrafts, GI protection, authentication methods, and artisan economics from KHCRF.",
    defaultAccessTier: "PUBLIC",
  },
  {
    name: "Best Practices",
    slug: "best-practices",
    publicLabel: "Best Practices",
    icon: FaStar,
    color: "bg-amber-600",
    textColor: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    description: "Documented best practices for craft production, quality control, GI compliance, and artisan welfare standards.",
    seoTitle: "Kashmir Craft Best Practices | KHCRF",
    seoDescription: "Evidence-based best practices for Pashmina, Kani, Carpet, and other Kashmir handicraft production and quality standards.",
    defaultAccessTier: "PUBLIC",
  },
  {
    name: "Case Studies",
    slug: "case-studies",
    publicLabel: "Case Studies",
    icon: FaBook,
    color: "bg-teal-600",
    textColor: "text-teal-700",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    description: "In-depth case studies of individual artisan clusters, export journeys, authentication successes, and GI disputes.",
    seoTitle: "Kashmir Handicraft Case Studies | KHCRF",
    seoDescription: "Real-world case studies documenting KHCRF's work with artisan communities, GI protection efforts, and authentication projects.",
    defaultAccessTier: "PUBLIC",
  },
  {
    name: "Market Intelligence",
    slug: "market-intelligence",
    publicLabel: "Market Intelligence",
    icon: FaChartLine,
    color: "bg-emerald-600",
    textColor: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    description: "Market data, pricing intelligence, export volume reports, buyer behaviour analysis, and trend forecasting for Kashmir crafts.",
    seoTitle: "Kashmir Handicraft Market Intelligence | KHCRF",
    seoDescription: "Export market data, pricing intelligence, and buyer trend analysis for Kashmir Pashmina, Carpet, Kani, and luxury handicrafts.",
    defaultAccessTier: "MEMBER",
  },
  {
    name: "Policy Briefs",
    slug: "policy-briefs",
    publicLabel: "Policy Briefs",
    icon: FaBalanceScale,
    color: "bg-indigo-600",
    textColor: "text-indigo-700",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    description: "Evidence-based policy recommendations for government bodies, trade councils, and international standards organisations.",
    seoTitle: "Kashmir Handicraft Policy Briefs | KHCRF",
    seoDescription: "KHCRF policy recommendations on GI legislation, artisan welfare, export regulations, and craft cluster development.",
    defaultAccessTier: "PUBLIC",
  },
  {
    name: "Authentication",
    slug: "authentication",
    publicLabel: "Authentication Guides",
    icon: FaShieldAlt,
    color: "bg-rose-600",
    textColor: "text-rose-700",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    description: "Technical guides, protocols, and standards for authenticating Kashmir handicrafts including fibre analysis, optical scanning, and DNA tagging.",
    seoTitle: "Kashmir Handicraft Authentication | KHCRF",
    seoDescription: "Technical authentication guides for Kashmir Pashmina, Kani shawls, and other GI-protected handicrafts using scientific methods.",
    defaultAccessTier: "PUBLIC",
  },
  {
    name: "Craft Documentation",
    slug: "craft-documentation",
    publicLabel: "Craft Documentation",
    icon: FaClipboardList,
    color: "bg-orange-600",
    textColor: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    description: "Technical documentation of craft techniques, tools, material specifications, and process standards for preservation and transmission.",
    seoTitle: "Kashmir Craft Documentation | KHCRF",
    seoDescription: "Detailed technical documentation of Kashmir handicraft techniques including Pashmina spinning, Kani weaving, and Sozni embroidery.",
    defaultAccessTier: "PUBLIC",
  },
  {
    name: "Cluster Reports",
    slug: "cluster-reports",
    publicLabel: "Cluster Reports",
    icon: FaMapMarkerAlt,
    color: "bg-purple-600",
    textColor: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    description: "Geographic and economic reports on artisan cluster performance, infrastructure assessment, and livelihood indicators.",
    seoTitle: "Kashmir Artisan Cluster Reports | KHCRF",
    seoDescription: "Detailed reports on Kashmir artisan clusters covering production capacity, economic indicators, and infrastructure needs.",
    defaultAccessTier: "PUBLIC",
  },
  {
    name: "Export Intelligence",
    slug: "export-intelligence",
    publicLabel: "Export Intelligence",
    icon: FaGlobe,
    color: "bg-cyan-600",
    textColor: "text-cyan-700",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200",
    description: "Country-specific export data, trade barrier analysis, customs frameworks, and market entry guides for Kashmir craft exporters.",
    seoTitle: "Kashmir Handicraft Export Intelligence | KHCRF",
    seoDescription: "Export market intelligence for Kashmir handicrafts covering EU, North America, UAE, Japan, and luxury market segments.",
    defaultAccessTier: "MEMBER",
  },
  {
    name: "Legislative Analysis",
    slug: "legislative-analysis",
    publicLabel: "Legislative Analysis",
    icon: FaLandmark,
    color: "bg-slate-600",
    textColor: "text-slate-700",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    description: "Analysis of GI laws, trade agreements, intellectual property frameworks, and legislative developments affecting Kashmir crafts.",
    seoTitle: "Kashmir Handicraft Legislative Analysis | KHCRF",
    seoDescription: "Analysis of GI Act provisions, international IP frameworks, and legislative developments affecting Kashmir handicraft protection.",
    defaultAccessTier: "PUBLIC",
  },
  {
    name: "Consumer Trends",
    slug: "consumer-trends",
    publicLabel: "Consumer Trends",
    icon: FaShoppingBag,
    color: "bg-pink-600",
    textColor: "text-pink-700",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    description: "Consumer behaviour research, provenance preference studies, ethical consumption trends, and luxury buyer psychology.",
    seoTitle: "Kashmir Handicraft Consumer Trends | KHCRF",
    seoDescription: "Consumer behaviour insights and trend research for Kashmir Pashmina and handicraft buyers in global luxury markets.",
    defaultAccessTier: "MEMBER",
  },
  {
    name: "Luxury Markets",
    slug: "luxury-markets",
    publicLabel: "Luxury Market Intelligence",
    icon: FaCertificate,
    color: "bg-yellow-600",
    textColor: "text-yellow-700",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    description: "Intelligence on luxury market positioning, premium pricing strategies, designer collaborations, and haute couture sourcing.",
    seoTitle: "Kashmir Craft Luxury Market Intelligence | KHCRF",
    seoDescription: "Luxury market intelligence on Kashmir Pashmina positioning, haute couture collaborations, and premium pricing strategy.",
    defaultAccessTier: "PREMIUM",
  },
  {
    name: "Training Guides",
    slug: "training-guides",
    publicLabel: "Training & Capacity Building",
    icon: FaGraduationCap,
    color: "bg-lime-600",
    textColor: "text-lime-700",
    bgColor: "bg-lime-50",
    borderColor: "border-lime-200",
    description: "Training manuals and skill development guides for artisans, quality inspectors, GI evaluators, and craft educators.",
    seoTitle: "Kashmir Craft Training Guides | KHCRF",
    seoDescription: "Professional training and capacity building resources for Kashmir artisans, quality inspectors, and GI certification evaluators.",
    defaultAccessTier: "PUBLIC",
  },
  {
    name: "Field Reports",
    slug: "field-reports",
    publicLabel: "Field Reports",
    icon: FaFileAlt,
    color: "bg-stone-600",
    textColor: "text-stone-700",
    bgColor: "bg-stone-50",
    borderColor: "border-stone-200",
    description: "Ground-level field research reports from artisan communities, including livelihood surveys and raw material assessments.",
    seoTitle: "Kashmir Craft Field Reports | KHCRF",
    seoDescription: "Ground-level field reports from KHCRF research teams documenting artisan livelihoods, materials, and cluster conditions in Kashmir.",
    defaultAccessTier: "PUBLIC",
  },
  {
    name: "Technical Documentation",
    slug: "technical-documentation",
    publicLabel: "Technical Documentation",
    icon: FaCogs,
    color: "bg-gray-600",
    textColor: "text-gray-700",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    description: "Technical specifications, lab protocols, equipment manuals, and quality standards documentation for craft analysis.",
    seoTitle: "Kashmir Craft Technical Documentation | KHCRF",
    seoDescription: "Technical specifications and lab protocols for Kashmir handicraft quality analysis, fibre testing, and authentication equipment.",
    defaultAccessTier: "MEMBER",
  },
];

const BLANK_FORM = {
  name: "", slug: "", publicLabel: "", description: "",
  seoTitle: "", seoDescription: "", sortOrder: "1",
  visibility: "Visible", defaultAccessTier: "PUBLIC",
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editingItem, setEditingItem] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(BLANK_FORM);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/publications/categories");
      const payload = res.data?.data ?? res.data;
      setCategories(Array.isArray(payload) ? payload : []);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const hc = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "name" && !form.slug) {
      setForm(f => ({ ...f, name: value, slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const seedFromPreset = (preset: (typeof DOMAIN_PRESETS)[0]) => {
    setForm({
      name: preset.name,
      slug: preset.slug,
      publicLabel: preset.publicLabel,
      description: preset.description,
      seoTitle: preset.seoTitle,
      seoDescription: preset.seoDescription,
      sortOrder: String(DOMAIN_PRESETS.indexOf(preset) + 1),
      visibility: "Visible",
      defaultAccessTier: preset.defaultAccessTier,
    });
    setShowCreate(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Category name is required"); return; }
    setSaving(true);
    try {
      if (editingItem) {
        await api.put(`/publications/categories/${editingItem.id}`, form);
        toast.success("Category updated");
      } else {
        await api.post("/publications/categories", form);
        toast.success("Category created");
      }
      setForm(BLANK_FORM);
      setShowCreate(false);
      setEditingItem(null);
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to save category");
    } finally { setSaving(false); }
  };

  const startEdit = (cat: Category) => {
    setEditingItem(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      publicLabel: cat.publicLabel || "",
      description: cat.description || "",
      seoTitle: cat.seoTitle || "",
      seoDescription: cat.seoDescription || "",
      sortOrder: String(cat.sortOrder || 1),
      visibility: cat.visibility || "Visible",
      defaultAccessTier: cat.defaultAccessTier || "PUBLIC",
    });
    setShowCreate(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Publications in it will become uncategorised.")) return;
    try {
      await api.delete(`/publications/categories/${id}`);
      toast.success("Category deleted");
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch {
      toast.error("Failed to delete");
    }
  };

  const seedAllDomains = async () => {
    setSeeding(true);
    let created = 0;
    for (const [i, preset] of DOMAIN_PRESETS.entries()) {
      const exists = categories.some(c => c.slug === preset.slug);
      if (!exists) {
        try {
          await api.post("/publications/categories", {
            name: preset.name,
            slug: preset.slug,
            publicLabel: preset.publicLabel,
            description: preset.description,
            seoTitle: preset.seoTitle,
            seoDescription: preset.seoDescription,
            sortOrder: i + 1,
            visibility: "Visible",
            defaultAccessTier: preset.defaultAccessTier,
          });
          created++;
        } catch { /* skip existing */ }
      }
    }
    await fetchCategories();
    setSeeding(false);
    toast.success(`Seeded ${created} new knowledge domain${created !== 1 ? "s" : ""}`);
  };

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.description || "").toLowerCase().includes(search.toLowerCase())
  );

  const getPreset = (slug: string) => DOMAIN_PRESETS.find(p => p.slug === slug);

  return (
    <div className="space-y-6">
      {/* ── Create / Edit Modal ─────────────────────────────────────────── */}
      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-stone-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-sm font-black text-gray-900">
                  {editingItem ? "Edit Knowledge Domain" : "Create Knowledge Domain"}
                </h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Each domain powers a filter, an SEO landing page, and a knowledge taxonomy node</p>
              </div>
              <button onClick={() => { setShowCreate(false); setEditingItem(null); setForm(BLANK_FORM); }}
                className="text-stone-400 hover:text-stone-700 p-2 rounded-lg hover:bg-stone-50">
                <FaTimes />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Domain Name *" name="name" value={form.name} onChange={hc} required placeholder="e.g. Market Intelligence" />
                <Input label="URL Slug" name="slug" value={form.slug} onChange={hc} placeholder="market-intelligence" />
                <Input label="Public Label" name="publicLabel" value={form.publicLabel} onChange={hc} placeholder="Label shown on public hub" />
                <Select label="Default Access Tier" name="defaultAccessTier" value={form.defaultAccessTier} onChange={hc}
                  options={[
                    { value: "PUBLIC", label: "Open Access" },
                    { value: "MEMBER", label: "Member Only" },
                    { value: "PREMIUM", label: "Premium Research" },
                  ]} />
              </div>

              <Textarea label="Description" name="description" value={form.description} onChange={hc} rows={2}
                placeholder="What type of knowledge does this domain contain? Used by readers and AI crawlers." />

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-stone-100">
                <Input label="SEO Meta Title" name="seoTitle" value={form.seoTitle} onChange={hc}
                  placeholder="Domain Title | KHCRF" />
                <Input label="Sort Order" name="sortOrder" value={form.sortOrder} onChange={hc} placeholder="1" />
              </div>
              <Textarea label="SEO Meta Description" name="seoDescription" value={form.seoDescription} onChange={hc} rows={2}
                placeholder="155-char description for search engines" />

              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-brand-primary text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/20 transition-all disabled:opacity-60">
                  {saving ? "Saving..." : editingItem ? "Update Domain" : "Create Domain"}
                </button>
                <button onClick={() => { setShowCreate(false); setEditingItem(null); setForm(BLANK_FORM); }}
                  className="px-5 py-3 bg-stone-100 text-stone-600 text-xs font-bold rounded-xl hover:bg-stone-200 transition-all">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-gray-900">Knowledge Domain Taxonomy</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {categories.length} of 15 domains seeded · Each domain is a taxonomy node, a public filter, and an SEO category page
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={seedAllDomains} disabled={seeding}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-200 text-gray-700 text-xs font-black uppercase tracking-wider rounded-xl hover:bg-stone-50 transition-all disabled:opacity-60">
            {seeding ? "Seeding..." : `⚡ Seed All 15 Domains`}
          </button>
          <button onClick={() => { setShowCreate(true); setEditingItem(null); setForm(BLANK_FORM); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/20 transition-all">
            <FaPlus size={10} /> New Domain
          </button>
        </div>
      </div>

      {/* ── Taxonomy Preset Grid (visual 15-domain map) ────────────────────── */}
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">KPS 15-Domain Taxonomy Map</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {DOMAIN_PRESETS.map(preset => {
            const Icon = preset.icon;
            const isCreated = categories.some(c => c.slug === preset.slug);
            return (
              <div
                key={preset.slug}
                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all group ${
                  isCreated
                    ? `${preset.bgColor} ${preset.borderColor}`
                    : "bg-white border-stone-200 hover:border-stone-300"
                }`}
                onClick={() => !isCreated && seedFromPreset(preset)}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs mb-2 ${preset.color}`}>
                  <Icon />
                </div>
                <p className={`text-[10px] font-black leading-tight ${isCreated ? preset.textColor : "text-gray-700"}`}>
                  {preset.name}
                </p>
                <p className="text-[8px] text-gray-400 mt-0.5 line-clamp-1">{preset.defaultAccessTier}</p>

                {isCreated ? (
                  <div className="absolute top-2 right-2">
                    <FaCheck size={9} className={preset.textColor} />
                  </div>
                ) : (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FaPlus size={9} className="text-gray-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-[9px] text-gray-400 mt-2">
          Click any grey domain to create it · Green domains ✓ are already in your system · Use "Seed All 15 Domains" to create all at once
        </p>
      </div>

      {/* ── Live Catalog ────────────────────────────────────────────────────── */}
      <div className="bg-white border border-stone-200/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 bg-stone-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-black text-gray-900">
            Live Domain Catalog
            <span className="ml-2 text-[10px] font-bold text-gray-400">({categories.length} domains)</span>
          </h3>
          <div className="relative">
            <FaSearch size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search domains..."
              className="pl-8 pr-4 py-2 text-xs border border-stone-200 rounded-xl bg-white focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-400 text-xs italic">Loading domains...</div>
        ) : filteredCategories.length === 0 ? (
          <div className="py-12 text-center">
            <FaFolder className="mx-auto text-3xl text-stone-200 mb-3" />
            <p className="text-sm font-bold text-stone-500">No domains created yet</p>
            <p className="text-xs text-gray-400 mt-1">Click "Seed All 15 Domains" above to set up the full KHCRF taxonomy in one click.</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {filteredCategories.map(cat => {
              const preset = getPreset(cat.slug);
              const Icon = preset?.icon || FaFolder;
              return (
                <div key={cat.id} className="flex items-center gap-4 px-6 py-4 hover:bg-stone-50/40 transition-all group">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${preset?.color || "bg-stone-500"}`}>
                    <Icon className="text-white text-sm" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-gray-900">{cat.name}</span>
                      {cat.publicLabel && cat.publicLabel !== cat.name && (
                        <span className="text-[9px] font-bold bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">{cat.publicLabel}</span>
                      )}
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        cat.defaultAccessTier === "PREMIUM" ? "bg-rose-50 text-rose-600 border border-rose-100" :
                        cat.defaultAccessTier === "MEMBER" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" :
                        "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      }`}>
                        {cat.defaultAccessTier || "PUBLIC"}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{cat.description}</p>
                    <p className="text-[9px] font-mono text-stone-300 mt-0.5">/{cat.slug}</p>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-right mr-2">
                      <p className="text-[10px] text-gray-400">
                        {cat._count?.publications ?? "—"} pub{cat._count?.publications !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <button onClick={() => startEdit(cat)}
                      className="p-2 text-stone-400 hover:text-brand-primary hover:bg-stone-100 rounded-lg transition-all">
                      <FaEdit size={12} />
                    </button>
                    <button onClick={() => handleDelete(cat.id)}
                      className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Coverage progress ───────────────────────────────────────────────── */}
      <div className="bg-white border border-stone-200/60 rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-black text-gray-900">Taxonomy Coverage</h3>
          <span className="text-xs font-bold text-gray-500">{categories.length}/15 domains seeded</span>
        </div>
        <div className="h-3 bg-stone-100 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-brand-primary to-emerald-500 rounded-full transition-all"
            style={{ width: `${(categories.length / 15) * 100}%` }}
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Open Access Domains", count: categories.filter(c => !c.defaultAccessTier || c.defaultAccessTier === "PUBLIC").length, color: "text-emerald-600" },
            { label: "Member Domains", count: categories.filter(c => c.defaultAccessTier === "MEMBER").length, color: "text-indigo-600" },
            { label: "Premium Domains", count: categories.filter(c => c.defaultAccessTier === "PREMIUM").length, color: "text-rose-600" },
          ].map(s => (
            <div key={s.label} className="text-center p-3 bg-stone-50 rounded-xl">
              <p className={`text-xl font-black ${s.color}`}>{s.count}</p>
              <p className="text-[9px] text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
