"use client";
import { getBaseUrlNoApi } from "@/lib/api";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaSearch, FaFilter, FaHistory, FaArrowDown, FaTimes, FaFilePdf, FaArrowRight } from "react-icons/fa";
import Link from "next/link";

// Mock data model matching the requested fields
interface MessageRecord {
  message_id: string;
  slug: string;
  assessment_year: string;
  name: string;
  designation: string;
  institution: string;
  category: string;
  contributor_type: string;
  district: string;
  title: string;
  excerpt: string;
  message_body: string;
  pdf_url: string | null;
  image_url: string | null;
  published_date: string;
  status: string;
  verification_status: string;
  created_at?: string;
  updated_at?: string;
}

// Since no published records exist yet, we initialize an empty array as required by the prompt
// ("Remove placeholders. Remove dummy names. Remove fake message counts. Remove fake message excerpts.")

export default function MessageArchive() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State initialization from URL or defaults
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All Categories");
  const [contributorType, setContributorType] = useState(searchParams.get("contributor_type") || "All Types");
  const [district, setDistrict] = useState(searchParams.get("district") || "All Districts");
  const [year, setYear] = useState(searchParams.get("year") || "2026");
  
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
const API_BASE_URL = getBaseUrlNoApi();
        const res = await fetch(`/api/backend/skc/official-messages`);
        const data = await res.json();
        if (data.success) {
          setMessages(data.data || []);
        } else {
          setMessages(data || []);
        }
      } catch (e) {
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const categories = ["All Categories", "Government", "Institution", "Expert", "Stakeholder"];
  
  const contributorTypes = [
    "All Types", "Master Artisan", "National Awardee", "Manufacturer", "Exporter", 
    "Retailer", "Researcher", "Academic", "Media Professional", "Women Leader", 
    "Youth Representative", "Tourism Stakeholder", "Financial Institution", 
    "Civil Society", "Political Representative", "Diaspora", "Government Officer", 
    "Department Head", "University Representative", "Trade Body Representative", 
    "Museum Representative", "Heritage Expert", "GI Expert", "Design Professional", 
    "Innovation Expert"
  ];

  const districts = [
    "All Districts", "Anantnag", "Bandipora", "Baramulla", "Budgam", "Ganderbal", 
    "Kulgam", "Kupwara", "Pulwama", "Shopian", "Srinagar"
  ];
  
  const archiveYears = ["2026-2027"];

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category !== "All Categories") params.set("category", category);
    if (contributorType !== "All Types") params.set("contributor_type", contributorType);
    if (district !== "All Districts") params.set("district", district);
    if (year !== "2026") params.set("year", year);

    router.replace(`/state-of-kashmir-crafts/official-messages?${params.toString()}`, { scroll: false });
  }, [search, category, contributorType, district, year, router]);

  const clearFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setContributorType("All Types");
    setDistrict("All Districts");
    setYear("2026");
  };

  const hasActiveFilters = search || category !== "All Categories" || contributorType !== "All Types" || district !== "All Districts" || year !== "2026";

  // Filter logic
  const filteredMessages = messages.filter((msg) => {
    // 6. Public visibility rule
    if (msg.status !== "Published" || msg.verification_status !== "Verified") return false;

    // 4. Year archive
    if (msg.assessment_year !== year) return false;

    // 1. Category dropdown
    if (category !== "All Categories" && msg.category !== category) return false;

    // Type Filter
    if (contributorType !== "All Types" && msg.contributor_type !== contributorType) return false;

    // 2. District dropdown
    if (district !== "All Districts" && msg.district !== district) return false;

    // 3. Search
    if (search) {
      const q = search.toLowerCase();
      return (
        msg.name.toLowerCase().includes(q) ||
        msg.designation.toLowerCase().includes(q) ||
        msg.institution.toLowerCase().includes(q) ||
        msg.title.toLowerCase().includes(q) ||
        msg.message_body.toLowerCase().includes(q) ||
        msg.excerpt.toLowerCase().includes(q) ||
        msg.district.toLowerCase().includes(q) ||
        msg.assessment_year.includes(q)
      );
    }
    return true;
  });

  // Calculate counters dynamically from the filtered year's published/verified records (ignoring other filters for the year summary)
  const currentYearMessages = messages.filter(
    msg => msg.status === "Published" && msg.verification_status === "Verified" && msg.assessment_year === year
  );
  
  const govCount = currentYearMessages.filter(m => m.category === "Government").length;
  const instCount = currentYearMessages.filter(m => m.category === "Institution").length;
  const expertCount = currentYearMessages.filter(m => m.category === "Expert").length;
  const stakeholderCount = currentYearMessages.filter(m => m.category === "Stakeholder").length;

  return (
    <section className="py-20 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Search & Filter */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-32">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-xl text-gray-900 flex items-center gap-2"><FaFilter data-ui-icon  className="" /> Filter Messages</h3>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs text-red-500 font-bold hover:underline flex items-center gap-1">
                    <FaTimes /> Clear Filters
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Search Messages</label>
                  <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search names, designations, institutions, titles, keywords..." 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-600"
                  >
                    {categories.map((cat: any) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Contributor Type</label>
                  <select 
                    value={contributorType}
                    onChange={(e) => setContributorType(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-600"
                  >
                    {contributorTypes.map((type: any) => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">District</label>
                  <select 
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-600"
                  >
                    {districts.map((dist: any) => <option key={dist} value={dist}>{dist}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Assessment Year</label>
                  <select 
                    value={year}
                    onChange={(e) => setYear(e.target.value.replace(" Assessment", ""))}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-600"
                  >
                    {archiveYears.map((yr: any) => <option key={yr} value={yr}>{yr} Assessment</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Message Archive */}
          <div className="lg:w-2/3">
            <h2 className="text-3xl font-black text-brand-dark mb-8 flex items-center gap-3"><FaHistory data-ui-icon  className="" /> Message Archive</h2>
            <div className="space-y-6">
              
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 flex justify-between items-center bg-brand-primary text-white">
                  <h3 className="font-black text-xl">{year} Assessment</h3>
                </div>
                
                <div className="p-6 border-t border-gray-100">
                  {/* Dynamic Counters */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mb-8">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100"><div className="font-black text-2xl text-brand-primary">{govCount}</div><div className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Government</div></div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100"><div className="font-black text-2xl text-brand-primary">{instCount}</div><div className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Institutions</div></div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100"><div className="font-black text-2xl text-brand-primary">{expertCount}</div><div className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Experts</div></div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100"><div className="font-black text-2xl text-brand-primary">{stakeholderCount}</div><div className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Stakeholders</div></div>
                  </div>

                  {/* Display Results or Empty State */}
                  {messages.length === 0 ? (
                    // Global Empty State (Database contains no records)
                    <div className="py-16 px-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-center">
                      <h4 className="text-xl font-black text-gray-800 mb-4">No Published Messages Yet</h4>
                      <p className="text-gray-600 max-w-md mx-auto mb-6">Official messages, institutional communications, and stakeholder statements will appear here once they have been received, verified, and published.</p>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Current Published Messages: 0</p>
                      <Link href="/state-of-kashmir-crafts/official-messages" className="inline-block px-8 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-secondary transition">
                        Back to Official Messages
                      </Link>
                    </div>
                  ) : filteredMessages.length === 0 ? (
                    // Filtered Empty State (Filters returned no matches)
                    <div className="py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-center">
                      <h4 className="text-lg font-black text-gray-800 mb-2">No messages match the selected filters.</h4>
                      <p className="text-sm text-gray-500 mb-6">Try changing category, district, contributor type, year, or search keywords.</p>
                      <div className="flex justify-center gap-4">
                        <button onClick={clearFilters} className="px-6 py-2 bg-white text-brand-dark border border-gray-300 font-bold rounded-lg hover:bg-gray-100 transition shadow-sm">
                          Clear Filters
                        </button>
                        <Link href="/state-of-kashmir-crafts/official-messages" className="px-6 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-secondary transition shadow-sm">
                          Back to Archive
                        </Link>
                      </div>
                    </div>
                  ) : (
                    // Display Cards
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredMessages.map((msg: any) => (
                        <div key={msg.message_id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition flex flex-col">
                          <div className="p-6 flex flex-col flex-grow">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-12 h-12 bg-gray-100 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden">
                                {msg.image_url ? (
                                  <img src={msg.image_url} alt={msg.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-gray-400 text-xs">Photo</span>
                                )}
                              </div>
                              <div>
                                <h3 className="font-bold text-lg text-gray-900 leading-tight">{msg.name}</h3>
                                <p className="text-sm text-gray-500">{msg.designation}</p>
                              </div>
                            </div>
                            
                            <div data-editorial-accent-text className="text-xs  font-bold mb-3 uppercase tracking-wider flex justify-between">
                              <span>{msg.institution}</span>
                              <span className="text-gray-400">{msg.district}</span>
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-6 flex-grow italic line-clamp-3">
                              "{msg.excerpt}"
                            </p>
                            
                            <div className="flex justify-between items-center text-xs text-gray-400 font-bold mb-4">
                              <span>{msg.published_date}</span>
                              <span>{msg.assessment_year}</span>
                            </div>
                            
                            <div className="flex gap-3">
                              <Link href={`/state-of-kashmir-crafts/official-messages/${msg.slug}`} className="flex-1 py-2.5 bg-gray-50 border border-gray-200 text-brand-dark font-bold text-center rounded-xl hover:bg-brand-primary hover:border-brand-primary hover:text-white transition text-xs flex items-center justify-center gap-1.5">
                                Read Full Message <FaArrowRight />
                              </Link>
                              {msg.pdf_url && (
                                <a href={msg.pdf_url} target="_blank" rel="noopener noreferrer" className="py-2.5 px-4 bg-gray-50 border border-gray-200 text-brand-dark rounded-xl hover:bg-brand-secondary hover:text-white transition flex items-center justify-center" title="Download PDF">
                                  <FaFilePdf />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
