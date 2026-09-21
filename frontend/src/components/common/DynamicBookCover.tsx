"use client";

import { useMemo } from "react";
import BookCoverDynamic from "./BookCoverDynamic";

interface DynamicBookCoverProps {
  title: string;
  subtitle?: string;
  author?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  variant?: number; // Optional override for cover image index (1-37)
  isbn?: string;
  isbnStatus?: string;
  edition?: string;
  publisher?: string;
  summaryPoints?: string[];
  coverImageUrl?: string | null;
}

export default function DynamicBookCover({
  title = "Untitled",
  subtitle = "",
  author,
  className = "",
  size = "md",
  variant,
  category = "BEST PRACTICE JOURNAL",
  isbn,
  isbnStatus,
  edition,
  publisher,
  summaryPoints,
  coverImageUrl,
}: DynamicBookCoverProps & { category?: string }) {
  // Dimensions map matching core sizing configs
  // 'full' expands to 100% width and height, setting a responsive font size so that the em units scale dynamically
  const sizeClasses = {
    sm: "w-28 h-44 text-[8px]",
    md: "w-40 h-64 text-[10px]",
    lg: "w-56 h-80 text-xs",
    xl: "w-72 h-[28rem] text-sm",
    full: "w-full h-full text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px]",
  };

  return (
    <div
      className={`
        relative shrink-0 overflow-hidden shadow-2xl rounded-r-md rounded-l-sm transform transition-transform hover:scale-[1.025]
        ${sizeClasses[size]} 
        ${className}
      `}
      style={{
        boxShadow:
          "4px 4px 12px rgba(0,0,0,0.3), inset 2px 0 4px rgba(255,255,255,0.1)",
        containerType: "size",
      }}
    >
      {coverImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img 
          src={coverImageUrl} 
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div 
          className="absolute inset-0 z-0"
          style={{
            fontSize: "clamp(8px, 4.8cqw, 24px)",
          }}
        >
          <BookCoverDynamic
            title={title}
            subtitle={subtitle}
            author={author || "KHCRF"}
            category={category}
            size={size}
            isbn={isbn}
            isbnStatus={isbnStatus}
            edition={edition}
            publisher={publisher}
            summaryPoints={summaryPoints}
          />
        </div>
      )}

      {/* Surface Shine/Texture overlay */}
      <div className="absolute inset-0 bg-linear-to-tr from-white/10 to-transparent pointer-events-none mix-blend-soft-light" />
    </div>
  );
}
