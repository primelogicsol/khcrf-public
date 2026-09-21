'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

const nextGenItems = [
  {
    label: "All",
    href: "/master-artisans/artisans/emerging-artisans?stage=all",
    matchCheck: (pathname: string, stage: string | null) => 
      (pathname.endsWith('/emerging-artisans') && stage === 'all')
  },
  {
    label: "Emerging Artisans",
    href: "/master-artisans/artisans/emerging-artisans",
    matchCheck: (pathname: string, stage: string | null) => 
      (pathname.endsWith('/emerging-artisans') && stage !== 'all')
  },
  {
    label: "Apprentices",
    href: "/master-artisans/artisans/apprentices",
    matchCheck: (pathname: string, stage: string | null) => 
      pathname.endsWith('/apprentices')
  }
];

function NextGenContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const stage = searchParams ? searchParams.get('stage') : null;

  const isMatch = pathname ? nextGenItems.some(item => pathname.startsWith('/master-artisans/artisans/emerging-artisans') || pathname.startsWith('/master-artisans/artisans/apprentices')) : false;

  if (!isMatch) return null;

  return (
    <div className="w-full bg-[#FAF9F6] relative z-40 mb-[-30px] pt-4 pb-2">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <div className="flex items-center gap-6 md:gap-8 overflow-x-auto scrollbar-hide">
          {nextGenItems.map((item) => {
            const isActive = pathname ? item.matchCheck(pathname, stage) : false;
            return (
              <Link 
                key={item.label}
                href={item.href}
                className={`text-[10px] md:text-xs font-bold uppercase tracking-[0.1em] whitespace-nowrap transition-colors duration-300 ${
                  isActive ? 'text-[#D4AF37]' : 'text-gray-400 hover:text-[#2A2A2A]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function NextGenerationSwitcher() {
  return (
    <Suspense fallback={null}>
      <NextGenContent />
    </Suspense>
  );
}
