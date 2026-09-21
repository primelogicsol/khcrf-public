import React from 'react';
import { FaChevronDown } from 'react-icons/fa';

export interface ProjectAccordionProps {
  id: string;
  badgeText: string;
  title: string;
  purpose: string;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  col1Title: string;
  col1Items: string[];
  col2Title: string;
  col2Items: string[];
  col3Title: string;
  col3Items: string[];
}

export default function ProjectAccordion({
  id,
  badgeText,
  title,
  purpose,
  isExpanded,
  onToggle,
  col1Title,
  col1Items,
  col2Title,
  col2Items,
  col3Title,
  col3Items,
}: ProjectAccordionProps) {
  return (
    <div
      className={`group overflow-hidden rounded-3xl transition-all duration-500 border ${
        isExpanded
          ? 'bg-white ring-1 ring-brand-primary/20 shadow-2xl scale-[1.02]'
          : 'bg-white hover:bg-white/50 border-gray-100 hover:shadow-lg'
      }`}
    >
      {/* Header */}
      <div
        className="p-6 md:p-8 cursor-pointer flex items-center justify-between gap-6"
        onClick={() => onToggle(id)}
      >
        <div className="flex items-center gap-6">
          <div
            className={`shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center font-black text-xl md:text-2xl transition-colors duration-300 ${
              isExpanded
                ? 'bg-brand-primary text-white'
                : 'bg-gray-100 text-gray-400 group-hover:bg-brand-primary/10 group-hover:text-brand-primary'
            }`}
          >
            {badgeText}
          </div>
          <div>
            <h3
              className={`text-xl md:text-2xl font-black transition-colors duration-300 ${
                isExpanded ? 'text-brand-dark' : 'text-gray-600 group-hover:text-brand-dark'
              }`}
            >
              {title}
            </h3>
            <p
              className={`text-sm md:text-base font-medium mt-1 transition-colors duration-300 ${
                isExpanded ? 'text-brand-primary' : 'text-gray-400'
              }`}
            >
              {purpose}
            </p>
          </div>
        </div>
        <FaChevronDown
          data-ui-icon
          className={`shrink-0 text-gray-300 transform transition-transform duration-300 ${
            isExpanded ? 'rotate-180 ' : ''
          }`}
        />
      </div>

      {/* Expanded Content */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          isExpanded ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 md:px-8 pb-8 pt-2">
          <div className="w-full h-px bg-gray-100 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1 (Activities/Key Areas) */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span data-editorial-accent-bg className="h-3 w-3 rounded-full bg-brand-primary shrink-0 -translate-y-[1px]"></span>
                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                  {col1Title}
                </h4>
              </div>
              <ul className="space-y-3">
                {col1Items.map((item, idx) => (
                  <li key={idx} className="text-gray-600 text-sm font-medium flex items-center gap-2">
                    <span className="text-brand-primary/40 shrink-0">&#9632;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2 (Outputs) */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span data-editorial-accent-bg className="h-3 w-3 rounded-full bg-brand-primary shrink-0 -translate-y-[1px]"></span>
                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                  {col2Title}
                </h4>
              </div>
              <ul className="space-y-3">
                {col2Items.map((item, idx) => (
                  <li key={idx} className="text-gray-600 text-sm font-medium flex items-center gap-2">
                    <span className="text-brand-secondary/40 shrink-0">&#9632;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 (Stakeholders) */}
            {col3Items && col3Items.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span data-editorial-accent-bg className="h-3 w-3 rounded-full bg-brand-primary shrink-0 -translate-y-[1px]"></span>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                    {col3Title}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {col3Items.map((item, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-50 border border-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

