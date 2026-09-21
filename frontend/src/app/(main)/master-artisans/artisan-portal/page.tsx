'use client';
import React, { Suspense } from 'react';
import { FaWrench } from 'react-icons/fa';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ArtisanPortalContent() {
  const searchParams = useSearchParams();
  const artisanId = searchParams.get('artisan') || 'Unknown ID';
  const sectionParam = searchParams.get('section');
  const name = searchParams.get('name') || 'Artisan';
  const returnTo = searchParams.get('returnTo') || '/master-artisans/artisans';

  const section = sectionParam === 'gallery' ? 'Artisan Gallery' : 
                  sectionParam === 'techniques' ? 'Craft Techniques' : 
                  sectionParam === 'dossier' ? 'Artisan Dossier' : 
                  sectionParam === 'contact' ? 'Contact Request' : 'Artisan Portal';

  return (
    <div className="min-h-screen bg-[#F5F5F0] py-16 px-4 sm:px-6 lg:px-8 font-sans mt-[100px]">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 shadow-sm border border-[#3E2723]/10 text-center">
        <FaWrench className="mx-auto text-4xl text-[#D4AF37] mb-6" />
        <h1 className="text-3xl font-bold text-[#3E2723] mb-2">{name}</h1>
        <h2 className="text-xl font-medium text-gray-600 mb-6">{section}</h2>
        <div className="w-16 h-1 bg-[#D4AF37] mx-auto mb-8"></div>
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          This artisan portal section is currently under development. Verified photographs, craft documentation and archival material will be published as they become available.
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded p-4 inline-block mb-8">
          <p className="text-sm font-mono text-gray-600">Craftlore Artisan ID: {artisanId}</p>
        </div>
        <div className="text-center mt-12">
          <a href={returnTo} className="inline-block border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723] hover:text-white px-6 py-2 transition-colors font-medium text-sm">
            Return
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ArtisanPortal() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F5F0] py-16"></div>}>
      <ArtisanPortalContent />
    </Suspense>
  );
}

