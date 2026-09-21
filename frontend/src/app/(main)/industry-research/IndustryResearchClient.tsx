"use client";

import Link from "next/link";
import {
  FaArrowRight,
  FaCheckCircle,
  FaGlobe,
  FaLeaf,
  FaGavel,
  FaFingerprint,
  FaUsers,
  FaChartLine,
  FaIndustry,
  FaSearch,
  FaEye,
  FaBullseye,
  FaBoxOpen,
  FaRocket,
  FaLightbulb,
} from "react-icons/fa";
import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import { industryResearchHeroFallback } from "@/config/heroFallbacks";
import FeatureSection from "@/components/FeatureSection";
import InfoGrid from "./components/InfoGrid";
import StickySubNav from "../../../components/StickySubNav";
import ScrollReveal from "../../../components/ScrollReveal";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: FaEye },
  { id: "objectives", label: "Objectives", icon: FaBullseye },
  { id: "deliverables", label: "Deliverables", icon: FaBoxOpen },
  { id: "scope", label: "Scope", icon: FaSearch },
  { id: "impact", label: "Impact", icon: FaRocket },
  { id: "projects", label: "Projects", icon: FaLightbulb },
];

const INITIATIVES_DATA = [
  {
    title: "Historical & Economic Impact",
    text: "Investigate the evolution of Kashmir's handicrafts and their significant contributions to local and international economies.",
    icon: FaGlobe,
  },
  {
    title: "Sustainability & Efficiency",
    text: "Develop strategies to reduce environmental impact while maintaining authentic, resource-efficient production practices.",
    icon: FaLeaf,
  },
  {
    title: "Policy & Governance",
    text: "Analyze policy gaps and propose regulatory frameworks to enhance artisan welfare and market protections.",
    icon: FaGavel,
  },
  {
    title: "Global Luxury Positioning",
    text: "Create strategies to position Kashmiri crafts as premium, globally recognized luxury products with a sustainable focus.",
    icon: FaArrowRight,
  },
  {
    title: "Authenticity & Transparency",
    text: "Integrate blockchain for secure, transparent craft traceability, ensuring authenticity and protecting artisans' rights.",
    icon: FaFingerprint,
  },
  {
    title: "Artisan Welfare & Equity",
    text: "Improve socio-economic conditions for artisans, with an emphasis on gender equity, fair wages, and leadership opportunities.",
    icon: FaUsers,
  },
];

const DELIVERABLES_DATA = [
  {
    title: "Comprehensive Industry Report",
    text: "A detailed report exploring market trends, economic impact, policy gaps, and recommendations for future sustainability.",
    icon: FaChartLine,
  },
  {
    title: "Sustainability Metrics Toolkit",
    text: "Scientifically validated metrics to guide artisans toward resource-efficient, eco-friendly production practices.",
    icon: FaLeaf,
  },
  {
    title: "Blockchain Traceability Platform",
    text: "A blockchain system for verifying and tracking the authenticity of crafts from production to market.",
    icon: FaFingerprint,
  },
  {
    title: "Dynamic Craft Pricing Model",
    text: "A valuation framework that integrates craftsmanship, material authenticity, sustainability, and market demand.",
    icon: FaIndustry,
  },
  {
    title: "Policy Reform Recommendations",
    text: "A set of proposals aimed at strengthening intellectual property rights, fair trade policies, and government support.",
    icon: FaGavel,
  },
  {
    title: "Global Brand Development Strategy",
    text: "A roadmap for positioning Kashmiri crafts in international luxury markets, emphasizing authenticity and heritage.",
    icon: FaGlobe,
  },
];

const SCOPE_DATA = [
  {
    title: "Geographical Impact",
    text: "Explore how regional factors affect production processes, market access, and geopolitical influences on export trends.",
    icon: FaGlobe,
  },
  {
    title: "Analysis of 16 Traditional Crafts",
    text: "Focus on understanding the uniqueness, market challenges, and opportunities of Pashmina, Carpets, Papier-mâché, and more.",
    icon: FaIndustry,
  },
  {
    title: "Policy & Economic Structures",
    text: "Evaluate current policies, economic models, and market regulations shaping the future of Kashmiri crafts.",
    icon: FaGavel,
  },
  {
    title: "Technological Solutions",
    text: "Explore innovations like blockchain and AI for supply chain transparency and market forecasting.",
    icon: FaSearch,
  },
  {
    title: "Environmental Impact",
    text: "Assess the environmental footprint of craft production, proposing sustainable, resource-efficient alternatives.",
    icon: FaLeaf,
  },
  {
    title: "Artisan Welfare & Equity",
    text: "Study artisan livelihoods, promoting better working conditions, fair wages, and leadership roles for women artisans.",
    icon: FaUsers,
  },
];

const IMPACT_DATA = [
  {
    title: "Economic Revitalization",
    text: "Drive economic growth by positioning Kashmiri crafts as globally competitive, luxury goods with sustainable practices.",
    icon: FaChartLine,
  },
  {
    title: "Sustainability Leadership",
    text: "Establish Kashmir’s crafts as leaders in eco-conscious production, promoting environmental responsibility.",
    icon: FaLeaf,
  },
  {
    title: "Counterfeit Protection",
    text: "Protect artisans’ work by preventing counterfeiting, using blockchain for verifiable, transparent product tracking.",
    icon: FaFingerprint,
  },
  {
    title: "Gender Equity & Empowerment",
    text: "Ensure equal opportunities, fair compensation, and leadership representation for women artisans.",
    icon: FaUsers,
  },
  {
    title: "Luxury Branding",
    text: "Transform Kashmiri crafts into high-end global brands, leveraging heritage and craftsmanship as key selling points.",
    icon: FaIndustry,
  },
  {
    title: "Policy Reform",
    text: "Influence government policy to better protect artisans, ensuring fair trade practices and sustainable growth.",
    icon: FaGavel,
  },
];

const PROJECTS_DATA = [
  {
    title: "Economic Modeling & Pricing",
    text: "Develop models to standardize craft pricing, reflecting authenticity, sustainability, and craftsmanship excellence.",
    icon: FaChartLine,
  },
  {
    title: "Blockchain Integration",
    text: "Build a blockchain platform to trace crafts’ production journey, ensuring authenticity and consumer trust.",
    icon: FaFingerprint,
  },
  {
    title: "Artisan Welfare & Empowerment",
    text: "Launch initiatives focused on improving working conditions, wages, and gender equity in the artisan community.",
    icon: FaUsers,
  },
  {
    title: "Sustainability Projects",
    text: "Promote sustainable practices in craft making, ensuring reduced environmental impact and resource efficiency.",
    icon: FaLeaf,
  },
  {
    title: "Policy Advocacy",
    text: "Advocate for reforms to strengthen protections for artisans and promote international market access.",
    icon: FaGavel,
  },
  {
    title: "Global Market Expansion",
    text: "Develop a strategic global marketing plan to position Kashmiri crafts as premium, luxury goods in international markets.",
    icon: FaGlobe,
  },
];

export default function IndustryResearchClient() {
  return (
    <div className="bg-white font-roboto selection:bg-brand-primary selection:text-white">
      {/* 1. HERO - Universal Editorial */}
      <UniversalEditorialHero
        pageKey="industry-research"
        fallbackConfig={industryResearchHeroFallback}
      />

      {/* STICKY NAV */}
      <StickySubNav items={NAV_ITEMS} />

      {/* 2. EMPOWERING ARTISANS */}
      <div id="overview" className="scroll-mt-32">
        <ScrollReveal>
          <FeatureSection
            category="Building Knowledge"
            title="Empowering Artisans through In-Depth Industry Research"
            description={
              <>
                <p className="mb-6">
                  The Kashmir handicraft industry is a testament to the region's
                  rich cultural heritage, spanning centuries of intricate
                  craftsmanship. With its vibrant history, each craft carries
                  the legacy of generations of artisans who have mastered the
                  art.
                </p>
                <p>
                  In today’s globalized economy, researching this unique
                  industry offers valuable insights into its evolving landscape,
                  challenges faced by artisans, and the need for modernization
                  without compromising authenticity.
                </p>
              </>
            }
            quote="This research initiative is aimed at fostering a sustainable future while preserving the deep-rooted traditions that define Kashmir's art and craft."
            imagePath="/assets/images/Kashmir22/1.png"
            imageAlt="Artisan Legacy"
            align="right"
          />
        </ScrollReveal>
      </div>

      {/* 3. RESEARCH OBJECTIVES */}
      <div id="objectives" className="scroll-mt-32">
        <ScrollReveal>
          <FeatureSection
            category="Primary Goals"
            title="Defining Paths to Sustainability & Growth"
            // description="KHCRF’s research seeks to preserve Kashmir’s crafts by advancing sustainable production practices, strengthening market access, and embedding equity as a core principle of sectoral development. The work examines historical and economic contributions of Kashmiri handicrafts while identifying structural gaps in sustainability, governance, and value realization across local and global markets. governance, and value realization across local and global markets. governance, and value realization across local and global markets. governance, and value realization across local and global markets. governance, and value realization across local and global markets. governance, and value realization across local and global markets. governance, and value realization across local and global markets. governance, and value realization across local and global markets. governance, and value realization across local and global markets. governance, and value realization across local and global markets. governance, and value realization across local and global markets."
            description={
              <>
                <p className="mb-0">
                  Hamadan Craft Revival Foundation (KHCRF) works to strengthen
                  the long-term sustainability and economic resilience of
                  Kashmir’s handicraft sector through focused policy research
                  and sector analysis. Our work moves beyond preservation as
                  sentiment and treats crafts as living economic systems that
                  must remain viable, fair, and competitive in contemporary
                  markets.
                </p>
                <p className="mb-0">
                  KHCRF examines how Kashmiri handicrafts are produced, valued,
                  governed, and traded across local, national, and global
                  contexts. We study historical contributions alongside
                  present-day realities to identify gaps in sustainable
                  production practices, market access, institutional support.
                </p>
                <p className="mb-0">
                  A core objective of this research is to inform policies that
                  improve livelihoods, ensure equity including gender equity,
                  and align traditional craft systems with evolving economic and
                  governance frameworks.
                </p>
              </>
            }
            imagePath="/assets/images/CRAFT_RESEARCH/1.png"
            imageAlt="Research Objectives"
            overlayImage="/assets/images/industry_small/1.png"
            align="left"
            isDark={true}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {[
                "Sustainable Practices",
                "Market Access",
                "Gender Equity",
                "Blockchain Integration",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-3 bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group"
                >
                  <FaCheckCircle data-ui-icon  className=" group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm tracking-wide text-white">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </FeatureSection>
        </ScrollReveal>

        {/* 4. INITIATIVES GRID */}
        <ScrollReveal>
          <InfoGrid
            title="Research Objectives"
            items={INITIATIVES_DATA}
            bgClass="bg-[#f8f9fa]"
          />
        </ScrollReveal>
      </div>

      {/* 5. DELIVERABLES */}
      <div id="deliverables" className="scroll-mt-32">
        <ScrollReveal>
          <FeatureSection
            category="Key Outcomes"
            title="Deliverables: Actionable Tools for Revival"
            // description="KHCRF’s research will deliver a comprehensive industry report, sustainability metrics, and a blockchain platform for authenticity. A dynamic pricing model and global branding strategy will position Kashmiri crafts as premium products."
            description={
              <>
                <p className="mb-6">
                  KHCRF’s research produces a comprehensive industry report
                  analyzing market structures, economic performance, and policy
                  gaps across Kashmir’s handicraft sector. This work is
                  supported by scientifically grounded sustainability metrics
                  that guide artisans, institutions, and policymakers toward
                  environmentally responsible, resource-efficient, and
                  economically viable production practices.
                </p>
                <p>
                  In parallel, the program develops a blockchain-enabled
                  traceability system to ensure authenticity from production to
                  market, alongside a transparent craft pricing framework that
                  reflects craftsmanship, material provenance, sustainability
                  performance, and market demand. These outputs translate into
                  actionable policy reform recommendations and a global brand
                  development strategy, strengthening artisan welfare and
                  positioning Kashmiri crafts as premium, ethically produced
                  offerings in international markets.
                </p>
              </>
            }
            imagePath="/assets/images/CRAFT_RESEARCH/2.png"
            imageAlt="Research Deliverables"
            overlayImage="/assets/images/industry_small/2.png"
            align="right"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {[
                "Industry Report",
                "Sustainability Metrics",
                "Authenticity & Traceability",
                "Policy & Market Strategy",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
                >
                  <FaCheckCircle data-ui-icon  className=" group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm tracking-wide text-black">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </FeatureSection>
        </ScrollReveal>

        {/* 6. DELIVERABLES DETAIL GRID */}
        <ScrollReveal>
          <InfoGrid
            title="Key Deliverables"
            items={DELIVERABLES_DATA}
            bgClass="bg-white"
          />
        </ScrollReveal>
      </div>

      {/* 7. SCOPE */}
      <div id="scope" className="scroll-mt-32">
        <ScrollReveal>
          <FeatureSection
            category="Project Scope"
            title="Comprehensive Study of Craft Dynamics"
            imagePath="/assets/images/CRAFT_RESEARCH/3.png"
            description={
              <>
                <p>
                  Our research covers sixteen core Kashmiri craft sectors,
                  examining their geographic spread, production systems, market
                  linkages, and economic performance. The study focuses on
                  market challenges, policy and institutional structures,
                  environmental sustainability, and social impact across the
                  craft value chain.
                </p>
                <p>
                  Special attention is given to technology-enabled transparency,
                  including blockchain-based traceability, alongside gender
                  equity and labor conditions, to assess how these factors
                  influence long-term sector viability. The scope is designed to
                  capture both structural constraints and growth opportunities,
                  ensuring Kashmir’s handicraft sector remains socially
                  resilient, economically competitive, and environmentally
                  responsible.
                </p>
              </>
            }
            imageAlt="Research Scope"
            overlayImage="/assets/images/industry_small/3.png"
            align="left"
            isDark={true} // Using Dark mode for contrast
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {[
                "Craft Geography & Markets",
                "Policy & Economic Structures",
                "Technology & Transparency",
                "Environmental & Social Impact",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-3 bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group"
                >
                  <FaCheckCircle data-ui-icon  className=" group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm tracking-wide text-white">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </FeatureSection>
        </ScrollReveal>

        {/* 8. SCOPE DETAIL GRID */}
        <ScrollReveal>
          <InfoGrid
            title="Research Scope Areas"
            items={SCOPE_DATA}
            bgClass="bg-[#f8f9fa]"
          />
        </ScrollReveal>
      </div>

      {/* 9. IMPACT */}
      <div id="impact" className="scroll-mt-32">
        <ScrollReveal>
          <FeatureSection
            category="Strategic Impact"
            title="Elevating Crafts to Global Luxury Markets"
            // description="KHCRF’s research will elevate Kashmir’s crafts through sustainable practices and blockchain-backed authenticity. This initiative will empower artisans, improve market opportunities, and position Kashmiri crafts in global luxury markets while preserving cultural heritage."
            description={
              <>
                <p>
                  KHCRF’s research strengthens the global positioning of Kashmiri
                  crafts by linking sustainability, authenticity, and market
                  credibility into a coherent policy framework. The work
                  connects environmental responsibility and verified provenance
                  to address gaps between craftsmanship and market expectations.
                </p>
                <p>
                  Through policy analysis, traceability systems, and value-based
                  pricing models, the research supports artisans by improving
                  visibility, expanding market access, and enhancing price
                  realization. It examines how governance structures and
                  supply-chain transparency shape buyer trust.
                </p>
                <p>
                  This approach positions Kashmiri crafts within global luxury
                  markets while safeguarding cultural integrity and reinforcing
                  ethical production standards. By aligning heritage value with
                  measurable quality, the research ensures cultural capital
                  translates into economic benefit for craft communities.
                </p>
              </>
            }
            imagePath="/assets/images/CRAFT_RESEARCH/4.png"
            imageAlt="Strategic Impact"
            overlayImage="/assets/images/industry_small/4.png"
            align="right"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {[
                "Global Luxury Positioning",
                "Authenticity & Counterfeit Protection",
                "ASustainability Leadership",
                "Gender Equity & Policy Impact",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
                >
                  <FaCheckCircle data-ui-icon  className=" group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm tracking-wide text-black">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </FeatureSection>
        </ScrollReveal>

        {/* 10. IMPACT DETAIL GRID (Key Projects) */}
        <ScrollReveal>
          <InfoGrid
            title="Key Impact Projects"
            items={IMPACT_DATA}
            bgClass="bg-white"
          />
        </ScrollReveal>
      </div>

      {/* 10. PROJECTS */}
      <div id="projects" className="scroll-mt-32">
        <ScrollReveal>
          <FeatureSection
            category="Key Initiatives"
            title="Pioneering Change through Innovation"
            // description="KHCRF’s projects include a blockchain platform for authenticity, a dynamic pricing model, and initiatives promoting artisan welfare and gender equity. Sustainability programs will focus on eco-friendly production, ensuring the Kashmiri craft industry thrives globally."
            description={
              <>
                <p>
                  KHCRF advances innovation across Kashmir’s craft sector by
                  combining economic reform, technology adoption, and
                  policy-driven experimentation. The focus is on solving
                  structural problems that limit artisan income and sector
                  growth.
                </p>
                <p>
                  Key initiatives center on developing fair, data-driven pricing
                  models, blockchain-based authenticity and traceability
                  systems, and scalable frameworks that connect artisans to
                  higher-value markets. These efforts strengthen trust, reduce
                  counterfeiting, and improve price realization without
                  compromising production methods.
                </p>
                <p>
                  By integrating technological tools with policy insight and
                  strategy, KHCRF enables sustainable expansion while
                  prioritizing artisan welfare and ethical production.
                  Innovation is treated not as disruption, but as a means to
                  modernize craft economies while preserving cultural
                  foundations.
                </p>
              </>
            }
            imagePath="/assets/images/CRAFT_RESEARCH/5.png"
            imageAlt="Key Projects"
            overlayImage="/assets/images/industry_small/5.png"
            align="left"
            isDark={true}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {[
                "Economic & Pricing Innovation",
                "Blockchain & Transparency",
                "Artisan Welfare & Sustainability",
                "Policy & Global Expansion",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-3 bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group"
                >
                  <FaCheckCircle data-ui-icon  className=" group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm tracking-wide text-white">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </FeatureSection>
        </ScrollReveal>

        {/* 11. PROJECTS GRID */}
        <ScrollReveal>
          <InfoGrid
            title="Key Projects"
            items={PROJECTS_DATA}
            bgClass="bg-[#f8f9fa]"
          />
        </ScrollReveal>
      </div>

      {/* 11. CTA Section (Matches legacy cta-three) */}
      <section className="py-20 bg-brand-primary text-white text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <FaUsers className="text-5xl mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              Stay Connected With Hamadan Craft Revival Foundation - Kashmir
            </h2>
            <p className="text-xl mb-10 opacity-90">
              Kashmir's Craft Policy Think-Tank
            </p>
            <Link
              href="/about/memberships"
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
