'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const peopleItems = [
  {
    label: "Master Artisans",
    href: "/master-artisans/artisans",
    matchCheck: (p: string) => p === "/master-artisans/artisans"
  },
  {
    label: "Living Legends",
    href: "/master-artisans/artisans/living-legends",
    matchCheck: (p: string) => p === "/master-artisans/artisans/living-legends"
  },
  {
    label: "Women Artisans",
    href: "/master-artisans/artisans/women-artisans",
    matchCheck: (p: string) => p === "/master-artisans/artisans/women-artisans"
  },
  {
    label: "Next Generation",
    href: "/master-artisans/artisans/emerging-artisans", // Defaults to emerging
    matchCheck: (p: string) => p.startsWith("/master-artisans/artisans/emerging-artisans") || p.startsWith("/master-artisans/artisans/apprentices")
  },
];

export default function PeopleGroupSwitcher() {
  const pathname = usePathname();

  const isMatch = pathname ? peopleItems.some(item => item.matchCheck(pathname)) : false;

  if (!isMatch) return null;

  return (
    <div className="w-full bg-[#FAF9F6] border-b border-gray-200 relative z-[45]">
      <div className="container-fluid mx-auto px-4 md:px-10 pt-10 pb-5">
        <div className="flex flex-wrap items-center gap-8 md:gap-14">
          {peopleItems.map((item) => {
            const isActive = pathname ? item.matchCheck(pathname) : false;
            return (
              <Link 
                key={item.label}
                href={item.href}
                className={`relative text-sm md:text-base font-bold uppercase tracking-[0.15em] transition-colors duration-500 ${
                  isActive ? 'text-[#2A2A2A]' : 'text-gray-400 hover:text-[#2A2A2A]'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.div 
                    layoutId="activePeopleTab" 
                    className="absolute -bottom-[21px] left-0 right-0 h-[3px] bg-[#D4AF37]" 
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
