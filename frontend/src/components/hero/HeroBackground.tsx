import React from 'react';

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0 bg-[#050A1E] overflow-hidden pointer-events-none">
      {/* Deep Navy Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030614] to-[#050A1E]" />
      
      {/* Subtle Heritage Brown Illumination */}
      <div className="absolute -top-[30%] -right-[10%] w-[80%] h-[80%] rounded-full bg-[#6B2B08] opacity-[0.08] blur-[120px]" />
      <div className="absolute top-[40%] -left-[20%] w-[60%] h-[60%] rounded-full bg-[#6B2B08] opacity-[0.06] blur-[100px]" />
      
      {/* Optional Texture/Grid Overlay to give it an institutional feel */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Base Darkening Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050A1E] via-transparent to-black/30" />
    </div>
  );
}
