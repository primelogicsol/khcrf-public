import React from "react";
import { FaSearch, FaFilter, FaPlus } from "react-icons/fa";
import Select from "@/components/common/Select";

interface FilterOption {
  key: string;
  label?: string; // Optional label for the select
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

interface DashboardControlsProps {
  onSearch?: (term: string) => void;
  searchValue?: string;
  filters?: FilterOption[];
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  placeholder?: string;
}

export default function DashboardControls({
  onSearch,
  searchValue,
  filters,
  primaryAction,
  placeholder = "Search...",
}: DashboardControlsProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-start md:items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center gap-4 flex-1 w-full md:w-auto">
        {onSearch && (
          <div className="relative flex-1 md:max-w-md">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={placeholder}
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all placeholder:text-gray-400 text-gray-700"
            />
          </div>
        )}

        {filters && filters.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            {/* Desktop Filters: Visible */}
            {filters.map((filter, idx) => (
              <div key={idx} className="min-w-[140px]">
                <Select
                  label={filter.label || ""}
                  options={filter.options}
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  className="!mb-0 !py-2 !text-sm"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 w-full md:w-auto">
        {/* Mobile Filters: Could go here or be hidden behind a modal if too many */}

        {primaryAction && (
          <button
            onClick={primaryAction.onClick}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white text-sm font-semibold rounded-lg hover:bg-brand-primary/90 transition-colors shadow-sm whitespace-nowrap w-full md:w-auto"
          >
            {primaryAction.icon || <FaPlus />}
            {primaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
}
