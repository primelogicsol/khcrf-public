'use client';
import { getBaseUrlNoApi } from "@/lib/api";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import {
  IssueCoverHero,
  EditorialNav,
  IssueOverview,
  IssueCoverStory,
  IssueContents,
  IssuePublicationDetails,
  IssueMembershipAccess,
} from '@/components/master-artisans/issues/MagazineIssueComponents';
import { useScroll, motion } from 'framer-motion';
import { resolvePublicationExperience } from '@/lib/presentation/publicationExperience';




const API_BASE_URL = getBaseUrlNoApi();

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: 'include', cache: 'no-store' });
  const json = await res.json();
  if (!res.ok) throw json;
  return json?.data !== undefined ? json.data : json;
};

export default function MagazineIssueDetailClient({ initialIssue, initialAccessDecision }: { initialIssue?: any, initialAccessDecision?: string }) {
  const params = useParams();
  const slug = params.slug as string;
  const [activeTab, setActiveTab] = useState<string>('overview');

  const { data: issue, error, isLoading } = useSWR(
    initialIssue ? null : `${API_BASE_URL}/api/backend/v1/magazine-issues/${slug}`, 
    fetcher,
    { fallbackData: initialIssue }
  );
    
  const experience = issue ? resolvePublicationExperience(issue) : null;

  useEffect(() => {
    if (experience && experience.sections.length > 0) {
      if (!experience.sections.find((s) => s.id === activeTab)) {
        setActiveTab(experience.sections[0].id);
      }
    }
  }, [experience, activeTab]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <span className="inline-block w-10 h-10 border-4 border-[#B8860B] border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (error || !issue || issue.error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <p className="text-gray-400 text-sm uppercase tracking-widest mb-4">Issue Not Found</p>
      <p className="text-gray-600 text-sm mb-8">This issue does not exist or is not publicly available.</p>
      <Link href="/master-artisans/publications" className="text-sm font-medium underline text-gray-800">← Back to all issues</Link>
    </div>
  );

  const accessState = initialAccessDecision || 'SIGN_IN_OR_APPLY';

  return (
    <main className="w-full bg-white min-h-screen text-black font-sans selection:bg-[#B8860B] selection:text-white relative">
      {experience && <IssueCoverHero issue={issue} experience={experience} />}
      {experience && <EditorialNav experience={experience} activeTab={activeTab} setActiveTab={setActiveTab} />}
      
      <div className="min-h-[500px]">
        {activeTab === 'overview' && experience && <IssueOverview issue={issue} experience={experience} />}
        {activeTab === 'context' && experience && <IssueCoverStory issue={issue} experience={experience} />}
        {activeTab === 'contents' && experience && <IssueContents highlights={issue.featureHighlights} experience={experience} />}
        {activeTab === 'publication' && experience && <IssuePublicationDetails issue={issue} experience={experience} />}
        {activeTab === 'membership' && experience && <IssueMembershipAccess issue={issue} accessState={accessState} publicationAccessStatus={issue.accessStatus} experience={experience} />}
      </div>
    </main>
  );
}

