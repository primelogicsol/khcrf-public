"use client";

import Link from "next/link";
import {
  FaLandmark,
  FaUniversity,
  FaAward,
  FaHandsHelping,
  FaRupeeSign,
  FaGlobe,
  FaUsers,
  FaBalanceScale,
  FaBuilding,
  FaGavel,
  FaCheckCircle,
  FaFileContract,
  FaSitemap,
  FaChalkboardTeacher,
  FaShieldAlt,
  FaHandHoldingUsd,
  FaPlaneDeparture,
} from "react-icons/fa";
import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import { governanceHeroFallback } from "@/config/heroFallbacks";
import FeatureSection from "@/components/FeatureSection";
import StickySubNav from "../../../../components/StickySubNav";
import ScrollReveal from "../../../../components/ScrollReveal";

const NAV_ITEMS = [
  { id: "framework", label: "Framework", icon: FaBalanceScale },
  { id: "administrative", label: "Administrative", icon: FaLandmark },
  { id: "capacity", label: "Capacity", icon: FaUniversity },
  { id: "quality", label: "Quality", icon: FaAward },
  { id: "support", label: "Support", icon: FaHandsHelping },
  { id: "financial", label: "Financial", icon: FaRupeeSign },
  { id: "export", label: "Export", icon: FaGlobe },
];

export default function GovernanceClient() {
  return (
    <div className="bg-white font-roboto selection:bg-brand-primary selection:text-white">
      {/* 1. HERO - Universal Editorial */}
      <UniversalEditorialHero
        pageKey="research-governance"
        fallbackConfig={governanceHeroFallback}
      />

      {/* STICKY NAV */}
      <StickySubNav items={NAV_ITEMS} />

      {/* 2. FRAMEWORK INTRO */}
      <div id="framework" className="scroll-mt-32">
        <ScrollReveal>
          <FeatureSection
            category="Governance Framework"
            title="Kashmir Handicrafts Industry Governance Framework"
            description={
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  The governance framework of the Kashmir Handicrafts Industry
                  is a sophisticated, multi-tiered ecosystem designed to sustain
                  the livelihood of nearly 3.5 lakh artisans. It bridges
                  centuries-old traditions with modern economic imperatives,
                  ensuring the sector remains competitive while preserving its
                  cultural integrity.
                </p>
                <p>
                  At its core, the framework rests on four key pillars:{" "}
                  <strong>Legislative Protection</strong> for geographic
                  indications; <strong>Institutional Capacity</strong> for skill
                  fostering; <strong>Market Regulation</strong> for fair trade;
                  and <strong>Social Welfare</strong> for artisan safety. This
                  holistic approach monitors the value chain from the high
                  Himalayas to global luxury markets, providing oversight and
                  strategic support.
                </p>
                <p>
                  This structure facilitates a seamless transition between
                  policy formulation and ground-level implementation, ensuring
                  that the benefits of governance reach the grassroots level of
                  the artisan community.
                </p>
              </div>
            }
            quote="This framework strengthens the handicrafts sector's foundation by safeguarding the rights of artisans, promoting traditional skills, and ensuring the long-term sustainability and global competitiveness of Kashmir’s cultural treasures."
            imagePath="/assets/images/Kashmir22/3.png"
            imageAlt="Governance Framework"
            align="right"
          />
        </ScrollReveal>
      </div>

      {/* 3. ADMINISTRATIVE GOVERNANCE */}
      <div id="administrative" className="scroll-mt-32">
        <ScrollReveal>
          <FeatureSection
            category="KHCRF Policy Regulation"
            title="Administrative Governance"
            description={
              <div className="space-y-6">
                <div>
                  <h4 className="flex items-center gap-3 font-bold text-white text-xl mb-3">
                    <FaSitemap className="text-white" /> Strategic Oversight
                  </h4>
                  <p className="text-gray-300 leading-relaxed">
                    Administrative governance forms the backbone of the policy
                    framework, structured hierarchically from the Ministry of
                    Textiles (GoI) to the Directorate of Handicrafts, Jammu &
                    Kashmir. This structure ensures cohesive policy formulation,
                    regulatory consistency, and effective monitoring across the
                    sector. A core function includes enforcing the{" "}
                    <strong className="text-white">
                      Jammu & Kashmir Handicrafts Quality Control Act
                    </strong>{" "}
                    through systematic inspections and comprehensive artisan
                    registration. This administrative layer bridges high-level
                    policy intent with the practical needs of artisan
                    communities. It supports digital platforms for transparent
                    subsidy disbursement and artisan identity verification. By
                    streamlining cooperative society registration, local
                    clusters operate with greater administrative clarity and
                    autonomy, while grievances move through defined
                    decision-making channels.
                  </p>
                </div>
                <div className="bg-white/10 p-6 rounded-xl border-l-4 border-[var(--card-left-accent)] shadow-lg">
                  <h4 className="font-bold text-white text-sm uppercase tracking-widest mb-2">
                    Primary Governance Bodies
                  </h4>
                  <ul className="space-y-3">
                    <li className="text-gray-200">
                      <strong className="block text-white">
                        Ministry of Textiles (GoI)
                      </strong>
                      <span className="text-sm text-gray-400">
                        Policy formulation & funding.
                      </span>
                    </li>
                    <li className="text-gray-200">
                      <strong className="block text-white">
                        Directorate of Handicrafts (J&K)
                      </strong>
                      <span className="text-sm text-gray-400">
                        Implementation & cluster development.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            }
            imagePath="/assets/images/CRAFT_RESEARCH/16.png"
            imageAlt="Administrative Governance"
            align="left"
            isDark={true}
          />
        </ScrollReveal>
      </div>

      {/* 4. CAPACITY BUILDING */}
      <div id="capacity" className="scroll-mt-32">
        <ScrollReveal>
          <FeatureSection
            category="Institutional Development"
            title="Capacity Building & Institutional Governance"
            description={
              <div className="space-y-6">
                <div>
                  <h4 className="flex items-center gap-3 font-bold text-brand-dark text-xl mb-3">
                    <FaChalkboardTeacher data-ui-icon  className="" /> Skill
                    & Design Ecosystem
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Capacity building is the engine of modernization. Programs
                    like the <strong>Karkhana Scheme</strong> merge practical
                    training with theoretical knowledge to upgrade artisan
                    toolkits. Institutions like the{" "}
                    <strong>Craft Development Institute (CDI)</strong> serve as
                    innovation hubs, digitizing heritage designs and researching
                    new material blends to create a generation of educated craft
                    entrepreneurs.
                  </p>
                </div>
                <div className="bg-brand-primary/5 p-6 rounded-xl border-l-4 border-[var(--card-left-accent)] shadow-sm">
                  <h4 data-editorial-accent-text className="font-bold  text-sm uppercase tracking-widest mb-2">
                    Key Institutions
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-brand-dark font-bold">
                        J&K Craft Development Institute (CDI)
                      </p>
                      <p className="text-sm text-gray-500">
                        Design innovation & academic courses.
                      </p>
                    </div>
                    <div>
                      <p className="text-brand-dark font-bold">
                        School of Designs
                      </p>
                      <p className="text-sm text-gray-500">
                        Preserving ancient motifs & adaptations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            }
            imagePath="/assets/images/CRAFT_RESEARCH/17.png"
            imageAlt="Capacity Building"
            align="right"
          />
        </ScrollReveal>
      </div>

      {/* 5. QUALITY CONTROL */}
      <div id="quality" className="scroll-mt-32">
        <ScrollReveal>
          <FeatureSection
            category="Quality Assurance"
            title="Quality Control & Certification"
            description={
              <div className="space-y-6">
                <div>
                  <h4 className="flex items-center gap-3 font-bold text-white text-xl mb-3">
                    <FaShieldAlt className="text-white" /> GI Tagging &
                    Authenticity
                  </h4>
                  <p className="text-gray-300 leading-relaxed">
                    Authenticity defines value within global luxury markets. The
                    framework operationalizes{" "}
                    <strong className="text-white">
                      Geographical Indication (GI)
                    </strong>{" "}
                    certification, where crafts such as Pashmina undergo
                    stringent verification for material purity and origin. A
                    coordinated network of accredited testing laboratories
                    performs advanced analysis to ensure only verifiable
                    Kashmiri products receive certification, preventing
                    counterfeits and reinforcing international buyer confidence,
                    while supporting price integrity, traceable supply chains,
                    regulatory enforcement, and long-term trust across premium
                    global markets.
                  </p>
                </div>
                <div className="bg-white/10 p-6 rounded-xl border-l-4 border-[var(--card-left-accent)] shadow-lg">
                  <h4 className="font-bold text-white text-sm uppercase tracking-widest mb-3">
                    Regulatory Infrastructure
                  </h4>
                  <ul className="space-y-3 text-sm text-gray-200">
                    <li className="flex items-start">
                      <FaAward className="mt-1 mr-3 text-white shrink-0" />
                      <span>
                        <strong className="text-white">GI Registry:</strong>{" "}
                        Legal protection authority.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <FaBuilding className="mt-1 mr-3 text-white shrink-0" />
                      <span>
                        <strong className="text-white">Testing Labs:</strong>{" "}
                        Chemical & physical analysis.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <FaGavel className="mt-1 mr-3 text-white shrink-0" />
                      <span>
                        <strong className="text-white">Enforcement:</strong>{" "}
                        Market raids & seizing counterfeits.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            }
            imagePath="/assets/images/CRAFT_RESEARCH/18.png"
            imageAlt="Quality Control"
            align="left"
            isDark={true}
          />
        </ScrollReveal>
      </div>

      {/* 6. ARTISAN SUPPORT */}
      <div id="support" className="scroll-mt-32">
        <ScrollReveal>
          <FeatureSection
            category="Welfare & Rights"
            title="Artisan Support & Grievance Redressal"
            description={
              <div className="space-y-6">
                <div>
                  <h4 className="flex items-center gap-3 font-bold text-brand-dark text-xl mb-3">
                    <FaHandsHelping data-ui-icon  className="" /> Welfare &
                    Grievances
                  </h4>
                  <p className="text-black leading-relaxed">
                    The governance framework embeds artisan welfare as a core
                    policy obligation, extending beyond production to social
                    security, financial protection, and rights enforcement.
                    Structured support mechanisms include access to health
                    insurance, pension coverage, and education assistance for
                    artisan households, reducing long-term vulnerability within
                    craft communities. A formal grievance redressal system
                    enables artisans to report exploitation, delayed payments,
                    or contractual violations through district-level grievance
                    cells. Mandated response timelines, administrative
                    accountability, and escalation pathways ensure grievances
                    are addressed transparently, reinforcing dignity, trust, and
                    economic security across the handicraft value chain.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-[var(--card-left-accent)] shadow-sm">
                  <h4 data-editorial-accent-text className="font-bold  text-sm uppercase tracking-widest mb-2">
                    Support Mechanisms
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>
                      <strong>Social Security:</strong> Health & Life Insurance
                      coverage.
                    </li>
                    <li>
                      <strong>Pension:</strong> Old age support for senior
                      artisans.
                    </li>
                    <li>
                      <strong>Grievance Cells:</strong> Dedicated district-level
                      helplines.
                    </li>
                  </ul>
                </div>
              </div>
            }
            imagePath="/assets/images/CRAFT_RESEARCH/19.png"
            imageAlt="Artisan Support"
          />
        </ScrollReveal>
      </div>

      {/* 7. FINANCIAL GOVERNANCE */}
      <div id="financial" className="scroll-mt-32">
        <ScrollReveal>
          <FeatureSection
            category="Economic Empowerment"
            title="Financial Governance"
            description={
              <div className="space-y-6">
                <div>
                  <h4 className="flex items-center gap-3 font-bold text-white text-xl mb-3">
                    <FaHandHoldingUsd className="text-white" /> Credit &
                    Subsidies
                  </h4>
                  <p className="text-gray-300 leading-relaxed">
                    Financial governance is designed to strengthen artisan
                    autonomy by reducing dependence on informal lending systems
                    and irregular credit access. Structured schemes such as the
                    Artisan Credit Card (ACC) provide low-interest working
                    capital, enabling artisans to manage production cycles, raw
                    material sourcing, and seasonal cash flow without
                    exploitative borrowing practices.
                  </p>

                  <p className="text-gray-300 leading-relaxed">
                    Transparency is institutionalized through Direct Benefit
                    Transfer (DBT), ensuring subsidies and interest support
                    reach verified beneficiaries without intermediaries.
                    Cooperative societies and self-help groups receive targeted
                    grants for shared infrastructure and capacity expansion,
                    promoting economies of scale, financial resilience, and
                    sustainable growth across artisan clusters.
                  </p>
                </div>
                <div className="bg-white/10 p-6 rounded-xl border-l-4 border-[var(--card-left-accent)] shadow-lg">
                  <h4 className="font-bold text-white text-sm uppercase tracking-widest mb-3">
                    Financial Instruments
                  </h4>
                  <ul className="space-y-3 text-sm text-gray-200">
                    <li className="flex items-start">
                      <FaRupeeSign className="mt-1 mr-3 text-white shrink-0" />
                      <span>
                        <strong className="text-white">
                          Artisan Credit Card:
                        </strong>{" "}
                        Loan up to ₹2 Lakhs.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <FaLandmark className="mt-1 mr-3 text-white shrink-0" />
                      <span>
                        <strong className="text-white">
                          Interest Subvention:
                        </strong>{" "}
                        Govt bears loan interest.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <FaUsers className="mt-1 mr-3 text-white shrink-0" />
                      <span>
                        <strong className="text-white">
                          Cooperative Grants:
                        </strong>{" "}
                        Funding for self-help groups.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            }
            imagePath="/assets/images/CRAFT_RESEARCH/20.png"
            imageAlt="Financial Governance"
            align="left"
            isDark={true}
          />
        </ScrollReveal>
      </div>

      {/* 8. EXPORT PROMOTION */}
      <div id="export" className="scroll-mt-32">
        <ScrollReveal>
          <FeatureSection
            category="Global Reach"
            title="Export Promotion & Trade Facilitation"
            description={
              <div className="space-y-6">
                <div>
                  <h4 className="flex items-center gap-3 font-bold text-brand-dark text-xl mb-3">
                    <FaPlaneDeparture data-ui-icon  className="" /> Global
                    Market Links
                  </h4>
                  <p className="text-black leading-relaxed">
                    Export promotion governance focuses on reducing procedural
                    barriers and strengthening international market access for
                    Kashmiri crafts. Simplified export documentation, including
                    streamlined Import Export Code (IEC) processes, enables
                    artisans and cooperatives to participate directly in
                    cross-border trade while remaining compliant with regulatory
                    standards. Government-supported initiatives promote global
                    visibility through curated participation in international
                    trade fairs, buyer–seller meets, and digital marketplaces.
                    Branding support, logistics subsidies, and incentive
                    mechanisms such as duty drawback enhance price
                    competitiveness, allowing Kashmiri crafts to scale globally
                    while preserving authenticity and producer equity.
                  </p>
                </div>
                <div className="bg-brand-primary/5 p-6 rounded-xl border-l-4 border-[var(--card-left-accent)] shadow-sm">
                  <h4 data-editorial-accent-text className="font-bold  text-sm uppercase tracking-widest mb-2">
                    Export Facilitators
                  </h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>EPCH:</strong> B2B platforms & international
                      fairs.
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>ITPO:</strong> Overseas exhibition management.
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>J&K Corp:</strong> Direct marketing agency.
                    </p>
                  </div>
                </div>
              </div>
            }
            imagePath="/assets/images/CRAFT_RESEARCH/21.png"
            imageAlt="Export Promotion"
            align="right"
          />
        </ScrollReveal>
      </div>

      {/* CTA Section */}
      <section className="py-20 bg-brand-primary text-white text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <FaUsers className="text-5xl mx-auto mb-6 opacity-80" />
            <h2 className="text-2xl md:text-5xl font-black mb-6">
              Stay Connected with <br /> Hamadan Craft Revival Foundation - Kashmir
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
