'use client';

import React, { useState, useEffect } from 'react';
import { StudioEntity } from '@/lib/services/canonicalStudio';
import { StudioExperienceDTO } from '@/lib/presentation/studioExperience';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { studioCatalogueHeroFallback } from '@/config/heroFallbacks';
import { 
  StudioHero, 
  StudioTabs, 
  StudioTabRail, 
  StudioOverview, 
  StudioContext, 
  StudioContent, 
  StudioRecord, 
  StudioAccess 
} from '@/components/master-artisans/studio/StudioComponents';

export default function StudioDetailClient({
  record,
  experience,
  initialAccessDecision,
  returnTo
}: {
  record: StudioEntity;
  experience: StudioExperienceDTO;
  initialAccessDecision: string;
  returnTo?: string;
}) {
  const [activeTab, setActiveTab] = useState('overview');


  return (
    <div className="bg-[#050505] min-h-screen font-sans selection:bg-[#D4AF37] selection:text-white pb-32">
      
            {/* 1. Global KHCRF Hero */}
      <UniversalEditorialHero pageKey={`studio-detail-${record.slug}`} fallbackConfig={studioCatalogueHeroFallback} />

      {/* 2. Cinematic Media Stage & Record Identity Strip */}
      <StudioHero record={record} experience={experience} returnTo={returnTo} />

      {experience.contentState === 'PUBLIC_CONTENT_INCOMPLETE' && (
        <div className="bg-red-900/20 border-b border-red-500/50 p-4 text-center">
          <p className="text-red-400 text-xs tracking-[0.2em] uppercase font-bold">Public Content Incomplete</p>
          <p className="text-gray-400 text-[10px] uppercase tracking-widest mt-1">This record requires rich documentary metadata before publication.</p>
        </div>
      )}

      <StudioTabs 
        experience={experience} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      <StudioTabRail>
        {activeTab === 'overview' && (
          <StudioOverview record={record} experience={experience} />
        )}
        
        {activeTab === 'context' && (
          <StudioContext record={record} experience={experience} />
        )}
        
        {activeTab === 'content' && (
          <StudioContent record={record} experience={experience} />
        )}
        
        {activeTab === 'record' && (
          <StudioRecord record={record} experience={experience} />
        )}
        
        {activeTab === 'access' && (
          <StudioAccess record={record} experience={experience} accessDecision={initialAccessDecision} />
        )}
      </StudioTabRail>

    </div>
  );
}
