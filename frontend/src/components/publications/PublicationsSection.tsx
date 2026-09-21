"use client";

import { useEffect, useState } from "react";
import { publicationApi } from "@/lib/api";
import PublicationFlipCard from "@/components/publications/PublicationFlipCard";
import { toCanonicalPublicationPresentation, CanonicalPublicationPresentation } from "@/types/CanonicalPublicationPresentation";
import Link from "next/link";
import { FaSearch, FaFilter, FaBookOpen } from "react-icons/fa";

export default function PublicationsSection({ initialPublications = [] }: { initialPublications?: any[] }) {
  const [publications, setPublications] = useState<CanonicalPublicationPresentation[]>(() => {
    if (!initialPublications || initialPublications.length === 0) return [];
    
    // Normalize using the exact same function as /publications
    const mapped = initialPublications.map(toCanonicalPublicationPresentation);
    
    // Order by canonical publication/release date, newest first
    mapped.sort((a, b) => {
      const dateA = new Date(a.publicationYear || 0).getTime();
      const dateB = new Date(b.publicationYear || 0).getTime();
      if (dateA !== dateB && !isNaN(dateA) && !isNaN(dateB)) return dateB - dateA;
      const yearA = parseInt(a.publicationYear) || 0;
      const yearB = parseInt(b.publicationYear) || 0;
      if (yearA !== yearB) return yearB - yearA;
      return (a.id || "").localeCompare(b.id || "");
    });
    
    return mapped;
  });
  const [loading, setLoading] = useState(initialPublications && initialPublications.length > 0 ? false : true);
  const [selectedCategory, setSelectedCategory] = useState("Market Intelligence");

  useEffect(() => {
    const loadPublications = async () => {
      if (initialPublications && initialPublications.length > 0) return; // SSR already handled it
      
      try {
        const allPubs = await publicationApi.getAll();
        const pubsArray = Array.isArray(allPubs) ? allPubs : (allPubs.data || allPubs.publications || []);
        const mappedPubs = pubsArray.map(toCanonicalPublicationPresentation);

        // Sort the entire array: publicationYear/published DESC, id ASC
        mappedPubs.sort((a, b) => {
          const dateA = new Date(a.publicationYear || 0).getTime();
          const dateB = new Date(b.publicationYear || 0).getTime();
          if (dateA !== dateB && !isNaN(dateA) && !isNaN(dateB)) return dateB - dateA;
          const yearA = parseInt(a.publicationYear) || 0;
          const yearB = parseInt(b.publicationYear) || 0;
          if (yearA !== yearB) return yearB - yearA;
          return (a.id || "").localeCompare(b.id || "");
        });
        
        setPublications(mappedPubs);
      } catch (error) {
        console.error("Error loading publications:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPublications();
  }, [initialPublications]);

  const categories = [
    "Market Intelligence",
    "Policy Briefs",
    "Research Papers",
    "Best Practices",
    "Case Studies",
    "Knowledge Books"
  ];

  const filteredPublications = publications.filter(item => {
    const pType = item.publicationType.toLowerCase();
    const pCat = item.series ? item.series.toLowerCase() : "";
    const sCat = selectedCategory.toLowerCase();
    
    if (sCat.includes(pType) || pType.includes(sCat)) return true;
    if (pCat && (pCat.includes(sCat) || sCat.includes(pCat))) return true;
    
    if (pType === "knowledge book" && sCat === "knowledge books") return true;
    if (pType === "case study" && sCat === "case studies") return true;
    if (pType === "best practice" && sCat === "best practices") return true;
    if (pType === "research paper" && sCat === "research papers") return true;
    if (pType === "policy brief" && sCat === "policy briefs") return true;
    return false;
  }).slice(0, 3);

  console.log("Publications State:", publications.length, publications);
  console.log("Filtered:", filteredPublications.length);
  
  if (loading)
    return <div className="text-center py-20 text-stone-400 font-medium animate-pulse">Loading KHCRF Press publications...</div>;

  return (
    <div className="flex flex-col space-y-12">
      {/* Filtering and Search Bar Wrapper */}
      <div className="flex flex-col gap-6 pb-10 mb-8 border-b border-gray-100">
        {/* Horizontal Category Filters - Single Line Scrollable */}
        <div className="flex flex-wrap gap-2.5 items-center w-full">
          <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mr-2 flex items-center gap-1.5">
            <FaFilter data-ui-icon  size={10} className="" /> Filter
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 text-[11px] font-black uppercase tracking-wider rounded-full transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-[#050A1E] text-white shadow-lg shadow-[#050A1E]/20 -translate-y-0.5"
                  : "bg-white text-stone-500 hover:text-[#050A1E] hover:bg-stone-50 border border-gray-200 hover:border-[#050A1E]/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      {filteredPublications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {filteredPublications.map((item, i) => (
            <PublicationFlipCard
              key={i}
              title={item.title}
              subtitle={item.subtitle || ""}
              category={item.publicationType}
              imagePath={item.coverImageUrl || undefined}
              link={`/publications/${item.slug}`}
              description={item.executiveSummary}
              isComingSoon={false}
              canonical={item}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-3xl bg-white border border-gray-200 shadow-sm max-w-4xl mx-auto">
          <div data-ui-icon className="w-20 h-20 bg-brand-primary/5 rounded-full flex items-center justify-center mb-6 ">
            <FaBookOpen size={30} className="opacity-75" />
          </div>

          <h3 className="text-2xl font-serif font-black text-brand-dark mb-4">
            Knowledge Library Being Built
          </h3>
          <p className="text-gray-600 max-w-xl mx-auto mb-8 leading-relaxed text-sm">
            KHCRF is preparing a structured publication archive covering Kashmir handicrafts, artisan livelihoods, authentication, GI protection, market access, and heritage preservation.
          </p>

          <div className="bg-slate-50 border border-gray-150 p-6 rounded-2xl max-w-lg mx-auto mb-8 text-left">
            <span className="text-[9px] font-black text-brand-primary bg-brand-primary/10 px-2 py-1 rounded-md uppercase tracking-wider inline-block mb-3">
              Featured publication in preparation
            </span>
            {(() => {
              if (selectedCategory === "Market Intelligence") {
                return (
                  <>
                    <h4 className="text-sm font-bold text-brand-dark mb-1">Luxury Consumer Trends in North America</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">Demand forecasting for authentic Pashmina targeting exporters and global brands.</p>
                  </>
                );
              }
              if (selectedCategory === "Policy Briefs") {
                return (
                  <>
                    <h4 className="text-sm font-bold text-brand-dark mb-1">Geographical Indications & Global IP</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">Securing Kashmir&apos;s Heritage through legal frameworks and trade bodies.</p>
                  </>
                );
              }
              if (selectedCategory === "Research Papers") {
                return (
                  <>
                    <h4 className="text-sm font-bold text-brand-dark mb-1">Historical Trajectories of Walnut Wood Carving</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">Evolution of motifs from 18th to 21st century for historians and museums.</p>
                  </>
                );
              }
              if (selectedCategory === "Case Studies") {
                return (
                  <>
                    <h4 className="text-sm font-bold text-brand-dark mb-1">Revival of the Kani Weaving Cooperative</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">A success story in collective bargaining for cooperatives and academics.</p>
                  </>
                );
              }
              if (selectedCategory === "Knowledge Books" || selectedCategory === "E-Publications") {
                return (
                  <>
                    <h4 className="text-sm font-bold text-brand-dark mb-1">The Encyclopedia of Kashmir Crafts</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">Volume I: Textiles and Weaves. For global libraries, researchers, and collectors.</p>
                  </>
                );
              }
              // Default (Best Practices or All)
              return (
                <>
                  <h4 className="text-sm font-bold text-brand-dark mb-1">Best Practices for Pashmina Authentication</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">A technical and practical guide for buyers, artisans, exporters, certification agencies, and policymakers.</p>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* View All Publications CTA - PREMIUM REDESIGN */}
      <div className="mt-24 relative overflow-hidden rounded-[2.5rem] bg-[#050A1E] p-12 md:p-20 text-center shadow-2xl flex flex-col items-center group">
        {/* Decorative ambient lighting */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#F6F2EC]/10 rounded-full blur-[100px] pointer-events-none transition-transform duration-1000 group-hover:scale-150" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] pointer-events-none transition-transform duration-1000 group-hover:scale-150" />
        
        <div className="relative z-10 space-y-8 max-w-3xl flex flex-col items-center">
          <div className="inline-flex items-center gap-2 border border-[#F6F2EC]/30 px-5 py-2 rounded-full text-[#F6F2EC] text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(197,164,55,0.1)]">
            Institutional Library
          </div>
          
          <h3 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight">
            Explore the Complete <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F6F2EC] to-[#F3E196]">Research Catalogue</span>
          </h3>
          
          <p className="text-stone-300 text-base md:text-lg max-w-xl mx-auto leading-relaxed font-medium">
            Browse every KHCRF publication, series, research topic, and forthcoming title. Access our definitive data frameworks and historical craft archives.
          </p>
          
          <div className="pt-4">
            <Link 
              href="/publications" 
              className="inline-flex items-center justify-center bg-white text-[#050A1E] px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:bg-[#F6F2EC] hover:text-white hover:shadow-[0_15px_40px_rgba(197,164,55,0.4)] hover:-translate-y-1 active:translate-y-0"
            >
              View All Publications
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

