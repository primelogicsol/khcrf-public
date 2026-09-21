"use client";

import React from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";

import { notFound } from "next/navigation";
import {
  CampaignActionHub,
  CampaignProgress,
  CampaignPledge,
  CampaignExtras,
  CampaignActivityTimeline,
  JoinMovementFooter
} from "./CampaignEngagementBlocks";

export interface ResearchTopic {
  slug: string;
  title: string;
  icon: string;
  shortDescription: string;
  objective: string;
  narrative: string;
  proposals?: {
    title: string;
    objective: string;
    rationale: {
      title: string;
      description: string;
    }[];
    legislativeAsk: string;
  }[];
  itemStrategies?: {
    title: string;
    objective: string;
    points: {
      title: string;
      description: string;
    }[];
    actionSteps: string[];
  }[];
  // Allow flexibility for different naming conventions if needed, but defaulting to Lobbying structure
  strategies?: {
    title: string;
    objective: string;
    points: {
      title: string;
      description: string;
    }[];
    actionSteps: string[];
  }[];
  outcomes: {
    title: string;
    description: string;
    points: {
      title: string;
      description: string;
    }[];
  }[];
  conclusion: string;
}

interface ResearchTopicDetailProps {
  topic: ResearchTopic | undefined;
  backLink?: string;
  backLabel?: string;
  breadcrumbMiddle?: string;
}

export default function CampaignTopicDetail({
  topic,
  backLink = "/research/industry-research",
  backLabel = "Back to Research Topics",
  breadcrumbMiddle = "Industry Research",
}: ResearchTopicDetailProps) {
  if (!topic) {
    notFound();
  }

  // Normalize strategies vs itemStrategies
  const strategies = topic.strategies || topic.itemStrategies || [];

  return (
    <div className="min-h-screen bg-stone-50 font-roboto text-stone-700 pb-20">
      {/* Navigation */}
      <nav className="sticky top-0 z-30 border-b border-stone-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href={backLink}
            className="group flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-brand-primary transition-colors uppercase tracking-wider"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            {backLabel}
          </Link>
          <div className="text-sm font-medium text-stone-400 hidden sm:block">
            Research / {breadcrumbMiddle} /{" "}
            <span className="text-brand-primary font-bold">{topic.title}</span>
          </div>
        </div>
      </nav>

      <main>
        {/* Header Section */}
        <section className="py-16 md:py-24 bg-white border-b border-stone-200">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-widest mb-6 md:mb-8">
              <i className={`fa-solid ${topic.icon}`} />
              Strategic Initiative
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 text-stone-900 font-playfair leading-tight">
              {topic.title}
            </h1>

            <p className="text-lg md:text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto mb-10 md:mb-12">
              {topic.shortDescription}
            </p>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8 text-left bg-[#fdfbf7] border-l-4 border-[var(--card-left-accent)] p-6 md:p-8 rounded-r-lg shadow-xs">
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2 font-playfair">
                  <i className="fa-solid fa-bullseye text-brand-primary" />
                  Objective
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {topic.objective}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2 font-playfair">
                  <i className="fa-solid fa-bookmark text-brand-primary" />
                  Context
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed line-clamp-4">
                  {topic.narrative.split("\n")[0]}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Narrative Section */}
        <section className="py-20 border-b border-stone-200 bg-stone-50">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-black mb-8 text-stone-900 font-playfair">
              The Narrative
            </h2>
            <div className="prose prose-stone prose-lg max-w-none text-stone-600 leading-relaxed whitespace-pre-line">
              {topic.narrative}
            </div>
          </div>
        </section>

        {/* Campaign Engagement Hub */}
        <CampaignActionHub campaignSlug={topic.slug} />
        <CampaignProgress />
        <CampaignPledge campaignSlug={topic.slug} />
        <CampaignExtras campaignSlug={topic.slug} />
        <CampaignActivityTimeline />

        {/* Proposals Section */}
        {topic.proposals && topic.proposals.length > 0 && (
          <section className="py-20 border-b border-stone-200 bg-white">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-16">
                <span data-editorial-accent-text className="block  font-bold tracking-widest uppercase text-sm mb-2">
                  Legislative Action
                </span>
                <h2 className="text-3xl md:text-4xl font-black mb-4 text-stone-900 font-playfair">
                  Policy Proposals
                </h2>
                <p className="text-stone-500 text-lg">
                  Key legislative actions and their rationale
                </p>
              </div>

              <div className="grid gap-12">
                {topic.proposals.map((proposal, idx) => (
                  <div
                    key={idx}
                    className="group relative bg-white border border-stone-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <span className="text-6xl md:text-9xl font-black text-brand-primary leading-none">
                        {idx + 1}
                      </span>
                    </div>

                    <div className="p-5 md:p-10 relative z-10">
                      <h3 className="text-2xl font-bold text-stone-900 mb-4 group-hover:text-brand-primary transition-colors font-playfair">
                        {proposal.title}
                      </h3>
                      <p className="text-stone-600 mb-8 border-l-4 border-[var(--card-left-accent)] pl-4 italic bg-stone-50 py-2 pr-2 rounded-r">
                        {proposal.objective}
                      </p>

                      <div className="grid md:grid-cols-3 gap-6 mb-8">
                        {proposal.rationale.map((r, rIdx) => (
                          <div
                            key={rIdx}
                            className="bg-stone-50 p-5 rounded-lg border border-stone-100"
                          >
                            <h4 data-editorial-accent-text className=" font-bold mb-2 text-xs uppercase tracking-wide">
                              {r.title}
                            </h4>
                            <p className="text-stone-600 text-sm leading-relaxed">
                              {r.description}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-start gap-4 bg-[#fdfbf7] border border-brand-primary/20 p-5 rounded-lg">
                        <i className="fa-solid fa-gavel text-brand-primary mt-1" />
                        <div>
                          <p className="font-bold text-stone-900 text-sm mb-1 uppercase tracking-wider">
                            Legislative Ask
                          </p>
                          <p className="text-stone-700 font-medium font-playfair italic">
                            "{proposal.legislativeAsk}"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Strategies Section */}
        {strategies && strategies.length > 0 && (
          <section className="py-20 border-b border-stone-200 bg-stone-50">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-16">
                <span data-editorial-accent-text className="block  font-bold tracking-widest uppercase text-sm mb-2">
                  Implementation
                </span>
                <h2 className="text-3xl md:text-4xl font-black mb-4 text-stone-900 font-playfair">
                  Strategic Initiatives
                </h2>
                <p className="text-stone-500 text-lg">
                  Action plans to drive the campaign forward
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {strategies.map((strategy, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-8 rounded-lg border border-stone-200 shadow-sm"
                  >
                    <h3 className="text-xl font-bold text-stone-900 mb-3 font-playfair">
                      {strategy.title}
                    </h3>
                    <p className="text-stone-600 text-sm mb-6 pb-6 border-b border-stone-100">
                      {strategy.objective}
                    </p>

                    <div className="space-y-4 mb-8">
                      {strategy.points.map((point, pIdx) => (
                        <div key={pIdx}>
                          <p className="font-bold text-stone-900 text-sm mb-1 flex items-center gap-2">
                            <span data-editorial-accent-bg className="w-1.5 h-1.5 rounded-full "></span>
                            {point.title}
                          </p>
                          <p className="text-stone-500 text-sm pl-3.5">
                            {point.description}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-stone-50 p-4 rounded-md border border-stone-100">
                      <p data-editorial-accent-text className="font-bold  text-xs uppercase tracking-wider mb-3">
                        Action Steps
                      </p>
                      <ul className="space-y-2">
                        {strategy.actionSteps.map((step, sIdx) => (
                          <li
                            key={sIdx}
                            className="text-stone-600 text-sm flex items-start gap-2"
                          >
                            <i className="fa-solid fa-arrow-right text-brand-primary text-xs mt-1 opacity-50" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Expected Outcomes */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-black mb-12 text-stone-900 font-playfair text-center">
              Expected Outcomes
            </h2>
            <div className="space-y-8">
              {topic.outcomes.map((outcome, idx) => (
                <div
                  key={idx}
                  className="flex gap-6 p-6 md:p-8 bg-white border border-stone-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="hidden sm:flex shrink-0 w-16 h-16 bg-stone-50 rounded-full items-center justify-center border border-stone-200">
                    <span className="text-2xl font-black text-brand-primary font-playfair">
                      {idx + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-stone-900 mb-2 font-playfair">
                      {outcome.title}
                    </h3>
                    <p className="text-stone-600 mb-6 font-medium">
                      {outcome.description}
                    </p>

                    <div className="grid sm:grid-cols-3 gap-4">
                      {outcome.points.map((point, pIdx) => (
                        <div
                          key={pIdx}
                          className="bg-stone-50 p-4 rounded-md border border-stone-100"
                        >
                          <p className="text-brand-primary text-xs font-bold mb-1 uppercase">
                            {point.title}
                          </p>
                          <p className="text-stone-500 text-xs leading-relaxed">
                            {point.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Join The Movement Footer */}
        <JoinMovementFooter campaignSlug={topic.slug} />
      </main>
    </div>
  );
}
