"use client";

import Image from "next/image";

import HeroBackground from "./hero/HeroBackground";

interface ResearchHeroProps {
    title: string;
    highlight: string;
    subtitle: string;
    imagePath?: string; // Kept for backwards compatibility but not rendered
}

import { useHeroOverlay } from "@/components/layout/HeroOverlayProvider";
export default function ResearchHero({ title, highlight, subtitle }: ResearchHeroProps) {
  const overlayContext = useHeroOverlay();
  useEffect(() => {
    if (overlayContext?.setOverlay) {
      overlayContext.setOverlay(true);
    }
    return () => {
      if (overlayContext?.setOverlay) {
        overlayContext.setOverlay(false);
      }
    };
  }, [overlayContext?.setOverlay]);

    return (
        <section className="relative min-h-[60vh] md:h-[70vh] flex items-center overflow-hidden font-manrope">
            {/* Background */}
            <HeroBackground />

            <div className="relative z-10 container mx-auto px-4 md:px-10 pt-[calc(var(--header-height,140px)+2rem)] pb-20 md:pb-24">
                <div className="max-w-4xl">
                    <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 md:px-4 mb-6 md:mb-8">
                        <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></span>
                        <span className="text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">Data-Driven Insights</span>
                    </div>

                    <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-white mb-6 md:mb-8 leading-tight md:leading-[0.95] tracking-tight">
                        {title} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-[#d4af37]">{highlight}</span>
                    </h1>

                    <p className="text-lg md:text-2xl text-gray-300 font-light max-w-2xl leading-relaxed border-l-4 border-[var(--card-left-accent)] pl-4 md:pl-6">
                        {subtitle}
                    </p>
                </div>
            </div>
        </section>
    );
}
