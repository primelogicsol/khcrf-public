"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  FaUniversity, FaLandmark, FaBuilding, FaGlobe, FaShieldAlt,
  FaUsers, FaHandshake, FaBookOpen, FaChartPie, FaComments,
  FaCheckCircle, FaSpinner, FaChevronDown, FaChevronUp,
} from "react-icons/fa";
import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import { participatingInstitutionsHeroFallback } from "@/config/heroFallbacks";
import { KASHMIR_DISTRICT_NAMES } from "@/lib/kashmir-districts";

// ── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES: { group: string; items: string[] }[] = [
  { group: "Government & Public Institutions", items: ["Government Department", "Development Authority", "Public Sector Enterprise", "Local Government Institution", "Regulatory Authority"] },
  { group: "Academic & Research", items: ["University", "College", "Research Institute", "Think Tank", "Technical Training Institute"] },
  { group: "Industry & Business", items: ["Manufacturer", "Exporter", "Cooperative", "Producer Company", "Trade Association", "Chamber of Commerce", "Retail Business", "Private Enterprise", "Startup"] },
  { group: "Cultural & Heritage", items: ["Museum", "Cultural Institution", "Heritage Organization", "Archive", "Library"] },
  { group: "Civil Society", items: ["Non-Governmental Organization (NGO)", "Foundation", "Trust", "Society", "Community Organization"] },
  { group: "International", items: ["International Organization", "UN Agency", "Development Agency", "Embassy / Consulate", "International Research Institution"] },
  { group: "Financial & Professional", items: ["Financial Institution", "CSR Foundation", "Consulting Organization", "Certification Body"] },
  { group: "Media & Communication", items: ["Media House", "Digital Media Platform", "Publisher", "Broadcasting Organization"] },
  { group: "Other", items: ["Other Institution"] },
];

const PARTICIPATION_GROUPS: { group: string; items: string[] }[] = [
  { group: "Institutional Participation", items: ["Institutional Registration", "Strategic Partnership", "Organizational Membership"] },
  { group: "State of Kashmir Crafts Assessment", items: ["Institutional Submission", "Stakeholder Consultation", "Evidence Contribution", "Public Hearing Participation", "Validation Round", "Expert Review", "Advisory Participation", "Official Message Submission"] },
  { group: "Research & Knowledge", items: ["Research Collaboration", "Joint Publications", "Knowledge Exchange", "Data Sharing", "Documentation Partnership"] },
  { group: "Technical Support", items: ["Technical Expertise", "Policy Advisory", "Standards Development", "Capacity Building", "Digital Innovation"] },
  { group: "Outreach", items: ["Public Awareness", "Media Collaboration", "Educational Activities", "Workshops", "Events"] },
  { group: "Heritage", items: ["Museum Collaboration", "Collection Documentation", "Conservation", "Cultural Exchange"] },
  { group: "Business Support", items: ["Market Development", "Artisan Support", "Enterprise Development", "Certification Support"] },
  { group: "Funding & Support", items: ["Grants", "Sponsorship", "CSR Partnership", "Donations"] },
  { group: "Other", items: ["Other Participation"] },
];

const EXPERTISE_TAGS = [
  "Handicrafts", "Heritage Conservation", "Cultural Policy", "Research", "Education",
  "Museum Studies", "Sustainable Development", "Environment", "Rural Development", "Tourism",
  "International Trade", "Business Development", "Digital Technology", "GIS & Mapping",
  "Documentation", "Marketing", "Legal & GI Protection", "Intellectual Property",
  "Textile Science", "Design", "Architecture", "Craft Revival", "Community Development",
  "Women Empowerment", "Youth Development", "Finance", "Governance", "Other",
];

const INDIA_STATES = [
  "Jammu & Kashmir", "Ladakh", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Puducherry",
];

const JK_DISTRICTS = [
  "Srinagar", "Anantnag", "Baramulla", "Bandipora", "Budgam", "Ganderbal", "Kulgam", "Kupwara", "Pulwama", "Shopian",
  "Jammu", "Kathua", "Samba", "Udhampur", "Reasi", "Ramban", "Doda", "Kishtwar", "Poonch", "Rajouri"
];

const LADAKH_DISTRICTS = [
  "Leh", "Kargil"
];

const COUNTRIES = [
  "India", "Afghanistan", "Australia", "Bangladesh", "Belgium", "Bhutan", "Canada", "China",
  "Denmark", "Egypt", "Finland", "France", "Germany", "Iran", "Italy", "Japan", "Jordan",
  "Kazakhstan", "Kuwait", "Malaysia", "Maldives", "Morocco", "Myanmar", "Nepal", "Netherlands",
  "New Zealand", "Norway", "Oman", "Pakistan", "Qatar", "Russia", "Saudi Arabia", "Singapore",
  "Spain", "Sri Lanka", "Sweden", "Switzerland", "Turkey", "UAE", "United Kingdom",
  "United States", "Uzbekistan", "Other",
];

const SCOPE_OPTIONS = [
  { value: "KHCRF", label: "Hamadan Craft Revival Foundation (KHCRF)", desc: "Institutional registry, partnership, and membership portal." },
  { value: "SKC", label: "State of Kashmir Crafts Assessment 2026–2027", desc: "Official institutional participation and consultation registry." },
  { value: "BOTH", label: "Both KHCRF and State of Kashmir Crafts", desc: "Participate across both ecosystems through a single unified registration." },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function toggle(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
}

function CollapsibleGroup({ group, items, selected, onToggle }: { group: string; items: string[]; selected: string[]; onToggle: (v: string) => void }) {
  const [open, setOpen] = useState(true);
  const checkedCount = items.filter(i => selected.includes(i)).length;
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button type="button" onClick={() => setOpen(o => !o)} className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 transition text-left">
        <span className="font-bold text-sm text-gray-800">
          {group}
          {checkedCount > 0 && <span className="ml-2 text-xs bg-brand-primary text-white px-2 py-0.5 rounded-full">{checkedCount}</span>}
        </span>
        {open ? <FaChevronUp className="text-gray-400 text-xs" /> : <FaChevronDown className="text-gray-400 text-xs" />}
      </button>
      {open && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3">
          {items.map(item => (
            <label key={item} className="flex items-start gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition">
              <input
                type="checkbox"
                className="mt-0.5 w-4 h-4 accent-brand-primary shrink-0"
                checked={selected.includes(item)}
                onChange={() => onToggle(item)}
              />
              <span className="text-sm text-gray-700">{item}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

type FormData = {
  participationScope: string;
  institutionName: string;
  category: string;
  representativeName: string;
  designation: string;
  email: string;
  phone: string;
  country: string;
  stateProvince: string;
  districtCity: string;
  website: string;
  participationTypes: string[];
  areasOfExpertise: string[];
  profile: string;
  proposedContribution: string;
  authConsent: boolean;
  privacyConsent: boolean;
  publicDirectoryConsent: boolean;
  communicationsConsent: boolean;
};

const INITIAL: FormData = {
  participationScope: "",
  institutionName: "",
  category: "",
  representativeName: "",
  designation: "",
  email: "",
  phone: "",
  country: "",
  stateProvince: "",
  districtCity: "",
  website: "",
  participationTypes: [],
  areasOfExpertise: [],
  profile: "",
  proposedContribution: "",
  authConsent: false,
  privacyConsent: false,
  publicDirectoryConsent: false,
  communicationsConsent: false,
};

export default function ParticipatingInstitutionsPage() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [result, setResult] = useState<{ referenceNumber: string; status: string; participationScope: string } | null>(null);

  const set = (field: keyof FormData, value: any) => {
    setForm(p => ({ ...p, [field]: value }));
    if (errors[field]) setErrors(p => { const n = { ...p }; delete n[field]; return n; });
  };

  const setMultiple = (fields: Partial<FormData>) => {
    setForm(p => ({ ...p, ...fields }));
    setErrors(p => {
      const n = { ...p };
      Object.keys(fields).forEach(f => {
        delete n[f];
      });
      return n;
    });
  };

  const toggleParticipation = (v: string) => set("participationTypes", toggle(form.participationTypes, v));
  const toggleExpertise = (v: string) => set("areasOfExpertise", toggle(form.areasOfExpertise, v));

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.participationScope) e.participationScope = "Please select a participation scope.";
    if (!form.institutionName.trim()) e.institutionName = "Institution name is required.";
    if (!form.category) e.category = "Please select a category.";
    if (!form.representativeName.trim()) e.representativeName = "Representative name is required.";
    if (!form.designation.trim()) e.designation = "Designation is required.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "A valid institutional email is required.";
    if (!form.phone.trim() || form.phone.length < 7) e.phone = "A valid phone number is required.";
    if (!form.country) e.country = "Country is required.";
    if (!form.districtCity.trim()) e.districtCity = "District / City is required.";
    if (form.participationTypes.length === 0) e.participationTypes = "Please select at least one participation type.";
    if (!form.authConsent) e.authConsent = "Authorization confirmation is required.";
    if (!form.privacyConsent) e.privacyConsent = "Privacy consent is required.";
    if (form.website && !/^https?:\/\//.test(form.website)) e.website = "Must start with https:// or http://";
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) document.getElementById(`field-${first}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setApiError("");
    try {
      const res = await fetch("/api/backend/skc/institutions/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      // Unwrap responseFormatter envelope — success: {status:'success',data:{...}} or raw {success:true,...}
      //                                    error:   {status:'error',data:{success:false,error:...}} or raw {success:false,error:...}
      const payload = (data?.data !== undefined) ? data.data : data;
      const regData = payload?.data || payload;
      if (res.ok && (payload?.success === true || regData?.referenceNumber)) {
        setResult({
          referenceNumber: regData.referenceNumber,
          status: regData.status || 'SUBMITTED',
          participationScope: regData.participationScope || form.participationScope
        });
      } else {
        const msg = payload?.error || payload?.message || data?.message || "Failed to submit registration.";
        setApiError(res.status === 400 ? msg : "We could not complete your registration. Please try again.");
      }
    } catch {
      setApiError("A network error occurred. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scopeLabel: Record<string, string> = { KHCRF: "KHCRF", SKC: "State of Kashmir Crafts", BOTH: "KHCRF & State of Kashmir Crafts" };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (result) {
    return (
      <main className="w-full">
        <UniversalEditorialHero pageKey="participating-institutions" fallbackConfig={participatingInstitutionsHeroFallback as any} />
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-10 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheckCircle className="text-4xl text-green-500" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Registration Submitted</h2>
              <p className="text-gray-600 mb-8">Your institution has been registered for <strong>{scopeLabel[result.participationScope] || result.participationScope}</strong>. The Assessment Secretariat will review your application and be in touch.</p>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-left max-w-sm mx-auto mb-8 space-y-3">
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Reference Number</span>
                  <span className="font-black text-brand-primary text-lg">{result.referenceNumber}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Participation Scope</span>
                  <span className="text-sm font-bold text-gray-800">{scopeLabel[result.participationScope] || result.participationScope}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Status</span>
                  <span className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full">{result.status}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-8">Please save your reference number for all follow-up enquiries.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => { setForm(INITIAL); setResult(null); }}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition"
                >
                  Register Another Institution
                </button>
                <Link 
                  href="/" 
                  onClick={() => { setForm(INITIAL); setResult(null); }}
                  className="px-6 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-secondary transition text-center"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────
  const isIndia = form.country === "India";
  const isJK = isIndia && (form.stateProvince === "Jammu & Kashmir" || form.stateProvince === "Ladakh");

  return (
    <main className="w-full">
      <UniversalEditorialHero pageKey="participating-institutions" fallbackConfig={participatingInstitutionsHeroFallback as any} />

      {/* Intro */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: FaBuilding, title: "Unified Registry", desc: "One registration serves both KHCRF and the State of Kashmir Crafts Assessment 2026–2027." },
              { icon: FaHandshake, title: "Strategic Partnerships", desc: "Formalise your institution's engagement with craft heritage policy and research." },
              { icon: FaGlobe, title: "Global Participation", desc: "Open to national and international institutions, agencies, and organizations." },
            ].map((c, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary shrink-0"><c.icon className="text-xl" /></div>
                <div><h3 className="font-bold text-gray-900 mb-1">{c.title}</h3><p className="text-sm text-gray-600">{c.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="register" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-200 shadow-lg">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-brand-dark mb-2">Institution Registration</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Register your institution to participate in the Hamadan Craft Revival Foundation (KHCRF), the State of Kashmir Crafts Assessment 2026–2027, or both.</p>
            </div>

            {apiError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-bold">{apiError}</div>
            )}
            {Object.keys(errors).length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-bold">
                Please correct the highlighted fields below.
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-10">

              {/* ── SCOPE ── */}
              <div id="field-participationScope">
                <h3 className="text-base font-black text-gray-900 mb-1">Participation Scope <span className="text-red-500">*</span></h3>
                <p className="text-sm text-gray-500 mb-4">Select the institutional programme(s) you wish to participate in.</p>
                <div className="space-y-3">
                  {SCOPE_OPTIONS.map(opt => (
                    <label key={opt.value} className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${form.participationScope === opt.value ? "border-brand-primary bg-brand-primary/5" : "border-gray-200 hover:border-gray-300"}`}>
                      <input type="radio" name="participationScope" value={opt.value} checked={form.participationScope === opt.value} onChange={() => set("participationScope", opt.value)} className="mt-1 accent-brand-primary" />
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{opt.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.participationScope && <p className="text-red-500 text-xs mt-2 font-bold">{errors.participationScope}</p>}
              </div>

              {/* ── INSTITUTION ── */}
              <div>
                <h3 className="text-base font-black text-gray-900 mb-5 pb-2 border-b border-gray-100">Institution Details</h3>
                <div className="space-y-5">
                  <div id="field-institutionName">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Institution Name <span className="text-red-500">*</span></label>
                    <input type="text" value={form.institutionName} onChange={e => set("institutionName", e.target.value)} placeholder="Full legal name of the institution or organization" className={`w-full p-3 border ${errors.institutionName ? "border-red-400 bg-red-50" : "border-gray-300 bg-gray-50"} rounded-xl text-sm focus:ring-2 focus:ring-brand-primary outline-none`} />
                    {errors.institutionName && <p className="text-red-500 text-xs mt-1 font-bold">{errors.institutionName}</p>}
                  </div>

                  <div id="field-category">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Institution Category <span className="text-red-500">*</span></label>
                    <select value={form.category} onChange={e => set("category", e.target.value)} className={`w-full p-3 border ${errors.category ? "border-red-400 bg-red-50" : "border-gray-300 bg-gray-50"} rounded-xl text-sm focus:ring-2 focus:ring-brand-primary outline-none`}>
                      <option value="">Select one</option>
                      {CATEGORIES.map(g => (
                        <optgroup key={g.group} label={g.group}>
                          {g.items.map(i => <option key={i} value={i}>{i}</option>)}
                        </optgroup>
                      ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-xs mt-1 font-bold">{errors.category}</p>}
                  </div>

                  <div id="field-website">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Website <span className="text-gray-400 font-normal">(Optional)</span></label>
                    <input type="url" value={form.website} onChange={e => set("website", e.target.value)} placeholder="https://" className={`w-full p-3 border ${errors.website ? "border-red-400 bg-red-50" : "border-gray-300 bg-gray-50"} rounded-xl text-sm focus:ring-2 focus:ring-brand-primary outline-none`} />
                    {errors.website && <p className="text-red-500 text-xs mt-1 font-bold">{errors.website}</p>}
                  </div>
                </div>
              </div>

              {/* ── REPRESENTATIVE ── */}
              <div>
                <h3 className="text-base font-black text-gray-900 mb-5 pb-2 border-b border-gray-100">Authorized Representative</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div id="field-representativeName">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                    <input type="text" value={form.representativeName} onChange={e => set("representativeName", e.target.value)} placeholder="Your full name" className={`w-full p-3 border ${errors.representativeName ? "border-red-400 bg-red-50" : "border-gray-300 bg-gray-50"} rounded-xl text-sm focus:ring-2 focus:ring-brand-primary outline-none`} />
                    {errors.representativeName && <p className="text-red-500 text-xs mt-1 font-bold">{errors.representativeName}</p>}
                  </div>
                  <div id="field-designation">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Designation / Title <span className="text-red-500">*</span></label>
                    <input type="text" value={form.designation} onChange={e => set("designation", e.target.value)} placeholder="e.g. Director, Dean, Secretary" className={`w-full p-3 border ${errors.designation ? "border-red-400 bg-red-50" : "border-gray-300 bg-gray-50"} rounded-xl text-sm focus:ring-2 focus:ring-brand-primary outline-none`} />
                    {errors.designation && <p className="text-red-500 text-xs mt-1 font-bold">{errors.designation}</p>}
                  </div>
                  <div id="field-email">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Official Email <span className="text-red-500">*</span></label>
                    <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="name@institution.org" className={`w-full p-3 border ${errors.email ? "border-red-400 bg-red-50" : "border-gray-300 bg-gray-50"} rounded-xl text-sm focus:ring-2 focus:ring-brand-primary outline-none`} />
                    {errors.email && <p className="text-red-500 text-xs mt-1 font-bold">{errors.email}</p>}
                  </div>
                  <div id="field-phone">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                    <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+91 00000 00000" className={`w-full p-3 border ${errors.phone ? "border-red-400 bg-red-50" : "border-gray-300 bg-gray-50"} rounded-xl text-sm focus:ring-2 focus:ring-brand-primary outline-none`} />
                    {errors.phone && <p className="text-red-500 text-xs mt-1 font-bold">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* ── LOCATION ── */}
              <div>
                <h3 className="text-base font-black text-gray-900 mb-5 pb-2 border-b border-gray-100">Primary Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div id="field-country">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Country <span className="text-red-500">*</span></label>
                    <select value={form.country} onChange={e => setMultiple({ country: e.target.value, stateProvince: "", districtCity: "" })} className={`w-full p-3 border ${errors.country ? "border-red-400 bg-red-50" : "border-gray-300 bg-gray-50"} rounded-xl text-sm focus:ring-2 focus:ring-brand-primary outline-none`}>
                      <option value="">Select country</option>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.country && <p className="text-red-500 text-xs mt-1 font-bold">{errors.country}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">State / Province / Region</label>
                    {isIndia ? (
                      <select value={form.stateProvince} onChange={e => setMultiple({ stateProvince: e.target.value, districtCity: "" })} className="w-full p-3 border border-gray-300 bg-gray-50 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary outline-none">
                        <option value="">Select state</option>
                        {INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    ) : (
                      <input type="text" value={form.stateProvince} onChange={e => set("stateProvince", e.target.value)} placeholder="State / Province" className="w-full p-3 border border-gray-300 bg-gray-50 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary outline-none" />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">District / City</label>
                    {isJK ? (
                      form.stateProvince === "Ladakh" ? (
                        <select value={form.districtCity} onChange={e => set("districtCity", e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary outline-none">
                          <option value="">Select district</option>
                          {LADAKH_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      ) : (
                        <select value={form.districtCity} onChange={e => set("districtCity", e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary outline-none">
                          <option value="">Select district</option>
                          {JK_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      )
                    ) : (
                      <input type="text" value={form.districtCity} onChange={e => set("districtCity", e.target.value)} placeholder="District / City" className="w-full p-3 border border-gray-300 bg-gray-50 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary outline-none" />
                    )}
                  </div>
                </div>
              </div>

              {/* ── PARTICIPATION TYPES ── */}
              <div id="field-participationTypes">
                <h3 className="text-base font-black text-gray-900 mb-1">Intended Participation <span className="text-red-500">*</span></h3>
                <p className="text-sm text-gray-500 mb-4">Select all that apply. You may select across multiple categories.</p>
                <div className="space-y-2">
                  {PARTICIPATION_GROUPS.map(g => (
                    <CollapsibleGroup key={g.group} group={g.group} items={g.items} selected={form.participationTypes} onToggle={toggleParticipation} />
                  ))}
                </div>
                {form.participationTypes.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {form.participationTypes.map(t => (
                      <span key={t} className="px-2 py-1 bg-brand-primary/10 text-brand-primary text-xs font-bold rounded-full flex items-center gap-1">
                        {t}
                        <button type="button" onClick={() => toggleParticipation(t)} className="hover:text-red-500 font-black">×</button>
                      </span>
                    ))}
                  </div>
                )}
                {errors.participationTypes && <p className="text-red-500 text-xs mt-2 font-bold">{errors.participationTypes}</p>}
              </div>

              {/* ── EXPERTISE ── */}
              <div>
                <h3 className="text-base font-black text-gray-900 mb-1">Areas of Expertise <span className="text-gray-400 font-normal text-sm">(Optional)</span></h3>
                <p className="text-sm text-gray-500 mb-4">Select all applicable areas of institutional expertise.</p>
                <div className="flex flex-wrap gap-2">
                  {EXPERTISE_TAGS.map(tag => (
                    <button
                      key={tag} type="button"
                      onClick={() => toggleExpertise(tag)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-[10px] border transition-colors ${form.areasOfExpertise.includes(tag) ? "border-[#6B2A08] bg-[#6B2A08] text-white" : "border-slate-300 bg-white text-slate-700 hover:border-[#6B2A08]/50"}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── DESCRIPTIVE ── */}
              <div>
                <h3 className="text-base font-black text-gray-900 mb-5 pb-2 border-b border-gray-100">About Your Institution</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Brief Institutional Profile <span className="text-gray-400 font-normal">(Optional)</span></label>
                    <textarea value={form.profile} onChange={e => set("profile", e.target.value)} rows={4} placeholder="Briefly describe your institution, mission, and primary activities." className="w-full p-3 border border-gray-300 bg-gray-50 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary outline-none resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Proposed Contribution <span className="text-gray-400 font-normal">(Optional)</span></label>
                    <textarea value={form.proposedContribution} onChange={e => set("proposedContribution", e.target.value)} rows={4} placeholder="Describe how your institution intends to contribute to KHCRF, the State of Kashmir Crafts Assessment, or both." className="w-full p-3 border border-gray-300 bg-gray-50 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary outline-none resize-none" />
                  </div>
                </div>
              </div>

              {/* ── CONSENTS ── */}
              <div>
                <h3 className="text-base font-black text-gray-900 mb-5 pb-2 border-b border-gray-100">Consents & Declarations</h3>
                <div className="space-y-4">

                  {/* Auth — required */}
                  <div id="field-authConsent" className={`flex items-start gap-3 p-4 rounded-xl border ${errors.authConsent ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"}`}>
                    <input type="checkbox" id="authConsent" checked={form.authConsent} onChange={e => set("authConsent", e.target.checked)} className="mt-1 w-4 h-4 accent-brand-primary shrink-0" />
                    <label htmlFor="authConsent" className="text-sm text-gray-700 cursor-pointer">
                      <span className="font-bold block mb-1">Authorized Representative <span className="text-red-500">*</span></span>
                      I confirm that I am authorized to represent this institution in relation to KHCRF, the State of Kashmir Crafts Assessment, or both, according to the participation scope selected above.
                    </label>
                  </div>
                  {errors.authConsent && <p className="text-red-500 text-xs font-bold -mt-2">{errors.authConsent}</p>}

                  {/* Privacy — required */}
                  <div id="field-privacyConsent" className={`flex items-start gap-3 p-4 rounded-xl border ${errors.privacyConsent ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"}`}>
                    <input type="checkbox" id="privacyConsent" checked={form.privacyConsent} onChange={e => set("privacyConsent", e.target.checked)} className="mt-1 w-4 h-4 accent-brand-primary shrink-0" />
                    <label htmlFor="privacyConsent" className="text-sm text-gray-700 cursor-pointer">
                      <span className="font-bold block mb-1">Privacy & Data Processing <span className="text-red-500">*</span></span>
                      I consent to KHCRF collecting, storing, and processing this information solely for institutional registration, partnership management, and participation administration in accordance with the KHCRF Privacy Policy.
                    </label>
                  </div>
                  {errors.privacyConsent && <p className="text-red-500 text-xs font-bold -mt-2">{errors.privacyConsent}</p>}

                  {/* Public directory — optional */}
                  <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50">
                    <input type="checkbox" id="publicDirectoryConsent" checked={form.publicDirectoryConsent} onChange={e => set("publicDirectoryConsent", e.target.checked)} className="mt-1 w-4 h-4 accent-brand-primary shrink-0" />
                    <label htmlFor="publicDirectoryConsent" className="text-sm text-gray-700 cursor-pointer">
                      <span className="font-bold block mb-1">Public Institution Directory <span className="text-gray-400 font-normal">(Optional)</span></span>
                      I consent to my institution's name, category, website, country, and approved participation areas being published in the KHCRF and/or State of Kashmir Crafts Participating Institutions Directory after verification.
                    </label>
                  </div>

                  {/* Communications — optional */}
                  <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50">
                    <input type="checkbox" id="communicationsConsent" checked={form.communicationsConsent} onChange={e => set("communicationsConsent", e.target.checked)} className="mt-1 w-4 h-4 accent-brand-primary shrink-0" />
                    <label htmlFor="communicationsConsent" className="text-sm text-gray-700 cursor-pointer">
                      <span className="font-bold block mb-1">Communications <span className="text-gray-400 font-normal">(Optional)</span></span>
                      I agree to receive institutional updates, consultation invitations, research opportunities, partnership announcements, and relevant communications from KHCRF.
                    </label>
                  </div>
                </div>
              </div>

              {/* ── SUBMIT ── */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-brand-primary text-white font-black text-lg rounded-xl hover:bg-brand-secondary transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <><FaSpinner className="animate-spin" /> Submitting...</> : "Submit Institution Registration"}
              </button>

            </form>
          </div>
        </div>
      </section>

      {/* Transparency */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-gray-50 border-l-4 border-[var(--card-left-accent)] p-6 md:p-8 rounded-r-2xl shadow-sm flex items-start gap-4">
            <FaShieldAlt data-ui-icon  className="text-3xl  shrink-0 mt-1" />
            <div>
              <h3 className="font-black text-gray-900 mb-2">Transparency Policy</h3>
              <p className="text-gray-600 font-medium text-sm leading-relaxed">
                Registration indicates participation in the consultation process. It does not imply endorsement of KHCRF findings or any political position. Public directory listing requires verification and explicit consent. Institutional data is held in strict confidence and used solely for programme administration.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
