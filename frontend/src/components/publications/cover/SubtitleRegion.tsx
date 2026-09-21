import React from 'react';
import { HCRFCoverTokens } from '../tokens/cover-tokens';

interface SubtitleRegionProps {
  subtitle?: string | null;
}

export default function SubtitleRegion({ subtitle }: SubtitleRegionProps) {
  return (
    <div 
      className="cover-subtitle-region font-sans uppercase text-white/70 font-medium"
      style={{
        position: "absolute",
        left: "12%",
        right: "12%",
        top: HCRFCoverTokens.subtitleTop,
        maxHeight: `calc(2 * ${HCRFCoverTokens.subtitleLineHeight}em)`,
        overflow: "hidden",
        textAlign: "center",
        lineHeight: HCRFCoverTokens.subtitleLineHeight,
        fontSize: "clamp(9px, 1.8cqw, 18px)",
        letterSpacing: "1px"
      }}
    >
      {subtitle}
    </div>
  );
}
