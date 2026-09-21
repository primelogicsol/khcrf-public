'use client';

import React from 'react';
import Link from 'next/link';
import { StudioEntity } from '@/lib/services/canonicalStudio';
import { StudioExperienceDTO } from '@/lib/presentation/studioExperience';

export const StudioHero = ({ record, experience, returnTo }: { record: StudioEntity, experience: StudioExperienceDTO, returnTo?: string }) => {
  const getCategoryLabel = (studioType: string) => {
    switch (studioType) {
      case 'WORKSHOP': return 'WORKSHOPS';
      case 'DOCUMENTARY_FILM': return 'FILMS & INTERVIEWS';
      case 'VIDEO_INTERVIEW': return 'FILMS & INTERVIEWS';
      case 'ORAL_HISTORY': return 'ORAL HISTORIES';
      case 'CRAFT_DEMONSTRATION': return 'CRAFT DEMONSTRATIONS';
      default: return 'STUDIO';
    }
  };
  
  const categoryLabel = getCategoryLabel(record.studioType);
  
  // Safe returnTo resolution
  const validReturnTo = returnTo && returnTo.startsWith('/master-artisans/studio') ? returnTo : '/master-artisans/studio';

  return (
    <section className="bg-black text-white relative">
      <div className={`w-full mx-auto max-w-[1600px] overflow-hidden relative ${experience.cinematicRatio} max-h-[80vh]`}>
        {record.media?.heroImage?.src ? (
          <img 
            src={record.media?.heroImage?.src || ''} 
            alt={record.title} 
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
            <span className="text-neutral-700 uppercase tracking-widest text-xs">Media Frame Unresolved</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <div className="max-w-4xl">
            <span className="text-[#D4AF37] text-[10px] tracking-[0.3em] uppercase mb-4 block">
              {experience.typeLabel}
            </span>
            <h1 className="text-4xl md:text-6xl font-serif mb-4 leading-tight">{record.title}</h1>
            {record.subtitle && (
              <p className="text-xl md:text-2xl text-gray-300 font-serif mb-8">{record.subtitle}</p>
            )}
            <Link 
              href="#access" 
              className="inline-block bg-white text-black px-8 py-3 text-xs uppercase tracking-[0.2em] font-medium hover:bg-gray-200 transition-colors"
            >
              {experience.publicCTA}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Back / Breadcrumb Row */}
      <div className="border-t border-white/10 bg-neutral-950">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Link 
            href={validReturnTo}
            className="text-[#D4AF37] text-[10px] tracking-[0.2em] uppercase font-bold hover:text-white transition-colors flex items-center gap-2"
          >
            <span>&larr;</span> BACK TO {categoryLabel}
          </Link>
          <div className="text-gray-500 text-[10px] tracking-[0.2em] uppercase">
            STUDIO / {categoryLabel} / <span className="text-gray-300">{record.title}</span>
          </div>
        </div>
      </div>
      
      {/* Information Strip */}
      <div className="border-t border-b border-white/10 bg-neutral-950">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap gap-x-12 gap-y-4 text-[10px] uppercase tracking-[0.2em] text-gray-400">
          <span className="text-white">{experience.typeLabel}</span>
          {record.duration && <span>{record.duration}</span>}
          {record.language && <span>{record.language}</span>}
          {record.recordedYear && <span>{record.recordedYear}</span>}
          {record.location && <span>{record.location}</span>}
          {record.transcriptAvailable && <span>TRANSCRIPT AVAILABLE</span>}
        </div>
      </div>
    </section>
  );
};

export const StudioTabs = ({ 
  experience, 
  activeTab, 
  setActiveTab 
}: { 
  experience: StudioExperienceDTO; 
  activeTab: string; 
  setActiveTab: (tab: string) => void;
}) => {
  return (
    <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex overflow-x-auto hide-scrollbar">
          {experience.sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              className={`px-8 py-6 text-[10px] uppercase tracking-[0.25em] whitespace-nowrap transition-colors duration-300 ${
                activeTab === section.id 
                  ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const StudioTabRail = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-16">
      {children}
    </section>
  );
};

export const StudioOverview = ({ record, experience }: { record: StudioEntity, experience: StudioExperienceDTO }) => {
  const { publicOverview } = experience;
  if (!publicOverview || !publicOverview.documentaryPremise) return (
    <div className="max-w-4xl text-left ml-0 mr-auto py-8">
      <h2 className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase font-bold mb-4">Content Incomplete</h2>
      <p className="text-gray-400">PUBLIC_CONTENT_INCOMPLETE</p>
    </div>
  );

  return (
    <div className="max-w-4xl text-left ml-0 mr-auto space-y-16 text-gray-300">
      <div className="space-y-6">
        <h2 className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase font-bold">Synopsis</h2>
        <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed space-y-6">
          {publicOverview.synopsis.split(/(?:\\n\\n|\n\n)/).map((paragraph: string, i: number) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
      
      {publicOverview.documentaryPremise && (
        <div className="space-y-6 bg-neutral-900/40 p-8 border border-white/5">
          <h2 className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase font-bold">Documentary Premise</h2>
          <p className="text-2xl text-white font-serif italic leading-relaxed">
            "{publicOverview.documentaryPremise}"
          </p>
        </div>
      )}

      {publicOverview.whyItMatters && (
        <div className="space-y-6">
          <h2 className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase font-bold">Why This Record Matters</h2>
          <p className="text-lg leading-relaxed">{publicOverview.whyItMatters}</p>
        </div>
      )}

      {publicOverview.examines && publicOverview.examines.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase font-bold">What This Record Examines</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
            {publicOverview.examines.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-[#D4AF37] mt-1">&bull;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {publicOverview.keyThemes && publicOverview.keyThemes.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase font-bold">Key Themes</h2>
          <div className="flex flex-wrap gap-3">
            {publicOverview.keyThemes.map((theme: string, i: number) => (
              <span key={i} className="text-xs uppercase tracking-widest text-gray-400 bg-white/5 px-4 py-2 border border-white/10">
                {theme}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export const StudioContext = ({ record, experience }: { record: StudioEntity, experience: StudioExperienceDTO }) => {
  const { contextModules } = experience;
  
  return (
    <div className="max-w-6xl text-left ml-0 mr-auto space-y-16 text-gray-300">
      {contextModules && contextModules.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {contextModules.map((mod, i) => (
            <div key={i} className="space-y-3">
              <h3 className="text-white text-sm uppercase tracking-widest border-b border-white/10 pb-2">{mod.title}</h3>
              <p className="text-sm leading-relaxed text-gray-400">{mod.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Relational Knowledge Graph Placeholder */}
      <div className="border-t border-white/10 pt-16">
        <h3 className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase font-bold mb-8">Related KHCRF Records</h3>
        <div className="text-sm text-gray-400 italic">
          Relational archive connections automatically resolve here (Artisans, Publications, Knowledge Pages).
        </div>
      </div>
    </div>
  );
};

export const StudioContent = ({ record, experience }: { record: StudioEntity, experience: StudioExperienceDTO }) => {
  const { contentPreview } = experience;
  
  return (
    <div className="max-w-5xl text-left ml-0 mr-auto text-gray-300">
      <h2 className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase font-bold mb-12">Inside this Record</h2>
      
      {contentPreview && contentPreview.length > 0 ? (
        <div className="space-y-8">
          {contentPreview.map((item, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-4 md:gap-8 border-b border-white/10 pb-8 last:border-0">
              <div className="text-gray-500 font-serif text-2xl w-16 shrink-0">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div>
                <h3 className="text-white text-lg font-serif mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.publicSummary}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500 italic">Content structure is protected.</div>
      )}
    </div>
  );
};

export const StudioRecord = ({ record, experience }: { record: StudioEntity, experience: StudioExperienceDTO }) => {
  const { colophonMetadata } = experience;
  
  return (
    <div className="max-w-6xl text-left ml-0 mr-auto text-gray-300">
      <h2 className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase font-bold mb-12">KHCRF Studio Record</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        {colophonMetadata.map((field, i) => (
          <div key={i} className="flex flex-col border-b border-white/5 pb-4">
            <span className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">{field.label}</span>
            <span className="text-white text-sm">{field.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const StudioAccess = ({ record, experience, accessDecision }: { record: StudioEntity, experience: StudioExperienceDTO, accessDecision: string }) => {
  const returnToUrl = `/master-artisans/studio/${record.slug}?tab=access`;
  const membershipApplyUrl = `/about/memberships?returnTo=${encodeURIComponent(returnToUrl)}`;
  const signInUrl = `/login?returnTo=${encodeURIComponent(returnToUrl)}`;
  
  // Format the label (e.g., 'workshop') for inline text
  const getResourceLabel = () => {
    switch (record.studioType) {
      case 'WORKSHOP': return 'workshop';
      case 'DOCUMENTARY_FILM': return 'documentary';
      case 'VIDEO_INTERVIEW': return 'interview';
      case 'ORAL_HISTORY': return 'oral history';
      case 'CRAFT_DEMONSTRATION': return 'demonstration';
      default: return 'studio';
    }
  };
  const resourceLabel = getResourceLabel();

  const renderState = () => {
    switch(accessDecision) {
      case 'SIGN_IN_OR_APPLY':
      case 'NOT_AUTHENTICATED':
        return (
          <div className="space-y-8">
            <p className="text-lg leading-relaxed max-w-2xl text-gray-300">
              The complete record contains extended field documentation, artisan relationships, 
              production processes, visual material and related research available through authorized member access.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
              <Link 
                href={membershipApplyUrl}
                className="inline-block bg-[#D4AF37] text-black px-8 py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#F3CF5B] transition-colors"
              >
                Apply for Membership
              </Link>
              <Link 
                href={signInUrl}
                className="inline-block bg-transparent border border-white/20 text-white px-8 py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-white/10 transition-colors"
              >
                Already a Member? Sign In
              </Link>
            </div>
          </div>
        );
        
      case 'MEMBERSHIP_REQUIRED':
        return (
          <div className="space-y-8">
            <h3 className="text-white text-sm uppercase tracking-widest border-b border-white/10 pb-2 max-w-xl">Membership Required</h3>
            <p className="text-lg leading-relaxed max-w-2xl text-gray-300">
              Access to the complete {resourceLabel} record requires approved KHCRF membership.
            </p>
            <div className="pt-4">
              <Link 
                href={membershipApplyUrl}
                className="inline-block bg-[#D4AF37] text-black px-8 py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#F3CF5B] transition-colors"
              >
                Apply for Membership
              </Link>
            </div>
          </div>
        );

      case 'APPLICATION_UNDER_REVIEW':
        return (
          <div className="space-y-8">
            <h3 className="text-white text-sm uppercase tracking-widest border-b border-white/10 pb-2 max-w-xl">Membership Application Under Review</h3>
            <p className="text-lg leading-relaxed max-w-2xl text-gray-300">
              Your KHCRF membership application is currently under review.
            </p>
            <div className="pt-4">
              <Link 
                href="/dashboard"
                className="inline-block bg-transparent border border-white/20 text-white px-8 py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-white/10 transition-colors"
              >
                View Application Status
              </Link>
            </div>
          </div>
        );
        
      case 'ADDITIONAL_INFORMATION_REQUIRED':
        return (
          <div className="space-y-8">
            <h3 className="text-white text-sm uppercase tracking-widest border-b border-white/10 pb-2 max-w-xl">Additional Information Required</h3>
            <p className="text-lg leading-relaxed max-w-2xl text-gray-300">
              Your KHCRF membership application requires additional information.
            </p>
            <div className="pt-4">
              <Link 
                href="/dashboard"
                className="inline-block bg-transparent border border-white/20 text-white px-8 py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-white/10 transition-colors"
              >
                Provide Information
              </Link>
            </div>
          </div>
        );
        
      case 'MEMBERSHIP_INACTIVE':
        return (
          <div className="space-y-8">
            <h3 className="text-white text-sm uppercase tracking-widest border-b border-white/10 pb-2 max-w-xl">Membership Inactive</h3>
            <p className="text-lg leading-relaxed max-w-2xl text-gray-300">
              Your KHCRF membership is currently inactive or suspended.
            </p>
            <div className="pt-4">
              <Link 
                href="/dashboard"
                className="inline-block bg-transparent border border-white/20 text-white px-8 py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-white/10 transition-colors"
              >
                View Account Status
              </Link>
            </div>
          </div>
        );

      case 'ENTITLEMENT_REQUIRED':
        return (
          <div className="space-y-8">
            <h3 className="text-white text-sm uppercase tracking-widest border-b border-white/10 pb-2 max-w-xl">Access Not Included</h3>
            <p className="text-lg leading-relaxed max-w-2xl text-gray-300">
              Your KHCRF membership is active, but this record is not included in your current access permissions.
            </p>
            <div className="pt-4">
              <Link 
                href="/dashboard/access"
                className="inline-block bg-transparent border border-white/20 text-white px-8 py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-white/10 transition-colors"
              >
                View Access Details
              </Link>
            </div>
          </div>
        );

      case 'RESOURCE_RESERVED':
        return (
          <div className="space-y-8">
            <h3 className="text-white text-sm uppercase tracking-widest border-b border-white/10 pb-2 max-w-xl">{experience.typeLabel} Reserved</h3>
            <div className="space-y-4">
              <p className="text-lg leading-relaxed max-w-2xl text-gray-300">
                Your access permissions are active.
              </p>
              <p className="text-lg leading-relaxed max-w-2xl text-gray-300">
                The complete {resourceLabel} documentation is not currently available for member access.
              </p>
            </div>
          </div>
        );

      case 'ACCESS_GRANTED':
        return (
          <div className="space-y-8">
            <p className="text-lg leading-relaxed max-w-2xl text-gray-300">
              Your access to this documentation record is active.
            </p>
            <div className="bg-neutral-900/50 p-8 border border-white/10 max-w-xl">
              <h3 className="text-white text-sm uppercase tracking-widest mb-6">Full Record</h3>
              <Link 
                href={`/master-artisans/studio/${record.slug}/view`}
                className="inline-block w-full text-center bg-white text-black px-6 py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-gray-200 transition-colors"
              >
                {experience.protectedCTA}
              </Link>
            </div>
          </div>
        );
      case 'RESOURCE_WITHDRAWN':
        return (
          <div className="space-y-8">
            <h3 className="text-white text-sm uppercase tracking-widest border-b border-white/10 pb-2 max-w-xl">Record Withdrawn</h3>
            <p className="text-lg leading-relaxed max-w-2xl text-gray-300">
              This record has been withdrawn from the archive and is no longer available for access.
            </p>
          </div>
        );

      case 'ACCESS_DENIED':
      default:
        return (
          <div className="space-y-8">
            <h3 className="text-white text-sm uppercase tracking-widest border-b border-white/10 pb-2 max-w-xl">Access Denied</h3>
            <p className="text-lg leading-relaxed max-w-2xl text-gray-300">
              Access to this record is denied or authorization could not be verified.
            </p>
          </div>
        );
}
  };

  return (
    <div className="max-w-4xl text-left ml-0 mr-auto space-y-12 text-gray-300">
      <div className="space-y-4">
        <h2 className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase font-bold">KHCRF Member Access</h2>
        <div className="space-y-2">
          <h3 className="text-gray-400 text-sm uppercase tracking-widest">Full {experience.typeLabel}</h3>
          <h1 className="text-3xl font-serif text-white">{record.title}</h1>
        </div>
      </div>
      
      {renderState()}
    </div>
  );
};










