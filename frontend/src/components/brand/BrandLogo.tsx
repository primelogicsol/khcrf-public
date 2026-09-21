import React from 'react';

export type LogoVariant = 
  | 'primary-full'
  | 'primary-light'
  | 'wordmark'
  | 'symbol-only'
  | 'mobile'
  | 'sticky'
  | 'footer'
  | 'auth'
  | 'dashboard'
  | 'print'
  | 'favicon'
  | 'og-mark';

export type LogoSurface = 'light' | 'dark' | 'auto';
export type LogoSize = 'sm' | 'md' | 'lg' | 'xl';
export type LogoContext = 'header' | 'footer' | 'content' | 'ui' | 'decorative';

export interface BrandLogoProps {
  variant?: LogoVariant;
  surface?: LogoSurface;
  context?: LogoContext;
  size?: LogoSize;
  priority?: boolean; // For LCP image prioritization
  className?: string;
  decorative?: boolean; // If true, alt=""
  altText?: string; 
}

const DEFAULT_ALT_TEXT = "Hamadan Craft Revival Foundation";

export function BrandLogo({
  variant = 'primary-full',
  surface = 'light',
  context = 'header',
  size = 'md',
  priority = false,
  className = '',
  decorative = false,
  altText
}: BrandLogoProps) {
  // Map variant and surface to actual asset paths.
  // In Phase 2B, these are placeholder paths until the asset audit defines exact paths.
  
  const getLogoPath = (v: LogoVariant, s: LogoSurface) => {
    // Placeholder resolution logic for testing in fixtures
    if (s === 'dark') {
      return `/assets/logos/${v}-white.svg`;
    }
    return `/assets/logos/${v}-navy.svg`;
  };

  const src = getLogoPath(variant, surface);
  const alt = decorative ? "" : (altText || DEFAULT_ALT_TEXT);

  // Use standard intrinsic dimensions based on variant and size to prevent CLS
  const dimensions = {
    'primary-full': { width: 300, height: 80 },
    'wordmark': { width: 250, height: 60 },
    'symbol-only': { width: 64, height: 64 },
  };

  const defaultDims = dimensions[variant as keyof typeof dimensions] || dimensions['primary-full'];
  
  // A scale factor based on size prop
  const scaleMap = { sm: 0.75, md: 1, lg: 1.5, xl: 2 };
  const scale = scaleMap[size];

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <img
        src={src}
        alt={alt}
        width={defaultDims.width * scale}
        height={defaultDims.height * scale}
        style={{ aspectRatio: `${defaultDims.width}/${defaultDims.height}` }}
        className="object-contain"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </div>
  );
}
