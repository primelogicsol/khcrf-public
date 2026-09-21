"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaCheckCircle, FaSpinner, FaExclamationTriangle, FaFileAlt, FaBalanceScale, FaLightbulb, FaShieldAlt } from 'react-icons/fa';
import { notFound } from 'next/navigation';

import { getBaseUrlNoApi } from "@/lib/api";
const API_BASE_URL = getBaseUrlNoApi();

export default function DraftFindingDetail({ params }: { params: { slug: string } }) {
  const [finding, setFinding] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchFinding = async () => {
      try {
        const res = await fetch(`/api/backend/skc/draft-findings/public/${params.slug}`);
        if (!res.ok) {
           if (res.status === 404) {
              notFound();
           }
           throw new Error('Failed to fetch');
        }
        const data = await res.json();
        if (data.success) {
          setFinding(data.data);
        } else {
          setError(true);
        }
      } catch (e) {
        console.error("Failed to fetch draft finding details", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchFinding();
  }, [params.slug]);

  if (loading) {
    return (
      <main className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-dark"></div>
      </main>
    );
  }

  if (error || !finding) {
    return (
      <main className="w-full min-h-screen bg-gray-50 pt-32 pb-20 text-center">
         <h1 className="text-3xl font-black text-brand-dark mb-4">Finding Not Found</h1>
         <p className="text-gray-600 mb-8">The requested draft finding could not be loaded or is not published.</p>
         <Link href="/state-of-kashmir-crafts/draft-findings" className="px-6 py-3 bg-brand-primary text-white rounded-[14px] font-bold">
            Return to Draft Findings
         </Link>
      </main>
    );
  }

  return (
    <main className="w-full bg-gray-50">
      {/* 1. Header */}
      <section className="pt-32 pb-16 border-b-4 border-brand-secondary universal-hero">
         <div className="container mx-auto px-4 max-w-4xl">
            <Link href="/state-of-kashmir-crafts/draft-findings" className="inline-flex items-center gap-2 text-brand-secondary font-bold hover:text-white transition mb-6">
               <FaArrowLeft /> Back to Draft Findings
            </Link>
            
            <div className="flex flex-wrap gap-3 mb-4">
               <span className="px-3 py-1 bg-brand-primary/20 text-brand-primary font-bold text-xs rounded-full uppercase tracking-wider border border-brand-primary/50">
                  {finding.findingType} FINDING
               </span>
               <span className="px-3 py-1 bg-white/10 text-white font-bold text-xs rounded-full uppercase tracking-wider">
                  VERSION {finding.version}
               </span>
               <span className={`px-3 py-1 font-bold text-xs rounded-full uppercase tracking-wider ${finding.status === 'PUBLISHED_FOR_VALIDATION' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-orange-500/20 text-orange-400 border border-orange-500/50'}`}>
                  {finding.status.replace(/_/g, ' ')}
               </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
               {finding.title}
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed font-medium">
               {finding.summary}
            </p>
         </div>
      </section>

      {/* 2. Validation CTA */}
      {finding.status === 'PUBLISHED_FOR_VALIDATION' && (
         <div className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 max-w-4xl py-6 flex flex-col md:flex-row items-center justify-between gap-4">
               <div className="flex items-center gap-3">
                  <FaShieldAlt data-ui-icon  className="text-3xl " />
                  <div>
                     <h3 className="font-bold text-gray-900 text-sm">Open for Validation</h3>
                     <p className="text-xs text-gray-600">This finding is preliminary. Submit corrections or additional evidence.</p>
                  </div>
               </div>
               <Link href={`/state-of-kashmir-crafts/validation-round/submit?findingId=${finding.id}`} className="px-6 py-2 bg-brand-dark text-white font-bold rounded-lg hover:bg-brand-primary transition whitespace-nowrap text-sm">
                  Validate Finding
               </Link>
            </div>
         </div>
      )}

      {/* 3. Metrics */}
      <section className="py-12 bg-gray-50 border-b border-gray-200">
         <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm">
                  <div className="text-3xl font-black text-brand-dark">{finding.stakeholderCount}</div>
                  <div className="text-[10px] uppercase font-bold text-gray-500 mt-1">Verified Stakeholders</div>
               </div>
               <div className="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm">
                  <div className="text-3xl font-black text-brand-dark">{finding.evidenceRecordCount}</div>
                  <div className="text-[10px] uppercase font-bold text-gray-500 mt-1">Evidence Records</div>
               </div>
               <div className="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm">
                  <div className="text-3xl font-black text-brand-dark">{finding.hearingCount}</div>
                  <div className="text-[10px] uppercase font-bold text-gray-500 mt-1">Public Hearings</div>
               </div>
               <div className="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm">
                  <div className="text-xl font-black text-brand-secondary mt-1">{finding.confidenceLevel || 'MODERATE'}</div>
                  <div className="text-[10px] uppercase font-bold text-gray-500 mt-2">Confidence Level</div>
               </div>
            </div>
         </div>
      </section>

      {/* 4. Full Analysis */}
      <section className="py-16">
         <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-200">
               <h2 className="text-2xl font-black text-brand-dark mb-6 flex items-center gap-3">
                  <FaFileAlt data-ui-icon  className="" /> Full Analysis
               </h2>
               <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {finding.fullAnalysis}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                  {finding.majorConcern && (
                     <div className="bg-red-50 border border-red-100 p-6 rounded-2xl">
                        <h3 className="font-bold text-red-800 flex items-center gap-2 mb-3">
                           <FaExclamationTriangle /> Major Concern
                        </h3>
                        <p className="text-red-900/80 text-sm leading-relaxed">{finding.majorConcern}</p>
                     </div>
                  )}
                  {finding.emergingOpportunity && (
                     <div className="bg-green-50 border border-green-100 p-6 rounded-2xl">
                        <h3 className="font-bold text-green-800 flex items-center gap-2 mb-3">
                           <FaLightbulb /> Emerging Opportunity
                        </h3>
                        <p className="text-green-900/80 text-sm leading-relaxed">{finding.emergingOpportunity}</p>
                     </div>
                  )}
                  {finding.primaryIssue && (
                     <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl">
                        <h3 className="font-bold text-orange-800 flex items-center gap-2 mb-3">
                           <FaBalanceScale /> Primary Issue
                        </h3>
                        <p className="text-orange-900/80 text-sm leading-relaxed">{finding.primaryIssue}</p>
                     </div>
                  )}
                  {finding.keyOpportunity && (
                     <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
                        <h3 className="font-bold text-blue-800 flex items-center gap-2 mb-3">
                           <FaCheckCircle /> Key Opportunity
                        </h3>
                        <p className="text-blue-900/80 text-sm leading-relaxed">{finding.keyOpportunity}</p>
                     </div>
                  )}
               </div>

               {finding.limitations && (
                  <div className="mt-12 pt-8 border-t border-gray-100">
                     <h3 className="text-lg font-black text-gray-900 mb-4">Methodological Limitations</h3>
                     <p className="text-gray-600 text-sm leading-relaxed italic border-l-4 border-gray-300 pl-4">
                        {finding.limitations}
                     </p>
                  </div>
               )}
            </div>
         </div>
      </section>
    </main>
  );
}
