import React from 'react';

interface HeaderRegionProps {
  publicationType: string;
  year: string;
}

export default function HeaderRegion({ publicationType, year }: HeaderRegionProps) {
  return (
    <div 
      className="absolute w-full flex items-center justify-center text-center left-0"
      style={{ 
        top: "10.666%", 
        height: "2.666%" 
      }}
    >
      <span 
        className="font-sans uppercase font-semibold text-[#b89557]"
        style={{ 
          fontSize: "clamp(8px, 1.6cqw, 16px)", 
          letterSpacing: "0.2em" // approx 3px on 16px font
        }}
      >
        {publicationType} | {year}
      </span>
    </div>
  );
}
