"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaGlobe, FaCertificate, FaUsers, FaChartLine } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { globalStatistics } from "@/config/statistics";

const GREETINGS = [
  { word: "Welcome", lang: "English" },
  { word: "Khushamdeed", lang: "Kashmiri / Persian" },
  { word: "Bienvenue", lang: "French" },
  { word: "Benvenuto", lang: "Italian" },
  { word: "ようこそ", lang: "Japanese" },
  { word: "أهلاً وسهلاً", lang: "Arabic" },
];

const MILESTONES = [
  {
    tag: "UNESCO Recognition",
    title: "Creative Cities Network",
    metric: "50 cities worldwide",
    desc: "With Srinagar at its cultural heart, Kashmir stands among the prestigious global network of cities represented in UNESCO’s Creative Cities Network under the Crafts and Folk Art category, affirming its civilizational place in the global heritage of master craftsmanship, design, and folk tradition.",
    icon: <FaGlobe data-ui-icon  className="" />
  },
  {
    tag: "WCC AISBL World Crafts Council",
    title: "World Craft Cities",
    metric: "63 cities recognized",
    desc: "Kashmir is honored within the global community of 63 World Craft Cities recognized by the World Craft Council. This prestigious title reinforces Kashmir’s place as an international epicenter of artisanal excellence, living craft heritage, and sustainable cooperative development.",
    icon: <FaCertificate data-ui-icon  className="" />
  },
  {
    tag: "Historic Trade Legacy",
    title: "Kashmir: Enduring Legacy of the Silk Route",
    metric: "1st Cent. BCE",
    desc: "From the 1st Century BCE to the 15th Century CE, Kashmir stood at the heart of the Silk Route, where craft, culture, and commerce converged. Through silk, shawls, woodcraft, and artisanal knowledge systems, Kashmir shaped a lasting legacy of transcontinental exchange.",
    icon: <FaChartLine data-ui-icon  className="" />
  },
  {
    tag: "1st Labour Rights Movement",
    title: "World’s Earliest Recorded Artisan-Labour Movement",
    metric: "1865 Precedent",
    desc: "A historic testament to sacrifice in the defense of artisanal dignity and the moral value of labour. Across generations, Kashmiri craftsmen endured hardship to preserve skill, identity, and the enduring worth of handmade labour within Kashmir’s craft heritage.",
    icon: <FaUsers data-ui-icon  className="" />
  },
  {
    tag: "Sanctuary of Artisans Center",
    title: "Kashmir: World Capital & Sanctuary of Artisans",
    metric: `${globalStatistics.craftArtisans > 0 ? globalStatistics.craftArtisans + '+' : '0'} Artisans`,
    desc: `Home to ${globalStatistics.craftArtisans > 0 ? 'more than ' + globalStatistics.craftArtisans : '0'} artisans, Kashmir remains a living center of inherited skill, cultural memory, and handmade excellence. Its craft traditions continue to sustain families, communities, and the region's enduring cultural, artistic, and civilizational heritage.`,
    icon: <FaUsers data-ui-icon  className="" />
  }
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  const [greetingIndex, setGreetingIndex] = useState(0);
  const [fadeState, setFadeState] = useState("opacity-100");

  const [milestoneIndex, setMilestoneIndex] = useState(0);
  const [slideAnimClass, setSlideAnimClass] = useState("opacity-100 translate-x-0");

  useEffect(() => {
    const greetingInterval = setInterval(() => {
      setFadeState("opacity-0 transition-opacity duration-500");
      setTimeout(() => {
        setGreetingIndex((prev) => (prev + 1) % GREETINGS.length);
        setFadeState("opacity-100 transition-opacity duration-500");
      }, 500);
    }, 4500);

    return () => clearInterval(greetingInterval);
  }, []);

  const triggerTransition = (nextIndex: number, direction: "next" | "prev") => {
    const slideOutClass = direction === "next" 
      ? "opacity-0 -translate-x-3 transition-all duration-200" 
      : "opacity-0 translate-x-3 transition-all duration-200";
    
    setSlideAnimClass(slideOutClass);
    
    setTimeout(() => {
      setMilestoneIndex(nextIndex);
      const startInClass = direction === "next" 
        ? "opacity-0 translate-x-3" 
        : "opacity-0 -translate-x-3";
      
      setSlideAnimClass(startInClass);
      
      setTimeout(() => {
        setSlideAnimClass("opacity-100 translate-x-0 transition-all duration-300");
      }, 50);
    }, 200);
  };

  const handleNext = () => {
    const nextIdx = (milestoneIndex + 1) % MILESTONES.length;
    triggerTransition(nextIdx, "next");
  };

  const handlePrev = () => {
    const prevIdx = (milestoneIndex - 1 + MILESTONES.length) % MILESTONES.length;
    triggerTransition(prevIdx, "prev");
  };

  useEffect(() => {
    const milestoneInterval = setInterval(() => {
      handleNext();
    }, 9000);

    return () => clearInterval(milestoneInterval);
  }, [milestoneIndex]);

  // Lift Tawk.to chat widget on auth pages to avoid overlapping forms/buttons
  useEffect(() => {
    if (typeof window !== "undefined") {
      interface TawkStyle {
        visibility?: {
          desktop?: { xOffset?: number; yOffset?: number };
          mobile?: { xOffset?: number; yOffset?: number };
        };
      }
      interface TawkWidget {
        customStyle?: TawkStyle;
        updateSettings?: () => void;
      }
      
      const windowWithTawk = window as unknown as { Tawk_API?: TawkWidget };
      windowWithTawk.Tawk_API = windowWithTawk.Tawk_API || {};
      
      // Save original custom style if any to restore later
      const originalStyle = windowWithTawk.Tawk_API.customStyle;
      
      // Lift the widget up by 96px on mobile (matching our pb-24 padding)
      windowWithTawk.Tawk_API.customStyle = {
        visibility: {
          desktop: {
            xOffset: 20,
            yOffset: 20
          },
          mobile: {
            xOffset: 15,
            yOffset: 96
          }
        }
      };

      // If already initialized, update settings
      if (typeof windowWithTawk.Tawk_API.updateSettings === "function") {
        windowWithTawk.Tawk_API.updateSettings();
      }

      return () => {
        if (windowWithTawk.Tawk_API) {
          windowWithTawk.Tawk_API.customStyle = originalStyle;
          if (typeof windowWithTawk.Tawk_API.updateSettings === "function") {
            windowWithTawk.Tawk_API.updateSettings();
          }
        }
      };
    }
  }, []);

  return (
    <main className="min-h-screen bg-stone-50 flex flex-col-reverse md:grid md:grid-cols-12 relative overflow-hidden md:overflow-visible">
      {/* Inline styles for clean, non-intrusive micro-animations */}
      <style>{`
        @keyframes slowZoom {
          0%, 100% { transform: scale(1.01); }
          50% { transform: scale(1.03); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slow-zoom {
          animation: slowZoom 25s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Left Column: Visual/Brand Section */}
      <section className="relative min-h-[260px] overflow-hidden bg-brand-dark text-white shadow-2xl md:col-span-7 md:min-h-screen flex flex-col">
        {/* Background Image with slow ambient zoom animation */}
        <div className="absolute inset-0 z-0 select-none auth-visual">
          <Image
            src="/assets/images/artisan-portrait.jpg"
            alt="Kashmiri Master Artisan Portrait"
            fill
            priority
            className="object-cover opacity-35 animate-slow-zoom"
          />
        </div>

        {/* Compact Mobile/Tablet Identity Panel (shown below 768px) */}
        <div className="relative flex min-h-[260px] flex-col justify-between p-6 md:hidden z-20 w-full h-full grow">
          {/* Brand Header */}
          <Link href="/" className="group flex items-center space-x-3.5">
            <div className="w-11 h-11 overflow-hidden flex items-center justify-center relative select-none shrink-0">
              <Image
                src="/assets/images/HCRF_LOGO_1.png"
                alt="KHCRF Logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-col select-none">
              <h1 className="text-xl font-black uppercase tracking-[0.06em] text-white leading-none">
                Hamadan
              </h1>
              <span className="text-[9px] font-semibold text-stone-200 mt-1 leading-none">
                Craft Revival Foundation
              </span>
            </div>
          </Link>

          {/* Mobile Title & Statement */}
          <div className="space-y-2 mt-auto">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-[0.08em] block leading-none auth-eyebrow">
                GLOBAL KNOWLEDGE PLATFORM
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white leading-tight">
              Preserving Craft.
              <br />
              Advancing Knowledge.
            </h2>
          </div>
        </div>

        {/* Full Desktop Institutional Panel (shown at 768px and above) */}
        <div className="hidden md:flex flex-col justify-between p-10 xl:p-12 relative z-20 w-full grow md:min-h-screen">
          {/* Brand Header */}
          <div className="flex items-center justify-between">
            <Link href="/" className="group flex items-center space-x-5">
              {/* Logo Seal */}
              <div className="w-16 h-16 overflow-hidden flex items-center justify-center relative select-none shrink-0">
                <Image
                  src="/assets/images/HCRF_LOGO_1.png"
                  alt="KHCRF Logo"
                  fill
                  className="object-contain"
                />
              </div>
              {/* Institutional Wordmark */}
              <div className="flex flex-col w-fit select-none">
                <h1 className="text-[32.5px] font-black uppercase tracking-[0.06em] text-white leading-none whitespace-nowrap">
                  Hamadan
                </h1>
                <h2 
                  className="text-[13.8px] font-semibold text-stone-200 mt-1.5 leading-none w-full block text-justify select-none"
                  style={{ textAlignLast: "justify", textJustify: "inter-word" }}
                >
                  Craft Revival Foundation
                </h2>
              </div>
            </Link>
          </div>

          {/* Global Cycling Greeting and Mission statement */}
          <div className="max-w-md my-auto space-y-8 py-6">
            <div className="space-y-3">
              <div className="flex items-baseline space-x-3 select-none">
                <span className="text-[14px] font-black uppercase tracking-[0.08em] block leading-none auth-eyebrow">
                  GLOBAL KNOWLEDGE PLATFORM
                </span>
                <span className="text-[12px] font-bold text-stone-500 block leading-none select-none">•</span>
                <span className={`text-[11.5px] font-semibold uppercase tracking-[0.06em] block leading-none select-none auth-khushamdeed ${fadeState}`}>
                  {GREETINGS[greetingIndex].word}
                </span>
              </div>
              <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white">
                Preserving Craft.
                <br />
                Advancing Knowledge.
              </h2>
            </div>

            {/* Interactive Milestone Showcase Card */}
            <div className="border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md p-6 relative overflow-hidden shadow-lg h-[260px] flex flex-col justify-between select-none">
              <div className={`space-y-4 shrink-0 ${slideAnimClass}`}>
                <div className="flex items-center justify-between select-none h-6">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-md leading-none h-5 flex items-center shrink-0 auth-card-badge">
                    {MILESTONES[milestoneIndex].tag}
                  </span>
                  <span className="text-[10px] font-bold leading-none right-0 shrink-0 auth-card-meta">
                    {MILESTONES[milestoneIndex].metric}
                  </span>
                </div>
                
                {/* Heading: Locked to exactly 2 lines height */}
                <div className="h-[52px] flex items-center overflow-hidden">
                  <h3 className="text-[17px] font-black text-white leading-snug line-clamp-2">
                    {MILESTONES[milestoneIndex].title}
                  </h3>
                </div>

                {/* Body: Locked to exactly 4 lines height */}
                <div className="h-[72px] overflow-hidden">
                  <p className="text-stone-300 text-xs font-medium leading-relaxed line-clamp-4">
                    {MILESTONES[milestoneIndex].desc}
                  </p>
                </div>
              </div>
              
              {/* Page number & Clean Navigation */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5 text-[9px] font-black uppercase tracking-widest select-none h-5 shrink-0 auth-slider-counter">
                <span>0{milestoneIndex + 1} / 0{MILESTONES.length}</span>
                <div className="flex space-x-6 auth-slider-control">
                  <button 
                    onClick={handlePrev}
                    className="hover:text-white transition-colors cursor-pointer flex items-center"
                  >
                    &larr; Previous
                  </button>
                  <button 
                    onClick={handleNext}
                    className="hover:text-white transition-colors cursor-pointer flex items-center"
                  >
                    Next &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* International Statistics Grid */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10 select-none">
              <div className="flex items-center space-x-4 hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 auth-metric-icon">
                  <FaUsers className="text-lg" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-white leading-none">12,400+</h4>
                  <p className="text-[9px] font-bold uppercase tracking-wider mt-1 auth-card-meta">Artisans</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 auth-metric-icon">
                  <FaGlobe className="text-lg" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-white leading-none">28</h4>
                  <p className="text-[9px] font-bold uppercase tracking-wider mt-1 auth-card-meta">Export Corridors</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 auth-metric-icon">
                  <FaCertificate className="text-lg" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-white leading-none">100%</h4>
                  <p className="text-[9px] font-bold uppercase tracking-wider mt-1 auth-card-meta">GI Traceable</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 auth-metric-icon">
                  <FaChartLine className="text-lg" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-white leading-none">15,000+</h4>
                  <p className="text-[9px] text-stone-400 font-bold uppercase tracking-wider mt-1">Catalog Entries</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Brand Meta */}
          <div className="flex flex-col gap-2 text-[8.5px] xl:text-[9.5px] font-bold uppercase tracking-wider select-none pt-4 border-t border-white/5">
            <span className="text-center md:text-left auth-footer">© {new Date().getFullYear()} Hamadan Craft Revival Foundation</span>
            <span className="text-center md:text-left leading-normal auth-footer-locations">SRINAGAR • NEW DELHI • DUBAI • GENEVA • PARIS • WASHINGTON, DC • NEW YORK • BANGKOK</span>
          </div>
        </div>
      </section>

      {/* Right Column: Authentication Form with radial depth gradient */}
      <section className="flex flex-col justify-start md:justify-center items-center md:col-span-5 p-4 sm:p-8 md:p-12 relative bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-stone-50 via-stone-100/90 to-stone-200/50 min-h-[calc(100vh-260px)] md:min-h-screen pt-6 pb-24 md:py-12 w-full">
        {/* Login Card with fade-in-up animation on load */}
        <div 
          className="w-full max-w-md bg-transparent sm:bg-white border-0 sm:border border-stone-200/80 rounded-none sm:rounded-[2rem] px-0 py-2 sm:p-8 mt-0 sm:mt-2 z-10 animate-fade-in-up shrink-0 sm:shadow-[0_30px_90px_rgba(0,0,0,0.12)]"
        >
          {children}
        </div>

        {/* Global Recognition of Kashmir Craft Heritage Block (Pill Style 3x2 Grid) */}
        {isLoginPage && (
          <div className="w-full max-w-2xl mt-6 border-t border-stone-200/80 pt-4 space-y-4 z-10 select-none animate-fade-in-up shrink-0" style={{ animationDelay: "0.2s" }}>
            <div className="space-y-1 text-center">
              <span data-editorial-accent-text className="text-[9px] font-black  uppercase tracking-[0.18em] block leading-none">
                GLOBAL RECOGNITION
              </span>
              <h4 className="text-sm font-black tracking-wider text-brand-dark uppercase block leading-tight">
                Kashmir Craft Heritage
              </h4>
              <p className="text-stone-600 text-[10.5px] font-semibold leading-normal max-w-md mx-auto">
                International recognitions, historical milestones, and enduring cultural significance.
              </p>
            </div>

            {/* Outlined Pill Containers (Locked 3x2 Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-0.5 select-none w-full justify-center">
              {[
                { text: "UNESCO Creative Cities Network", icon: <FaGlobe className="text-stone-400 text-xs shrink-0" /> },
                { text: "World Craft Council Recognition", icon: <FaCertificate className="text-stone-400 text-xs shrink-0" /> },
                { text: "Silk Route Legacy", icon: <FaChartLine className="text-stone-400 text-xs shrink-0" /> },
                { text: "GI Craft Heritage", icon: <FaCertificate className="text-stone-400 text-xs shrink-0" /> },
                { text: "Living Artisan Traditions", icon: <FaUsers className="text-stone-400 text-xs shrink-0" /> },
                { text: "Historic Craft Civilization", icon: <FaGlobe className="text-stone-400 text-xs shrink-0" /> }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className="w-full h-10 rounded-full border border-stone-200/80 bg-white px-4 flex items-center space-x-2.5 shadow-2xs hover:shadow-xs hover:-translate-y-[1px] transition-all duration-300 cursor-default overflow-hidden"
                >
                  {item.icon}
                  <span className="text-stone-600 text-[9.5px] font-semibold tracking-wide whitespace-nowrap overflow-hidden text-ellipsis grow text-left">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
