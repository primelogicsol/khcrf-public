'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const knowledgeGroups = {
  tools: {
    label: "Tools, Materials & Dyes",
    items: [
      {
        label: "Tools & Materials",
        href: "/master-artisans/tools-materials",
        exact: false
      },
      {
        label: "Natural Dyes",
        href: "/master-artisans/natural-dyes",
        exact: false
      },
    ],
  },
  motifs: {
    label: "Motifs, Symbols & Glossary",
    items: [
      {
        label: "Motifs & Symbols",
        href: "/master-artisans/motifs-symbols",
        exact: false
      },
      {
        label: "Glossary",
        href: "/master-artisans/knowledge/glossary",
        exact: false
      },
    ],
  },
};

export default function KnowledgeGroupSwitcher() {
  const pathname = usePathname();

  let activeGroup = null;
  for (const key in knowledgeGroups) {
    const group = knowledgeGroups[key as keyof typeof knowledgeGroups];
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
                    layoutId="activeKnowledgeTab" 
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
