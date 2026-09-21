"use client";

import Link from "next/link";
import {
  FaPassport,
  FaCopyright,
  FaShieldAlt,
  FaUserShield,
  FaGlobe,
  FaLeaf,
  FaUsers,
  FaBalanceScale,
  FaGavel,
  FaCheckDouble,
} from "react-icons/fa";
import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import { regulationsHeroFallback } from "@/config/heroFallbacks";
import FeatureSection from "@/components/FeatureSection";
import StickySubNav from "../../../../components/StickySubNav";
import ScrollReveal from "../../../../components/ScrollReveal";

const NAV_ITEMS = [
  { id: "gi", label: "GI Certification", icon: FaPassport },
  { id: "ipr", label: "IPR Protection", icon: FaCopyright },
  { id: "counterfeiting", label: "Anti-Counterfeiting", icon: FaShieldAlt },
  { id: "welfare", label: "Artisan Welfare", icon: FaUserShield },
  { id: "export", label: "Export Policies", icon: FaGlobe },
  { id: "environmental", label: "Environmental", icon: FaLeaf },
];

export default function RegulationsClient() {
  return (
    <div className="bg-white font-roboto selection:bg-brand-primary selection:text-white">
      {/* 1. HERO - Universal Editorial */}
      <UniversalEditorialHero
        pageKey="research-regulations"
        fallbackConfig={regulationsHeroFallback}
      />

      {/* STICKY NAV */}
      <StickySubNav items={NAV_ITEMS} />

      {/* 2. INTRO SECTION */}
      <div className="container mx-auto px-4 py-12 md:py-16 text-center max-w-4xl">
        <ScrollReveal>
          <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-6">
            Regulations that preserve Kashmir craftsmanship.
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Through our collaboration with government bodies and trade
            associations, KHCRF is committed to ensuring that the policy
            regulations governing Kashmir’s handicraft industry not only protect
            the rich heritage of these crafts but also empower artisans for a
            prosperous future.
          </p>
        </ScrollReveal>
      </div>

      {/* 3. GI CERTIFICATION */}
      <div id="gi" className="scroll-mt-32">
        <ScrollReveal>
          <FeatureSection
            category="KHCRF Policy Regulation"
            title="Geographical Indication (GI) Certification"
            description={
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-brand-dark text-lg mb-2">
                    Purpose
                  </h4>
                  <p className="text-gray-600">
                    The Geographical Indication (GI) certification establishes a
                    legal framework to protect products whose quality,
                    reputation, and characteristics are intrinsically linked to
                    a specific geographical region, such as traditional Kashmiri
                    crafts. It formally recognizes origin-based authenticity and
                    safeguards region-specific production knowledge.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-brand-dark text-lg mb-2">
                    Impact
                  </h4>
                  <p className="text-gray-600">
                    GI certification prevents the misuse of protected
                    geographical names by unauthorized producers, strengthening
                    market credibility and preserving the global reputation of
                    Kashmiri crafts. This legal protection enhances consumer
                    trust while supporting fair valuation and long-term cultural
                    and economic sustainability.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[var(--card-left-accent)]">
                  <h4 data-editorial-accent-text className="font-bold  text-sm uppercase tracking-widest mb-1">
                    Regulatory Body
                  </h4>
                  <p className="text-gray-700 font-medium">
                    Geographical Indications Registry of India
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Oversees GI certification applications, grants GI status,
                    and ensures compliance under the GI Act, 1999.
                  </p>
                </div>
              </div>
            }
            imagePath="/assets/images/CRAFT_RESEARCH/23.png"
            imageAlt="GI Certification"
            align="right"
          />
        </ScrollReveal>
      </div>

      {/* 4. IPR PROTECTION */}
      <div id="ipr" className="scroll-mt-32">
        <ScrollReveal>
          <FeatureSection
            category="KHCRF Policy Regulation"
            title="Intellectual Property Rights (IPR) Protection"
            description={
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-white text-lg mb-2">Purpose</h4>
                  <p className="text-gray-300">
                    Intellectual Property Rights (IPR) protection establishes a
                    legal safeguard for the designs, techniques, motifs, and
                    creative expressions developed by Kashmiri artisans. It
                    prevents unauthorized reproduction, misuse, and
                    commercialization of traditional knowledge and craft-based
                    intellectual assets.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white text-lg mb-2">Impact</h4>
                  <p className="text-gray-300">
                    Effective IPR enforcement ensures artisans retain control
                    over their creations and benefit fairly from their
                    commercial use. This protection strengthens bargaining
                    power, supports ethical licensing, and reinforces long-term
                    economic sustainability while preserving cultural ownership
                    and creative dignity.
                  </p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg border-l-4 border-[var(--card-left-accent)]">
                  <h4 className="font-bold text-white text-sm uppercase tracking-widest mb-2">
                    Regulatory Body
                  </h4>
                  <p className="text-gray-200 text-sm">
                    <FaGavel className="inline mr-2 text-white" />
                    Controller General of Patents, Designs, and Trademarks in
                    India
                  </p>
                  <p className="text-xs text-gray-400 mt-1 ml-6">
                    Oversees IPR protection for handicrafts.
                  </p>
                </div>
              </div>
            }
            imagePath="/assets/images/CRAFT_RESEARCH/24.png"
            imageAlt="IPR Protection"
            align="left"
            isDark={true}
          />
        </ScrollReveal>
      </div>

      {/* 5. ANTI-COUNTERFEITING */}
      <div id="counterfeiting" className="scroll-mt-32">
        <ScrollReveal>
          <FeatureSection
            category="KHCRF Policy Regulation"
            title="Anti-Counterfeiting Laws and Enforcement"
            description={
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-brand-dark text-lg mb-2">
                    Purpose
                  </h4>
                  <p className="text-gray-600">
                    Anti-counterfeiting laws aim to combat the sale of fake
                    products that are marketed as authentic Kashmiri
                    handicrafts. Counterfeiting is a significant problem,
                    especially for high-value crafts like Pashmina shawls.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-brand-dark text-lg mb-2">
                    Impact
                  </h4>
                  <p className="text-gray-600">
                    Enforcing these laws preserves the integrity of Kashmiri
                    crafts, ensuring only genuine products reach the market.
                    This benefits both artisans (fair compensation) and
                    consumers (assured authenticity).
                  </p>
                </div>
                <div className="bg-brand-primary/5 p-4 rounded-lg border-l-4 border-[var(--card-left-accent)]">
                  <h4 data-editorial-accent-text className="font-bold  text-sm uppercase tracking-widest mb-1">
                    Regulatory Bodies
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li className="flex items-center">
                      <FaUserShield data-ui-icon  className="mr-2 " />{" "}
                      Customs Authorities
                    </li>
                    <li className="flex items-center">
                      <FaBalanceScale data-ui-icon  className="mr-2 " />{" "}
                      Ministry of Commerce and Industry
                    </li>
                    <li className="flex items-center">
                      <FaCheckDouble data-ui-icon  className="mr-2 " />{" "}
                      Geographical Indications Registry
                    </li>
                  </ul>
                </div>
              </div>
            }
            imagePath="/assets/images/CRAFT_RESEARCH/25.png"
            imageAlt="Anti-Counterfeiting"
            align="right"
          />
        </ScrollReveal>
      </div>

      {/* 6. ARTISAN WELFARE */}
      <div id="welfare" className="scroll-mt-32">
        <ScrollReveal>
          <FeatureSection
            category="KHCRF Policy Regulation"
            title="Artisan Welfare and Social Security Policies"
            description={
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-white text-lg mb-2">Purpose</h4>
                  <p className="text-gray-300">
                    Artisan welfare and social security policies are designed to
                    provide financial protection, healthcare access, and
                    long-term security to artisans, particularly those operating
                    within informal and unorganized craft sectors. These
                    frameworks ensure access to insurance, pensions, educational
                    support, and skill development programs.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white text-lg mb-2">Impact</h4>
                  <p className="text-gray-300">
                    Robust welfare mechanisms enhance economic stability and
                    social dignity for artisan households by reducing
                    vulnerability to health risks and income shocks. Sustained
                    support enables career continuity, intergenerational skill
                    transfer, and improved quality of life across Kashmir’s
                    craft ecosystem.
                  </p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg border-l-4 border-[var(--card-left-accent)]">
                  <h4 className="font-bold text-white text-sm uppercase tracking-widest mb-2">
                    Regulatory Body
                  </h4>
                  <p className="text-gray-200 font-medium">
                    Ministry of Textiles
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Primary agency responsible for implementation, working
                    alongside state government departments.
                  </p>
                </div>
              </div>
            }
            imagePath="/assets/images/CRAFT_RESEARCH/26.png"
            imageAlt="Artisan Welfare"
            align="left"
            isDark={true}
          />
        </ScrollReveal>
      </div>

      {/* 7. EXPORT PROMOTION */}
      <div id="export" className="scroll-mt-32">
        <ScrollReveal>
          <FeatureSection
            category="KHCRF Policy Regulation"
            title="Export Promotion Policies"
            description={
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-brand-dark text-lg mb-2">
                    Purpose
                  </h4>
                  <p className="text-gray-600">
                    Export promotion policies are structured to integrate
                    Kashmiri handicrafts into global trade systems by reducing
                    entry barriers and improving market access. These frameworks
                    support artisans through export subsidies, simplified
                    procedures for GI-certified products, participation in
                    international trade fairs, and access to global marketing
                    platforms.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-brand-dark text-lg mb-2">
                    Impact
                  </h4>
                  <p className="text-gray-600">
                    Strengthened export mechanisms expand international demand
                    and visibility for Kashmiri crafts, leading to higher sales
                    volumes and stable incomes. Preferential treatment for
                    GI-certified products enhances credibility, improves price
                    realization, and reinforces the sector’s contribution to
                    regional and national economic growth.
                  </p>
                </div>
                <div className="bg-brand-primary/5 p-4 rounded-lg border-l-4 border-[var(--card-left-accent)]">
                  <h4 data-editorial-accent-text className="font-bold  text-sm uppercase tracking-widest mb-1">
                    Regulatory Bodies
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li className="flex items-center">
                      <FaGlobe data-ui-icon  className="mr-2 " /> Export
                      Promotion Council for Handicrafts (EPCH)
                    </li>
                    <li className="flex items-center">
                      <FaBalanceScale data-ui-icon  className="mr-2 " />{" "}
                      Ministry of Commerce and Industry
                    </li>
                  </ul>
                </div>
              </div>
            }
            imagePath="/assets/images/CRAFT_RESEARCH/27.png"
            imageAlt="Export Promotion"
            align="right"
          />
        </ScrollReveal>
      </div>

      {/* 8. ENVIRONMENTAL */}
      <div id="environmental" className="scroll-mt-32">
        <ScrollReveal>
          <FeatureSection
            category="KHCRF Policy Regulation"
            title="Environmental and Sustainability Regulations"
            description={
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-white text-lg mb-2">Purpose</h4>
                  <p className="text-gray-300">
                    Environmental and sustainability regulations guide the
                    handicraft sector toward responsible production by
                    encouraging eco-friendly materials, low-impact processes,
                    and resource efficiency. These frameworks ensure Kashmiri
                    crafts are produced using methods that minimize carbon
                    footprint while respecting ecological limits and traditional
                    knowledge systems.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white text-lg mb-2">Impact</h4>
                  <p className="text-gray-300">
                    Sustainability compliance protects natural resources while
                    preserving heritage techniques such as natural dyes and
                    ethical wood sourcing. Alignment with global environmental
                    standards enhances market acceptance, strengthens brand
                    credibility, and positions Kashmiri handicrafts within
                    responsible and future-ready global supply chains.
                  </p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg border-l-4 border-[var(--card-left-accent)]">
                  <h4 className="font-bold text-white text-sm uppercase tracking-widest mb-2">
                    Regulatory Body
                  </h4>
                  <p className="text-gray-200 font-medium">
                    Ministry of Environment, Forest, and Climate Change (India)
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Enforces environmental regulations related to the handicraft
                    sector.
                  </p>
                </div>
              </div>
            }
            imagePath="/assets/images/CRAFT_RESEARCH/28.png"
            imageAlt="Environmental Regulations"
            align="left"
            isDark={true}
          />
        </ScrollReveal>
      </div>

      {/* CTA Section */}
      <section className="py-20 bg-brand-primary text-white text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <FaUsers className="text-5xl mx-auto mb-6 opacity-80" />
            <h2 className="text-2xl md:text-5xl font-black mb-6">
              Stay Connected With Hamadan Craft Revival Foundation - Kashmir
            </h2>
            <p className="text-xl mb-10 opacity-90">
              Kashmir's Craft Policy Think-Tank
            </p>
            <Link
              href="/memberships"
              className="inline-block bg-white text-brand-primary px-10 py-4 rounded-full font-black uppercase tracking-widest hover:bg-brand-dark hover:text-white transition-colors shadow-2xl"
            >
              Subscribe Membership Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
