import React from 'react';

interface TitleRegionProps {
  title: string;
  subtitle?: string | null;
}

import { HCRFCoverTokens } from '../tokens/cover-tokens';

export default function TitleRegion({ title }: TitleRegionProps) {
  // Always use a fixed font size instead of shrinking
  const titleSize = "clamp(16px, 7.2cqw, 72px)";

  // Helper to force exactly 4 lines
  const getFourLines = (text: string): string[] => {
    if (!text) return ['', '', '', ''];
    
    // If it already has manual line breaks
    if (text.includes('\n')) {
      const parts = text.split('\n').map(p => p.trim());
      while (parts.length < 4) parts.push('');
      if (parts.length > 4) {
        parts[3] = parts.slice(3).join(' ');
        parts.length = 4;
      }
      return parts;
    }

    // Otherwise, split into words and distribute across 4 lines
    const words = text.trim().split(/\s+/);
    if (words.length <= 4) {
      const lines = ['', '', '', ''];
      words.forEach((w, i) => lines[i] = w);
      return lines;
    }

    const lines = ['', '', '', ''];
    const wordsPerLine = Math.ceil(words.length / 4);
    let wordIdx = 0;
    for (let i = 0; i < 4; i++) {
      const lineWords = [];
      const target = i === 3 ? words.length - wordIdx : Math.round((words.length - wordIdx) / (4 - i));
      for (let j = 0; j < target && wordIdx < words.length; j++) {
        lineWords.push(words[wordIdx++]);
      }
      lines[i] = lineWords.join(' ');
    }
    return lines;
  };

  const lines = getFourLines(title);

  return (
    <div 
      className="cover-title-region absolute flex flex-col items-center justify-between text-center left-1/2 -translate-x-1/2"
      style={{ 
        top: HCRFCoverTokens.titleTop, 
        height: HCRFCoverTokens.titleMaxHeight,
        width: HCRFCoverTokens.titleMaxWidth,
      }}
    >
      <h2 
        className="font-serif uppercase font-bold text-[#b89557] flex flex-col justify-between w-full h-full"
        style={{ 
          fontSize: titleSize,
          lineHeight: "1.08",
          letterSpacing: "0.3px",
          textShadow: "0px 2px 4px rgba(0,0,0,0.5)",
        }}
      >
        {lines.map((line, idx) => (
          <span key={idx} className="block w-full">{line || '\u00A0'}</span>
        ))}
      </h2>
    </div>
  );
}
