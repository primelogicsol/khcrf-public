import React from 'react';
import Image from 'next/image';

interface HCRFCoverCanvasProps {
  children: React.ReactNode;
}

export default function HCRFCoverCanvas({ children }: HCRFCoverCanvasProps) {
  return (
    <div 
      className="relative w-full overflow-hidden shadow-[0_20px_40px_rgb(0,0,0,0.12)] bg-[#0d1629]"
      style={{ 
        aspectRatio: "2/3", 
        borderRadius: "0.5rem",
        containerType: "inline-size" // Enables cqw units for child typography
      }}
    >
      <Image
        src="/assets/images/book_cover_final_approval.png"
        alt="KHCRF Press Master Cover"
        fill
        priority
        draggable={false}
        className="object-cover z-0 select-none pointer-events-none"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div className="absolute inset-0 z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
