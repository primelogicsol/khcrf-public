import React from 'react';
import { FaLandmark } from 'react-icons/fa';

export default function InstitutionalCMSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="bg-brand-dark p-8 text-white rounded-sm relative overflow-hidden shadow-sm">
         
         <h1 className="text-3xl font-serif flex items-center gap-4 relative z-10">
           <FaLandmark data-ui-icon  className="" /> Universal Institutional CMS
         </h1>
         <p className="mt-2 text-sm text-gray-300 max-w-2xl font-light relative z-10">
           Centralized administration for all KHCRF institutional knowledge, heritage collections, master artisans, and media assets.
         </p>
      </div>
      {children}
    </div>
  );
}
