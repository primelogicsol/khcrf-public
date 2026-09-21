"use client";

import Image from "next/image";
import HeroBackground from "./hero/HeroBackground";

import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

interface PageHeroProps {
    title: React.ReactNode;
    highlight?: string;
    subtitle?: string;
    description?: string;
    badge?: string;
    bgImage?: string;
    parentPage?: string;
    parentLink?: string;
    children?: React.ReactNode;
    align?: 'left' | 'center'; // Keep for backward compat, though design is left-focused
}

import { useHeroOverlay } from "@/components/layout/HeroOverlayProvider";
const PageHero = ({
    title,
    highlight,
    subtitle,
    description,
    badge,
    bgImage,
    parentPage,
    parentLink,
    children,
    align = 'left'
}: PageHeroProps) => {
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

    // Use highlight if available, otherwise use subtitle for the gradient text
    const displaySubtitle = highlight || subtitle;

    return (
        <section className="relative min-h-[50vh] md:h-[60vh] flex items-center bg-brand-dark overflow-hidden font-manrope">
            {/* Background */}
            {bgImage ? (
    <div className="absolute inset-0 z-0">
        <Image
            src={bgImage}
            alt="Hero Background"
            fill
            className="object-cover opacity-30 scale-105 animate-subtle-zoom"
            priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#000000]/80 to-transparent" />
    </div>
  ) : (
    <HeroBackground />
  )}

            <div className="relative z-10 container mx-auto px-4 md:px-10 pt-[calc(var(--header-height,140px)+2rem)] pb-16 md:pb-24">
                <div className="max-w-4xl">
                    {/* Parent Link / Breadcrumb */}
                    {(parentPage && parentLink) && (
                        <Link
                            href={parentLink}
                            className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors text-sm font-medium uppercase tracking-wider group"
                        >
                            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to {parentPage}
                        </Link>
                    )}

                    {badge && (
                        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 md:px-4 mb-6">
                            <span className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse"></span>
                            <span className="text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">{badge}</span>
                        </div>
                    )}

                    <h1 className="text-3xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
                        {title} <br />
                        {displaySubtitle && (
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-secondary to-brand-primary">{displaySubtitle}</span>
                        )}
                    </h1>

                    {description && (
                        <p className="text-lg md:text-xl text-gray-300 font-light max-w-2xl leading-relaxed border-l-4 border-[var(--card-left-accent)] pl-4 md:pl-6 mb-8">
                            {description}
                        </p>
                    )}

                    {children}
                </div>
            </div>
        </section>
    );
};

export default PageHero;
