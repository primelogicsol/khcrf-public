"use client";

import React from "react";
import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import { advocacyHeroFallback } from "@/config/heroFallbacks";
import { ADVOCACY_TOPICS } from "@/data/advocacy-data";
import {
  FaShieldAlt,
  FaBalanceScale,
  FaLeaf,
  FaGlobe,
  FaVenus,
  FaLaptop,
  FaChevronRight,
  FaUsers,
  FaBullhorn,
  FaHandshake,
  FaHandHoldingUsd,
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

const ICON_MAP: Record<string, any> = {
  "counterfeit-prevention": FaShieldAlt,
  "artisan-rights": FaBalanceScale,
  sustainability: FaLeaf,
  "market-access": FaGlobe,
  "gender-equity": FaVenus,
  "digital-transformation": FaLaptop,
};

export default function AdvocacyClient() {
  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    const shareData = {
      title: "KHCRF Policy Advocacy",
      text: "Join the movement for Artisan Empowerment and Policy Action.",
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        navigator.clipboard.writeText(shareData.url);
        alert("Advocacy link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const gridItems = ADVOCACY_TOPICS.map((topic) => ({
    title: topic.title,
    text: topic.shortDescription,
    link: `/research/advocacy/${topic.slug}`,
    icon: ICON_MAP[topic.slug] || FaShieldAlt,
  }));

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-roboto">
      {/* Hero Section */}
      <UniversalEditorialHero
        pageKey="research-advocacy"
        fallbackConfig={advocacyHeroFallback as any}
      />

      {/* Intro & Objectives Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span data-editorial-accent-text className="block  font-bold tracking-widest uppercase text-sm mb-2">
                Shaping the Future
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-black text-stone-900 mb-6 leading-tight">
                Kashmir Craft Policy Advocacy
              </h2>
              <p className="text-stone-600 text-lg leading-relaxed mb-8">
                KHCRF’s Policy Advocacy campaigns are committed to influencing
                key legislative changes and shaping public opinion in favor of
                supporting Kashmiri artisans. By partnering with government
                bodies, industry stakeholders, and craft leaders, we aim to
                implement policies that safeguard the future of the craft
                industry.
              </p>

              <p className="text-stone-600 text-lg leading-relaxed mb-8">
                Our strategic policy outreach works toward securing essential
                regulatory updates and fostering public awareness for the
                benefit of talented regional creators. By engaging with various
                legislative entities, market specialists, and cultural experts,
                we constantly strive to establish frameworks that protect the
                legacy of tradition.
              </p>

              <div className="bg-[#fdfbf7] p-8 rounded-lg border-l-4 border-[var(--card-left-accent)]">
                <h3 className="font-playfair text-xl font-bold text-stone-900 mb-4">
                  Advocacy Objectives
                </h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <span className="text-brand-primary mt-1">✦</span>
                    <p className="text-stone-700 text-sm">
                      <span className="font-bold text-stone-900">
                        Strengthening Artisan Rights:
                      </span>{" "}
                      Legal protection, fair wages, and safe conditions.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-brand-primary mt-1">✦</span>
                    <p className="text-stone-700 text-sm">
                      <span className="font-bold text-stone-900">
                        Supporting Craft Export Growth:
                      </span>{" "}
                      Expanding global markets and simplifying trade
                      regulations.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-brand-primary mt-1">✦</span>
                    <p className="text-stone-700 text-sm">
                      <span className="font-bold text-stone-900">
                        Sustainability:
                      </span>{" "}
                      Eco-friendly practices and environmental protection.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[700px] rounded-lg overflow-hidden shadow-2xl group">
              <div className="absolute inset-0 bg-stone-200">
                <img
                  src="/assets/images/get_involved/5.png"
                  alt="Shaping Artisan Futures"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://placehold.co/600x800/e2e8f0/475569?text=Artisan+Future")
                  }
                />
              </div>
              {/* <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <p className="font-playfair text-2xl italic">
                  "Lobbying for sector-specific needs"
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Advocacy */}
      <section className="py-20 bg-stone-50 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {(() => {
            const featuredAdvocacy = ADVOCACY_TOPICS[0];
            return featuredAdvocacy ? (
              <div className="mb-16">
                <span className="block text-stone-400 font-bold tracking-widest uppercase text-xs mb-4">
                  Featured Initiative
                </span>
                <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col md:flex-row group hover:shadow-xl transition-all duration-500">
                  <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                    <Image src="/assets/images/advo.png" alt={featuredAdvocacy.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                      ACTIVE LOBBY
                    </div>
                  </div>
                  <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center bg-white relative">
                    <h3 className="text-2xl md:text-3xl font-playfair font-black text-stone-900 mb-4">
                      {featuredAdvocacy.title}
                    </h3>
                    <p className="text-stone-600 text-lg mb-8 leading-relaxed">
                      {featuredAdvocacy.shortDescription}
                    </p>
                    <div className="flex flex-wrap items-center gap-6 mt-auto">
                      <div className="flex -space-x-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-stone-200 overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="Advocate" className="w-full h-full object-cover" />
                          </div>
                        ))}
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-500">
                          +150
                        </div>
                      </div>
                      <Link href={`/research/advocacy/${featuredAdvocacy.slug}`} className="px-6 py-3 bg-stone-900 text-white text-sm font-bold rounded-xl hover:bg-stone-800 transition-colors shadow-md ml-auto flex items-center gap-2">
                        View Details <FaChevronRight className="text-xs" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : null;
          })()}

          {/* Advocacy Grid */}
          <div className="mb-20">
            <div className="flex justify-between items-end mb-8">
              <span className="block text-stone-400 font-bold tracking-widest uppercase text-xs">
                All Policy Action
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(() => {
                const gridItemsList = ADVOCACY_TOPICS.slice(1);
                const bgColors = ["bg-amber-50/50", "bg-stone-50", "bg-orange-50/30", "bg-white border-stone-200", "bg-stone-100/50 border-stone-200"];
                const metrics = ["Legislative Review", "Policy Drafted", "In Consultation", "Global Action", "Implementation"];
                const statuses = ["ACTIVE", "ONGOING", "UPCOMING", "ACTIVE", "COMPLETED"];
                const statusColors = ["bg-emerald-500", "bg-blue-500", "bg-amber-500", "bg-emerald-500", "bg-stone-500"];
                
                return gridItemsList.map((item, i) => (
                  <div key={item.slug} className={`rounded-2xl border border-stone-100 p-8 flex flex-col h-full group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ${bgColors[i % bgColors.length]}`}>
                    <div className="flex justify-between items-start mb-6">
                      <span className={`px-2.5 py-1 text-[10px] font-bold text-white rounded uppercase tracking-widest ${statusColors[i % statusColors.length]}`}>
                        {statuses[i % statuses.length]}
                      </span>
                      <span className="text-stone-300 group-hover:text-amber-600 transition-colors">
                        {ICON_MAP[item.slug] ? React.createElement(ICON_MAP[item.slug], { className: "text-xl" }) : <FaBalanceScale className="text-xl" />}
                      </span>
                    </div>
                    <h4 className="text-xl font-playfair font-bold text-stone-900 mb-3">{item.title}</h4>
                    <p className="text-stone-600 text-sm leading-relaxed mb-6 flex-grow">
                      {item.shortDescription}
                    </p>
                    
                    <div className="flex items-center justify-between border-t border-stone-200/60 pt-5 mt-auto">
                      <div className="text-xs font-bold text-stone-500 uppercase tracking-widest">
                        {metrics[i % metrics.length]}
                      </div>
                      <Link href={`/research/advocacy/${item.slug}`} className="text-stone-900 hover:text-amber-700 transition-colors flex items-center gap-1 text-sm font-bold">
                        View <FaChevronRight className="text-[10px]" />
                      </Link>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Get Involved Action Cards */}
          <div>
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-stone-600 font-bold tracking-widest uppercase text-xs mb-4 shadow-sm">
                Get Involved
              </span>
              <h3 className="text-3xl font-playfair font-black text-stone-900">How You Can Help</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { icon: FaBullhorn, label: "Share", link: "#" },
                { icon: FaUsers, label: "Participate", link: "/legislative-office" },
                { icon: FaHandshake, label: "Partner", link: "/about/partner-network/join" },
                { icon: FaHandHoldingUsd, label: "Sponsor", link: "/about/donations/donate" },
                { icon: FaGlobe, label: "Campaigns", link: "/research/campaigns" },
              ].map((action, i) => {
                if (action.label === "Share") {
                  return (
                    <button onClick={handleShare} key={i} className="bg-white border border-stone-200 rounded-2xl p-6 text-center hover:border-amber-300 hover:shadow-md transition-all group block w-full">
                      <div className="w-12 h-12 rounded-full bg-stone-50 text-stone-400 group-hover:bg-amber-50 group-hover:text-amber-600 flex items-center justify-center mx-auto mb-4 transition-colors">
                        <action.icon className="text-xl" />
                      </div>
                      <h4 className="font-bold text-stone-900">{action.label}</h4>
                    </button>
                  );
                }
                return (
                  <Link href={action.link} key={i} className="bg-white border border-stone-200 rounded-2xl p-6 text-center hover:border-amber-300 hover:shadow-md transition-all group block">
                    <div className="w-12 h-12 rounded-full bg-stone-50 text-stone-400 group-hover:bg-amber-50 group-hover:text-amber-600 flex items-center justify-center mx-auto mb-4 transition-colors">
                      <action.icon className="text-xl" />
                    </div>
                    <h4 className="font-bold text-stone-900">{action.label}</h4>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Support / CTA Section */}
      <section className="py-20 bg-stone-900 text-white relative overflow-hidden">
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <span className="block text-white font-bold tracking-[0.2em] uppercase text-xs mb-4">
            Get Involved
          </span>
          <h2 className="text-3xl md:text-5xl font-playfair font-black mb-6">
            Join the Movement for Artisan Rights
          </h2>
          <p className="text-stone-300 text-lg mb-10 max-w-2xl mx-auto">
            KHCRF’s policy advocacy is dedicated to securing the future of
            Kashmir’s handicraft industry. Help us shape policies that support
            livelihoods and protect heritage.
          </p>
          <div className="flex flex-col gap-6 text-left mt-12 max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-stone-800/80 backdrop-blur-sm rounded-2xl border border-stone-700 transition-all hover:border-brand-primary hover:bg-stone-800">
              <div className="flex-grow">
                <h3 className="font-playfair text-xl font-bold text-white mb-2">
                  Advocacy Partner Application
                </h3>
                <p className="text-stone-300 text-sm leading-relaxed max-w-md">
                  Apply to join KHCRF's advocacy network and support direct policy action for artisan rights, fair trade, cultural heritage, and craft sector protection.
                </p>
              </div>
              <div className="flex-shrink-0 w-full sm:w-auto">
                <Link
                  href="/research/campaigns/cultural-pride/join?type=partner"
                  className="inline-block w-full sm:w-auto px-6 py-3 bg-brand-primary text-white text-sm font-bold text-center rounded-xl hover:bg-brand-dark transition-colors shadow-sm"
                >
                  Apply Now
                </Link>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-stone-800/50 backdrop-blur-sm rounded-2xl border border-stone-700 transition-all hover:border-amber-500 hover:bg-stone-800/80">
              <div className="flex-grow">
                <h3 className="font-playfair text-xl font-bold text-white mb-2">
                  Existing Advocacy Members
                </h3>
                <p className="text-stone-400 text-sm leading-relaxed max-w-md">
                  Access your advocacy dashboard, manage policy initiatives, submit field reports, and participate in approved lobbying efforts.
                </p>
              </div>
              <div className="flex-shrink-0 w-full sm:w-auto">
                <Link
                  href="/login"
                  className="inline-block w-full sm:w-auto px-6 py-3 bg-transparent border border-stone-500 text-white text-sm font-bold text-center rounded-xl hover:bg-stone-700 hover:border-stone-400 transition-colors shadow-sm"
                >
                  Login To Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
