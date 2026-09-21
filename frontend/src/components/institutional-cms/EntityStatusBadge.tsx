import React from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaClock, FaBan, FaGlobe, FaLock } from 'react-icons/fa';

export function LifecycleBadge({ status }: { status: string }) {
  const styles: any = {
    DRAFT: 'bg-gray-100 text-gray-700 border-gray-200',
    IN_REVIEW: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    PUBLISHED: 'bg-green-50 text-green-700 border-green-200',
    ARCHIVED: 'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest border rounded-sm ${styles[status] || styles.DRAFT}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

export function VisibilityBadge({ status }: { status: string }) {
  const isPublic = status === 'PUBLIC';
  return (
    <span className={`flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-widest border rounded-sm ${isPublic ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
      {isPublic ? <FaGlobe /> : <FaLock />} {status}
    </span>
  );
}

export function VerificationBadge({ status }: { status: string }) {
  const config: any = {
    UNVERIFIED: { color: 'bg-red-50 text-red-700 border-red-200', icon: <FaBan /> },
    PENDING_VERIFICATION: { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: <FaClock /> },
    PARTIALLY_VERIFIED: { color: 'bg-orange-50 text-orange-700 border-orange-200', icon: <FaExclamationTriangle /> },
    VERIFIED: { color: 'bg-green-50 text-green-700 border-green-200', icon: <FaCheckCircle /> }
  };
  const badge = config[status] || config.UNVERIFIED;
  return (
    <span className={`flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-widest border rounded-sm ${badge.color}`}>
      {badge.icon} {status.replace('_', ' ')}
    </span>
  );
}
