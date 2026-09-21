"use client";

import Link from "next/link";
import { FaArrowLeft, FaBookOpen, FaCalendarAlt } from "react-icons/fa";

export default function UpcomingCaseStudiesPage() {
  const upcoming = [
    {
      title: "Sustainable Livelihoods in Artisan Clusters",
      subtitle: "Field Insights from 5 Districts",
      audience: "NGOs, Researchers, Philanthropists",
      status: "Data Collection",
      release: "Q2 2027",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Revival of the Kani Weaving Cooperative",
      subtitle: "A success story in collective bargaining",
      audience: "Cooperatives, Government, Academics",
      status: "In Preparation",
      release: "Q1 2027",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Blockchain Traceability in the Carpet Industry",
      subtitle: "How GI tags were digitized in Kashmir",
      audience: "Tech Partners, Certifying Agencies, Exporters",
      status: "Drafting",
      release: "Q3 2027",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Artisan-to-Consumer Direct Retail Models",
      subtitle: "Bypassing intermediaries for fair pricing",
      audience: "Artisans, Retail Platforms, Economists",
      status: "Peer Review",
      release: "Q4 2026",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Impact of Micro-Finance on Women Embroiderers",
      subtitle: "Empowerment through Sozni and Crewel crafts",
      audience: "Financial Institutions, NGOs, Sociologists",
      status: "Data Collection",
      release: "Q2 2027",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Crafting Post-Crisis",
      subtitle: "Resilience in artisan families during economic shocks",
      audience: "Policymakers, Researchers, Aid Agencies",
      status: "Planning",
      release: "Q4 2027",
      icon: <FaBookOpen className="text-xl" />,
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 mt-10 mb-32">
        <div className="mb-12 text-center">
          <Link href="/publications/case-studies" className="inline-flex text-xs font-black text-gray-400 hover:text-brand-primary uppercase tracking-widest items-center gap-2 mb-6">
            <FaArrowLeft /> Back to Case Studies
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-brand-dark leading-tight mb-4">
            Upcoming <span className="text-brand-primary">Case Studies</span> Releases
          </h1>
          <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto">
            The KHCRF Editorial Board is actively curating and preparing a rigorous pipeline of new research and guidelines to support the craft ecosystem.
          </p>
        </div>

        <div className="space-y-6">
          {upcoming.map((item, idx) => (
            <div key={idx} className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 md:items-center">
              <div data-ui-icon className="w-16 h-16 rounded-2xl bg-brand-primary/10  flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div className="flex-1">
                <span data-editorial-accent-text className="text-[10px] font-black  uppercase tracking-widest mb-1 block">
                  Target: {item.release} • {item.status}
                </span>
                <h3 className="text-xl font-bold text-brand-dark mb-1">{item.title}</h3>
                <p className="text-sm font-semibold text-gray-500">{item.subtitle}</p>
                <div className="mt-4 pt-4 border-t border-gray-100 text-xs font-medium text-gray-400">
                  <span className="font-bold text-gray-600">Audience:</span> {item.audience}
                </div>
              </div>
              <div className="md:border-l border-gray-100 md:pl-6 pt-4 md:pt-0">
                <Link
                  href="/about/contact?subject=Notify Me: upcoming publication"
                  className="px-6 py-3 bg-brand-dark text-white rounded-xl hover:bg-brand-primary transition-all text-[11px] font-black uppercase tracking-wider block text-center shadow-lg"
                >
                  <FaCalendarAlt className="inline-block mr-2" /> Notify Me
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
