import React from "react";
import Link from "next/link";
import { Breadcrumbs, BreadcrumbItem } from "./Breadcrumbs";

export type HeroVariant = "institutional" | "editorial" | "image-led" | "compact" | "homepage";
export type HeaderMode = "solid" | "overlay";
export type OverlayStrength = "subtle" | "standard" | "strong" | "editorial";

export interface PageHeroData {
  variant: HeroVariant;
  eyebrow?: string;
  title: string;
  summary?: string;
  image?: {
    src: string;
    alt: string;
    focalPoint?: { x: number; y: number };
  };
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  headerMode?: HeaderMode;
  overlay?: OverlayStrength;
  breadcrumbs?: BreadcrumbItem[];
}

export function PageHero({ data }: { data: PageHeroData }) {
  const {
    variant,
    eyebrow,
    title,
    summary,
    image,
    primaryAction,
    secondaryAction,
    headerMode = "solid",
    overlay = "standard",
    breadcrumbs,
  } = data;

  // Determine height classes based on variant
  let heightClass = "";
  switch (variant) {
    case "institutional":
      heightClass = "min-h-[300px] h-auto md:h-[min(440px,50vh)]";
      break;
    case "editorial":
      heightClass = "min-h-[340px] h-auto md:h-[min(560px,60vh)]";
      break;
    case "image-led":
      heightClass = "min-h-[380px] h-auto md:h-[min(620px,70vh)]";
      break;
    case "compact":
      heightClass = "min-h-[220px] h-auto md:h-[min(320px,40vh)]";
      break;
    case "homepage":
      heightClass = "min-h-[480px] h-auto md:h-[min(720px,80vh)]";
      break;
  }

  // Padding compensation if header is overlay (assuming ~104px total header height for desktop, 64px sticky)
  // Actually, standardizing on a uniform pt ensures content clears the header
  const overlayPadding = headerMode === "overlay" ? "pt-[104px] md:pt-[120px]" : "pt-8";

  // Overlay classes mapping to semantic CSS variables
  let overlayStyle: React.CSSProperties = {};
  if (image) {
    overlayStyle.background = `var(--overlay-${variant === 'editorial' ? 'editorial' : 'hero-' + overlay})`;
  }

  // Institutional variant uses controlled navy if no image
  const containerBg = image ? "bg-gray-900" : (variant === "institutional" || variant === "homepage") ? "bg-[#050A1E]" : "bg-gray-100";
  const textColor = (image || variant === "institutional" || variant === "homepage") ? "text-white" : "text-[#050A1E]";
  const summaryColor = (image || variant === "institutional" || variant === "homepage") ? "text-gray-200" : "text-gray-700";
  const focusRing = (image || variant === "institutional" || variant === "homepage") ? "focus-visible:ring-[var(--ring-focus-on-dark)]" : "focus-visible:ring-[var(--ring-focus-on-light)]";

  return (
    <div className={`relative w-full flex flex-col justify-end pb-12 px-4 md:px-8 xl:px-12 ${heightClass} ${overlayPadding} ${containerBg} overflow-hidden`}>
      {/* Background Image */}
      {image && (
        <>
          <img
            src={image.src}
            alt={image.alt || ""}
            className="absolute inset-0 w-full h-full object-cover z-0"
            style={{ 
              objectPosition: image.focalPoint ? `${image.focalPoint.x}% ${image.focalPoint.y}%` : 'center center'
            }}
            fetchPriority="high" // Hero image
          />
          <div 
            className="absolute inset-0 z-[1]"
            style={overlayStyle}
            aria-hidden="true"
          />
        </>
      )}

      {/* Content Plane */}
      <div className={`relative z-10 w-full max-w-[1400px] mx-auto flex flex-col gap-6 ${textColor}`}>
        
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mb-2">
            <Breadcrumbs 
              items={breadcrumbs} 
              theme={(image || variant === "institutional" || variant === "homepage") ? "dark" : "light"} 
            />
          </div>
        )}

        <div className="flex flex-col gap-4 max-w-3xl">
          {eyebrow && (
            <span className="text-[var(--text-eyebrow)] font-bold uppercase tracking-widest text-[#F6F2EC]">
              {eyebrow}
            </span>
          )}
          
          <h1 className="text-[var(--text-hero-title)] leading-tight font-serif tracking-tight" style={{ maxWidth: '22ch' }}>
            {title}
          </h1>

          {summary && (
            <p className={`text-[var(--text-page-lead)] leading-relaxed mt-2 max-w-[65ch] ${summaryColor}`}>
              {summary}
            </p>
          )}
        </div>

        {/* Actions */}
        {(primaryAction || secondaryAction) && (
          <div className="flex flex-wrap items-center gap-4 mt-4">
            {primaryAction && (
              <Link 
                href={primaryAction.href}
                className={`flex h-[44px] px-8 items-center justify-center font-bold text-sm tracking-wide rounded transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${focusRing} ${
                  image || variant === "institutional" || variant === "homepage" 
                    ? "bg-[#F6F2EC] text-[#050A1E] hover:bg-[#dcc059]" 
                    : "bg-[#050A1E] text-white hover:bg-gray-800"
                }`}
              >
                {primaryAction.label}
              </Link>
            )}
            {secondaryAction && (
              <Link 
                href={secondaryAction.href}
                className={`flex h-[44px] px-8 items-center justify-center font-bold text-sm tracking-wide rounded border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${focusRing} ${
                  image || variant === "institutional" || variant === "homepage" 
                    ? "border-white/30 text-white hover:bg-white/10" 
                    : "border-gray-300 text-[#050A1E] hover:bg-gray-100"
                }`}
              >
                {secondaryAction.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
