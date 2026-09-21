"use client";


import ScrollReveal from "@/components/ScrollReveal";
import Image from "next/image";
import ProjectAccordion from "@/components/common/ProjectAccordion";
import { useState } from "react";
import {
  FaLayerGroup,
  FaChartLine,
  FaCogs,
  FaProjectDiagram,
  FaChevronDown,
} from "react-icons/fa";
import MembershipCTA from "@/components/membership/MembershipCTA";
import CommonCta from "@/components/common/CommonCta";
import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import { aboutHcrfProjectHeroFallback } from "@/config/heroFallbacks";


const KHCRF_PROGRAMS = [
  {
    "id": "prog1",
    "title": "01 Industry & Governance",
    "purpose": "Researching the structures, policies and regulatory systems shaping Kashmir's craft economy.",
    "details": {
      "activities": ["Handicrafts Industry Research", "Kashmir Craft Policy Insights", "Handicrafts Governance", "Kashmir Craft Regulations"],
      "outputs": ["Industry research reports", "Policy briefs", "Governance assessments", "Regulatory analysis", "Institutional recommendations"],
      "stakeholders": ["Government departments", "Artisan organizations", "Researchers & academics", "Industry bodies", "Policy institutions"]
    }
  },
  {
    "id": "prog2",
    "title": "02 Advocacy & Action",
    "purpose": "Advancing artisan interests, craft protection and evidence-based policy engagement.",
    "details": {
      "activities": ["Artisan Advocacy", "Craft Protection Campaigns", "Kashmir Legislative Lobbying", "Legislative Office Updates"],
      "outputs": ["Advocacy briefs", "Campaign initiatives", "Legislative submissions", "Policy representations", "Public-interest interventions"],
      "stakeholders": ["Artisans", "Craft communities", "Civil society organizations", "Policymakers", "Legislative institutions"]
    }
  },
  {
    "id": "prog3",
    "title": "03 Discover",
    "purpose": "Exploring the depth and breadth of Kashmir's artisan network and craft heritage.",
    "details": {
      "activities": ["Artisan Discovery", "Craft Ecosystem Mapping", "Regional Craft Profiling", "Heritage Documentation"],
      "outputs": ["Interactive directories", "Discovery portals", "Craft maps", "Heritage archives"],
      "stakeholders": ["General public", "Researchers", "Buyers", "Cultural tourists"]
    }
  },
  {
    "id": "prog4",
    "title": "04 People",
    "purpose": "Documenting, recognizing and connecting the people and communities who sustain Kashmir's craft traditions.",
    "details": {
      "activities": ["Kashmir Artisan Registry", "Master Artisans", "Living Legends", "Women Artisans", "Emerging Artisans", "Workshop Communities"],
      "outputs": ["Artisan records", "Master artisan profiles", "Community documentation", "Recognition records", "Workshop-community mapping"],
      "stakeholders": ["Artisans", "Master craftspeople", "Women artisans", "Emerging artisans", "Workshop communities"]
    }
  },
  {
    "id": "prog5",
    "title": "05 Studio",
    "purpose": "Capturing the living processes, environments, and narratives of craft creation through multimedia.",
    "details": {
      "activities": ["Audio Stories", "Craft Demonstrations", "Documentary Films", "Oral Histories", "Video Interviews", "Workshop Diaries"],
      "outputs": ["Multimedia documentaries", "Oral history archives", "Video demonstrations", "Studio diaries"],
      "stakeholders": ["Documentarians", "Artisans", "Media organizations", "Cultural preservers"]
    }
  },
  {
    "id": "prog6",
    "title": "06 Collections",
    "purpose": "Curating and safeguarding rare objects, signature masterpieces, and historical craft collections.",
    "details": {
      "activities": ["Contemporary Excellence", "Essays & Curations", "Museum Archive", "Rare Objects", "Signature Masterpieces"],
      "outputs": ["Digital exhibitions", "Collection catalogues", "Curatorial essays", "Archival records"],
      "stakeholders": ["Museums", "Curators", "Collectors", "Historians"]
    }
  },
  {
    "id": "prog7",
    "title": "07 Knowledge",
    "purpose": "Codifying the technical vocabulary, motifs, materials, and lineages of Kashmir's crafts.",
    "details": {
      "activities": ["Craft Glossary", "Lineages Documentation", "Motifs & Symbols", "Natural Dyes", "Techniques & Tools"],
      "outputs": ["Technical glossaries", "Motif databases", "Material guides", "Lineage trees"],
      "stakeholders": ["Students", "Designers", "Researchers", "Master artisans"]
    }
  },
  {
    "id": "prog8",
    "title": "08 Industry Intelligence",
    "purpose": "Providing data-driven market insights and trend analysis for the Kashmir craft sector.",
    "details": {
      "activities": ["Market Intelligence", "Sector Analysis", "Trade Data Tracking", "Economic Forecasting"],
      "outputs": ["Market intelligence reports", "Data dashboards", "Economic analyses", "Trade advisories"],
      "stakeholders": ["Exporters", "Investors", "Policy makers", "Business owners"]
    }
  },
  {
    "id": "prog9",
    "title": "09 Guides & Studies",
    "purpose": "Publishing foundational research, academic studies, and applied methodologies.",
    "details": {
      "activities": ["Policy Briefs", "Research Papers", "Best Practices", "Case Studies", "Knowledge Books"],
      "outputs": ["Academic papers", "Best practice manuals", "Published books", "Detailed case studies"],
      "stakeholders": ["Academics", "Practitioners", "Students", "Libraries"]
    }
  },
  {
    "id": "prog10",
    "title": "10 Evaluations & Grants",
    "purpose": "Assessing enterprise performance and facilitating financial support for craft businesses.",
    "details": {
      "activities": ["Enterprise Evaluation & Ranking", "Grant Assessment", "Funding Distribution", "Impact Measurement"],
      "outputs": ["Enterprise rankings", "Grant allocations", "Performance reports", "Impact scorecards"],
      "stakeholders": ["Craft enterprises", "Donors & philanthropists", "Financial institutions", "Evaluators"]
    }
  },
  {
    "id": "prog11",
    "title": "11 Certifications",
    "purpose": "Validating authenticity, business compliance, and professional standards in the craft ecosystem.",
    "details": {
      "activities": ["Business Certification", "Accreditation", "Entrepreneurs Kit", "Quality Standard Verification"],
      "outputs": ["Official certificates", "Accreditation badges", "Compliance documentation", "Business support kits"],
      "stakeholders": ["Craft businesses", "Entrepreneurs", "Retailers", "Consumers"]
    }
  }
]
;
// Phase Data
const DEFAULT_PHASES = [
  {
    id: "phase1",
    title: "Phase 1: Research & Documentation",
    purpose:
      "Mapping Kashmir’s craft ecosystem through evidence-based research and field documentation.",
    details: {
      activities: [
        "Field surveys with artisan clusters",
        "Documentation of indigenous techniques and oral knowledge",
        "Mapping supply chains and intermediaries",
        "Identifying economic, environmental, and social bottlenecks",
      ],
      outputs: [
        "Craft knowledge repository",
        "Baseline artisan database",
        "Research white papers",
        "Policy insight briefs",
      ],
      stakeholders: [
        "Artisans & master craftsmen",
        "Researchers & ethnographers",
        "Academic institutions",
      ],
    },
  },
  {
    id: "phase2",
    title: "Phase 2: Policy Formulation",
    purpose:
      "Designing a sustainable, ethical, and enforceable policy framework for craft revival.",
    details: {
      activities: [
        "Drafting the Kashmir Craft Policy",
        "Stakeholder consultations and workshops",
        "Aligning with GI, sustainability, and fair-trade norms",
        "Legal and regulatory validation",
      ],
      outputs: [
        "Kashmir Craft Policy Draft",
        "Compliance & ethics framework",
        "Institutional governance models",
      ],
      stakeholders: [
        "Policy experts",
        "Government bodies",
        "Cultural institutions",
      ],
    },
  },
  {
    id: "phase3",
    title: "Phase 3: Digital Implementation",
    purpose:
      "Building digital infrastructure to ensure authenticity, transparency, and global access.",
    details: {
      activities: [
        "Launch of Craftlore ID (digital artisan identity)",
        "De Koshur commerce platform rollout",
        "Digital traceability and verification layers",
        "Training artisans in digital onboarding",
      ],
      outputs: [
        "Verified artisan profiles",
        "Digital catalogs and storytelling",
        "Transparent supply-chain records",
      ],
      stakeholders: [
        "Technology partners",
        "Artisans & cooperatives",
        "Global buyers",
      ],
    },
  },
  {
    id: "phase4",
    title: "Phase 4: Market Expansion",
    purpose: "Scaling Kashmir’s crafts into ethical global markets.",
    details: {
      activities: [
        "International market access programs",
        "Strategic brand partnerships",
        "Global exhibitions and cultural showcases",
        "Direct-to-consumer and B2B channels",
      ],
      outputs: [
        "Global craft presence",
        "Sustainable revenue streams",
        "Reduced dependency on intermediaries",
      ],
      stakeholders: [
        "Global retailers",
        "Cultural ambassadors",
        "Export councils",
      ],
    },
  },
  {
    id: "phase5",
    title: "Phase 5: Impact Measurement & Continuity",
    purpose: "Ensuring long-term sustainability and measurable outcomes.",
    details: {
      activities: [
        "Impact assessment (economic, social, environmental)",
        "Continuous policy refinement",
        "Skill development and next-generation training",
        "Knowledge preservation programs",
      ],
      outputs: [
        "Annual impact reports",
        "Artisan income growth metrics",
        "Environmental sustainability indicators",
      ],
      stakeholders: [
        "Impact Assessment Agencies",
        "Donor & Grant Organizations",
        "Community Leaders",
      ],
    },
  },
];

import { cmsApi } from "@/lib/api";
import { useEffect } from "react";

export default function HCRFProject() {
  const [expandedPhase, setExpandedPhase] = useState<string | null>("phase1");
  const [phases, setPhases] = useState(DEFAULT_PHASES);
  const [expandedProgram, setExpandedProgram] = useState<string | null>("prog1");
  const toggleProgram = (id: string) => { setExpandedProgram(expandedProgram === id ? null : id); };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await cmsApi.getContent("hcrf-project-phases");
        if (data && data.content) {
          setPhases(data.content);
        }
      } catch (error) {
        console.error("Failed to fetch content, using default:", error);
      }
    };
    fetchContent();
  }, []);

  const togglePhase = (id: string) => {
    setExpandedPhase(expandedPhase === id ? null : id);
  };

  return (
    <main className="bg-white min-h-screen">
      <UniversalEditorialHero pageKey="hcrf-project" fallbackConfig={aboutHcrfProjectHeroFallback as any} />

      {/* Introduction Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl">
            <div className="text-left">
              <span data-editorial-accent-text className=" font-bold tracking-wider uppercase text-sm mb-2 block">
                Reviving Heritage Through Innovation
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 font-manrope">
                HCRF Projects & Initiatives
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                At HCRF, our projects are the lifeblood of our mission. From
                rigorous policy research to grassroots artisan welfare programs,
                we are actively reshaping the landscape of Kashmiri crafts. We
                bridge the gap between tradition and modernity, ensuring that
                every initiative drives tangible, sustainable impact for the
                artisan community.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                HCRF projects are designed as structured interventions within
                the Kashmiri craft ecosystem. Each initiative addresses a
                specific layer of the value chain—artisan capacity, market
                access, policy alignment, digital integration, and
                sustainability compliance. Rather than isolated programs, our
                projects function as coordinated systems aimed at long-term
                sector resilience.
              </p>

              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                From skill revitalization workshops and cluster-based training
                models to traceability frameworks and global export readiness
                programs, we operate with measurable benchmarks. Every
                initiative is evaluated on artisan income growth, quality
                enhancement, market penetration, and intergenerational skill
                transfer. Impact is defined through data, not assumption.
              </p>
              <div className="bg-gray-50 border-l-4 border-[var(--card-left-accent)] p-6 rounded-r-lg hover:shadow-md transition-shadow">
                <p className="text-gray-800 font-medium italic">
                  "Our projects are not just diverse; they are interconnected,
                  forming a holistic ecosystem that supports every facet of the
                  craft industry—from the loom to the global marketplace."
                </p>
              </div>
            </div>
            <ScrollReveal delay={200}>
              <div className="relative h-full min-h-[400px] rounded-4xl overflow-hidden shadow-2xl">
                <img
                  src="/assets/images/about_hcrf_bnr/4.png"
                  alt="HCRF Projects"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <ScrollReveal>
              <h5 data-editorial-accent-text className=" font-black uppercase tracking-[0.3em] text-[11px] mb-4">
                Project Overview
              </h5>
              <h2 className="text-4xl md:text-5xl font-black text-brand-dark mb-8 leading-tight">
                Architecting a{" "}
                <span className="text-brand-primary">Sustainable Future</span>
              </h2>
              <div className="space-y-6 text-gray-500 font-medium text-lg leading-relaxed">
                <p>
                  The HCRF Project is not just a preservation effort; it is a
                  structural overhaul of the artisanal ecosystem. By integrating
                  modern supply chain management, digital identity (De-Koshur),
                  and rigorous quality control (Craftlore), we are creating a
                  self-sustaining economy for artisans.
                </p>
                <p>
                  Our approach aims to eliminate the middleman exploitation,
                  ensure authenticity through blockchain-like verification, and
                  open direct global channels for trade.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 flex flex-col items-center text-center hover:shadow-xl transition-all">
                  <FaLayerGroup data-ui-icon  className="text-4xl  mb-4" />
                  <h4 className="font-black text-brand-dark text-xl">
                    Structured Ecology
                  </h4>
                </div>
                <div className="bg-brand-dark p-8 rounded-3xl border border-gray-100 flex flex-col items-center text-center hover:shadow-xl transition-all">
                  <FaProjectDiagram data-ui-icon  className="text-4xl  mb-4" />
                  <h4 className="font-black text-white text-xl">
                    Digital Integration
                  </h4>
                </div>
                <div className="bg-brand-secondary/10 p-8 rounded-3xl border border-gray-100 flex flex-col items-center text-center hover:shadow-xl transition-all">
                  <FaChartLine data-ui-icon  className="text-4xl  mb-4" />
                  <h4 className="font-black text-brand-dark text-xl">
                    Economic Model
                  </h4>
                </div>
                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 flex flex-col items-center text-center hover:shadow-xl transition-all">
                  <FaCogs data-ui-icon  className="text-4xl  mb-4" />
                  <h4 className="font-black text-brand-dark text-xl">
                    Policy Framework
                  </h4>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Timeline / Phases */}
      <section className="py-24 bg-[#fafafa]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <ScrollReveal>
              <span data-editorial-accent-text className=" font-bold tracking-widest uppercase text-xs mb-3 block">
                Roadmap to Revival
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-brand-dark">
                Implementation Phases
              </h2>
            </ScrollReveal>
          </div>

          <div className="space-y-6">
            {phases.map((phase, i) => (
              <ScrollReveal key={phase.id} delay={i * 50}>
                <ProjectAccordion
                  id={phase.id}
                  badgeText={"0" + (i + 1)}
                  title={phase.title}
                  purpose={phase.purpose}
                  isExpanded={expandedPhase === phase.id}
                  onToggle={togglePhase}
                  col1Title="Key Activities"
                  col1Items={phase.details.activities}
                  col2Title="Outputs"
                  col2Items={phase.details.outputs}
                  col3Title="Stakeholders"
                  col3Items={phase.details.stakeholders}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <MembershipCTA />

            {/* Driving Change Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <span data-editorial-accent-text className=" font-bold tracking-wider uppercase text-sm mb-3 block">
              Driving Change in Kashmir Crafts
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-6">
              KHCRF Institutional Programs & Projects
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
              The Hamdan Craft Revival Foundation (KHCRF) operates through interconnected institutional systems. These programs govern research, craft assessment, digital intelligence, market access, and socio-economic support across the entire Kashmir craft ecosystem.
            </p>
          </div>

          <div className="space-y-6">
            {/* Featured Block: State of Kashmir Crafts */}
            <ScrollReveal delay={0}>
              <div className="bg-brand-dark text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary opacity-20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="relative z-10">
                  <span className="text-brand-primary font-bold uppercase tracking-widest text-xs mb-3 block">Featured Institutional Programme</span>
                  <h3 className="text-2xl md:text-3xl font-black mb-4">State of Kashmir Crafts</h3>
                  <p className="text-white/80 max-w-3xl leading-relaxed mb-8">
                    The authoritative assessment and public consultation process evaluating the health, policy, and economic reality of Kashmir's artisan sector.
                  </p>
                  
                  <div className="flex flex-col md:flex-row gap-8 pt-8 border-t border-white/20">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4"><span className="h-3 w-3 bg-brand-primary rounded-full shrink-0 -translate-y-[1px]"></span><h4 className="text-xs font-bold uppercase tracking-widest text-white/50">KEY AREAS</h4></div>
                      <ul className="space-y-2 text-white/90 text-sm font-medium">
                        <li className="flex items-center gap-2"><span className="text-brand-primary shrink-0">&#9632;</span> Assessment &amp; Governance</li>
                        <li className="flex items-center gap-2"><span className="text-brand-primary shrink-0">&#9632;</span> Methodology</li>
                        <li className="flex items-center gap-2"><span className="text-brand-primary shrink-0">&#9632;</span> Public Participation</li>
                        <li className="flex items-center gap-2"><span className="text-brand-primary shrink-0">&#9632;</span> Hearings &amp; Evidence</li>
                      </ul>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4"><span className="h-3 w-3 bg-brand-primary rounded-full shrink-0 -translate-y-[1px]"></span><h4 className="text-xs font-bold uppercase tracking-widest text-white/50">OUTPUTS</h4></div>
                      <ul className="space-y-2 text-white/90 text-sm font-medium">
                        <li className="flex items-center gap-2"><span className="text-brand-primary shrink-0">&#9632;</span> Evidence Repository</li>
                        <li className="flex items-center gap-2"><span className="text-brand-primary shrink-0">&#9632;</span> Validation Reports</li>
                        <li className="flex items-center gap-2"><span className="text-brand-primary shrink-0">&#9632;</span> Expert Review</li>
                        <li className="flex items-center gap-2"><span className="text-brand-primary shrink-0">&#9632;</span> Final Assessment Report</li>
                      </ul>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4"><span className="h-3 w-3 bg-brand-primary rounded-full shrink-0 -translate-y-[1px]"></span><h4 className="text-xs font-bold uppercase tracking-widest text-white/50">STAKEHOLDERS</h4></div>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/10 px-3 py-1 text-xs font-medium rounded-full text-white/90">Government</span>
                        <span className="bg-white/10 px-3 py-1 text-xs font-medium rounded-full text-white/90">Artisans</span>
                        <span className="bg-white/10 px-3 py-1 text-xs font-medium rounded-full text-white/90">Policy Experts</span>
                        <span className="bg-white/10 px-3 py-1 text-xs font-medium rounded-full text-white/90">Industry Bodies</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {KHCRF_PROGRAMS.map((program, i) => (
              <ScrollReveal key={program.id} delay={(i + 1) * 50}>
                <ProjectAccordion
                  id={program.id}
                  badgeText={program.title.split(' ')[0]}
                  title={program.title.substring(3)}
                  purpose={program.purpose}
                  isExpanded={expandedProgram === program.id}
                  onToggle={toggleProgram}
                  col1Title="KEY AREAS"
                  col1Items={program.details.activities}
                  col2Title="OUTPUTS"
                  col2Items={program.details.outputs}
                  col3Title="STAKEHOLDERS"
                  col3Items={program.details.stakeholders}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
</section>

      <CommonCta
        title={{
          firstPart: "Want to be",
          highlightedPart: "Listed Here?",
        }}
        description="Join our partner network and start a collaboration that creates real impact for the artisan community."
        primaryAction={{
          label: "Apply for Partnership",
          href: "/about/partner-network/join",
        }}
      />
    </main>
  );
}
