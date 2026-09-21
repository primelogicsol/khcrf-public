'use client';
import { getBaseUrlNoApi } from "@/lib/api";
import React from 'react';
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



const API_BASE_URL = getBaseUrlNoApi();

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: 'include', cache: 'no-store' });
  const json = await res.json();
  if (!res.ok) throw json;
  return json?.data !== undefined ? json.data : json;
};

export default function MagazineIssueDetailClient() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: issue, error, isLoading } = useSWR(`/api/backend/magazine-issues/${slug}`, fetcher);
  const { data: accessData, error: accessError } = useSWR(`/api/backend/magazine-issues/${slug}/access`, fetcher);
  
  const { scrollYProgress } = useScroll();

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <span className="inline-block w-10 h-10 border-4 border-[#B8860B] border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (error || !issue || issue.error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <p className="text-gray-400 text-sm uppercase tracking-widest mb-4">Issue Not Found</p>
      <p className="text-gray-600 text-sm mb-8">This issue does not exist or is not publicly available.</p>
      <Link href="/master-artisans/issues" className="text-sm font-medium underline text-gray-800">← Back to all issues</Link>
    </div>
  );

  const getAccessState = () => {
    if (accessError) {
      if (accessError.reason) return accessError.reason;
      if (accessError.status === 401 || accessError.error === 'UNAUTHENTICATED') return 'UNAUTHENTICATED';
      return 'UNAUTHENTICATED';
    }
    if (!accessData) return null;
    if (accessData.reason === 'ADMIN_AUTHORIZED') return 'ADMIN_AUTHORIZED';
    if (accessData.authorized) return 'APPROVED';
    if (accessData.reason === 'UNAUTHENTICATED') return 'UNAUTHENTICATED';
    if (accessData.reason === 'NO_MEMBERSHIP_RECORD') return 'REGISTERED_NO_APPLICATION';
    if (accessData.reason === 'MEMBERSHIP_APPROVAL_REQUIRED') return 'UNDER_REVIEW';
    if (accessData.reason === 'MEMBERSHIP_REJECTED') return 'REJECTED';
    if (accessData.reason === 'MEMBERSHIP_WITHDRAWN') return 'WITHDRAWN';
    if (accessData.reason === 'MEMBERSHIP_EXPIRED') return 'EXPIRED';
    if (accessData.reason === 'MEMBERSHIP_SUSPENDED') return 'SUSPENDED';
    if (accessData.reason === 'MEMBERSHIP_REVOKED') return 'REVOKED';
    if (accessData.reason === 'MEMBERSHIP_INACTIVE') return 'DENIED';
    return 'DENIED';
  };

  const accessState = getAccessState();

  return (
    <main className="w-full bg-white min-h-screen text-black font-sans selection:bg-[#B8860B] selection:text-white relative">
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#B8860B] origin-left z-[100]" 
        style={{ scaleX: scrollYProgress }} 
      />
      
      <IssueCoverHero issue={issue} />
      <EditorialNav />
      <IssueOverview issue={issue} />
      <IssueCoverStory issue={issue} />
      <IssueContents highlights={issue.featureHighlights} />
      <IssuePublicationDetails issue={issue} />
      <IssueMembershipAccess issue={issue} accessState={accessState} />
    </main>
  );
}
