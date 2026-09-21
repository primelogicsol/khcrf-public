"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaArrowLeft,
  FaShieldAlt,
  FaCheck,
  FaGlobe,
  FaFolder,
  FaUsers,
  FaTag,
  FaBookOpen,
  FaChevronDown,
  FaChevronUp,
  FaExternalLinkAlt,
} from "react-icons/fa";
import PublicationAccessPanel from "./PublicationAccessPanel";
import HCRFPressCoverTemplateV1 from "./HCRFPressCoverTemplateV1";
import PublicationTableOfContents from "./PublicationTableOfContents";
import PublicationCitationBlock from "./PublicationCitationBlock";
import PublicationKnowledgeGraphRefs from "./PublicationKnowledgeGraphRefs";
import PublicationCanonicalSections from "./PublicationCanonicalSections";
import ScholarlyReception from "./ScholarlyReception";

import { CanonicalPublicationPresentation } from "@/types/CanonicalPublicationPresentation";
import { publicationEditorialProfiles } from "@/data/publicationEditorialProfiles";

export interface PublicationPublicViewProps {
  canonical: CanonicalPublicationPresentation;
  isPreviewMode?: boolean;
  initialAccessState?: any;
}

export default function PublicationPublicView({
  canonical,
  isPreviewMode = false,
  initialAccessState,
}: PublicationPublicViewProps) {
  const vm = canonical;
  const editorialProfile = publicationEditorialProfiles[canonical.slug] || { keyFindings: [], insideThisPublication: [] };
  const activeKeyInsights = canonical.keyInsights && canonical.keyInsights.length > 0 ? canonical.keyInsights : editorialProfile.keyFindings;
  
  const isbn = vm.isbn;
  const isbnStatus = vm.isbnStatus;
  const edition = vm.edition;
  const publisher = vm.publisher;
  const publicationYear = vm.publicationYear;
  const language = vm.language;

  const craftSector = vm.craftSector;
  const domain = vm.domain;
  const audience = vm.audience;
  const region = vm.region;

  const execSummary = vm.executiveSummary;
  const whyMatters = vm.whyMatters;
  const whoShouldRead = vm.whoShouldRead;

  const keyInsightsList = vm.keyInsights;

  const categoryMapping: Record<string, string> = {
    'Market Intelligence': 'market-intelligence',
    'Pricing Intelligence Series': 'market-intelligence',
    'Policy Briefs': 'policy-briefs',
    'Research Papers': 'research-papers',
    'Best Practices': 'best-practices',
    'Case Studies': 'case-studies',
    'E-Publications': 'knowledge-books',
    'Knowledge Books': 'knowledge-books'
  };

  const categoryName = vm.series;
  const categoryDest = categoryName ? categoryMapping[categoryName] : null;
  const backHref = categoryDest ? `/publications/${categoryDest}` : "/publications";
  const backLabel = categoryName ? `Back to ${categoryName}` : "Back to Library Hub";

  return (
    <div className="min-h-screen bg-stone-50/30 font-sans flex flex-col">
      <main className="grow pb-24">
        {/* Breadcrumb Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 pt-8">
          {isPreviewMode ? (
            <div className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em]">
              Preview Mode — Breadcrumb Hidden
            </div>
          ) : (
            <Link
              href={backHref}
              className="group inline-flex items-center text-stone-400 hover:text-brand-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <FaArrowLeft className="mr-3 transition-transform group-hover:-translate-x-1" />
              {backLabel}
            </Link>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-16">
            
            {/* LEFT COLUMN - Cover & Purchase Details */}
            <div className="lg:col-span-5">
              <aside className="sticky top-28 flex flex-col gap-6">
                <div className="overflow-hidden rounded-3xl border border-stone-200/60 bg-white p-5 shadow-sm">
                  <HCRFPressCoverTemplateV1
                    publicationType={vm.publicationType}
                    title={vm.title}
                    subtitle={vm.subtitle}
                    year={vm.publicationYear}
                    publicationCode={vm.publicationCode}
                    isbn={vm.isbn || ""}
                    edition={vm.edition}
                    isComingSoon={false}
                  />
                </div>

                <PublicationAccessPanel
                  canonical={vm}
                  isPreviewMode={isPreviewMode}
                  initialAccessState={initialAccessState}
                />
              </aside>
            </div>

            {/* RIGHT COLUMN - Details & Actions */}
            <div className="lg:col-span-7 space-y-12">
              <header className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-brand-primary text-white px-3 py-1 text-xs font-black uppercase tracking-widest rounded-sm">
                    {vm.publicationType}
                  </span>
                  <span className="bg-stone-800 text-stone-100 px-3 py-1 text-xs font-black uppercase tracking-widest rounded-sm">
                    {categoryName}
                  </span>
                  <span className="bg-white border border-stone-200 text-stone-600 px-3 py-1 text-xs font-black uppercase tracking-widest rounded-sm">
                    {edition}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-stone-900 leading-[1.1] tracking-tight">
                    {vm.title}
                  </h1>
                  {vm.subtitle && (
                    <h2 className="text-xl sm:text-2xl font-serif text-stone-600 mt-4 leading-snug italic">
                      {vm.subtitle}
                    </h2>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-stone-600 border-t border-b border-stone-200/60 py-4 font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-500 font-bold font-serif text-xs border border-stone-300">
                      {vm.authors[0].charAt(0)}
                    </div>
                    <span className="font-bold text-stone-800">{vm.authors[0]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaFolder className="text-stone-400" />
                    <span>{vm.craftSector}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaGlobe className="text-stone-400" />
                    <span>{vm.region}</span>
                  </div>
                </div>
              </header>

              {/* Executive Summary */}
              <section className="prose prose-stone max-w-none">
                <h3 className="text-sm font-black text-stone-400 uppercase tracking-widest mb-4">
                  Executive Summary
                </h3>
                {execSummary && (
                  <p className="text-lg text-stone-800 leading-relaxed font-serif">
                    {execSummary}
                  </p>
                )}
              </section>

              {/* Strategic Insights */}
              <section className="bg-white border border-stone-200/60 rounded-2xl p-6 sm:p-8 shadow-sm">
                <h3 className="text-sm font-black text-stone-850 uppercase tracking-widest mb-6 flex items-center gap-3">
                  <span data-editorial-accent-bg className="w-8 h-[2px] "></span>
                  Key Findings & Insights
                </h3>
                {activeKeyInsights && activeKeyInsights.length > 0 && (
                  <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                    {activeKeyInsights.map((insight: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <FaCheck data-ui-icon className=" mt-1 text-sm shrink-0" />
                        <span className="text-stone-700 text-sm leading-relaxed">{insight}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Metadata Grid */}
              <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {vm.publicationCode && (
                    <div className="bg-white p-4 rounded-xl border border-stone-200/50">
                      <span className="block text-[10px] text-stone-400 font-black uppercase tracking-wider mb-1">
                        Publication Code
                      </span>
                      <span className="text-sm font-bold text-stone-800 font-mono tracking-tight">{vm.publicationCode}</span>
                    </div>
                  )}
                  {vm.publishingSeries && (
                    <div className="bg-white p-4 rounded-xl border border-stone-200/50">
                      <span className="block text-[10px] text-stone-400 font-black uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        ISBN Publisher Registration
                        <FaShieldAlt className="text-stone-300 w-3 h-3" title="Government of India ISBN Registration" />
                      </span>
                      <span className="text-sm font-bold text-stone-800 font-mono tracking-tight">
                        {vm.publishingSeries}
                      </span>
                    </div>
                  )}
                  {vm.series && (
                    <div className="bg-white p-4 rounded-xl border border-stone-200/50">
                      <span className="block text-[10px] text-stone-400 font-black uppercase tracking-wider mb-1">
                        Publishing Series
                      </span>
                      <span className="text-sm font-bold text-stone-800 tracking-tight">
                        {vm.series}
                      </span>
                    </div>
                  )}
                  {vm.isbn && vm.isbn !== "Pending" && (
                    <div className="bg-white p-4 rounded-xl border border-stone-200/50">
                      <span className="block text-[10px] text-stone-400 font-black uppercase tracking-wider mb-1">
                        Book ISBN
                      </span>
                      <span className="text-sm font-bold text-stone-800 font-mono tracking-tight">
                        {vm.isbn}
                      </span>
                    </div>
                  )}
                  {publicationYear && (
                    <div className="bg-white p-4 rounded-xl border border-stone-200/50">
                      <span className="block text-[10px] text-stone-400 font-black uppercase tracking-wider mb-1">
                        Published
                      </span>
                      <span className="text-sm font-bold text-stone-800 font-mono tracking-tight">{publicationYear}</span>
                    </div>
                  )}
                  {publisher && (
                    <div className="bg-white p-4 rounded-xl border border-stone-200/50">
                      <span className="block text-[10px] text-stone-400 font-black uppercase tracking-wider mb-1">
                        Publisher
                      </span>
                      <span className="text-sm font-bold text-stone-800">{publisher}</span>
                    </div>
                  )}
                </section>

              <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-stone-200/60">
                <div>
                  <span data-editorial-accent-text className="flex items-center gap-2 text-[10px]  font-black uppercase tracking-wider mb-2">
                    <FaTag /> Value Proposition
                  </span>
                  <h4 className="font-serif font-bold text-sm text-stone-850">
                    Why It Matters
                  </h4>
                  {whyMatters && (
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {whyMatters}
                    </p>
                  )}
                </div>
                <div>
                  <span data-editorial-accent-text className="flex items-center gap-2 text-[10px]  font-black uppercase tracking-wider mb-2">
                    <FaUsers /> Target Audience
                  </span>
                  <h4 className="font-serif font-bold text-sm text-stone-850">
                    Who Should Read This
                  </h4>
                  {whoShouldRead && (
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {whoShouldRead}
                    </p>
                  )}
                </div>
              </div>

              {/* Table of Contents */}
              <PublicationTableOfContents slug={canonical.slug} chapters={vm.chapters || []} 
                pubTitle={vm.title} 
                readerAvailability={vm.readerAvailability} 
              />

              {/* Citation block */}
              <PublicationCitationBlock 
                title={vm.title}
                author={vm.authors[0]}
                publicationYear={vm.publicationYear}
                slug={vm.slug || ""}
                isbn={vm.isbn || ""}
              />

              {/* KG References */}
              <PublicationKnowledgeGraphRefs
                relatedCrafts={vm.relatedCrafts}
                relatedPolicies={vm.relatedPolicies}
              />

              <PublicationCanonicalSections vm={vm} />

            </div>
          </div>
        </div>

        {/* Scholarly Reception Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <ScholarlyReception
            initialReviews={vm.reviews || []}
            publicationId={vm.id}
            category={categoryName}
          />
        </div>

      </main>
    </div>
  );
}
