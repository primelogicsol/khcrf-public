"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaHome, FaChevronRight } from "react-icons/fa";

const SPECIAL_LABELS: Record<string, string> = {
  'hr': 'HR',
  'cms': 'CMS', 
  'skc': 'SKC',
  'cce-applications': 'CCE Applications',
  'cce': 'CCE',
  'ccsi': 'CCSI',
  'donations': 'Donations',
  'master-artisans': 'Master Artisans',
  'business': 'Business',
  'applications': 'Applications',
};

function formatLabel(segment: string) {
  if (SPECIAL_LABELS[segment]) {
    return SPECIAL_LABELS[segment];
  }
  
  // Check if it's a UUID or CUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const cuidRegex = /^c[a-z0-9]{24}$/i;
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (uuidRegex.test(segment) || cuidRegex.test(segment) || objectIdRegex.test(segment)) {
    return 'Detail';
  }

  // Capitalize each segment word
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function Breadcrumb() {
  const pathname = usePathname();
  
  if (!pathname) return null;

  const segments = pathname.split('/').filter(Boolean);
  
  // Skip 'dashboard' from segments as it's the root
  const breadcrumbSegments = segments.filter(segment => segment !== 'dashboard');

  if (pathname === '/dashboard') {
    return (
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center text-sm">
        <ol className="flex items-center space-x-2">
          <li className="flex items-center text-icon-on-light font-medium">
            <FaHome className="mr-1.5" />
            <span>Dashboard</span>
          </li>
        </ol>
      </nav>
    );
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex items-center text-sm">
      <ol className="flex items-center space-x-2">
        <li>
          <Link 
            href="/dashboard" 
            className="flex items-center text-gray-500 hover:text-brand-primary transition-colors"
          >
            <FaHome className="mr-1.5" />
            <span>Dashboard</span>
          </Link>
        </li>
        
        {breadcrumbSegments.map((segment, index) => {
          const isLast = index === breadcrumbSegments.length - 1;
          const href = '/dashboard/' + breadcrumbSegments.slice(0, index + 1).join('/');
          const label = formatLabel(segment);

          return (
            <li key={href} className="flex items-center">
              <FaChevronRight className="mx-2 text-gray-400 text-xs" />
              {isLast ? (
                <span className="text-brand-primary font-medium">{label}</span>
              ) : (
                <Link 
                  href={href} 
                  className="text-gray-500 hover:text-brand-primary transition-colors"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
