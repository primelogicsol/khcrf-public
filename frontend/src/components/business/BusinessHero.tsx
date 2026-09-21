"use client";

interface BusinessHeroProps {
  title: string;
  highlight: string;
  subtitle: string;
  imagePath?: string;
  category?: string;
}

import HeroBackground from "../hero/HeroBackground";

export default function BusinessHero({
  title,
  highlight,
  subtitle,
  imagePath,
  category,
}: BusinessHeroProps) {
  return (
    <section className="relative min-h-[50vh] md:h-[60vh] flex items-center overflow-hidden font-manrope">
      {/* Background */}
      <HeroBackground />

      <div className="relative z-10 container mx-auto px-4 md:px-10 py-16 md:py-0">
        <div className="max-w-4xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 md:px-4 mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse"></span>
            <span className="text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
              {category != null ? category : "Business Support"}
            </span>
          </div>

          <h1 className="text-3xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
            {title} <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-secondary to-white">
              {highlight}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 font-light max-w-2xl leading-relaxed border-l-4 border-[var(--card-left-accent)] pl-4 md:pl-6">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
