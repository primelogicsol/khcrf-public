import React from 'react';
import { LucideIcon, HelpCircle } from 'lucide-react';
// Note: Icon library normalization will map exact names to specific underlying libraries.

export type IconName = 'search' | 'menu' | 'close' | 'user' | 'chevron-down' | 'chevron-right' | 'arrow-right' | 'check' | 'alert-circle' | 'info';

export type IconCategory = 'navigation' | 'action' | 'status' | 'disclosure' | 'social' | 'file-type' | 'data' | 'directional' | 'decorative';

export type IconTone = 'primary' | 'secondary' | 'muted' | 'inverse' | 'disabled' | 'success' | 'warning' | 'error' | 'information' | 'on-action' | 'inherit';

export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

export interface IconProps {
  name: IconName;
  size?: IconSize;
  tone?: IconTone;
  category?: IconCategory;
  decorative?: boolean;
  className?: string;
  'aria-label'?: string;
  // A temporary prop for the PoC to pass a direct Lucide icon until registry is complete
  lucideIcon?: LucideIcon;
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48
};

const toneClassMap: Record<IconTone, string> = {
  primary: 'text-text-primary',
  secondary: 'text-text-secondary',
  muted: 'text-text-muted',
  inverse: 'text-text-inverse',
  disabled: 'text-text-disabled',
  success: 'text-green-600',
  warning: 'text-amber-600',
  error: 'text-red-600',
  information: 'text-blue-600',
  'on-action': 'text-white',
  inherit: 'currentColor'
};

export function Icon({
  name,
  size = 'md',
  tone = 'inherit',
  decorative = true,
  className = '',
  'aria-label': ariaLabel,
  lucideIcon
}: IconProps) {
  
  // Use passed icon or fallback for PoC
  const Component = lucideIcon || HelpCircle;
  const dimension = sizeMap[size] || 24;
  const toneClass = tone === 'inherit' ? '' : toneClassMap[tone];

  return (
    <Component
      size={dimension}
      className={`${toneClass} ${className}`}
      aria-hidden={decorative}
      aria-label={decorative ? undefined : ariaLabel}
      role={decorative ? undefined : 'img'}
    />
  );
}
