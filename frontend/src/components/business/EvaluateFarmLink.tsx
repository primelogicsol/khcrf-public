"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaCheckCircle, FaFileSignature, FaChartLine, FaShieldAlt, FaLock, FaChevronDown, FaChevronUp, FaAward } from "react-icons/fa";
import ScrollReveal from "../ScrollReveal";

export default function EvaluateFarmLink({ buttonLink = "/business-support/evaluation" }: { buttonLink?: string }) {
  const [openTier, setOpenTier] = useState<string>('GOLD');
  return (
    <section className="py-32 bg-[#fafafa] relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-white rounded-bl-[120px] shadow-[0_0_100px_rgba(0,0,0,0.02)] -z-0"></div>
      <div className="absolute -left-40 bottom-20 w-96 h-96 bg-[#6B2B08]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-[1680px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          {/* Left Column - Image & Dashboard Vibe */}
          <div className="space-y-16">
            <ScrollReveal>
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_30px_100px_-20px_rgba(5,10,30,0.2)] bg-[#050A1E] group p-3 border border-gray-100/10">
                <div className="absolute inset-0 border border-white/10 rounded-[2.5rem] pointer-events-none"></div>
                
                <div className="rounded-[2rem] overflow-hidden relative">
                  <div className="absolute inset-0 bg-[#050A1E]/20 z-10 group-hover:bg-transparent transition-colors duration-700 pointer-events-none"></div>
                  <img
                    src="/assets/images/generated/kashmir-office-sofa-screens-closed.jpg"
                    alt="Modern Kashmir Office with Closed Curtains, Team on Sofa, and KHCRF Dashboards"
                    className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-1000 min-h-[500px]"
                    loading="lazy"
                  />
                  
                  {/* Floating Analytics Card */}
                  <div className="absolute bottom-8 right-8 z-20">
                    <div className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl flex items-center gap-5 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100 border border-white/20">
                      <div data-ui-icon className="w-12 h-12 bg-[#050A1E] rounded-full flex items-center justify-center  shrink-0">
                        <FaShieldAlt className="text-xl" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Application Status</div>
                        <div className="text-sm font-black text-[#050A1E] leading-tight">Verification In Progress</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.25em] mb-8 border-b border-gray-200 pb-4">
                How It Works
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { title: "Answer Questions", desc: "Provide information about your craft practice, business or institution against the applicable verification factors.", icon: <FaCheckCircle /> },
                  { title: "Upload Supporting Documentation", desc: "Attach supporting documents, certifications, records or other evidence relevant to your claims.", icon: <FaFileSignature /> },
                  { title: "KHCRF Verifies Your Claims", desc: "KHCRF independently reviews submitted evidence and may conduct ground verification where required.", icon: <FaChartLine /> },
                  { title: "Receive Verified Findings", desc: "Once verification is complete, your verified findings are recorded and securely shared with Craftlore for its independent trust and trade-intelligence processes.", icon: <FaShieldAlt /> },
                ].map((step, idx) => (
                  <li key={idx} className="flex gap-4 group">
                    <div data-ui-icon className="w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center  group-hover:bg-[#6B2B08] group-hover:text-white group-hover:border-[#6B2B08] transition-all duration-300 shrink-0 mt-1">
                      <div className="text-lg">{step.icon}</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#050A1E] text-sm md:text-base mb-1">{step.title}</h4>
                      <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="mt-12 flex flex-col sm:flex-row sm:items-center gap-6">
                <Link
                  href={buttonLink}
                  className="group relative inline-flex items-center justify-center px-10 py-5 bg-[#050A1E] text-white font-bold uppercase tracking-widest text-xs rounded-xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(5,10,30,0.5)] hover:shadow-[0_20px_50px_-10px_rgba(5,10,30,0.6)] transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-[#6B2B08] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
                  <span className="relative z-10 flex items-center gap-3">
                    START VERIFICATION APPLICATION
                    <FaCheckCircle className="text-lg opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-500" />
                  </span>
                </Link>
                <div className="flex items-start gap-3 max-w-xs">
                  <div className="w-8 h-8 rounded-full bg-[#6B2B08]/10 flex items-center justify-center shrink-0">
                    <FaLock data-ui-icon  className=" text-xs" />
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                    Your application and supporting evidence are handled under KHCRF’s privacy and security requirements.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-10 lg:pl-10">
            <ScrollReveal delay={100}>
              <div className="inline-flex items-center gap-4 mb-6">
                <span className="h-[2px] w-12 bg-[#6B2B08]"></span>
                <span data-editorial-accent-text className=" font-bold uppercase tracking-[0.25em] text-xs">
                  KHCRF INDEPENDENT CRAFT VERIFICATION
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#050A1E] leading-[1.1] tracking-tight mb-8">
                Build Verified Trust for Your Craft Practice, Business or Institution
              </h2>
              <p className="text-gray-600 text-lg md:text-xl font-light leading-relaxed mb-6">
                Submit your claims and supporting evidence for independent KHCRF verification against applicable craft, provenance, responsible-practice and compliance standards.
              </p>
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.03)] mb-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#6B2B08]"></div>
                <p className="text-gray-500 text-sm md:text-base font-medium leading-relaxed">
                  KHCRF’s verification framework supports artisans, businesses and institutions across the Kashmir craft sector. Submitted claims are reviewed against applicable factors including authenticity and provenance, responsible practices, worker safeguards, traceability, sustainability and operational presence. Supporting evidence is independently reviewed, with ground verification conducted where required.
                </p>
              </div>
            </ScrollReveal>

            {/* 1. AFTER KHCRF VERIFICATION */}
            <ScrollReveal delay={200}>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.25em] mb-4 border-b border-gray-200 pb-4">
                AFTER KHCRF VERIFICATION
              </h3>
              <p className="text-gray-600 text-sm md:text-base font-light leading-relaxed mb-6">
                Once KHCRF completes independent verification, the verified findings are securely shared with Craftlore. Craftlore uses those findings to calculate your verified Performance Trust Score, determine your rank within the relevant entity category, and strengthen your discoverability across its trade-intelligence ecosystem.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div>
                  <h4 className="font-bold text-[#050A1E] text-sm mb-2">Verified PTS</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">Evidence-backed performance score calculated by Craftlore.</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#050A1E] text-sm mb-2">Category Ranking</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">Ranked separately among Artisans, Businesses, or Institutions.</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#050A1E] text-sm mb-2">Greater Discoverability</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">Helps buyers, partners and institutions identify verified entities with stronger trust signals.</p>
                </div>
              </div>
            </ScrollReveal>

            {/* 2. CRAFTLORE RECOGNITION TIERS */}
            <ScrollReveal delay={300}>
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.03)] relative overflow-hidden">
                <h3 className="text-xs font-bold text-[#6B2B08] uppercase tracking-[0.25em] mb-4">
                  CRAFTLORE RECOGNITION TIERS
                </h3>
                <p className="text-gray-600 text-sm font-medium leading-relaxed mb-4">
                  Gold, Silver and Bronze are Craftlore administrative recognition tiers for qualifying verified entities. They are separate from KHCRF verification and are not automatically awarded by score alone.
                </p>

                <p className="text-xs font-bold text-gray-400 mb-8 uppercase tracking-wider">
                  How recognition works <br/>
                  <span className="font-normal text-gray-500">KHCRF verifies evidence &rarr; Craftlore evaluates trust and ranking &rarr; Craftlore may assign recognition tiers</span>
                </p>

                <div className="space-y-4 mb-6">
                  {/* GOLD */}
                  <div className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openTier === 'GOLD' ? 'border-amber-400/50 bg-amber-50/10 shadow-sm' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                    <button 
                      onClick={() => setOpenTier(openTier === 'GOLD' ? '' : 'GOLD')}
                      className="w-full text-left p-5 flex items-center justify-between focus:outline-none"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${openTier === 'GOLD' ? 'bg-amber-100 text-amber-600' : 'bg-gray-50 text-gray-400'}`}>
                          <FaAward className="text-lg" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-[#050A1E] text-sm uppercase tracking-wider">GOLD</h4>
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-widest border border-amber-100">Top Recognition</span>
                          </div>
                          <p className="text-gray-500 text-xs">Highest portfolio recognition for selected qualifying verified entities.</p>
                        </div>
                      </div>
                      <div className="text-gray-400 ml-4">
                        {openTier === 'GOLD' ? <FaChevronUp /> : <FaChevronDown />}
                      </div>
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openTier === 'GOLD' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="p-5 pt-0 border-t border-amber-100/50 mt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                          <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Meaning</span>
                            <p className="text-gray-700 text-xs leading-relaxed">Premier administrative recognition within Craftlore’s portfolio system.</p>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Eligibility</span>
                            <p className="text-gray-700 text-xs leading-relaxed">Active KHCRF registration, verified standing, good standing, and selection through Craftlore review.</p>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Visibility Benefit</span>
                            <p className="text-gray-700 text-xs leading-relaxed">Increased prominence in portfolio discovery and trust-led buyer evaluation.</p>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Governance Note</span>
                            <p className="text-gray-700 text-xs leading-relaxed">Assigned manually, not automatically by raw score.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SILVER */}
                  <div className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openTier === 'SILVER' ? 'border-gray-400/50 bg-gray-50/30 shadow-sm' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                    <button 
                      onClick={() => setOpenTier(openTier === 'SILVER' ? '' : 'SILVER')}
                      className="w-full text-left p-5 flex items-center justify-between focus:outline-none"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${openTier === 'SILVER' ? 'bg-gray-200 text-gray-600' : 'bg-gray-50 text-gray-400'}`}>
                          <FaAward className="text-lg" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-[#050A1E] text-sm uppercase tracking-wider">SILVER</h4>
                            <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full uppercase tracking-widest border border-gray-200">Enhanced Visibility</span>
                          </div>
                          <p className="text-gray-500 text-xs">Strong verified standing with enhanced portfolio visibility.</p>
                        </div>
                      </div>
                      <div className="text-gray-400 ml-4">
                        {openTier === 'SILVER' ? <FaChevronUp /> : <FaChevronDown />}
                      </div>
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openTier === 'SILVER' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="p-5 pt-0 border-t border-gray-200/50 mt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                          <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Meaning</span>
                            <p className="text-gray-700 text-xs leading-relaxed">High-confidence recognition for verified entities with strong standing.</p>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Eligibility</span>
                            <p className="text-gray-700 text-xs leading-relaxed">Verified and in good standing, meeting Craftlore review standards.</p>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Visibility Benefit</span>
                            <p className="text-gray-700 text-xs leading-relaxed">Improved presentation across portfolio and trade-intelligence surfaces.</p>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Governance Note</span>
                            <p className="text-gray-700 text-xs leading-relaxed">Administrative recognition, separate from KHCRF findings.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BRONZE */}
                  <div className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openTier === 'BRONZE' ? 'border-orange-600/30 bg-orange-50/20 shadow-sm' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                    <button 
                      onClick={() => setOpenTier(openTier === 'BRONZE' ? '' : 'BRONZE')}
                      className="w-full text-left p-5 flex items-center justify-between focus:outline-none"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${openTier === 'BRONZE' ? 'bg-orange-100 text-orange-600' : 'bg-gray-50 text-gray-400'}`}>
                          <FaAward className="text-lg" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-[#050A1E] text-sm uppercase tracking-wider">BRONZE</h4>
                            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full uppercase tracking-widest border border-orange-100">Verified Portfolio</span>
                          </div>
                          <p className="text-gray-500 text-xs">Recognized verified standing within Craftlore’s portfolio system.</p>
                        </div>
                      </div>
                      <div className="text-gray-400 ml-4">
                        {openTier === 'BRONZE' ? <FaChevronUp /> : <FaChevronDown />}
                      </div>
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openTier === 'BRONZE' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="p-5 pt-0 border-t border-orange-200/50 mt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                          <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Meaning</span>
                            <p className="text-gray-700 text-xs leading-relaxed">Entry-level recognition for verified entities meeting portfolio criteria.</p>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Eligibility</span>
                            <p className="text-gray-700 text-xs leading-relaxed">Verified status and qualifying standing under Craftlore rules.</p>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Visibility Benefit</span>
                            <p className="text-gray-700 text-xs leading-relaxed">Foundational portfolio presence and stronger discoverability.</p>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Governance Note</span>
                            <p className="text-gray-700 text-xs leading-relaxed">Recognition is reviewed and assigned, not purely score-driven.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 text-center">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    KHCRF verifies independently. Craftlore calculates PTS, ranking and recognition.
                  </p>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </div>
    </section>
  );
}
