import { getBaseUrl } from "@/lib/api";
export const revalidate = 0;
import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import { homepageHeroFallback } from "@/config/heroFallbacks";
import ThreeDBook from "@/components/ThreeDBook";
import AssessmentLifecycleTracker from "@/components/assessment/AssessmentLifecycleTracker";
import Image from "next/image";
import Link from "next/link";
import CountUpAnimation from "@/components/common/CountUpAnimation";
import { globalStatistics } from "@/config/statistics";
import {
  FaCheck,
  FaUsers,
  FaBuilding,
  FaGlobe,
  FaCertificate,
  FaExternalLinkAlt,
  FaLock,
  FaArrowRight,
  FaLandmark,
  FaBookOpen,
  FaSearch,
  FaChartLine,
  FaFileContract,
} from "react-icons/fa";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import PlatformUpgradeButton from "@/components/common/PlatformUpgradeButton";

const EvaluationRegistry = dynamic(
  () => import("@/components/business/EvaluationRegistry"),
);
const EvaluateFarmLink = dynamic(
  () => import("@/components/business/EvaluateFarmLink"),
);
const MagazineCTA = dynamic(
  () => import("@/components/publications/MagazineCTA"),
);
const GrantCtaButtonSection = dynamic(
  () => import("@/components/business/GrantCtaButtonSection"),
);
const AccreditedCTAsection = dynamic(
  () => import("@/components/business/AccreditedCTAsection"),
);
const GetKitCTASection = dynamic(
  () => import("@/components/business/GetKitCTASection"),
);
const DonationMainSection = dynamic(
  () => import("@/components/business/DonationMainSection"),
);
const MembershipCTA = dynamic(
  () => import("@/components/membership/MembershipCTA"),
);
const PartnerStats = dynamic(() => import("@/components/common/PartnerStats"));
const PublicationsSection = dynamic(
  () => import("@/components/publications/PublicationsSection"),
);

export const metadata: Metadata = {
  title: "Home",
  description:
    "An ecosystem where art and artisans flourish. We are undertaking a pioneering initiative to develop a comprehensive policy framework for Kashmiri crafts.",
};

async function getPublications() {
const API_BASE = getBaseUrl();
  try {
    const res = await fetch(`${API_BASE}/publications`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      throw new Error("Publications API returned status: " + res.status);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    // A single optional section must never crash the whole homepage.
    // Degrade gracefully in every environment (backend may be unreachable,
    // e.g. in the v0 sandbox preview) while keeping the failure visible.
    console.warn("[v0] getPublications failed, rendering homepage without publications:", error);
    return [];
  }
}

export default async function Home() {
  const publications = await getPublications();
  return (
    <main className="bg-[#fafafa]">
      <UniversalEditorialHero pageKey="homepage" fallbackConfig={homepageHeroFallback} />

      {/* About Section - Modern Material Elevation */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative group">
            <div className="relative z-10 rounded-4xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-[#6B2B08] bg-[#6B2B08] p-3 transition-transform duration-700 group-hover:scale-[1.02]">
              <Image
                src="/assets/images/home_bnner.png"
                alt="KHCRF Home Banner"
                width={600}
                height={600}
                className="w-full h-auto rounded-[1.8rem] transition-transform duration-1000 group-hover:scale-105 filter grayscale-[50%] contrast-[105%] saturate-[75%]"
              />
            </div>
            {/* Floating Experience Badge */}
            <div className="absolute -bottom-10 -right-4 md:-right-10 bg-[#6B2B08] p-1 rounded-3xl shadow-2xl z-20 animate-bounce-slow">
              <div className="bg-[#6B2B08] text-white p-8 rounded-[1.8rem] shadow-inner">
                <div className="text-5xl font-black mb-1 drop-shadow-lg">
                  <CountUpAnimation target="700+" />
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] leading-tight opacity-90">
                  Years of
                  <br />
                  Craft Legacy
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h5 data-editorial-accent-text className=" font-black uppercase tracking-[0.3em] text-[11px] mb-4">
                <span className="flex items-center mb-2">
                  <span data-editorial-accent-bg className="w-8 h-[2px]  mr-3" />
                  Welcome
                </span>
                <span className="block pl-11">Kashmir Hamadan Craft Revival Foundation</span>
              </h5>
              <h2 className="text-4xl md:text-6xl font-black text-brand-dark leading-[1.1] tracking-tight">
                An ecosystem where{" "}
                <span className="text-brand-primary">art</span> and{" "}
                <span className="text-brand-primary">artisans</span> flourish
              </h2>
            </div>
            <p className="text-gray-500 text-lg md:text-xl leading-relaxed font-medium">
              We are undertaking a pioneering initiative to develop a
              comprehensive policy framework that enables artisans, safeguards
              traditional techniques, and forges a path forward in the global
              market through rigorous scientific inquiry.
            </p>
            <div className="relative p-8 rounded-3xl bg-white border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] italic group">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#6B2B08] rounded-l-3xl group-hover:w-2 transition-all" />
              <p className="text-brand-dark font-medium leading-relaxed">
                "The Foundation works as a think tank, engaging in research,
                policy analysis, and advocacy to protect the rich heritage of
                Kashmiri crafts while addressing the modern challenges faced by
                artisans."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Approach Section - NEW */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20 max-w-4xl mx-auto">
            <h5 data-editorial-accent-text className="flex items-center justify-center  font-black uppercase tracking-[0.3em] text-[11px] mb-4">
              <span data-editorial-accent-bg className="w-8 h-[2px]  mr-3" />
              OUR MISSION & APPROACH
              <span data-editorial-accent-bg className="w-8 h-[2px]  ml-3" />
            </h5>
            <h2 className="text-4xl md:text-5xl font-black text-brand-dark leading-[1.2] tracking-tight mb-8">
              Reviving Heritage. Empowering Artisans. Securing The Future Of Kashmir Crafts.
            </h2>
            <div className="space-y-6 text-gray-500 text-lg leading-relaxed font-medium">
              <p>
                The Kashmir Hamadan Craft Revival Foundation (KHCRF) works at the intersection of research, preservation, policy, enterprise development, and public engagement to strengthen Kashmir's living craft traditions.
              </p>
              <p>
                We believe that preserving a craft requires more than protecting products. It requires protecting knowledge, supporting artisans, strengthening institutions, enabling markets, and building long-term systems that allow traditional craftsmanship to thrive in a changing world.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {[
              {
                title: "Research & Intelligence",
                text: "Industry research, market intelligence, policy analysis, and evidence-based insights supporting the future of Kashmir's handicraft sector.",
                icon: <FaGlobe data-ui-icon  className="text-3xl " />,
              },
              {
                title: "Documentation & Preservation",
                text: "Recording traditional knowledge, artisan histories, cultural practices, techniques, and endangered craft traditions for future generations.",
                icon: <FaLandmark data-ui-icon  className="text-3xl " />,
              },
              {
                title: "Policy & Advocacy",
                text: "Advancing legislative awareness, policy reform, artisan protection, and institutional support through research-driven advocacy.",
                icon: <FaBuilding data-ui-icon  className="text-3xl " />,
              },
              {
                title: "Artisan Development",
                text: "Supporting artisans through education, capacity building, recognition programs, and sustainable livelihood initiatives.",
                icon: <FaUsers data-ui-icon  className="text-3xl " />,
              },
              {
                title: "Business & Enterprise Support",
                text: "Helping enterprises improve quality, certification, market readiness, credibility, and long-term business sustainability.",
                icon: <FaCertificate data-ui-icon  className="text-3xl " />,
              },
              {
                title: "Public Engagement & Partnerships",
                text: "Connecting communities, institutions, researchers, businesses, and supporters through collaborative programs and campaigns.",
                icon: <FaUsers data-ui-icon  className="text-3xl " />,
              },
            ].map((pillar, i) => (
              <div key={i} className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:border-brand-primary/30 hover:shadow-xl transition-all duration-300 group">
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-4">
                  {pillar.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {pillar.text}
                </p>
              </div>
            ))}
          </div>

          <div className="relative p-10 md:p-16 rounded-4xl bg-[#050A1E] overflow-hidden text-center max-w-5xl mx-auto">
            {/* Removed background pattern per global rule */}
            <p className="relative z-10 text-xl md:text-2xl font-medium text-white leading-relaxed">
              "For more than seven centuries, Kashmir's crafts have carried stories of skill, resilience, creativity, and cultural identity. KHCRF exists to ensure these traditions continue to inspire, support livelihoods, and remain relevant for generations to come."
            </p>
          </div>
        </div>
      </section>

      {/* Strategic Impact & Ecosystem Section - OVERHAUL */}
      <section className="py-32 bg-[#fcfcfc] border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-24 max-w-4xl mx-auto">
            <h5 data-editorial-accent-text className=" font-black uppercase tracking-[0.4em] text-[11px] mb-4">
              Strategic Impact • Global Reach
            </h5>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-brand-dark mb-8">
              Our Integrated Ecosystem
            </h2>
            <p className="text-gray-600 font-medium text-lg leading-relaxed">
              We bridge the gap between heritage, knowledge, technology, tourism, commerce, and global market access through an interconnected ecosystem designed to protect Kashmir's craft traditions while creating sustainable opportunities for artisans, entrepreneurs, institutions, and future generations.
            </p>
          </div>

          <div className="space-y-16">
            {/* Craftlore */}
            <div className="bg-white rounded-4xl p-10 md:p-16 shadow-xl border border-gray-100 flex flex-col lg:flex-row gap-12 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[var(--card-left-accent)]" />
              <div className="lg:w-1/2 flex flex-col">
                <span data-editorial-accent-text className=" font-black uppercase tracking-[0.25em] text-[10px] mb-3 block">
                  KASHMIR CRAFT INTELLIGENCE PLATFORM
                </span>
                <h3 className="text-4xl font-black text-brand-dark mb-6">Craftlore</h3>
                <p className="text-gray-600 leading-relaxed mb-4 text-[15px]">
                  An integrated intelligence platform for Kashmir crafts combining GI verification, blockchain-enabled provenance, trade registry, buyer learning, sustainability assessment, fair value appraisal, socio-economic monitoring, and risk intelligence. Craftlore protects craft authenticity, strengthens buyer confidence, documents sector knowledge, and supports evidence-based decisions across Kashmir’s craft ecosystem.
                </p>
                <p className="text-gray-400 font-medium italic text-xs mb-8 grow">
                  Developed with ForceSource.
                </p>
                <Link
                  href="https://www.craftlore.org/"
                  target="_blank"
                  className="inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-brand-dark font-black tracking-widest text-[12px] uppercase hover:bg-brand-secondary hover:text-white transition-all w-fit"
                >
                  <span>VISIT WEBSITE</span>
                  <FaExternalLinkAlt className="text-[10px]" />
                </Link>
              </div>
              <div className="lg:w-1/2 lg:pl-12 lg:border-l border-gray-100 flex flex-col justify-center">
                <h4 className="font-playfair font-black text-xl mb-8 text-gray-900">Core Areas</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                  {["GI Verification System", "Blockchain Provenance", "Trade Registry", "Fair Value Appraisal", "Sustainability Intelligence", "Risk & Market Monitoring"].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div data-editorial-accent-bg className="w-2 h-2 rounded-full /50" />
                      <span className="text-[15px] font-medium text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ARTSTAY */}
            <div className="bg-white rounded-4xl p-10 md:p-16 shadow-xl border border-gray-100 flex flex-col lg:flex-row gap-12 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[var(--card-left-accent)]" />
              <div className="lg:w-1/2 flex flex-col">
                <span data-editorial-accent-text className=" font-black uppercase tracking-[0.25em] text-[10px] mb-3 block">
                  CRAFT TOURISM & ARTISAN EXPERIENCE ECOSYSTEM
                </span>
                <h3 className="text-4xl font-black text-brand-dark mb-6">KASHMIR ARTSTAY</h3>
                <p className="text-gray-600 leading-relaxed mb-8 text-[15px] grow">
                  A craft tourism and artisan experience ecosystem connecting travelers, craft communities, and heritage destinations through immersive cultural journeys. KASHMIR ARTSTAY integrates artisan homestays, craft safaris, fairs, documentation, marketplace access, and logistics support to create sustainable income opportunities while preserving Kashmir's living craft traditions.
                </p>
                <PlatformUpgradeButton
                  platformName="Kashmir ArtStay"
                  className="inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-brand-dark font-black tracking-widest text-[12px] uppercase hover:bg-brand-primary hover:text-white transition-all w-fit"
                />
              </div>
              <div className="lg:w-1/2 lg:pl-12 lg:border-l border-gray-100 flex flex-col justify-center">
                <h4 className="font-playfair font-black text-xl mb-8 text-gray-900">Core Areas</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                  {["Vacation With Artisans", "Craft Safaris", "Craft Fairs & Events", "Craft Marketplace", "Craft Documentary Network", "Craft Shipping & Logistics"].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div data-editorial-accent-bg className="w-2 h-2 rounded-full /50" />
                      <span className="text-[15px] font-medium text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Offshore Integration */}
            <div className="bg-white rounded-4xl p-10 md:p-16 shadow-xl border border-gray-100 flex flex-col lg:flex-row gap-12 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[var(--card-left-accent)]" />
              <div className="lg:w-1/2 flex flex-col">
                <span data-editorial-accent-text className=" font-black uppercase tracking-[0.25em] text-[10px] mb-3 block">
                  GLOBAL TRADE & OFFSHORE MARKET ACCESS
                </span>
                <h3 className="text-4xl font-black text-brand-dark mb-6">Offshore Integration</h3>
                <p className="text-gray-600 leading-relaxed mb-4 text-[15px]">
                  A global market access framework connecting Kashmir craft enterprises with international buyers through 106 US-based omnichannel retail opportunities, 17 craft distribution networks, and 6 structured craft export pathways. Offshore Integration helps artisans, entrepreneurs, and craft businesses expand beyond local markets through retail partnerships, distribution infrastructure, export support, and cross-border commerce systems.
                </p>
                <p className="text-gray-400 font-medium italic text-xs mb-8 grow">
                  Supported by De Koshur Craft USA.
                </p>
                <PlatformUpgradeButton
                  platformName="Offshore Integration"
                  className="inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-brand-dark font-black tracking-widest text-[12px] uppercase hover:bg-brand-dark hover:text-white transition-all w-fit"
                />
              </div>
              <div className="lg:w-1/2 lg:pl-12 lg:border-l border-gray-100 flex flex-col justify-center">
                <h4 className="font-playfair font-black text-xl mb-8 text-gray-900">Core Areas</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                  {["US-Based Retail Access", "Craft Distribution Networks", "Craft Export Pathways", "Omnichannel Commerce", "International Buyers", "Trade Partnerships"].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div data-editorial-accent-bg className="w-2 h-2 rounded-full /50" />
                      <span className="text-[15px] font-medium text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Purple Soul USA */}
            <div className="bg-white rounded-4xl p-10 md:p-16 shadow-xl border border-gray-100 flex flex-col lg:flex-row gap-12 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[var(--card-left-accent)]" />
              <div className="lg:w-1/2 flex flex-col">
                <span data-editorial-accent-text className=" font-black uppercase tracking-[0.25em] text-[10px] mb-3 block">
                  FAITH-BASED MARKETPLACE ECOSYSTEM
                </span>
                <h3 className="text-4xl font-black text-brand-dark mb-6">Purple Soul USA</h3>
                <p className="text-gray-600 leading-relaxed mb-8 text-[15px] grow">
                  A faith-based e-commerce platform connecting conscious buyers with products inspired by spirituality, sacred traditions, ethical craftsmanship, and meaningful living. Purple Soul USA brings together faith, purpose, heritage, and commerce to support artisans, creators, authors, spiritual organizations, and values-driven communities.
                </p>
                <PlatformUpgradeButton
                  platformName="Purple Soul USA"
                  className="inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-brand-dark font-black tracking-widest text-[12px] uppercase hover:bg-purple-600 hover:text-white transition-all w-fit"
                />
              </div>
              <div className="lg:w-1/2 lg:pl-12 lg:border-l border-gray-100 flex flex-col justify-center">
                <h4 className="font-playfair font-black text-xl mb-8 text-gray-900">Core Areas</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                  {["Faith-Based Commerce", "Spiritual Living Products", "Sacred Art & Heritage", "Books & Knowledge", "Ethical & Conscious Shopping", "Global Faith Communities"].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#050A1E]" />
                      <span className="text-[15px] font-medium text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* DKC B2B Connect */}
            <div className="bg-[#050A1E] rounded-4xl p-10 md:p-16 shadow-2xl flex flex-col relative overflow-hidden">
              {/* Removed background pattern per global rule */}
              <div className="relative z-10">
                <div className="text-center mb-16">
                  <span data-editorial-accent-text className=" font-black uppercase tracking-[0.25em] text-[10px] mb-3 block">
                    BUSINESS-TO-BUSINESS NETWORK
                  </span>
                  <h3 className="text-4xl md:text-5xl font-black text-white mb-6">DKC B2B Connect</h3>
                  <p className="text-gray-300 leading-relaxed text-lg max-w-3xl mx-auto">
                    A dedicated B2B trade and partnership platform for Kashmir craft entrepreneurs, suppliers, artisans, buyers, institutions, and enterprise partners. DKC B2B Connect helps Kashmir-based entrepreneurs build scalable commercial relationships across local, national, and international markets.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                  {/* Core Trade */}
                  <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-brand-primary/50 transition-colors">
                    <h4 className="text-white font-black text-lg mb-3 min-h-[86px] leading-[1.2]">Core<br />Trade</h4>
                    <p className="text-gray-400 text-xs leading-[1.65] pb-[30px] min-h-[150px]">
                      Enables Kashmir craft entrepreneurs to access e-commerce, consignment, wholesale, and import pathways through structured trade support.
                    </p>
                    <ul className="text-sm font-medium text-gray-300 space-y-3 border-t border-white/10 pt-[30px]">
                      {["E-Commerce", "Consignment", "Wholesale", "Import"].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-[#562508]">›</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Brand Expansion */}
                  <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-brand-primary/50 transition-colors">
                    <h4 className="text-white font-black text-lg mb-3 min-h-[86px] leading-[1.2]">Brand<br />Expansion</h4>
                    <p className="text-gray-400 text-xs leading-[1.65] pb-[30px] min-h-[150px]">
                      Helps Kashmir craft entrepreneurs grow through exhibitions, bidding access, white-label partnerships, and brick-and-mortar retail channels.
                    </p>
                    <ul className="text-sm font-medium text-gray-300 space-y-3 border-t border-white/10 pt-[30px]">
                      {["Exhibition", "Bidding", "White-Label", "Brick & Mortar"].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-[#562508]">›</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Collaborative Services */}
                  <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-brand-primary/50 transition-colors">
                    <h4 className="text-white font-black text-lg mb-3 min-h-[86px] leading-[1.2]">Collaborative<br />Services</h4>
                    <p className="text-gray-400 text-xs leading-[1.65] pb-[30px] min-h-[150px]">
                      Supports Kashmir craft enterprises with packaging, design collaboration, storytelling, media, and warehousing for market readiness.
                    </p>
                    <ul className="text-sm font-medium text-gray-300 space-y-3 border-t border-white/10 pt-[30px]">
                      {["Packaging", "Design Collaboration", "Storytelling & Media", "Warehouse"].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-[#562508]">›</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Institutional Partnerships */}
                  <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-brand-primary/50 transition-colors">
                    <h4 className="text-white font-black text-lg mb-3 min-h-[86px] leading-[1.2]">Institutional<br />Partnerships</h4>
                    <p className="text-gray-400 text-xs leading-[1.65] pb-[30px] min-h-[150px]">
                      Connects Kashmir craft entrepreneurs with logistics partners, museums, NGO buyers, technology providers, and institutional networks.
                    </p>
                    <ul className="text-sm font-medium text-gray-300 space-y-3 border-t border-white/10 pt-[30px]">
                      {["Logistics", "Museum", "NGO Buyer", "Technology Partnership"].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-[#562508]">›</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="text-center">
                  <PlatformUpgradeButton
                    platformName="DKC B2B Connect"
                    className="inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl bg-white text-brand-dark font-black tracking-widest text-[12px] uppercase hover:bg-brand-primary hover:text-white transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Ecosystem Impact Grid */}
          <div className="mt-32 mb-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-black text-brand-dark">Ecosystem Impact</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {[
                { title: "Knowledge", platform: "Craftlore", desc: "Preserves and protects knowledge." },
                { title: "Tourism", platform: "ARTSTAY", desc: "Creates cultural experiences and artisan income." },
                { title: "Trade", platform: "Offshore Integration", desc: "Connects products to international markets." },
                { title: "Commerce", platform: "Purple Soul USA", desc: "Creates trusted consumer-facing sales channels." },
                { title: "Enterprise Development", platform: "DKC B2B Connect", desc: "Builds commercial partnerships and business growth pathways." }
              ].map((impact, idx) => (
                <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg text-center hover:-translate-y-1 transition-transform flex flex-col justify-center">
                  <h5 className="font-black uppercase tracking-widest text-[10px] text-gray-400 mb-2">{impact.title}</h5>
                  <p className="text-brand-primary font-black text-lg mb-4">{impact.platform}</p>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">{impact.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Closing statement */}
          <div className="max-w-4xl mx-auto text-center border-t border-gray-200 pt-16">
            <p className="text-xl md:text-2xl text-gray-800 leading-relaxed font-playfair">
              Together, these platforms create a unified ecosystem that supports every stage of the craft value chain—from knowledge preservation and cultural education to tourism, trade, enterprise development, and global market access. Through this integrated approach, KHCRF works to ensure that Kashmir's craft traditions remain economically viable, culturally relevant, and globally recognized for generations to come.
            </p>
          </div>

          {/* Become Part of the Integrated Ecosystem */}
          <div className="mt-24 pt-16 border-t border-gray-100 text-center max-w-6xl mx-auto">
            <h3 className="text-3xl font-black text-brand-dark mb-6">Become Part of the Integrated Ecosystem</h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-12 max-w-4xl mx-auto">
              Whether you are an artisan, enterprise, institution, technology provider, tourism partner, buyer, distributor, researcher, NGO or cultural organization, there is a place to collaborate across the KHCRF ecosystem.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {[
                { title: "Knowledge & Research Partner", desc: "For universities, researchers, museums, policy institutions, heritage organizations and documentation partners.", interest: "knowledge" },
                { title: "Technology & Traceability Partner", desc: "For blockchain, digital identity, authentication, software, data, AI and technology organizations.", interest: "technology" },
                { title: "Tourism & Cultural Experience Partner", desc: "For hotels, homestays, tour operators, cultural institutions, event organizers and experience providers.", interest: "tourism" },
                { title: "Trade & Market Access Partner", desc: "For retailers, distributors, importers, exporters, wholesalers, buyers and international market partners.", interest: "trade" },
                { title: "Artisan & Enterprise Partner", desc: "For artisans, workshops, cooperatives, manufacturers, craft businesses and entrepreneurs.", interest: "enterprise" },
                { title: "Institutional & Development Partner", desc: "For government agencies, NGOs, CSR programs, foundations, development organizations and policy institutions.", interest: "institutional" }
              ].map((route, idx) => (
                <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-8 flex flex-col hover:shadow-xl transition-all h-full relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-[var(--card-left-accent)]" />
                  <h4 className="font-black text-brand-dark text-lg mb-3 relative z-10">{route.title}</h4>
                  <p className="text-sm text-gray-500 mb-8 flex-grow">{route.desc}</p>
                  <Link href={`/about/partner-network?interest=${route.interest}`} className="inline-flex items-center text-icon-on-light font-bold text-sm tracking-widest uppercase hover:text-brand-dark transition-colors">
                    <span>Explore Partnership</span>
                    <FaArrowRight className="ml-2 w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Mission Section - Premium Glassmorphism Cards */}
      <section className="py-32 universal-hero text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-brand-primary/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-brand-secondary/10 blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h5 className="text-white font-black uppercase tracking-[0.4em] text-[11px] mb-4">
              Crafting Connections • Shaping Futures
            </h5>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">
              Mission, Focus & Reach
            </h2>
            <div className="flex justify-center mt-8">
              <div className="w-12 h-1 bg-brand-primary rounded-full" />
              <div className="w-4 h-1 bg-brand-primary/30 rounded-full ml-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Our Mission",
                icon: <FaGlobe className="text-3xl text-white" />,
                items: [
                  "Revitalize crafts through innovation.",
                  "Fostering sustainability in Kashmir's crafts.",
                  "Promote eco-friendly sustainable crafts.",
                  "Support policies protecting artisans.",
                  "Forge partnerships for impactful initiatives.",
                  "Empower artisans with essential resources.",
                ],
              },
              {
                title: "Core Focus Areas",
                icon: <FaCertificate className="text-3xl text-white" />,
                items: [
                  "Market research and analysis.",
                  "Policy research and advocacy.",
                  "Skill development and capacity building.",
                  "Cultural preservation and documentation.",
                  "Market access facilitation.",
                  "Innovate product design & development.",
                ],
              },
              {
                title: "Our Audience",
                icon: <FaUsers className="text-3xl text-white" />,
                items: [
                  "Artisans and craft communities.",
                  "Government agencies and policymakers.",
                  "NGOs and development organizations.",
                  "Private sector stakeholders.",
                  "Educational institutions & training centers.",
                  "General public interested in art and crafts.",
                ],
              },
            ].map((card, i) => (
              <div key={i} className="group relative h-full">
                
                <div className="h-full bg-white/5 backdrop-blur-xl p-10 rounded-4xl border border-white/10 hover:border-brand-primary/50 transition-all duration-500 shadow-2xl flex flex-col">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 group-hover:bg-brand-primary/10 transition-all duration-500">
                    {card.icon}
                  </div>
                  <h3 className="text-2xl font-black mb-8 text-white  transition-colors">
                    {card.title}
                  </h3>
                  <ul className="space-y-5 grow">
                    {card.items.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-start text-gray-500 group/item"
                      >
                        <div className="w-5 h-5 rounded-full border border-[#562508]/50 flex items-center justify-center mt-0.5 mr-4 shrink-0 transition-colors group-hover/item:border-[#562508]">
                          <div className="w-3 h-3 m-1 bg-[#562508] rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-[15px] font-medium leading-tight group-hover/item:text-white transition-colors">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Publications Section - NEW */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-16 flex flex-col items-center text-center">
            <h5 className="inline-flex items-center justify-center gap-2 border border-brand-accent/30 px-5 py-2 rounded-full text-brand-accent text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(197,164,55,0.05)] mb-6">
              Research • Insights • Knowledge
            </h5>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#050A1E] mb-6 leading-[1.1]">
              Latest Kashmir Craft <br />
              <span className="text-brand-accent">Publications</span>
            </h2>
            <p className="text-stone-500 font-medium text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Explore the latest KHCRF publications across Market Intelligence, Policy Briefs, Research Papers, Best Practices, Case Studies, and Knowledge Books.
            </p>
          </div>

          <div data-publications-build="2026-07-18-publications-v2" />
          <PublicationsSection initialPublications={publications} />
        </div>
      </section>

      {/* Legislative Updates Section - NEW */}
      <section className="py-32 bg-[#fcfcfc] border-y border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-center md:text-left">
            <div className="max-w-2xl mx-auto md:mx-0">
              <h5 data-editorial-accent-text className="flex items-center justify-center md:justify-start  font-black uppercase tracking-[0.3em] text-[11px] mb-4">
                <span data-editorial-accent-bg className="w-8 h-[2px]  mr-3" />
                Institutional Transparency
              </h5>
              <h2 className="text-4xl md:text-5xl font-black text-brand-dark leading-tight tracking-tight">
                Verified Legislative Highlights
              </h2>
              <p className="text-gray-500 mt-6 font-medium text-lg leading-relaxed">
                Direct, verified communication from elected representatives
                championing the artisanal sector in Kashmir. Access official
                notices, meeting summaries, and policy updates.
              </p>
            </div>
            <Link
              href="/research/lobbying"
              className="px-10 py-5 bg-white border-2 border-brand-primary text-brand-primary font-black tracking-widest text-[13px] uppercase hover:bg-brand-primary hover:text-white rounded-2xl transition-all shadow-lg flex items-center gap-3 group mx-auto md:mx-0"
            >
              <span>Engage in Legislative Change</span>
              <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="mb-16 w-full h-[300px] md:h-[450px] relative rounded-[2.5rem] overflow-hidden shadow-2xl group bg-[#050A1E]">
            <Image 
              src="/assets/images/jk-legislative-assembly.jpg" 
              alt="J&K Legislative Assembly" 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-1000 grayscale-[30%] opacity-90" 
            />
            {/* Moderate color tint filter */}
            <div className="absolute inset-0 bg-[#050A1E]/40 mix-blend-color pointer-events-none" />
            {/* Gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050A1E] to-transparent pointer-events-none opacity-80" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 relative group overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[var(--card-left-accent)]" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 flex flex-col h-full">
                <div data-ui-icon className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center  mb-8">
                  <FaLandmark className="text-3xl" />
                </div>
                <h3 className="text-2xl font-black text-brand-dark mb-4 group-hover:text-brand-primary transition-colors">
                  Official Policy Updates
                </h3>
                <p className="text-gray-500 font-medium leading-relaxed mb-8 grow">
                  Access direct information regarding GI law reforms, fair trade
                  legislation, and trade policy adjustments shared by verified
                  legislative offices.
                </p>
                <Link
                  href="/legislative-office"
                  className="text-brand-primary font-black uppercase tracking-widest text-[11px] flex items-center gap-2 group/btn"
                >
                  View Latest Posts{" "}
                  <FaArrowRight className="group-hover/btn:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="bg-[#050A1E] text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full bg-[var(--card-left-accent)]" />
              <div className="relative z-10 flex flex-col h-full">
                <div data-ui-icon className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center  mb-8 border border-white/10">
                  <FaUsers className="text-3xl text-white" />
                </div>
                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-white transition-colors">
                  Representative Directory
                </h3>
                <p className="text-stone-400 font-medium leading-relaxed mb-8 grow">
                  Find your constituency's representative and their specific
                  focus areas within the handicraft economy. Every office is
                  verified for institutional neutrality.
                </p>
                <Link
                  href="/research/lobbying"
                  className="text-white font-black uppercase tracking-widest text-[11px] flex items-center gap-2 group/btn"
                >
                  Engage in Legislative Change{" "}
                  <FaArrowRight className="group-hover/btn:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Assessment 2026 Section - REDESIGNED */}
      <section className="py-32 bg-gradient-to-b from-stone-50 to-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-secondary/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="max-w-4xl mx-auto mb-16 space-y-8 flex flex-col items-center">
            <div data-editorial-accent-text className="inline-flex items-center gap-2 bg-white border border-brand-primary/20 shadow-sm px-5 py-2 rounded-full  text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
              </span>
              Historic First-Ever Census
            </div>
            
            <div>
              <h5 data-editorial-accent-text className="flex items-center justify-center  font-black uppercase tracking-[0.4em] text-[10px] mb-6">
                <span data-editorial-accent-bg className="w-12 h-[1px] /30 mr-4" />
                SURVEY & FIELD ANALYSIS
                <span data-editorial-accent-bg className="w-12 h-[1px] /30 ml-4" />
              </h5>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-brand-dark leading-[1.1] tracking-tight">
                State of Kashmir Crafts <br />
                <span className="text-brand-primary">Assessment 2026</span>
              </h2>
            </div>
            
            <p className="text-stone-600 text-lg md:text-xl leading-relaxed font-medium max-w-3xl">
              We are conducting the most comprehensive field-level study of the Kashmiri craft sector. Measuring production indices, artisan wages, cooperative structures, and authentic GI pashmina exports to construct a resilient policy roadmap.
            </p>
          </div>

          {/* Premium Blockquote */}
          <div className="max-w-3xl mx-auto mb-20 relative">
            <div className="absolute -top-12 -left-8 text-8xl text-brand-primary/10 font-serif leading-none select-none">"</div>
            <p className="relative z-10 text-stone-500 text-base md:text-lg leading-relaxed font-serif italic text-center px-8">
              This is the first time in the history of Kashmiri handicrafts that a field-level census of this scale has been launched. It builds a definitive data framework to secure fair wages, block counterfeit trade, and establish clear provenance tracking directly benefiting the weavers.
            </p>
            <div className="absolute -bottom-16 -right-8 text-8xl text-brand-primary/10 font-serif leading-none select-none">"</div>
          </div>
          
          {/* SKC Scope Framework Pillars - 4 Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 text-left">
            {[
              {
                number: "01",
                title: "About & Governance",
                desc: "Defining the assessment scope, methodology baselines, and legal governance framework guided by the Advisory Council.",
                tags: ["Framework", "Methodology", "Advisory Council"]
              },
              {
                number: "02",
                title: "Stakeholder Engagement",
                desc: "Tracking stakeholder participation, consultation submissions, official communications, and verified institutional participation.",
                tags: ["Tracker", "Official Messages", "Registry"]
              },
              {
                number: "03",
                title: "Hearings, Evidence & Findings",
                desc: "Conducting public hearings, preserving submitted evidence, and developing findings through structured review and expert validation.",
                tags: ["Hearings", "Evidence Repository", "Expert Review"]
              },
              {
                number: "04",
                title: "Reports & Resources",
                desc: "Publishing assessment findings, final reports, research resources, public archives, media materials, and guidance.",
                tags: ["Final Report", "Media Center", "FAQ"]
              }
            ].map((pillar, idx) => (
              <div key={idx} className="group relative p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 hover:border-brand-primary/30 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 flex flex-col h-full -translate-y-0 hover:-translate-y-2">
                <div className="relative z-10 flex-grow">
                  <span data-editorial-accent-text className="text-[10px] font-black uppercase tracking-[0.2em]  mb-3 block">Pillar {pillar.number}</span>
                  <h4 className="text-lg font-black text-brand-dark mb-3 leading-tight group-hover:text-brand-primary transition-colors">{pillar.title}</h4>
                  <p className="text-[13px] text-stone-500 leading-relaxed mb-6">
                    {pillar.desc}
                  </p>
                </div>
                <div className="relative z-10 flex flex-wrap gap-2 mt-auto pt-4 border-t border-stone-100">
                  {pillar.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] bg-stone-50 text-stone-500 px-2.5 py-1 rounded-md font-semibold group-hover:bg-brand-primary/5 group-hover:text-brand-dark transition-colors">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-6xl mx-auto mb-16">
            <AssessmentLifecycleTracker />
          </div>

          <div className="text-center pt-8">
            <Link
              href="/state-of-kashmir-crafts/current-assessment-2026"
              className="inline-flex items-center justify-center bg-brand-dark hover:bg-brand-primary text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-[0_10px_20px_rgba(5,10,30,0.2)] hover:shadow-[0_15px_30px_rgba(197,164,55,0.3)] hover:-translate-y-1 active:translate-y-0"
            >
              Explore Assessment Insights
            </Link>
          </div>
        </div>
      </section>

      {/* Master Artisans Section - NEW */}
      <section className="py-32 bg-[#050A1E] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-24 items-stretch">
          <div className="order-2 lg:order-1 relative min-h-[480px] lg:min-h-full flex">
            <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border-8 border-white/10 bg-white/5 p-2 grow">
              <Image
                src="/assets/images/master_artisans_intro.jpg"
                alt="Master Artisans & Lineages"
                fill
                className="object-cover rounded-[1.8rem] hover:scale-105 transition-transform duration-1000 p-2"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-10 flex flex-col justify-center">
            <div>
              <h5 className="flex items-center text-white font-black uppercase tracking-[0.3em] text-[11px] mb-4">
                <span className="w-8 h-[2px] bg-white mr-3" />
                HERITAGE PRESERVATION
              </h5>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
                Living Legends of <br />
                <span className="text-white">Kashmiri Craft Lineages</span>
              </h2>
            </div>
            <p className="text-stone-400 text-lg leading-relaxed font-medium">
              Meet the master craftsmen preserving centuries of generational knowledge. Our directory documents living legends in Pashmina, Kani, Sozni, Carpets, Papier-Mâché, and Walnut Wood carving, celebrating their techniques and supporting emerging apprentices.
            </p>
            <div className="grid grid-cols-1 gap-4">
              {[
                "Generational Lineage Archives & Tree Mapping",
                "Apprenticeship Sponsorships & Craft Fellowships",
                "Oral History Transcriptions & Technique Records",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#562508] shrink-0">
                    <FaCheck className="text-[10px]" />
                  </div>
                  <span className="text-sm font-semibold text-stone-300">{item}</span>
                </div>
              ))}
            </div>
            <div>
              <Link
                href="/master-artisans/lineages"
                className="inline-flex items-center justify-center bg-brand-secondary hover:bg-[#804825] text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors shadow-sm active:scale-[0.98]"
              >
                Browse Master Directory
              </Link>
            </div>
          </div>
        </div>
      </section>

      <DonationMainSection />
      <EvaluationRegistry />
      <MagazineCTA />
      <EvaluateFarmLink />
      <GrantCtaButtonSection />
      <AccreditedCTAsection />
      <GetKitCTASection useExploreButton={true} />
      <div id="apply-now">
        <MembershipCTA />
      </div>
      <PartnerStats />
      {/* How We Work Section - Museum Quality Premium Design */}
      <section className="py-32 bg-white relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#fafafa] rounded-bl-[100px] -z-0"></div>
        <div className="absolute top-40 -left-20 w-72 h-72 bg-[#6B2B08]/5 rounded-full blur-[80px] -z-0 pointer-events-none"></div>

        <div className="max-w-[1680px] mx-auto px-6 md:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center relative z-10">
          <div className="order-2 lg:order-1 space-y-12">
            <div>
              <div className="inline-flex items-center gap-4 mb-6">
                <span className="h-[2px] w-12 bg-[#6B2B08]"></span>
                <span data-editorial-accent-text className=" font-bold uppercase tracking-[0.25em] text-xs">
                  Strategic Collaboration
                </span>
              </div>
              <h2 className="text-5xl lg:text-7xl font-black text-[#050A1E] leading-[1.1] tracking-tight mb-8">
                How we work
              </h2>
              <p className="text-gray-600 text-xl leading-relaxed max-w-xl font-light">
                We collaborate with government agencies, NGOs, businesses, &
                international organizations to leverage resources, share
                knowledge, & implement innovative solutions.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 pt-4">
              {[
                { title: "Field Research & Documentation", desc: "Rigorous on-ground analysis of artisan practices and economic realities.", icon: <FaSearch /> },
                { title: "Market Dynamics Analysis", desc: "Evaluating global supply chains and authenticity mechanisms for Kashmir crafts.", icon: <FaChartLine /> },
                { title: "Comprehensive Policy Review", desc: "Developing actionable frameworks to protect heritage and ensure fair trade.", icon: <FaFileContract /> },
              ].map((item, k) => (
                <div
                  key={k}
                  className="group relative flex items-start p-8 rounded-3xl bg-white border border-gray-100 hover:border-[#6B2B08]/30 hover:bg-[#fafafa] transition-all duration-500 overflow-hidden shadow-sm hover:shadow-xl"
                >
                  {/* Hover highlight bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#6B2B08] transform scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-500"></div>
                  
                  <div className="w-14 h-14 bg-[#050A1E]/5 rounded-2xl flex items-center justify-center text-[#050A1E] group-hover:bg-[#050A1E] group-hover:text-icon-on-light transition-all duration-500 shrink-0 mt-1">
                    <div className="text-xl">
                      {item.icon}
                    </div>
                  </div>
                  <div className="ml-6">
                    <h4 className="text-2xl font-black text-[#050A1E] tracking-tight mb-2 group-hover:text-icon-on-light transition-colors duration-300">
                      {item.title}
                    </h4>
                    <p className="text-gray-500 font-medium leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2 relative">
            {/* Premium Image Frame */}
            <div className="relative group mt-8 lg:mt-0">
              {/* Decorative border frame */}
              <div className="absolute inset-0 border-2 border-[#6B2B08]/20 rounded-[3rem] transform translate-x-4 translate-y-4 md:translate-x-6 md:translate-y-6 -z-10 transition-transform duration-700 group-hover:translate-x-6 group-hover:translate-y-6 md:group-hover:translate-x-8 md:group-hover:translate-y-8"></div>
              
              <div className="relative rounded-[3rem] overflow-hidden shadow-[0_20px_80px_-20px_rgba(5,10,30,0.15)] bg-[#050A1E]">
                <div className="absolute inset-0 bg-[#050A1E]/10 z-10 group-hover:bg-transparent transition-colors duration-700 pointer-events-none"></div>
                <Image
                  src="/home22.png"
                  alt="Strategic Collaboration & Research"
                  width={800}
                  height={900}
                  className="w-full h-auto object-cover transform scale-105 group-hover:scale-110 transition-transform duration-1000"
                />
                
                {/* Floating Glass Label */}
                <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 z-20">
                  <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl flex items-center gap-5 md:gap-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                    <div className="w-12 h-12 bg-[#6B2B08] rounded-full flex items-center justify-center text-white shrink-0">
                      <FaGlobe className="text-xl" />
                    </div>
                    <div>
                      <div className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Global Impact</div>
                      <div className="text-base md:text-lg font-black text-[#050A1E] leading-tight">Building a Sustainable Future</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-10">
          <p className="text-xs text-gray-400 text-center max-w-5xl mx-auto">
            KHCRF works alongside nonprofit, knowledge, cultural, technology and independent commercial platforms that address different parts of the craft ecosystem. These organizations retain their own governance, operational and commercial responsibilities. KHCRF itself does not act as a marketplace, reseller, broker or transaction intermediary. Participation in an external commercial platform is independent of KHCRF evaluation, research, recognition, membership and institutional services.
          </p>
        </div>
      </section>
    </main>
  );
}



