import { getBaseUrl } from "@/lib/api";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight, FaBookOpen } from 'react-icons/fa';

const API_BASE = getBaseUrl();

export default async function MagazineCTA() {
  let latestIssue: any = null;
  
  try {
    const res = await fetch(`${API_BASE}/v1/magazine-issues`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
            const arr = Array.isArray(data) ? data : (data && Array.isArray(data.data) ? data.data : []);
      if (arr && arr.length > 0) {
        const validIssues = arr.filter((issue) => issue.status === 'PUBLISHED');
        
        validIssues.sort((a, b) => {
          const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
          const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
          return dateB - dateA;
        });
        
        latestIssue = validIssues.length > 0 ? validIssues[0] : null;
      }
    }
  } catch (error) {
    console.error("Error fetching latest magazine issue for CTA:", error);
  }

  // Fallbacks if backend is unreachable or empty
  const coverImage = latestIssue?.coverImage || "/img/art-2.jpg";
  const title = latestIssue?.title || "The Pashmina Renaissance";
  const issueLabel = latestIssue 
    ? `${latestIssue.issueNumber || 1} • ${latestIssue.edition || "Latest Edition"}` 
    : "Vol. 1 • Inaugural Edition";

  return (
    <section className="py-24 bg-[#050A1E] relative overflow-hidden border-y border-white/5">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-[#F6F2EC]/10 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Content */}
        <div className="order-2 lg:order-1">
          <h5 className="text-[#F6F2EC] font-black uppercase tracking-[0.3em] text-[11px] mb-6 flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#F6F2EC]" />
            KHCRF Press • Editorial Archives
          </h5>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-8">
            Master Artisans <br />
            <span className="text-[#F6F2EC] font-playfair italic font-normal tracking-normal">Master Artisans Magazine</span>
          </h2>
          <p className="text-stone-400 text-lg leading-relaxed mb-10 max-w-xl font-medium">
            A continuing editorial programme documenting Kashmir's master artisans, endangered knowledge systems, workshops, techniques and extraordinary objects.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/master-artisans/issues"
              className="inline-flex items-center gap-4 bg-[#F6F2EC] hover:bg-white text-[#050A1E] px-8 py-5 rounded-xl font-black uppercase tracking-widest text-xs transition-all duration-300 shadow-xl shadow-[#F6F2EC]/10 group"
            >
              <FaBookOpen className="text-lg" />
              <span>Browse All Issues</span>
              <FaArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Visuals - Magazine Mockup */}
        <div className="order-1 lg:order-2 relative">
          <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl group p-4 sm:p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            
            {/* Magazine Cover */}
            <div className="w-full h-full relative transform -rotate-2 group-hover:rotate-0 transition-transform duration-700 shadow-2xl rounded-2xl overflow-hidden border-4 border-white/20 bg-stone-900 flex items-center justify-center">
               <Image 
                 src={coverImage} 
                 alt={title} 
                 fill 
                 className="object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#050A1E] via-[#050A1E]/40 to-transparent opacity-90 pointer-events-none" />
               <div className="absolute bottom-8 left-8 right-8 pointer-events-none">
                  <span className="text-white/60 uppercase tracking-[0.2em] text-[10px] font-bold block mb-3">{issueLabel}</span>
                  <h3 className="text-white text-3xl sm:text-4xl font-playfair font-black leading-tight mb-4 shadow-black drop-shadow-lg">
                    {title}
                  </h3>
                  <div className="w-12 h-1 bg-[#F6F2EC] rounded-full" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
