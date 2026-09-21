"use client";

import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import { policyHeroFallback } from "@/config/heroFallbacks";
import FeatureSection from "@/components/FeatureSection";
import StickySubNav from "../../../../components/StickySubNav";
import ScrollReveal from "../../../../components/ScrollReveal";

import Link from "next/link";
import {
  FaEye,
  FaHandshake,
  FaAward,
  FaGraduationCap,
  FaLeaf,
  FaGlobe,
  FaVenus,
  FaShieldAlt,
  FaCheckCircle,
  FaUsers,
} from "react-icons/fa";

const NAV_ITEMS = [
  { id: "intro", label: "Overview", icon: FaEye },
  { id: "artisan-welfare", label: "Welfare", icon: FaHandshake },
  { id: "gi-certification", label: "GI Tag", icon: FaAward },
  { id: "capacity-building", label: "Skills", icon: FaGraduationCap },
  { id: "sustainability", label: "Sustainability", icon: FaLeaf },
  { id: "export-promotion", label: "Exports", icon: FaGlobe },
  { id: "gender-equity", label: "Gender Equity", icon: FaVenus },
  { id: "ip-protection", label: "IP Rights", icon: FaShieldAlt },
  { id: "quality-control", label: "Quality", icon: FaCheckCircle },
];

export default function PolicyClient() {
  return (
    <div className="bg-white font-roboto selection:bg-brand-primary selection:text-white pb-20">
      {/* 1. HERO - Universal Editorial */}
      <UniversalEditorialHero
        pageKey="research-policy"
        fallbackConfig={policyHeroFallback}
      />

      {/* STICKY NAV */}
      <StickySubNav items={NAV_ITEMS} />

      {/* 2. INTRO */}
      <div id="intro" className="scroll-mt-32">
        <ScrollReveal>
          <FeatureSection
            category="Strategic Vision"
            title="Navigating the Policy Landscape"
            description={
              <>
                <p className="mb-6 font-light">
                  KHCRF Policy Insights provides targeted and in-depth analysis
                  on the policy landscape shaping the Kashmiri handicraft
                  sector. Our policy briefs and white papers offer stakeholders
                  the tools to navigate and respond to the shifting dynamics of
                  industry policies on a local, national, and global scale.
                </p>
                <p className="font-light">
                  We dissect the intricate web of policies that affect market
                  access, trade competitiveness, and sustainability. Our
                  insights empower decision-makers to craft informed, strategic
                  responses to emerging challenges, ensuring the sector's growth
                  and resilience.
                </p>
              </>
            }
            quote="With a focus on geopolitical impacts, trade agreements, and market access barriers, our insights support decision-makers in developing forward-thinking strategies."
            imagePath="/assets/images/Kashmir22/2.png"
            imageAlt="Policy Landscape"
            align="right"
          />
        </ScrollReveal>
      </div>

      {/* 3. ARTISAN WELFARE */}
      <div id="artisan-welfare" className="scroll-mt-32">
        <ScrollReveal>
          <FeatureSection
            category="Artisan Welfare"
            title="Artisan Welfare and Empowerment"
            description={
              <>
                <strong className="text-white text-xl block mb-2 font-medium">
                  Insight
                </strong>
                <p className="mb-4 text-gray-300">
                  KHCRF’s analysis examines how artisan welfare is shaped by
                  access to finance, income stability, and bargaining power
                  within Kashmir’s craft sector. The research assesses how
                  formal credit access influences production continuity, cost
                  management, and reduced reliance on informal intermediaries
                  and exploitative lending practices.
                </p>

                <strong className="text-white text-xl block mb-2 font-medium">
                  Impact
                </strong>
                <p className="text-gray-300">
                  Stronger financial inclusion enables artisans to concentrate
                  on craftsmanship while gaining security, predictability, and
                  social protection, lowering economic stress and uncertainty.
                  Improved stability supports sustained livelihoods, long-term
                  production planning, and more confident participation in
                  organized markets.
                </p>

                <p className="text-gray-300">
                  The research also integrates technology-enabled systems to
                  ensure authenticity, transparency, and traceability from
                  artisan to market, protecting intellectual and cultural
                  ownership. In parallel, it informs policy and governance
                  frameworks that embed artisan welfare within sectoral
                  development strategies.
                </p>
              </>
            }
            imagePath="/assets/images/CRAFT_RESEARCH/7.png"
            imageAlt="Artisan Welfare"
            align="left"
            isDark={true}
          />
        </ScrollReveal>
      </div>

      {/* 4. GI CERTIFICATION */}
      <div id="gi-certification" className="scroll-mt-32">
        <ScrollReveal>
          <FeatureSection
            category="Authenticity"
            title="Geographical Indication (GI) Certification"
            description={
              <>
                <strong className="text-brand-primary text-xl block mb-2 font-medium">
                  Insight
                </strong>
                <p className="mb-4 text-black">
                  GI certification anchors Kashmiri crafts such as Pashmina to
                  their place of origin, establishing legal recognition, quality
                  assurance, and protection against imitation and misuse in
                  domestic and international markets.
                </p>

                <strong className="text-brand-primary text-xl block mb-2 font-medium">
                  Impact
                </strong>
                <p className="text-black">
                  Effective GI enforcement strengthens price integrity and
                  consumer trust, improving artisan income and expanding access
                  to legitimate markets by clearly distinguishing authentic
                  crafts from mass-produced counterfeits.
                </p>

                <p className="text-black">
                  KHCRF’s policy analysis supports stronger GI governance,
                  enforcement mechanisms, and integration with traceability
                  systems to ensure long-term protection of cultural identity
                  and economic value.
                </p>
              </>
            }
            imagePath="/assets/images/CRAFT_RESEARCH/8.png"
            imageAlt="GI Certification"
            align="right"
          />
        </ScrollReveal>
      </div>

      {/* 5. CAPACITY BUILDING */}
      <div id="capacity-building" className="scroll-mt-32">
        <ScrollReveal>
          <FeatureSection
            category="Skills Development"
            title="Capacity Building and Skill Development"
            description={
              <>
                <strong className="text-white text-xl block mb-2 font-medium">
                  Insight
                </strong>
                <p className="mb-4 text-gray-300">
                  Capacity-building initiatives strengthen artisan skills by
                  integrating traditional knowledge with modern design,
                  production techniques, and market-oriented training across
                  Kashmir’s craft sectors. The focus extends beyond skill
                  transfer to include quality standards, productivity
                  improvement, material handling, design adaptation, and
                  awareness of changing consumer expectations globally.
                </p>

                <strong className="text-white text-xl block mb-2 font-medium">
                  Impact
                </strong>
                <p className="text-gray-300">
                  Improved skills and adaptive learning enable artisans to
                  remain competitive globally while preserving craft identity
                  and cultural continuity. Enhanced technical capacity supports
                  innovation, consistent quality, and efficient production,
                  improving income stability and market access. Over time,
                  stronger skills ecosystems reduce vulnerability, encourage
                  long-term planning, support youth participation, and help
                  craft communities align tradition with evolving economic and
                  commercial realities responsibly sustainably inclusively
                  regionally long-term.
                </p>
              </>
            }
            imagePath="/assets/images/CRAFT_RESEARCH/9.png"
            imageAlt="Capacity Building"
            align="left"
            isDark={true}
          />
        </ScrollReveal>
      </div>

      {/* 6. SUSTAINABLE PRACTICES */}
      <div id="sustainability" className="scroll-mt-32">
        <ScrollReveal>
          <FeatureSection
            category="Sustainability"
            title="Sustainable Craft Practices"
            description={
              <>
                <strong className="text-brand-primary text-xl block mb-2 font-medium">
                  Insight
                </strong>
                <p className="mb-4 text-black">
                  KHCRF’s research analyzes sustainable craft practices by
                  assessing responsible material sourcing, resource efficiency,
                  waste reduction, and environmentally sound production methods
                  across Kashmir’s handicraft sector. The study links ecological
                  stewardship with economic resilience, examining how
                  sustainability standards influence production costs, artisan
                  livelihoods, resource availability, and compliance with
                  evolving international environmental expectations.
                </p>

                <strong className="text-brand-primary text-xl block mb-2 font-medium">
                  Impact
                </strong>
                <p className="text-black">
                  Embedding sustainability within craft policy strengthens
                  market credibility, supports climate-aligned production, and
                  reduces environmental risk across the value chain. Clear
                  sustainability practices attract eco-conscious buyers, improve
                  export readiness, and enhance price realization. Over time,
                  responsible production safeguards natural resources, lowers
                  long-term costs, builds institutional trust, and positions
                  Kashmiri crafts competitively within global markets
                  increasingly shaped by environmental regulation, ethical
                  sourcing requirements, and sustainability-driven consumer
                  demand, and long-term sector resilience outcomes.
                </p>
              </>
            }
            imagePath="/assets/images/CRAFT_RESEARCH/10.png"
            imageAlt="Sustainable Practices"
            align="right"
          />
        </ScrollReveal>
      </div>

      {/* 7. EXPORT PROMOTION */}
      <div id="export-promotion" className="scroll-mt-32">
        <ScrollReveal>
          <FeatureSection
            category="Global Access"
            title="Export Promotion and Market Expansion"
            description={
              <>
                <strong className="text-white text-xl block mb-2 font-medium">
                  Insight
                </strong>
                <p className="mb-4 text-gray-300">
                  KHCRF’s research analyzes export promotion and market expansion
                  by examining trade facilitation mechanisms, compliance
                  requirements, logistics frameworks, and institutional support
                  systems shaping international access for Kashmiri handicrafts.
                  The study assesses how export policies, certification, and
                  market intelligence influence artisan readiness, pricing,
                  scalability, and sustained participation in global trade
                  channels.
                </p>

                <strong className="text-white text-xl block mb-2 font-medium">
                  Impact
                </strong>
                <p className="text-gray-300">
                  Effective export promotion improves global visibility, expands
                  market access, and strengthens income potential for artisans
                  and enterprises. Clear trade pathways reduce entry barriers,
                  improve regulatory compliance, and enhance buyer confidence.
                  Over time, stronger export integration supports
                  diversification of markets, stabilizes demand cycles, improves
                  foreign exchange earnings, and positions Kashmiri crafts
                  competitively within international value chains shaped by
                  quality, authenticity, traceability, and evolving global
                  consumption patterns.
                </p>
              </>
            }
            imagePath="/assets/images/CRAFT_RESEARCH/11.png"
            imageAlt="Export Promotion"
            align="left"
            isDark={true}
          />
        </ScrollReveal>
      </div>

      {/* 8. GENDER INCLUSIVE */}
      <div id="gender-equity" className="scroll-mt-32">
        <ScrollReveal>
          <FeatureSection
            category="Gender Equity"
            title="Gender-Inclusive Craft Policies"
            description={
              <>
                <strong className="text-brand-primary text-xl block mb-2 font-medium">
                  Insight
                </strong>
                <p className="mb-4 text-black">
                  KHCRF’s research examines gender-inclusive craft policies by
                  analyzing access to skills training, finance, ownership
                  rights, and decision-making roles for women artisans within
                  Kashmir’s handicraft sector. The study assesses how
                  institutional support, social norms, and policy design
                  influence participation, income equity, leadership
                  opportunities, and long-term economic empowerment of women
                  across craft value chains.
                </p>

                <strong className="text-brand-primary text-xl block mb-2 font-medium">
                  Impact
                </strong>
                <p className="text-black">
                  Gender-inclusive policies strengthen economic participation,
                  improve income equity, and expand leadership opportunities for
                  women artisans. Greater access to skills, finance, and markets
                  enhances household stability and community resilience. Over
                  time, inclusive frameworks support workforce retention,
                  intergenerational skill transfer, and more balanced sector
                  governance, ensuring craft development reflects social equity,
                  shared prosperity, and sustainable growth across regional and
                  global markets.
                </p>
              </>
            }
            imagePath="/assets/images/CRAFT_RESEARCH/12.png"
            imageAlt="Gender Inclusive Policies"
            align="right"
          />
        </ScrollReveal>
      </div>

      {/* 9. INTELLECTUAL PROPERTY */}
      <div id="ip-protection" className="scroll-mt-32">
        <ScrollReveal>
          <FeatureSection
            category="Protection"
            title="Intellectual Property Protection"
            description={
              <>
                <strong className="text-white text-xl block mb-2 font-medium">
                  Insight
                </strong>
                <p className="mb-4 text-gray-300">
                  KHCRF’s research examines intellectual property protection
                  within Kashmir’s craft sector by analyzing legal frameworks,
                  customary rights, and enforcement mechanisms governing
                  traditional designs, techniques, and knowledge systems. The
                  study evaluates how ownership recognition, documentation, and
                  institutional safeguards influence artisan control, misuse
                  prevention, commercialization rights, and long-term protection
                  of cultural assets.
                </p>

                <strong className="text-white text-xl block mb-2 font-medium">
                  Impact
                </strong>
                <p className="text-gray-300">
                  Strong intellectual property protection preserves cultural
                  integrity, prevents unauthorized replication, and ensures
                  artisans retain control over their creative work. Clear
                  ownership rights improve bargaining power, enable fair
                  licensing, and support sustainable income generation. Over
                  time, effective IP governance builds trust across markets,
                  encourages ethical sourcing, reduces exploitation, and
                  positions Kashmiri crafts within global systems that respect
                  originality, heritage value, and lawful economic
                  participation.
                </p>
              </>
            }
            imagePath="/assets/images/CRAFT_RESEARCH/13.png"
            imageAlt="Intellectual Property"
            align="left"
            isDark={true}
          />
        </ScrollReveal>
      </div>

      {/* 10. QUALITY CONTROL */}
      <div id="quality-control" className="scroll-mt-32">
        <ScrollReveal>
          <FeatureSection
            category="Quality Standards"
            title="Quality Control and Certification"
            description={
              <>
                <strong className="text-brand-primary text-xl block mb-2 font-medium">
                  Insight
                </strong>
                <p className="mb-4 text-black">
                  KHCRF’s research evaluates quality control and certification
                  systems by examining standards, testing protocols, compliance
                  mechanisms, and verification processes used across Kashmir’s
                  craft sector. The study analyzes how consistent quality
                  benchmarks, documentation, and independent certification help
                  distinguish authentic products, reduce counterfeiting, and
                  support credibility in domestic and international markets.
                </p>

                <strong className="text-brand-primary text-xl block mb-2 font-medium">
                  Impact
                </strong>
                <p className="text-black">
                  Robust quality control strengthens consumer trust, supports
                  premium pricing, and improves market positioning for genuine
                  Kashmiri crafts. Clear certification standards reduce
                  disputes, enhance buyer confidence, and facilitate export
                  compliance. Over time, consistent quality systems protect
                  brand reputation, stabilize demand, encourage skill
                  discipline, and position artisans to compete effectively
                  within global markets governed by transparency, reliability,
                  and verified product integrity.
                </p>
              </>
            }
            imagePath="/assets/images/CRAFT_RESEARCH/14.png"
            imageAlt="Quality Control"
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
