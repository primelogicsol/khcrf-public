"use client";

import Link from "next/link";
import { FaArrowRight, FaShieldAlt, FaCheckCircle, FaSearch } from "react-icons/fa";
import ScrollReveal from "../ScrollReveal";

export default function EvaluationRegistry() {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-[1680px] mx-auto px-6 md:px-10 lg:px-16">
        <ScrollReveal>
          <div className="relative bg-[#050A1E] rounded-[2.5rem] p-12 md:p-20 overflow-hidden shadow-[0_30px_100px_-15px_rgba(5,10,30,0.4)] border border-[#050A1E]/10 group">
            
            {/* Premium Background Effects */}
            <div className="absolute inset-0 z-0">
              {/* Subtle grid pattern */}
              <div 
                className="absolute inset-0 opacity-[0.03]" 
                style={{ backgroundImage: 'radial-gradient(#F6F2EC 1px, transparent 1px)', backgroundSize: '40px 40px' }}
              ></div>
              {/* Elegant gradient glows */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F6F2EC]/10 rounded-full blur-[120px] pointer-events-none transform translate-x-1/4 -translate-y-1/4 transition-transform duration-1000 group-hover:scale-110"></div>
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/3 translate-y-1/3"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              
              {/* Text Side */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-4 mb-6">
                  <span className="h-[2px] w-12 bg-[#F6F2EC]"></span>
                  <span className="text-[#F6F2EC] font-bold uppercase tracking-[0.25em] text-xs">
                    Institutional Trust
                  </span>
                </div>
                
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight">
                  Evaluated & Verified <br className="hidden md:block" />
                  <span className="text-[#F6F2EC]">Business Registry.</span>
                </h2>
                
                <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed mb-10 max-w-2xl">
                  Access the KHCRF Registry of Evaluated and Verified Craft Enterprises. Explore detailed insights into organizational collaborations, compliance status, and active engagements within the global KHCRF ecosystem.
                </p>

                <ul className="flex flex-col sm:flex-row gap-6 sm:gap-10">
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <FaShieldAlt className="text-[#F6F2EC] text-sm" />
                    </div>
                    <span className="text-gray-300 font-medium text-sm md:text-base tracking-wide">Globally Compliant</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <FaSearch className="text-[#F6F2EC] text-sm" />
                    </div>
                    <span className="text-gray-300 font-medium text-sm md:text-base tracking-wide">Publicly Searchable</span>
                  </li>
                </ul>
              </div>

              {/* Action Side */}
              <div className="lg:col-span-5 flex flex-col items-start lg:items-end justify-center">
                <div className="relative w-full max-w-md">
                  {/* Decorative backdrop for button */}
                  <div className="absolute inset-0 bg-[#F6F2EC]/20 rounded-[2rem] blur-2xl transform scale-90 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                  
                  <Link
                    href="/business-support/evaluation/registry"
                    className="relative w-full flex items-center justify-between p-6 md:p-8 bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 hover:border-[#F6F2EC]/40 backdrop-blur-xl rounded-[2rem] transition-all duration-500 overflow-hidden group/btn shadow-xl hover:shadow-[0_20px_50px_rgba(205,172,54,0.15)] hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#F6F2EC]/0 via-[#F6F2EC]/10 to-[#F6F2EC]/0 transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                    <div className="flex flex-col relative z-10">
                      <span className="text-[#F6F2EC] text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] mb-2">Public Access Directory</span>
                      <span className="text-white font-black text-xl md:text-2xl tracking-tight group-hover/btn:text-[#F6F2EC] transition-colors duration-300">View Verified Registry</span>
                    </div>
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/10 flex items-center justify-center text-white group-hover/btn:bg-[#F6F2EC] group-hover/btn:scale-110 transition-all duration-500 shrink-0 relative z-10 border border-white/5">
                      <FaArrowRight className="transform group-hover/btn:-rotate-45 transition-transform duration-500 text-lg md:text-xl" />
                    </div>
                  </Link>
                </div>
              </div>
              
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
