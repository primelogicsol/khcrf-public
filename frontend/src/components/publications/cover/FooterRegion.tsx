import React from 'react';
import Image from 'next/image';
import { HCRFCoverTokens } from '../tokens/cover-tokens';

interface FooterRegionProps {
  edition?: string;
  publicationCode?: string;
  isbn?: string;
}

export default function FooterRegion({ edition, publicationCode, isbn }: FooterRegionProps) {
  return (
    <div 
      className="absolute w-full left-0"
      style={{ 
        top: HCRFCoverTokens.footerStart, 
        height: "24%",
      }}
    >
      {/* 1. Official KHCRF Book Cover Logo */}
      <div 
        className="cover-logo absolute left-1/2 -translate-x-1/2 aspect-square"
        style={{ 
          top: HCRFCoverTokens.footerLogoTop, 
          width: HCRFCoverTokens.logoMaxWidth,
        }}
      >
        <Image
          src="/assets/images/book_cover_logo.png"
          alt="KHCRF Press Logo"
          fill
          priority
          draggable={false}
          className="object-contain"
        />
      </div>

      {/* 2. Publisher */}
      <div 
        className="absolute w-full text-center"
        style={{ top: HCRFCoverTokens.footerPublisherTop }}
      >
        <span 
          className="font-serif font-bold uppercase text-[#b89557] leading-none"
          style={{ fontSize: "clamp(12px, 2.8cqw, 28px)" }}
        >
          KHCRF PRESS
        </span>
      </div>

      {/* 3. Division */}
      <div 
        className="absolute w-full text-center"
        style={{ top: HCRFCoverTokens.footerDivisionTop }}
      >
        <span 
          className="font-sans font-normal text-[rgba(255,255,255,0.72)] leading-none"
          style={{ 
            fontSize: "clamp(8px, 1.3cqw, 13px)", 
          }}
        >
          Publishing Division of Hamadan Craft Revival Foundation
        </span>
      </div>

      {/* 4. Edition */}
      {edition && (
        <div 
          className="absolute w-full text-center"
          style={{ top: HCRFCoverTokens.footerEditionTop }}
        >
          <span 
            className="font-sans font-bold uppercase text-[#b89557] leading-none"
            style={{ 
              fontSize: "clamp(8px, 1.4cqw, 14px)",
              letterSpacing: "0.16em"
            }}
          >
            {edition}
          </span>
        </div>
      )}

      {/* 5. Publication Code */}
      {publicationCode && (
        <div 
          className="absolute w-full text-center"
          style={{ top: HCRFCoverTokens.footerCodeTop }}
        >
          <span 
            className="font-sans font-normal text-[rgba(255,255,255,0.65)] leading-none"
            style={{ fontSize: "clamp(8px, 1.3cqw, 13px)" }}
          >
            {publicationCode}
          </span>
        </div>
      )}
      
      {/* ISBN (if needed) */}
      {isbn && !publicationCode && (
        <div 
          className="absolute w-full text-center"
          style={{ top: HCRFCoverTokens.footerCodeTop }}
        >
          <span 
            className="font-mono text-white/50 leading-none"
            style={{ fontSize: "clamp(6px, 1.2cqw, 12px)", letterSpacing: "2px" }}
          >
            {isbn}
          </span>
        </div>
      )}
    </div>
  );
}
