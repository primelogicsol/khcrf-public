"use client";

import React from "react";
import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import { lobbyingExploreHeroFallback } from "@/config/heroFallbacks";
import Link from "next/link";
import {
  FaLandmark,
  FaFileSignature,
  FaUserTie,
  FaBullhorn,
  FaCheck,
  FaXmark,
} from "react-icons/fa6";
import {
  ShieldCheck,
  Scale,
  Users,
  Eye,
  FileSearch,
  ArrowRight,
  FileText,
  Clock,
  CheckCircle2,
  Lock,
  MessageSquareX,
  Search,
  CheckCircle
} from "lucide-react";

export default function LegislativeDeskDetails() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-roboto animate-fadeIn">
      <UniversalEditorialHero
        pageKey="research-lobbying-explore"
        fallbackConfig={lobbyingExploreHeroFallback as any}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section 1: Premium Plain Explanation */}
        <section className="mb-24 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-bold tracking-widest uppercase text-xs mb-6 shadow-sm">
                Plain Explanation
              </span>
              <h2 className="text-4xl md:text-5xl font-playfair font-black text-stone-950 tracking-tight leading-tight">
                What This Desk Is
              </h2>
            </div>

            <div className="bg-white rounded-3xl p-10 md:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-200 relative overflow-hidden group transition-all duration-500 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)]">
              
              
              <div className="relative z-10 mb-16 max-w-3xl">
                <p className="text-2xl md:text-3xl text-stone-800 leading-snug font-playfair border-l-4 border-amber-600 pl-6 md:pl-8 py-2">
                  The Jammu and Kashmir Legislative Constituency Artisan Desk is a <span className="text-amber-700 italic font-semibold">verified digital interface</span> for legislative offices serving constituencies with significant artisan populations or craft clusters.
                </p>
              </div>

              <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 md:gap-12">
                <div className="bg-stone-50/50 rounded-2xl p-8 border border-stone-100 transition-all hover:bg-stone-50">
                  <h3 className="font-bold text-xl text-stone-950 mb-8 flex items-center gap-3 border-b border-stone-200 pb-4">
                    <span className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                      <FaCheck className="text-sm" />
                    </span>
                    Allows Your Office To:
                  </h3>
                  <ul className="space-y-6 text-stone-700">
                    {[
                      "Officially document artisan realities in your constituency",
                      "Publish verified updates on craft-related work and priorities",
                      "Make artisan issues visible to departments, institutions, and stakeholders",
                      "Create transparency without political messaging or campaigning"
                    ].map((item, i) => (
                      <li key={i} className="flex gap-4 items-start group/item">
                        <div className="mt-1.5 w-2 h-2 rounded-full bg-amber-300 group-hover/item:scale-150 group-hover/item:bg-amber-600 transition-all shrink-0"></div>
                        <span className="text-lg leading-relaxed group-hover/item:text-stone-950 transition-colors">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-stone-950 text-stone-300 rounded-2xl p-8 shadow-2xl relative overflow-hidden group/dark hover:-translate-y-1 transition-transform duration-500">
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-stone-800 rounded-full blur-2xl opacity-50 transition-transform duration-700 group-hover/dark:scale-150"></div>
                  <div className="relative z-10 h-full flex flex-col justify-center">
                    <h3 className="font-bold text-white text-xl mb-6 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                        <FaXmark className="text-red-400 text-sm" />
                      </span>
                      Important Clarification
                    </h3>
                    <p className="mb-6 text-lg leading-relaxed">
                      This is <strong className="text-white border-b border-red-500/50">not</strong> a social media platform and <strong className="text-white border-b border-red-500/50">not</strong> a press outlet.
                    </p>
                    <div className="p-5 bg-stone-900/80 rounded-xl border border-stone-800 backdrop-blur-sm">
                      <p className="text-stone-300 leading-relaxed">
                        It is a <span className="text-amber-500 font-semibold">sector-specific documentation and coordination tool</span> focused exclusively on handicrafts and artisan livelihoods.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Why Use This */}
        <section className="mb-20 bg-white rounded-3xl p-8 md:p-16 shadow-lg border border-gray-100">
          <div className="max-w-4xl mx-auto">
            <span data-editorial-accent-text className="block  font-bold tracking-widest uppercase text-sm mb-2">
              The Need
            </span>
            <h2 className="text-3xl md:text-4xl font-playfair font-black text-gray-900 mb-8">
              Why Legislative Offices Use This
            </h2>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Constituencies with Craft Clusters
                </h3>
                <p className="text-gray-600 mb-8 text-lg">
                  Many constituencies contain craft villages, artisan-dependent
                  households, informal but skilled labor economies, and
                  traditional industries under pressure. Yet these realities
                  often remain undocumented at policy level.
                </p>

                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  This Desk Helps You:
                </h3>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex gap-3 items-center">
                    <div data-editorial-accent-bg className="w-2 h-2 rounded-full "></div>
                    Present constituency-specific craft needs clearly
                  </li>
                  <li className="flex gap-3 items-center">
                    <div data-editorial-accent-bg className="w-2 h-2 rounded-full "></div>
                    Show ongoing efforts and constraints without exaggeration
                  </li>
                  <li className="flex gap-3 items-center">
                    <div data-editorial-accent-bg className="w-2 h-2 rounded-full "></div>
                    Reduce misinformation by publishing verified updates
                  </li>
                  <li className="flex gap-3 items-center">
                    <div data-editorial-accent-bg className="w-2 h-2 rounded-full "></div>
                    Support policy attention based on facts, not noise
                  </li>
                </ul>
              </div>
              <div className="relative">
                {/* Abstract background blur */}
                <div className="absolute -inset-4 bg-brand-primary/5 rounded-full filter blur-3xl opacity-50"></div>
                <div className="relative grid grid-cols-2 gap-4 h-full">
                  <div className="bg-gray-50 p-6 rounded-2xl text-center border border-gray-100 shadow-sm hover:shadow-md transition-all group h-full flex flex-col justify-center items-center">
                    <FaLandmark className="text-4xl text-gray-400 group-hover:text-brand-primary transition-colors mx-auto mb-3" />
                    <p className="font-bold text-gray-800">Policy Clarity</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-2xl text-center border border-gray-100 shadow-sm hover:shadow-md transition-all group h-full flex flex-col justify-center items-center">
                    <FaFileSignature className="text-4xl text-gray-400 group-hover:text-brand-primary transition-colors mx-auto mb-3" />
                    <p className="font-bold text-gray-800">Documentation</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-2xl text-center border border-gray-100 shadow-sm hover:shadow-md transition-all group h-full flex flex-col justify-center items-center">
                    <FaBullhorn className="text-4xl text-gray-400 group-hover:text-brand-primary transition-colors mx-auto mb-3" />
                    <p className="font-bold text-gray-800">Verified Updates</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-2xl text-center border border-gray-100 shadow-sm hover:shadow-md transition-all group h-full flex flex-col justify-center items-center">
                    <FaUserTie className="text-4xl text-gray-400 group-hover:text-brand-primary transition-colors mx-auto mb-3" />
                    <p className="font-bold text-gray-800">Coordination</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Onboarding Flow */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <span data-editorial-accent-text className="block  font-bold tracking-widest uppercase text-sm mb-2">
              Process
            </span>
            <h2 className="text-3xl md:text-4xl font-playfair font-black text-gray-900 mb-12">
              Onboarding Flow for Legislative Members
            </h2>

            <div className="relative border-l-2 border-gray-200 ml-4 md:ml-8 space-y-12 pl-8 md:pl-12 py-4">
              <div className="relative group">
                <span className="absolute -left-[51px] md:-left-[67px] w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold shadow-lg ring ring-white group-hover:scale-110 transition-transform">
                  1
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-brand-primary transition-colors">
                  Office Registration
                </h3>
                <p className="text-gray-600 mb-4 text-lg">
                  Your office submits official legislator details, constituency
                  info, confirmation of craft populations, and basic data on
                  dominant crafts.
                </p>
                <div className="text-sm font-bold text-brand-primary bg-brand-primary/10 inline-block px-4 py-1.5 rounded-full">
                  Takes 5–8 minutes
                </div>
              </div>

              <div className="relative group">
                <span data-ui-icon className="absolute -left-[51px] md:-left-[67px] w-10 h-10 rounded-full bg-white border-2 border-brand-primary  flex items-center justify-center font-bold shadow-lg ring ring-white group-hover:scale-110 transition-transform">
                  2
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-brand-primary transition-colors">
                  Verification
                </h3>
                <p className="text-gray-600 mb-4 text-lg">
                  KHCRF verifies submission through official email validation,
                  office phone confirmation, and supporting document review.
                  Only verified offices can publish.
                </p>
              </div>

              <div className="relative group">
                <span className="absolute -left-[51px] md:-left-[67px] w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold shadow-lg ring ring-white group-hover:scale-110 transition-transform">
                  3
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-brand-primary transition-colors">
                  Office Dashboard Access
                </h3>
                <p className="text-gray-600 text-lg mb-4">
                  Once verified, your office receives access to a private
                  dashboard where you can:
                </p>
                <ul className="space-y-2 text-gray-700 list-disc pl-5">
                  <li>Manage your office profile</li>
                  <li>Create and publish blog updates</li>
                  <li>View engagement and feedback</li>
                  <li>Update constituency craft information when needed</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        {/* Section 4: Operational Framework (Audit Approved Upgrade) */}
        <div className="mb-24 space-y-12 relative z-10">
          
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-stone-800 font-bold tracking-widest uppercase text-xs mb-4 shadow-sm">
              Operational Framework
            </span>
            <h2 className="text-3xl md:text-4xl font-playfair font-black text-stone-950 tracking-tight">
              Platform Dynamics & Guidelines
            </h2>
          </div>

          {/* 1. Governance Principles */}
          <section className="mb-16">
            <h3 className="font-playfair font-bold text-2xl mb-6 text-stone-900 border-b border-stone-200 pb-3">
              Platform Principles
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { icon: FileSearch, title: "Evidence-Based", color: "text-amber-700", bg: "bg-amber-50" },
                { icon: Eye, title: "Transparent", color: "text-stone-700", bg: "bg-stone-100" },
                { icon: Scale, title: "Non-Partisan", color: "text-blue-700", bg: "bg-blue-50" },
                { icon: Users, title: "Public Interest", color: "text-emerald-700", bg: "bg-emerald-50" },
                { icon: ShieldCheck, title: "Verifiable", color: "text-indigo-700", bg: "bg-indigo-50" }
              ].map((prin, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-transform cursor-default">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${prin.bg} ${prin.color}`}>
                    <prin.icon className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-stone-900 text-sm">{prin.title}</div>
                </div>
              ))}
            </div>
          </section>

          {/* 2. How Office Updates Work & What Is Allowed */}
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-stretch mb-8">
            <section className="bg-white p-10 rounded-3xl shadow-sm border border-stone-200 relative overflow-hidden group hover:shadow-md transition-shadow">
              <h3 className="font-playfair font-bold text-2xl mb-8 text-stone-900 border-b border-stone-100 pb-4">
                How Office Updates Work
              </h3>
              <p className="text-stone-600 mb-8 leading-relaxed text-lg">
                The Office Blog is a <span className="font-semibold text-amber-700">verified, constituency-specific update stream</span> designed for formal record-keeping.
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-6 bg-stone-50 rounded-2xl border border-stone-100 text-center">
                  <FileText className="w-8 h-8 text-stone-400 mb-3" />
                  <span className="font-bold text-stone-900">Documentation</span>
                </div>
                <div className="flex flex-col items-center p-6 bg-stone-50 rounded-2xl border border-stone-100 text-center">
                  <Eye className="w-8 h-8 text-stone-400 mb-3" />
                  <span className="font-bold text-stone-900">Transparency</span>
                </div>
                <div className="flex flex-col items-center p-6 bg-stone-50 rounded-2xl border border-stone-100 text-center">
                  <Users className="w-8 h-8 text-stone-400 mb-3" />
                  <span className="font-bold text-stone-900">Coordination</span>
                </div>
              </div>
            </section>

            <section className="bg-red-50/40 p-10 rounded-3xl border border-red-100 shadow-sm transition hover:shadow-md">
              <h3 className="font-playfair font-bold text-red-900 text-2xl mb-8 border-b border-red-200/50 pb-4 flex items-center gap-3">
                <MessageSquareX className="text-red-500 w-6 h-6" /> Not Allowed
              </h3>
              <div className="space-y-4">
                {[
                  "Political opinion pieces",
                  "Party messaging",
                  "Campaign content",
                  "Slogans or unverified claims"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white px-5 py-3.5 rounded-xl border border-red-100 text-red-800 text-sm font-semibold shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-red-400 shrink-0"></span>
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* 3. Example Public Update & Posting Guidance */}
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-stretch mb-8">
            <section className="bg-white p-10 rounded-3xl shadow-sm border border-stone-200 relative">
              <h3 className="font-playfair font-bold text-2xl mb-8 text-stone-900 border-b border-stone-100 pb-4">
                Example Public Update
              </h3>
              <div className="bg-stone-50 rounded-2xl border border-stone-200 p-8 shadow-sm relative">
                <div className="absolute top-4 right-4 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-200">
                  Preview
                </div>
                <h4 className="font-playfair font-black text-xl text-stone-900 mb-4">
                  Cluster Development Work in Kulgam
                </h4>
                <div className="flex flex-wrap gap-4 mb-6 text-sm">
                  <div className="flex flex-col">
                    <span className="text-stone-500 font-medium text-xs uppercase tracking-wider">Context</span>
                    <span className="font-bold text-stone-800">Kulgam District<br/><span className="font-normal text-stone-600">112 artisans surveyed, 3 craft clusters engaged</span></span>
                  </div>
                  <div className="flex flex-col border-l border-stone-200 pl-4">
                    <span className="text-stone-500 font-medium text-xs uppercase tracking-wider">Status</span>
                    <span className="font-bold text-amber-600 flex items-center gap-1.5"><span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span> In Progress</span>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-stone-100">
                  <div className="text-stone-500 font-medium text-xs uppercase tracking-wider mb-2">Office Actions</div>
                  <ul className="space-y-2 text-stone-700 text-sm font-medium">
                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> Two stakeholder meetings conducted.</li>
                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> Infrastructure proposal submitted.</li>
                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> District craft mapping initiated.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-white p-10 rounded-3xl border border-stone-200 shadow-sm flex flex-col">
              <h3 className="font-playfair font-bold text-2xl mb-8 text-stone-900 border-b border-stone-100 pb-4 flex items-center gap-3">
                <Clock className="w-6 h-6 text-stone-400" /> Posting Guidance
              </h3>
              <p className="text-stone-600 mb-8 text-lg leading-relaxed">Focus on meaningful updates. The platform values verified outcomes, not posting frequency.</p>
              
              <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 shadow-sm relative overflow-hidden mb-6 grow">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-stone-900"></div>
                <div className="font-bold text-stone-900 mb-4 text-sm tracking-wider uppercase">Recommended</div>
                <ul className="space-y-4 text-stone-700 font-medium">
                  <li className="flex items-center gap-3"><span className="w-2 h-2 bg-stone-400 rounded-full shrink-0"></span> 1–2 updates per quarter</li>
                  <li className="flex items-center gap-3"><span className="w-2 h-2 bg-stone-400 rounded-full shrink-0"></span> Additional updates during major initiatives</li>
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <span className="text-amber-800 font-bold tracking-widest uppercase text-sm">Quality Over Frequency</span>
              </div>
            </section>
          </div>

          {/* 4. Update Lifecycle */}
          <section className="bg-stone-900 text-white p-10 md:p-14 rounded-3xl shadow-lg relative overflow-hidden mb-8">
             
             <h3 className="font-playfair font-bold text-2xl mb-12 text-white border-b border-stone-800 pb-4 relative z-10">
               Update Lifecycle
             </h3>
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
               {/* Line connecting them in desktop */}
               <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-stone-800 -translate-y-1/2 z-0"></div>
               
               {[
                 { step: "Issue Identified", icon: Search },
                 { step: "Office Review", icon: FileSearch },
                 { step: "Action Initiated", icon: ShieldCheck },
                 { step: "Public Update", icon: Eye },
                 { step: "Verification", icon: CheckCircle2 },
                 { step: "Archived Record", icon: Lock }
               ].map((flow, i) => (
                 <div key={i} className="relative z-10 flex flex-col items-center group w-full md:w-auto">
                   <div className="w-16 h-16 rounded-2xl bg-stone-950 border-2 border-stone-800 flex items-center justify-center mb-4 group-hover:border-amber-500 group-hover:bg-amber-900/20 transition-all shadow-xl relative">
                     <flow.icon className="w-6 h-6 text-stone-400 group-hover:text-amber-400 transition-colors" />
                   </div>
                   <div className="text-[11px] font-bold text-stone-400 tracking-wider uppercase text-center group-hover:text-white transition-colors max-w-[90px]">{flow.step}</div>
                 </div>
               ))}
             </div>
          </section>

          {/* 5. Practical Benefits & Who Sees These Blogs */}
          <div className="grid lg:grid-cols-2 gap-8 items-stretch mb-8">
            <section className="bg-white p-10 rounded-3xl shadow-sm border border-stone-200">
              <h3 className="font-playfair font-bold text-2xl mb-8 text-stone-900 border-b border-stone-100 pb-4">
                Practical Benefits
              </h3>
              <ul className="space-y-6">
                {[
                  { icon: FaFileSignature, title: "Official Public Record", desc: "Creates a lasting record of work done." },
                  { icon: FaUserTie, title: "Reduces Repeated Queries", desc: "Constituents find answers here first." },
                  { icon: FaLandmark, title: "Faster Department Understanding", desc: "Helps departments see needs clearly." },
                  { icon: ShieldCheck, title: "Builds Continuity", desc: "Even when officers change." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-5 items-start group">
                    <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center shrink-0 group-hover:bg-stone-100 transition-colors">
                      <item.icon className="text-stone-500 text-xl group-hover:text-stone-900 transition-colors" />
                    </div>
                    <div>
                      <div className="font-bold text-stone-900 text-lg mb-1">{item.title}</div>
                      <div className="text-sm text-stone-600">{item.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-amber-50 p-10 rounded-3xl shadow-sm border border-amber-100 flex flex-col h-full relative">
               <h3 className="font-playfair font-bold text-2xl mb-8 text-amber-950 border-b border-amber-200/50 pb-4">
                 Who Sees These Blogs
               </h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 grow mb-8">
                 {[
                   { title: "Constituents", sub: "Track office initiatives, craft concerns and public responses." },
                   { title: "Departments", sub: "Review constituency issues, coordination records and project updates." },
                   { title: "Researchers", sub: "Access verified field observations and public records." },
                   { title: "KHCRF Teams", sub: "Coordinate reporting, verification and documentation." }
                 ].map((aud, i) => (
                   <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100/50 hover:-translate-y-1 transition-transform cursor-default">
                     <div className="font-bold text-amber-950 text-lg mb-2">{aud.title}</div>
                     <div className="text-sm text-stone-600 font-medium leading-relaxed">{aud.sub}</div>
                   </div>
                 ))}
               </div>
            </section>
          </div>

          {/* 6. KHCRF Role */}
          <section className="bg-stone-50 p-10 md:p-14 rounded-3xl border border-stone-200 shadow-sm flex flex-col">
            <h3 className="font-playfair font-bold text-3xl mb-10 text-stone-900 border-b border-stone-200 pb-4 text-center">
              KHCRF’s Role <span className="text-stone-500 font-normal italic text-lg ml-2">(Clearly Defined)</span>
            </h3>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h4 className="text-stone-900 font-bold tracking-widest text-sm uppercase mb-6 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" /> KHCRF Does:
                </h4>
                <ul className="space-y-4">
                  {["Verifies office identity", "Maintains platform neutrality", "Helps structure information", "Assists with data & reports"].map((item, i) => (
                    <li key={i} className="flex gap-4 items-center text-stone-700 font-medium text-lg">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="md:border-l md:border-stone-200 md:pl-12">
                <h4 className="text-stone-900 font-bold tracking-widest text-sm uppercase mb-6 flex items-center gap-3">
                  <MessageSquareX className="w-6 h-6 text-red-600" /> KHCRF Does NOT:
                </h4>
                <ul className="space-y-4">
                  {["Edit political positions", "Promote any party or individual", "Publish without approval"].map((item, i) => (
                    <li key={i} className="flex gap-4 items-center text-stone-700 font-medium text-lg">
                      <span className="w-2 h-2 rounded-full bg-red-400 shrink-0"></span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

        </div>
        {/* CTA Section */}
        <div className="bg-stone-900 text-white rounded-3xl p-8 md:p-16 text-center relative overflow-hidden group">
          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-playfair font-black mb-6 group-hover:scale-105 transition-transform duration-500">
              Ready to Engage Responsibly?
            </h2>
            <p className="text-stone-300 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              If your constituency includes craft clusters or artisan
              communities, the Jammu and Kashmir Legislative Constituency Artisan Desk enables
              your office to engage in a verified, transparent, and accountable
              manner on artisan-related matters.
            </p>
            <div className="flex flex-col md:flex-row gap-8 justify-center items-start md:items-stretch">
              {/* Primary Action */}
              <div className="flex-1 w-full flex flex-col items-center">
                <Link
                  href="/research/lobbying/register"
                  className="w-full bg-brand-primary hover:bg-white hover:text-brand-primary text-white font-bold py-5 px-6 rounded-xl transition-all uppercase tracking-widest text-sm shadow-xl hover:shadow-2xl mb-4 flex items-center justify-center gap-3 group/btn"
                >
                  <span>Begin Office Verification</span>
                  <FaCheck className="text-white/70 group-hover/btn:text-icon-on-light transition-colors" />
                </Link>
                <p className="text-stone-400 text-xs text-center max-w-xs mx-auto font-medium">
                  Verification required. Only confirmed legislative offices may
                  publish or coordinate.
                </p>
              </div>

              {/* Divider for mobile */}
              <div className="md:hidden w-full h-px bg-stone-800 my-2"></div>

              {/* Secondary Action */}
              <div className="flex-1 w-full flex flex-col items-center">
                <Link
                  href="/legislative-office"
                  className="w-full border-2 border-stone-600 hover:border-white hover:bg-white hover:text-stone-900 text-stone-300 font-bold py-5 px-6 rounded-xl transition-all uppercase tracking-widest text-sm hover:shadow-xl mb-4 flex items-center justify-center gap-3 group/btn"
                >
                  <span>View Public Office Updates</span>
                  <FaLandmark className="text-stone-500 group-hover/btn:text-stone-900 transition-colors" />
                </Link>
                <p className="text-stone-500 text-xs text-center max-w-xs mx-auto font-medium">
                  Read-only access to verified legislative records and updates.
                </p>
              </div>
            </div>
          </div>
          {/* Background decoration */}
          
          <div className="absolute -bottom-1/2 -right-1/2 w-[800px] h-[800px] bg-brand-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}
