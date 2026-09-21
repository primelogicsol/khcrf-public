"use client";

import Link from "next/link";
import PartnerStats from "@/components/common/PartnerStats";
import { ORGANIZATION_TYPES } from "@/lib/partnerTaxonomy";

export default function PartnerNetwork() {
  return (
    <main className="bg-brand-primary min-h-screen">

      {/* ── Centered header + 3 collection cards ─────────────────── */}
      <PartnerStats />

      {/* ── Split panel: Institutional Partnership Landscape ──────── */}
      <section className="border-t border-white/[0.06] py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* LEFT — context + CTAs */}
            <div className="lg:col-span-5 flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 block">
                COLLECTION C · STRATEGIC & INSTITUTIONAL ALLIANCES
              </span>

              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-5 leading-tight">
                Institutional Partnership Landscape
              </h2>

              <p className="text-[15px] text-slate-400 leading-relaxed mb-10">
                KHCRF partners with institutions across six domains — government, academic, cultural, trade, development and financial. Each category represents a distinct pathway for institutional collaboration, co-research, policy engagement and ecosystem support.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/about/partner-network/registry?collection=institutional-alliance"
                  className="inline-flex items-center gap-3 px-6 py-4 border border-white/[0.14] text-white font-black uppercase tracking-wider text-[10px] rounded-xl hover:border-white/30 hover:bg-white/[0.04] transition-colors"
                >
                  <span>Explore Partner Registry</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/about/partner-network/join"
                  className="inline-flex items-center gap-3 px-6 py-4 bg-[#B34E28] text-white font-black uppercase tracking-wider text-[10px] rounded-xl hover:bg-[#8B3A1E] transition-colors"
                >
                  <span>Apply for Partnership</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* RIGHT — 2 × 3 institutional category tiles */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 gap-4">
                {ORGANIZATION_TYPES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/about/partner-network/registry?collection=institutional-alliance&focus=${cat.slug}`}
                    className="group flex flex-col border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.14] rounded-xl p-6 transition-colors"
                  >
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-white mb-2 leading-snug">
                      {cat.label}
                    </h3>
                    <p className="text-[13px] text-slate-500 leading-relaxed flex-1">
                      {cat.desc}
                    </p>
                    <span className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-[#B34E28] transition-colors">
                      Explore →
                    </span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
