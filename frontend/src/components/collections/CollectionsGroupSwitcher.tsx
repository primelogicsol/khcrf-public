'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const collectionGroups = {
  heritage: {
    label: "Heritage & Museum",
    items: [
      {
        label: "Heritage Collections",
        href: "/master-artisans/collections",
        exact: true
      },
      {
        label: "Museum Archive",
        href: "/master-artisans/collections/museum-archive",
        exact: false
      },
    ],
  },
  masterpieces: {
    label: "Masterpieces & Rare Objects",
    items: [
      {
        label: "Signature Masterpieces",
        href: "/master-artisans/collections/signature-masterpieces",
        exact: false
      },
      {
        label: "Rare Objects",
        href: "/master-artisans/collections/rare-objects",
        exact: false
      },
    ],
  },
};

export default function CollectionsGroupSwitcher() {
  const pathname = usePathname();

  // Find the active group
  let activeGroup = null;
  for (const key in collectionGroups) {
    const group = collectionGroups[key as keyof typeof collectionGroups];
    const isMatch = group.items.some(item => 
      item.exact ? pathname === item.href : pathname?.startsWith(item.href)
    );
    if (isMatch) {
      activeGroup = group;
      break;
    }
  }

  if (!activeGroup) return null;

  return (
    <div className="w-full bg-[#050505] border-b border-white/10 relative z-30">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 md:gap-10 overflow-x-auto scrollbar-hide py-4">
          <div className="text-[10px] md:text-[11px] font-sans tracking-[0.2em] text-[#B8860B] uppercase font-bold whitespace-nowrap hidden md:block mr-2">
            {activeGroup.label}
          </div>
          {activeGroup.items.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
            return (
              <Link 
                key={item.label}
                href={item.href}
                className={`relative text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] whitespace-nowrap transition-colors duration-300 ${
                  isActive ? 'text-white' : 'text-gray-500 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.div 
                    layoutId="activeCollectionTab" 
                    className="absolute -bottom-[16px] left-0 right-0 h-[2px] bg-[#B8860B]" 
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
