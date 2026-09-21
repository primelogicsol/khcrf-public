"use client";

import React from "react";
import Link from "next/link";
import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import { aboutAssessmentHeroFallback } from "@/config/heroFallbacks";
import {
  FaHammer,
  FaLandmark,
  FaGlobe,
  FaUserGraduate,
  FaBalanceScale,
  FaPlane,
  FaUserTie,
  FaCertificate,
  FaLightbulb,
  FaChartLine,
  FaBookOpen,
  FaUsers,
  FaHandshake,
  FaFileAlt,
  FaClipboardCheck,
  FaSearch,
  FaCheckCircle,
  FaArrowRight,
  FaBan,
  FaShieldAlt,
  FaStore,
  FaNewspaper,
  FaSeedling,
  FaUniversity,
} from "react-icons/fa";
import FeatureCard from "@/components/common/FeatureCard";

/* ─── Assessment Domain Cards ─── */
const assessmentDomains = [
  {
    icon: FaHammer,
    title: "Artisan Livelihoods",
    desc: "Income, working conditions, welfare, dignity, and economic security.",
  },
  {
    icon: FaLandmark,
    title: "Heritage Preservation",
    desc: "Traditional knowledge, endangered practices, cultural continuity, and craft identity.",
  },
  {
    icon: FaStore,
    title: "Production Systems",
    desc: "Raw materials, tools, workshops, supply chains, quality, and production capacity.",
  },
  {
    icon: FaGlobe,
    title: "Markets and Trade",
    desc: "Domestic demand, retail systems, distribution, pricing, and market access.",
  },
  {
    icon: FaPlane,
    title: "Exports",
    desc: "International trade, buyer markets, export barriers, standards, and competitiveness.",
  },
  {
    icon: FaNewspaper,
    title: "Tourism and Crafts",
    desc: "Visitor engagement, cultural tourism, retail experiences, and destination markets.",
  },
  {
    icon: FaSeedling,
    title: "Youth Participation",
    desc: "Skills transfer, apprenticeships, education, entrepreneurship, and future participation.",
  },
  {
    icon: FaUserTie,
    title: "Women in Crafts",
    desc: "Production roles, entrepreneurship, income, visibility, ownership, and leadership.",
  },
  {
    icon: FaCertificate,
    title: "GI and Authenticity",
    desc: "Geographical Indications, provenance, verification, counterfeiting, and consumer trust.",
  },
  {
    icon: FaLightbulb,
    title: "Innovation and Technology",
    desc: "Design development, digital tools, e-commerce, production innovation, and adaptation.",
  },
  {
    icon: FaBalanceScale,
    title: "Public Policy and Governance",
    desc: "Institutions, regulations, implementation, public programmes, and sector coordination.",
  },
];

/* ─── Coverage mechanisms ─── */
const coverageMechanisms = [
  { icon: FaUsers, label: "Stakeholder Consultation" },
  { icon: FaUniversity, label: "Institutional Engagement" },
  { icon: FaFileAlt, label: "Public Submissions" },
  { icon: FaSearch, label: "Field Evidence" },
  { icon: FaUserGraduate, label: "Expert Review" },
  { icon: FaChartLine, label: "Independent Analysis" },
];

/* ─── Exclusion items ─── */
const exclusionItems = [
  "A government audit",
  "A political campaign",
  "A certification programme",
  "A funding programme",
  "A commercial ranking exercise",
  "An advocacy platform for predetermined conclusions",
];

/* ─── Public engagement pathways ─── */
const engagementPathways = [
  {
    group: "Artisans and Producers",
    icon: FaHammer,
    desc: "Master artisans, weavers, embroiderers, woodcarvers, cooperatives, and producer groups.",
  },
  {
    group: "Trade and Markets",
    icon: FaGlobe,
    desc: "Exporters, retailers, online sellers, buyers, collectors, and financial institutions.",
  },
  {
    group: "Education and Research",
    icon: FaUserGraduate,
    desc: "Students, researchers, universities, academic institutions, and museums.",
  },
  {
    group: "Government and Policy",
    icon: FaLandmark,
    desc: "Government departments, elected representatives, regulatory agencies, and public programmes.",
  },
  {
    group: "Society and Community",
    icon: FaUsers,
    desc: "Citizens, youth, women entrepreneurs, civil society organisations, and heritage bodies.",
  },
  {
    group: "Tourism and Media",
    icon: FaPlane,
    desc: "Tourism stakeholders, media professionals, cultural organisations, and destination managers.",
  },
  {
    group: "Global Community",
    icon: FaHandshake,
    desc: "Diaspora members, international buyers, development agencies, and cultural institutions.",
  },
];

/* ─── Assessment model steps ─── */
const assessmentSteps = [
  { num: 1, title: "Public Participation", icon: FaUsers },
  { num: 2, title: "Evidence Collection", icon: FaFileAlt },
  { num: 3, title: "Stakeholder Consultation", icon: FaHandshake },
  { num: 4, title: "Expert Review", icon: FaUserGraduate },
  { num: 5, title: "Validation", icon: FaClipboardCheck },
  { num: 6, title: "Annual Assessment Report", icon: FaBookOpen },
];

/* ─── KHCRF responsibilities ─── */
const hcrfResponsibilities = [
  { icon: FaShieldAlt, label: "Governance Framework" },
  { icon: FaClipboardCheck, label: "Assessment Methodology" },
  { icon: FaChartLine, label: "Technical Coordination" },
  { icon: FaHandshake, label: "Stakeholder Engagement" },
  { icon: FaBalanceScale, label: "Public Accountability" },
];

export default function AboutAssessmentClient() {
  return (
    <main className="w-full">
      {/* ════════════════════════════════════════════════════
          1. HERO — Concise, authoritative, immediate clarity
         ════════════════════════════════════════════════════ */}
      <UniversalEditorialHero pageKey="about-assessment" fallbackConfig={aboutAssessmentHeroFallback} />

      {/* ════════════════════════════════════════════════════
          2. INSTITUTIONAL INTRODUCTION — Two-column layout
         ════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: narrative */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-6">
                A Permanent Institutional Assessment
              </h2>
              <div className="text-gray-600 leading-relaxed space-y-4 font-medium text-lg">
                <p>
                  State of Kashmir Crafts is an annual public-interest assessment
                  convened by the{" "}
                  <strong className="text-brand-dark">
                    Hamadan Craft Revival Foundation (KHCRF)
                  </strong>{" "}
                  to document, understand, and evaluate the changing realities of
                  Kashmir&apos;s handicraft ecosystem.
                </p>
                <p>
                  By combining stakeholder consultation, public participation,
                  evidence-based research, and expert review, the assessment
                  creates a trusted institutional record that supports informed
                  dialogue, responsible policy development, and long-term sector
                  planning.
                </p>
                <p>
                  Unlike one-time surveys or project reports, the assessment is
                  designed as a recurring institutional process that establishes a
                  consistent evidence base for measuring change over time. Each
                  annual edition builds upon the previous assessment, enabling
                  meaningful comparisons, strengthening public accountability, and
                  providing policymakers, researchers, institutions, and
                  stakeholders with reliable insights into the evolving condition
                  of Kashmir&apos;s handicraft ecosystem.
                </p>
              </div>
              <div className="w-20 h-1 bg-brand-secondary rounded mt-6" />
            </div>

            {/* Right: summary card */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                    <FaBookOpen data-ui-icon  className="text-xl " />
                  </div>
                  <h3 className="text-lg font-black text-brand-dark">
                    Permanent Annual Assessment
                  </h3>
                </div>
                <div className="space-y-4">
                  {[
                    { icon: FaUsers, label: "Public Participation" },
                    { icon: FaSearch, label: "Verified Evidence" },
                    { icon: FaUserGraduate, label: "Expert Review" },
                    { icon: FaChartLine, label: "Annual Reporting" },
                  ].map((attr) => (
                    <div
                      key={attr.label}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <attr.icon className="text-brand-primary shrink-0" />
                      <span className="font-bold text-gray-800 text-sm">
                        {attr.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          3. WHY IT WAS CREATED — Three-card structure
         ════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: narrative */}
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-black text-brand-dark mb-6">
                Why It Was Created
              </h2>
              <div className="text-gray-600 leading-relaxed space-y-4 font-medium">
                <p>
                  Kashmir&apos;s handicrafts represent centuries of cultural
                  heritage, skilled craftsmanship, livelihoods, and economic
                  opportunity. Yet the sector continues to evolve under changing
                  social, economic, environmental, technological, and market
                  conditions.
                </p>
                <p>
                  The initiative was established to create a structured annual
                  assessment that captures these changes through evidence, public
                  participation, and independent analysis, helping build a
                  stronger understanding of the sector over time.
                </p>
              </div>
              <div className="w-20 h-1 bg-brand-secondary rounded mt-6" />
            </div>

            {/* Right: purpose cards */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard
                icon={FaFileAlt}
                title="Document Reality"
                description="Create a permanent institutional record of artisan voices, market evidence, institutional data, and public perspectives across the entire ecosystem."
              />
              <FeatureCard
                icon={FaChartLine}
                title="Track Change"
                description="Establish annual baselines that enable meaningful year-on-year comparison of livelihoods, heritage, markets, policy impact, and sector evolution."
              />
              <FeatureCard
                icon={FaBalanceScale}
                title="Inform Decisions"
                description="Support evidence-based policy dialogue, responsible governance, institutional collaboration, and long-term planning for Kashmir's craft sector."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          4. WHY 2026 MATTERS — Left text + right highlight
         ════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-10 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black text-brand-dark mb-6">
                Why 2026-27 Matters
              </h2>
              <div className="text-gray-600 leading-relaxed space-y-4 font-medium text-lg">
                <p>
                  The{" "}
                  <strong className="text-brand-dark">2026–2027 Assessment</strong>{" "}
                  establishes the first comprehensive baseline for future annual
                  assessments.
                </p>
                <p>
                  It creates the initial public record against which future
                  editions can measure progress, identify emerging challenges,
                  evaluate policy outcomes, and monitor long-term trends across
                  Kashmir&apos;s handicraft ecosystem.
                </p>
              </div>
            </div>
            <div className="bg-brand-primary text-white p-8 md:p-10 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <FaChartLine className="text-9xl" />
              </div>
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-brand-secondary uppercase border border-brand-secondary/30 rounded-lg">
                  Baseline Year
                </span>
                <h3 className="text-2xl font-black mb-4">
                  2026-27 Baseline Assessment
                </h3>
                <p className="font-medium text-white/90 leading-relaxed">
                  The first structured public record for tracking long-term
                  trends, policy impact, institutional change, and market shifts
                  across Kashmir&apos;s handicraft sector.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          5. ASSESSMENT DOMAINS — Full card grid
         ════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-4">
              Assessment Domains
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              The annual assessment examines the interconnected cultural,
              economic, institutional, social, and market dimensions of
              Kashmir&apos;s handicraft ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {assessmentDomains.map((domain) => (
              <FeatureCard
                key={domain.title}
                icon={domain.icon}
                title={domain.title}
                description={domain.desc}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          6. WHAT IT COVERS / WHAT IT IS NOT — Balanced columns
         ════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-10 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* LEFT: Covers */}
            <div>
              <h2 className="text-3xl font-black text-brand-dark mb-4 flex items-center gap-3">
                <FaCheckCircle data-ui-icon  className=" shrink-0" />
                What the Initiative Covers
              </h2>
              <div className="text-gray-600 leading-relaxed space-y-4 font-medium mb-8">
                <p>
                  The assessment gathers evidence from across Kashmir&apos;s
                  handicraft ecosystem through stakeholder consultation,
                  institutional engagement, field evidence, public submissions,
                  expert review, and independent analysis.
                </p>
                <p>
                  Its objective is to develop a balanced understanding of
                  opportunities, challenges, emerging trends, and future
                  priorities affecting the sector.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {coverageMechanisms.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-brand-primary hover:shadow-md transition duration-300"
                  >
                    <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <item.icon className="text-brand-primary" />
                    </div>
                    <span className="font-bold text-gray-800 text-sm">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Not */}
            <div>
              <h2 className="text-3xl font-black text-gray-800 mb-4 flex items-center gap-3">
                <FaBan className="text-gray-400 shrink-0" />
                What the Initiative Is Not
              </h2>
              <p className="text-gray-600 leading-relaxed font-medium mb-8">
                State of Kashmir Crafts is <strong>not</strong>:
              </p>

              <div className="space-y-3 mb-8">
                {exclusionItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
                  >
                    <FaBan className="text-gray-400 shrink-0 text-sm" />
                    <span className="font-bold text-gray-600 text-sm">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-brand-dark text-white rounded-2xl shadow-lg">
                <p className="font-medium leading-relaxed">
                  It is an{" "}
                  <span className="text-brand-secondary font-bold">
                    independent, non-partisan, public-interest assessment
                  </span>{" "}
                  committed to listening, documenting, analysing, validating, and
                  publishing evidence through a transparent and participatory
                  process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          7. ANNUAL ASSESSMENT MODEL — Process pipeline
         ════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-4">
              Annual Assessment Model
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Each assessment follows a structured methodology that combines:
            </p>
          </div>

          {/* Desktop: horizontal pipeline */}
          <div className="hidden md:block max-w-6xl mx-auto mb-12">
            <div className="relative">
              {/* Connector line */}
              <div className="absolute top-10 left-[8%] right-[8%] h-0.5 bg-gray-200 z-0" />

              <div className="grid grid-cols-6 gap-4 relative z-10">
                {assessmentSteps.map((step) => (
                  <div
                    key={step.num}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="w-20 h-20 bg-brand-primary text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg relative">
                      <step.icon className="text-2xl" />
                      <span className="absolute -top-2 -right-2 w-7 h-7 bg-brand-secondary text-white text-xs font-black rounded-full flex items-center justify-center shadow">
                        {step.num}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm leading-tight">
                      {step.title}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile: vertical timeline */}
          <div className="md:hidden max-w-sm mx-auto mb-12">
            <div className="relative pl-12">
              {/* Vertical line */}
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

              <div className="space-y-8">
                {assessmentSteps.map((step) => (
                  <div key={step.num} className="relative">
                    <div className="absolute -left-12 w-10 h-10 bg-brand-primary text-white rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-sm font-black">{step.num}</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-3">
                        <step.icon className="text-brand-primary shrink-0" />
                        <h3 className="font-bold text-gray-900 text-sm">
                          {step.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-gray-500 text-center max-w-3xl mx-auto font-medium">
            This consistent process enables meaningful year-on-year comparison
            while strengthening institutional learning and evidence-based
            decision-making.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          8. HOW THE PUBLIC CAN ENGAGE — Structured pathways
         ════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-4">
              How the Public Can Engage
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Everyone connected to Kashmir&apos;s handicraft ecosystem is
              encouraged to participate. Artisans, entrepreneurs, exporters,
              cooperatives, researchers, students, buyers, collectors, financial
              institutions, museums, tourism stakeholders, government agencies,
              civil society organisations, members of the diaspora, and citizens
              can contribute their knowledge, experiences, and evidence through
              the public consultation process.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {engagementPathways.map((pathway) => (
              <div
                key={pathway.group}
                className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:-translate-y-1 hover:shadow-xl hover:border-brand-primary transition duration-300"
              >
                <div className="w-14 h-14 bg-brand-primary/10 rounded-xl flex items-center justify-center mb-5">
                  <pathway.icon className="text-2xl text-brand-primary" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3">
                  {pathway.group}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {pathway.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/state-of-kashmir-crafts/participate"
              className="px-8 py-4 bg-brand-primary text-white rounded-[14px] font-bold hover:bg-brand-secondary transition shadow-xl inline-flex items-center gap-2"
            >
              Participate Online
              <FaArrowRight className="text-sm" />
            </Link>
            <Link
              href="/state-of-kashmir-crafts/stakeholder-registry"
              className="px-8 py-4 bg-white text-brand-dark rounded-[14px] font-bold hover:bg-gray-100 transition shadow-xl border border-gray-200 inline-flex items-center gap-2"
            >
              Register as Stakeholder
              <FaArrowRight className="text-sm" />
            </Link>
            <Link
              href="/state-of-kashmir-crafts/evidence-repository"
              className="px-8 py-4 bg-transparent border-2 border-gray-300 text-brand-dark rounded-[14px] font-bold hover:bg-gray-100 transition inline-flex items-center gap-2"
            >
              Submit Evidence
              <FaArrowRight className="text-sm" />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          9. RELATIONSHIP WITH KHCRF — Full-width institutional
         ════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: narrative */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-6">
                Relationship With KHCRF
              </h2>
              <div className="text-gray-600 leading-relaxed space-y-4 font-medium text-lg">
                <p>
                  The{" "}
                  <strong className="text-brand-dark">
                    Hamadan Craft Revival Foundation (KHCRF)
                  </strong>{" "}
                  independently convenes State of Kashmir Crafts as part of its
                  mission to strengthen Kashmir&apos;s handicraft ecosystem
                  through research, documentation, evidence-based policy
                  dialogue, institutional collaboration, artisan development, and
                  heritage preservation.
                </p>
                <p>
                  As the institutional convener, KHCRF establishes the governance
                  framework, assessment methodology, technical coordination, and
                  stakeholder engagement processes that ensure every annual
                  assessment is conducted with independence, transparency,
                  methodological rigour, and public accountability.
                </p>
                <p>
                  KHCRF does not predetermine the assessment&apos;s findings or
                  advocate predetermined outcomes. Its role is to provide an
                  independent institutional platform that enables diverse
                  stakeholders to contribute evidence, perspectives, and
                  expertise through a transparent and structured assessment
                  process. The findings are developed through documented
                  evidence, public consultation, validation, and expert review
                  rather than institutional opinion.
                </p>
                <p>
                  By maintaining a recurring annual assessment, KHCRF seeks to
                  strengthen institutional memory, encourage informed public
                  dialogue, support evidence-based decision-making, and
                  contribute to the long-term sustainability, resilience, and
                  global competitiveness of Kashmir&apos;s handicraft ecosystem.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <span className="inline-block px-4 py-2 bg-brand-primary/5 text-brand-dark text-sm font-bold rounded-[12px] border border-brand-primary/10">
                  Independent Convener & Institutional Steward
                </span>
                <span className="inline-block px-4 py-2 bg-brand-primary/5 text-brand-dark text-sm font-bold rounded-[12px] border border-brand-primary/10">
                  Non-Governmental Public-Interest Organization
                </span>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-brand-primary font-bold text-sm hover:underline"
                >
                  Learn About KHCRF
                  <FaArrowRight className="text-xs" />
                </Link>
              </div>
            </div>

            {/* Right: responsibility panel */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 h-full">
                <h3 className="text-lg font-black text-brand-dark mb-6 border-b border-gray-200 pb-4">
                  Institutional Responsibilities
                </h3>
                <div className="space-y-4">
                  {hcrfResponsibilities.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100"
                    >
                      <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <item.icon className="text-brand-primary" />
                      </div>
                      <span className="font-bold text-gray-800 text-sm">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          10. FINAL CALL TO ACTION — Dark institutional close
         ════════════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden universal-hero">
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight text-white leading-tight">
              Help Build the Public Record of Kashmir Crafts
            </h2>
            <p className="text-lg md:text-xl font-medium mb-6 text-gray-300 leading-relaxed">
              The future of Kashmir&apos;s handicrafts should be shaped by those
              who create them, preserve them, study them, support them, invest in
              them, trade them, and depend upon them.
            </p>
            <p className="text-base text-gray-400 mb-10 leading-relaxed max-w-3xl mx-auto">
              By participating in the{" "}
              <strong className="text-white">
                State of Kashmir Crafts – Current Assessment 2026–2027
              </strong>
              , you contribute to a permanent public record that will help
              strengthen knowledge, improve policy, preserve heritage, support
              livelihoods, and guide the future development of Kashmir&apos;s
              handicraft ecosystem.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
              <Link
                href="/state-of-kashmir-crafts/participate"
                className="px-8 py-4 bg-brand-primary text-white font-bold rounded-[14px] hover:bg-brand-secondary transition-all shadow-xl"
              >
                Participate in the 2026–2027 Assessment
              </Link>
              <Link
                href="/state-of-kashmir-crafts/stakeholder-registry"
                className="px-8 py-4 bg-white text-brand-dark font-bold rounded-[14px] hover:bg-gray-100 transition-all shadow-xl"
              >
                Register as a Stakeholder
              </Link>
              <Link
                href="/state-of-kashmir-crafts/governance-framework"
                className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-[14px] hover:bg-white/10 transition-all"
              >
                View Governance Framework
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
