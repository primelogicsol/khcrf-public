"use client";

import React from "react";
import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import { lobbyingHeroFallback } from "@/config/heroFallbacks";
import InfoGrid from "../../industry-research/components/InfoGrid";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  FaLandmark,
  FaShieldHalved,
  FaMoneyBillTrendUp,
  FaGlobe,
  FaLaptopCode,
  FaUsersGear,
  FaHandHoldingHeart,
  FaLeaf,
  FaLifeRing,
  FaArrowRight
} from "react-icons/fa6";
import { 
  FaBalanceScale, 
  FaGavel, 
  FaHandshake, 
  FaFileContract, 
  FaNewspaper 
} from "react-icons/fa";
import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Link from "next/link";

const LOBBYING_TOPICS = [
  {
    title: "Cultural Heritage & IPR",
    description:
      "Advocating for robust Intellectual Property Rights regarding Kashmiri Crafts.",
    link: "/research/lobbying/cultural-heritage-ipr",
    icon: FaLandmark,
  },
  {
    title: "Anti-Counterfeit Legislation",
    description:
      "Strengthening laws to prevent fake products and protect authentic Kashmir Art.",
    link: "/research/lobbying/anti-counterfeit-legislation",
    icon: FaShieldHalved,
  },
  {
    title: "Tax & Trade Incentives",
    description:
      "Seeking tax breaks and financial incentives for artisanal businesses.",
    link: "/research/lobbying/tax-trade-incentives",
    icon: FaMoneyBillTrendUp,
  },
  {
    title: "Sustainable Craft Policy",
    description:
      "Promoting sustainable policies to protect crafts and artisan livelihoods.",
    // link: "/research/lobbying/funding-development",
    link: "/research/lobbying/sustainable-craft-policy",
    icon: FaLeaf,
  },
  {
    title: "Export Promotion",
    description:
      "Global branding initiatives to expand international market access.",
    link: "/research/lobbying/export-promotion",
    icon: FaGlobe,
  },
  {
    title: "Disaster Relief & Crisis Protection",
    description:
      "Advocating for disaster relief tailored to the craft sector's vulnerabilities.",
    link: "/research/lobbying/disaster-relief-crisis-protection",
    icon: FaLifeRing,
  },
  {
    title: "Digital Transformation",
    description:
      "Modernizing the sector through digital adoption and e-commerce.",
    link: "/research/lobbying/digital-transformation",
    icon: FaLaptopCode,
  },
  {
    title: "Cluster Development",
    description:
      "Modernizing artisan clusters for collective growth and shared resources.",
    link: "/research/lobbying/cluster-development",
    icon: FaUsersGear,
  },
  {
    title: "Social Security & Welfare",
    description:
      "Ensuring safety nets, health insurance, and pension schemes for artisans.",
    link: "/research/lobbying/social-security-welfare",
    icon: FaHandHoldingHeart,
  },
];

const LEGISLATORS = [
  {
    name: "OMAR ABDULLAH",
    location: "BUDGAM/GANDERBAL",
    image: "/assets/images/lobby7.png",
    title: "Boosting Craft Economy",
  },
  {
    name: "FAROOQ AHMAD SHAH",
    location: "GULMARGH",
    image: "/assets/images/lobby10.png",
    title: "Support Artisan Administration",
  },
  {
    name: "SALMAN SAGAR",
    location: "HAZRATBAL",
    image: "/assets/images/lobby1.png",
    title: "Uplifting Artisan Futures",
  },
  {
    name: "Yousuf Tarigami",
    location: "KULGAM",
    image: "/assets/images/lobby3.png",
    title: "Upholding Artisan Rights",
  },
  {
    name: "TANVIR SADIQ",
    location: "ZADIBAL",
    image: "/assets/images/lobby6.png",
    title: "Sustainable Craft Policy",
  },
  {
    name: "MUBARIK GUL",
    location: "EIDGAH",
    image: "/assets/images/lobby5.png",
    title: "Advocating Craft Empowerment",
  },
  {
    name: "TARIQ HAMEED KARRA",
    location: "CENTRAL SHALTENG",
    image: "/assets/images/lobby4.png",
    title: "Strengthen Craft Legislation",
  },
  {
    name: "SHAMIM FIRDOUS",
    location: "HABBAKADAL",
    image: "/assets/images/lobby9.png",
    title: "Supporting Women Artisans",
  },
];

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

export default function LobbyingClient() {
  const [legislators, setLegislators] = useState<any[]>([]);

  useEffect(() => {
    const fetchLegislators = async () => {
      try {
        const { data } = await api.get("/legislative/public/list");
        if (Array.isArray(data)) {
          setLegislators(data);
        } else if (data && Array.isArray(data.data)) {
          setLegislators(data.data);
        } else {
          setLegislators([]);
        }
      } catch (error) {
        console.error("Failed to fetch legislators", error);
      }
    };
    fetchLegislators();
  }, []);

  const gridItems = LOBBYING_TOPICS.map((topic) => ({
    title: topic.title,
    text: topic.description,
    link: topic.link,
    icon: topic.icon,
  }));

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-roboto">
      {/* Hero Section */}
      <UniversalEditorialHero
        pageKey="research-lobbying"
        fallbackConfig={lobbyingHeroFallback as any}
      />

      {/* Intro & Shaping Artisan Futures Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span data-editorial-accent-text className="block  font-bold tracking-widest uppercase text-sm mb-2">
                Driving Legislative Change
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-black text-stone-900 mb-6 leading-tight">
                Policy Legislative Lobbying
              </h2>
              <p className="text-stone-600 text-lg leading-relaxed mb-8">
                KHCRF’s Policy Legislative Lobbying division is the driving force
                behind legislative change within the Kashmiri craft industry. We
                engage with legislative bodies, government agencies, and
                international policymakers to influence the creation of
                pro-craft policies that ensure the industry&apos;s long-term
                viability. Our lobbying efforts focus on securing artisan
                rights, expanding market opportunities, and ensuring that
                government policies reflect the needs of the Kashmiri craft
                sector.
              </p>

              <div className="bg-[#fdfbf7] p-8 rounded-lg border-l-4 border-[var(--card-left-accent)]">
                <h3 className="font-playfair text-xl font-bold text-stone-900 mb-4">
                  Lobbying Focus
                </h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <span className="text-brand-primary mt-1">✦</span>
                    <p className="text-stone-700 text-sm">
                      <span className="font-bold text-stone-900">
                        Intellectual Property Law Reforms:
                      </span>{" "}
                      Lobbying for stronger protections for Geographical
                      Indications (GI) and other intellectual property rights to
                      safeguard the authenticity of Kashmiri products.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-brand-primary mt-1">✦</span>
                    <p className="text-stone-700 text-sm">
                      <span className="font-bold text-stone-900">
                        Fair Trade Legislation:
                      </span>{" "}
                      Advocating for laws that enforce fair wage standards,
                      ethical labor practices, and social welfare programs for
                      artisans.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-brand-primary mt-1">✦</span>
                    <p className="text-stone-700 text-sm">
                      <span className="font-bold text-stone-900">
                        Trade Policy Adjustments:
                      </span>{" "}
                      Pushing for more favorable trade policies that reduce
                      tariffs, streamline export regulations, and open up new
                      international markets for Kashmiri crafts.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[700px] rounded-lg overflow-hidden shadow-2xl group">
              <div className="absolute inset-0 bg-stone-200">
                <img
                  src="/assets/images/get_involved/7.png"
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

      {/* Legislators Driving Change - Auto Scroll Section */}
      {legislators.length > 0 && (
        <section className="py-20 bg-stone-100 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
            <span data-editorial-accent-text className="block  font-bold tracking-widest uppercase text-sm mb-2">
              Shaping Artisan Futures
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-black text-stone-900">
              Legislators Driving Change in Kashmir&apos;s Handicrafts
            </h2>
            <p className="text-stone-600 mt-4 max-w-2xl mx-auto">
              Popular Proactive Legislators Championing the Revival of Kashmir&apos;s
              Handicraft Legacy.
            </p>
          </div>

          <div className="max-w-7xl mx-auto px-4">
            <Carousel
              responsive={responsive}
              infinite={true}
              autoPlay={true}
              autoPlaySpeed={2500}
              keyBoardControl={true}
              showDots={false}
              arrows={false}
              containerClass="carousel-container"
              itemClass="px-4"
              pauseOnHover={true}
            >
              {(legislators || []).map((leg, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300"
                >
                  <div className="h-[400px] overflow-hidden relative">
                    <img
                      src={leg.officeImageUrl || "/assets/images/lobby7.png"}
                      alt={leg.representativeName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) =>
                        (e.currentTarget.src =
                          "https://placehold.co/600x800/e2e8f0/475569?text=Representative")
                      }
                    />
                    <div className="absolute top-4 right-4 bg-brand-primary/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      {leg.party}
                    </div>
                  </div>
                  <div className="p-8 text-center bg-white border-t-4 border-brand-primary">
                    <h3 className="text-xl font-bold text-stone-900 mb-1">
                      {leg.representativeName}
                    </h3>
                    <p className="text-stone-300 text-sm italic border-l-2 border-[var(--card-left-accent)] pl-3 mt-2">
                      {leg.designation}
                    </p>

                    <a
                      href={`/legislative-office/${leg.username}`}
                      className="mt-6 inline-flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Visit Verified Blog
                    </a>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </section>
      )}

      {/* Main Content - Grid of Topics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <InfoGrid
          title="Lobbying Initiatives"
          items={gridItems}
          bgClass="bg-transparent"
        />
      </div>

      {/* Call to Action */}
      {/* Call to Action - Redesigned to International Standard */}
      <section className="py-32 bg-[#050A1E] text-white relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[#F6F2EC]/10 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/img/pattern.svg')] opacity-[0.03] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h5 className="flex items-center justify-center text-[#F6F2EC] font-black uppercase tracking-[0.3em] text-[11px] mb-6">
              <span className="w-8 h-[1px] bg-[#F6F2EC] mr-3" />
              How This Works for Legislative Offices
              <span className="w-8 h-[1px] bg-[#F6F2EC] ml-3" />
            </h5>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight tracking-tight">
              Jammu and Kashmir Legislative <br />
              <span className="text-[#F6F2EC] font-playfair italic font-normal tracking-normal">Constituency Artisan Desk</span>
            </h2>
          </div>

          <div className="mb-16 w-full h-[400px] md:h-[500px] relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 group bg-[#050A1E]">
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

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
            <div className="text-stone-300 text-lg leading-relaxed space-y-6 font-medium">
              <p>
                The Jammu and Kashmir Legislative Constituency Artisan Desk is a verified digital interface for legislative offices serving constituencies with significant artisan populations or craft clusters. 
              </p>
              <p>
                Many constituencies contain craft villages, artisan-dependent households, informal but skilled labor economies, and traditional industries under pressure. Yet these realities often remain undocumented at policy level. 
              </p>
              <p>
                This desk helps your office to present constituency-specific craft needs clearly. Show ongoing efforts and constraints without exaggeration. Reduce misinformation by publishing verified updates. Support policy attention based on facts, not noise.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F6F2EC]/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
              
              <h3 className="font-black text-white text-2xl mb-8 relative z-10">It allows your office to:</h3>
              
              <ul className="space-y-6 relative z-10">
                {[
                  "Officially document artisan realities in your constituency",
                  "Publish verified updates on craft-related work and priorities",
                  "Make artisan issues visible to departments, institutions, and stakeholders",
                  "Create transparency without political messaging or campaigning"
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full border border-[#F6F2EC]/30 flex items-center justify-center shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-[#F6F2EC]" />
                    </div>
                    <span className="text-stone-300 font-medium leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-[#F6F2EC]/10 p-8 rounded-3xl border border-[#F6F2EC]/20 flex flex-col md:flex-row items-center gap-8 mb-16 shadow-lg">
              <div className="w-16 h-16 shrink-0 bg-[#F6F2EC] rounded-full flex items-center justify-center text-[#050A1E] font-black text-2xl">
                !
              </div>
              <div>
                <h4 className="text-white font-black text-xl mb-2">
                  Important Clarification
                </h4>
                <p className="text-stone-300 leading-relaxed font-medium">
                  This is not a social media platform and not a press outlet. It is a sector-specific documentation and coordination tool focused purely on handicrafts and artisan livelihoods.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 justify-center">
              <Link
                href="/research/lobbying/explore"
                className="inline-flex items-center gap-4 bg-[#F6F2EC] hover:bg-white text-[#050A1E] px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[13px] transition-all duration-300 shadow-xl shadow-[#F6F2EC]/20 group"
              >
                <span>Explore in detail about the Program</span>
                <FaArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-10">
          <p className="text-sm text-gray-500 italic text-center max-w-4xl mx-auto">
            KHCRF policy positions are developed in furtherance of its public-interest mission and are not adopted to advance the commercial interests of any individual member, donor, partner, affiliated platform or enterprise.
          </p>
        </div>
      </section>
    </div>
  );
}
