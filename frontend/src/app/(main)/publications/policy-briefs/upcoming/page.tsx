"use client";

import Link from "next/link";
import { FaArrowLeft, FaBookOpen, FaCalendarAlt } from "react-icons/fa";

export default function UpcomingPolicyBriefsPage() {
  const upcoming = [
    {
      title: "Geographical Indications & Global IP",
      subtitle: "Securing Kashmir's Heritage",
      audience: "Legal Experts, Trade Bodies, Government",
      status: "Drafting",
      release: "Q1 2027",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Export Subsidies and Artisan Welfare",
      subtitle: "Proposing a dual-benefit framework",
      audience: "Policymakers, Exporters, Trade Unions",
      status: "In Preparation",
      release: "Q4 2026",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Fair Wage Implementation in Craft Sectors",
      subtitle: "Standardizing compensation across GI crafts",
      audience: "Labor Departments, Cooperatives, NGOs",
      status: "Data Collection",
      release: "Q2 2027",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Tax Exemptions for Heritage Artisans",
      subtitle: "Fiscal strategies for craft preservation",
      audience: "Finance Ministry, Artisan Guilds, Economists",
      status: "Drafting",
      release: "Q3 2027",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Environmental Standards for Dyeing Facilities",
      subtitle: "Regulatory frameworks for water management",
      audience: "Environmental Protection Agencies, Industry",
      status: "In Preparation",
      release: "Q4 2027",
      icon: <FaBookOpen className="text-xl" />,
    },
    {
      title: "Anti-Counterfeiting Legislation",
      subtitle: "Protecting authentic crafts at retail borders",
      audience: "Customs Officials, Legal Experts, Brands",
      status: "Planning",
      release: "Q1 2028",
      icon: <FaBookOpen className="text-xl" />,
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 mt-10 mb-32">
        <div className="mb-12 text-center">
          <Link href="/publications/policy-briefs" className="inline-flex text-xs font-black text-gray-400 hover:text-brand-primary uppercase tracking-widest items-center gap-2 mb-6">
            <FaArrowLeft /> Back to Policy Briefs
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-brand-dark leading-tight mb-4">
            Upcoming <span className="text-brand-primary">Policy Briefs</span> Releases
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
