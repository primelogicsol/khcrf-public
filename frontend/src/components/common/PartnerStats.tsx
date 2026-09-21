"use client";

import ScrollReveal from "../ScrollReveal";
import Link from "next/link";
import { usePartnerNetworkCollections } from "@/hooks/usePartnerNetworkCollections";

export default function PartnerStats() {
  const { counts, loading, error } = usePartnerNetworkCollections();

  const fmt = (n: number | null) => {
    if (loading) return "?";
    return n === null ? "?" : String(n);
  };

  return (
    <section className="relative bg-brand-primary overflow-hidden">
      {/* Top edge rule */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#F6F2EC]/15 to-transparent" />
      {/* Bottom edge rule */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#F6F2EC]/15 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-24">

        {/* Centered section header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 border border-white/[0.12] rounded-full px-5 py-2 mb-8">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Global Reach · Institutional Network
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-5 leading-tight tracking-tight">
              Building Our Institutional Network
            </h2>

            <p className="text-[15px] text-slate-400 leading-relaxed max-w-2xl mx-auto">
              KHCRF's ecosystem of core organizations, specialized enterprises and independent institutional alliances supporting the future of Kashmir craftsmanship.
            </p>
          </div>
        </ScrollReveal>

        {/* Three collection cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card A — Core Ecosystem */}
          <ScrollReveal delay={0}>
            <Link
              href="/about/partner-network/registry?collection=core-ecosystem"
              className="group flex flex-col h-full border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05] rounded-2xl p-8 md:p-10 transition-colors"
            >
              <div className="min-h-[48px]">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block">
                  COLLECTION A · CORE ECOSYSTEM
                </span>
              </div>

              <div className="min-h-[90px] text-6xl font-black text-white tabular-nums leading-none">
                {fmt(counts.coreEcosystem)}
              </div>

              <div className="min-h-[64px]">
                <h3 className="text-xl font-playfair font-bold text-white leading-tight">
                  Integrated Ecosystem<br />Entities
                </h3>
              </div>

              <div className="min-h-[140px] mt-3">
                <p className="text-[15px] text-slate-400 leading-relaxed">
                  KHCRF-connected entities supporting technology, research, provenance, commerce, tourism, media and public-interest infrastructure.
                </p>
              </div>

              <div className="border-t border-white/[0.06] pt-5 mt-auto">
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 group-hover:text-[#F6F2EC] transition-colors">
                  EXPLORE ECOSYSTEM &rarr;
                </span>
              </div>
            </Link>
          </ScrollReveal>

          {/* Card B — Specialized Enterprises */}
          <ScrollReveal delay={80}>
            <Link
              href="/about/partner-network/registry?collection=specialized-enterprise"
              className="group flex flex-col h-full border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05] rounded-2xl p-8 md:p-10 transition-colors"
            >
              <div className="min-h-[48px]">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B34E28] block">
                  COLLECTION B · SPECIALIZED ENTERPRISES
                </span>
              </div>

              <div className="min-h-[90px] text-6xl font-black text-white tabular-nums leading-none">
                {fmt(counts.specializedEnterprises)}
              </div>

              <div className="min-h-[64px]">
                <h3 className="text-xl font-playfair font-bold text-white leading-tight">
                  Specialized Platforms &amp;<br />Enterprises
                </h3>
              </div>

              <div className="min-h-[140px] mt-3">
                <p className="text-[15px] text-slate-400 leading-relaxed">
                  Specialized platforms and enterprises supporting commerce, market access, technology, design, logistics, media and cultural services.
                </p>
              </div>

              <div className="border-t border-white/[0.06] pt-5 mt-auto">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#B34E28] group-hover:text-amber-300 transition-colors">
                  EXPLORE SPECIALIZED ENTERPRISES &rarr;
                </span>
              </div>
            </Link>
          </ScrollReveal>

          {/* Card C — Strategic Alliances */}
          <ScrollReveal delay={160}>
            <Link
              href="/about/partner-network/registry?collection=institutional-alliance"
              className="group flex flex-col h-full border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05] rounded-2xl p-8 md:p-10 transition-colors"
            >
              <div className="min-h-[48px]">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block">
                  COLLECTION C · STRATEGIC ALLIANCES
                </span>
              </div>

              <div className="min-h-[90px] flex flex-col justify-start">
                <div className="text-6xl font-black text-white tabular-nums leading-none">
                  {fmt(counts.institutionalAlliances)}
                </div>
                {counts.institutionalAlliances === 0 && !loading && (
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-600 mt-2">
                    Network Expanding
                  </div>
                )}
              </div>

              <div className="min-h-[64px]">
                <h3 className="text-xl font-playfair font-bold text-white leading-tight">
                  Strategic &amp; Institutional<br />Partners
                </h3>
              </div>

              <div className="min-h-[140px] mt-3">
                <p className="text-[15px] text-slate-400 leading-relaxed">
                  Strategic partners supporting KHCRF through philanthropy, research, technology, sustainability, policy and community development.
                </p>
              </div>

              <div className="border-t border-white/[0.06] pt-5 mt-auto">
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 group-hover:text-[#F6F2EC] transition-colors">
                  EXPLORE STRATEGIC PARTNERS &rarr;
                </span>
              </div>
            </Link>
          </ScrollReveal>
        </div>

        {/* Explore link */}
        <div className="mt-10 text-center">
          <Link
            href="/about/partner-network"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-[#F6F2EC] transition-colors"
          >
            Explore Partner Network &rarr;
          </Link>
        </div>

      </div>
    </section>
  );
}
