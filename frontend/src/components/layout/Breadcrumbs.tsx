import React from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  theme?: "light" | "dark";
  className?: string;
}

export function Breadcrumbs({ items, theme = "dark", className = "" }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  const textColor = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const hoverColor = theme === "dark" ? "hover:text-white" : "hover:text-[#050A1E]";
  const activeColor = theme === "dark" ? "text-white" : "text-[#050A1E]";
  const separatorColor = theme === "dark" ? "text-gray-500" : "text-gray-400";
  const focusRing = theme === "dark" ? "focus-visible:ring-[var(--ring-focus-on-dark)]" : "focus-visible:ring-[var(--ring-focus-on-light)]";

  return (
    <nav aria-label="Breadcrumb" className={`w-full overflow-hidden ${className}`}>
      <ol className="flex items-center space-x-2 text-[var(--text-breadcrumb)] font-medium whitespace-nowrap overflow-hidden text-ellipsis">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={item.href}>
              <li className="flex items-center min-w-0">
                {isLast ? (
                  <span 
                    className={`${activeColor} truncate`}
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link 
                    href={item.href}
                    className={`${textColor} ${hoverColor} transition-colors outline-none ${focusRing} focus-visible:ring-2 focus-visible:ring-offset-2 rounded-sm truncate`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
              {!isLast && (
                <li className={`flex-shrink-0 ${separatorColor}`} aria-hidden="true">
                  <Icon name="chevron-right" size="sm" tone="inherit" />
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
